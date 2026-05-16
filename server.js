const express = require('express');
const cors = require('cors');
const db = require('./db'); // Database layer
const integrations = require('./integrations'); // Integration layer
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const JWT_SECRET = process.env.JWT_SECRET || 'edusync-super-secret-key';
const jwt = require('jsonwebtoken');

// --- SECURITY MIDDLEWARE: Authorization Check ---
const checkAuth = (req, res, next) => {
    // Check header (API) or cookie (Page Load)
    let token = null;
    if (req.headers['authorization']) {
        token = req.headers['authorization'].split(' ')[1];
    } else if (req.headers.cookie) {
        const cookies = req.headers.cookie.split(';').reduce((acc, c) => {
            const [k, v] = c.trim().split('=');
            acc[k] = v;
            return acc;
        }, {});
        token = cookies['edusync_token'];
    }

    if (!token) {
        if (req.path.endsWith('.html')) return res.redirect('/index.html');
        return res.status(401).json({ error: "Yetkisiz erişim. Lütfen giriş yapın." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (req.path.endsWith('.html')) return res.redirect('/index.html');
        return res.status(401).json({ error: "Geçersiz veya süresi dolmuş oturum." });
    }
};

// Protect matching dashboard pages (both correct URL and legacy typo URL)
app.use(['/dashboard.html', '/admin/dashboard-admin.html', '/parent/dashboard-parent.html', '/parent/dasboard-parent.html'], checkAuth);

// --- SECURITY MIDDLEWARE: SSL Enforcement ---
app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production' && !req.secure && req.get('x-forwarded-proto') !== 'https') {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
});

// Initialize Database
(async () => {
    try {
        await db.connect();
        await db.init();
        
        // Initialize default mock users if needed
        const row = await db.get("SELECT count(*) as count FROM users");
        if (row && row.count === 0) {
            const adminHash = bcrypt.hashSync("123456", 10);
            const teacherHash = bcrypt.hashSync("123456", 10);
            const parentHash = bcrypt.hashSync("123456", 10);
            await db.run("INSERT INTO users (role, username, password_hash) VALUES (?, ?, ?)", ["admin", "admin", adminHash]);
            await db.run("INSERT INTO users (role, username, password_hash) VALUES (?, ?, ?)", ["teacher", "teacher1", teacherHash]);
            await db.run("INSERT INTO users (role, username, password_hash) VALUES (?, ?, ?)", ["parent", "12345678900", parentHash]);
            console.log('Mock users created.');
        }
    } catch (err) {
        console.error('Database initialization failed:', err);
    }
})();

// AI Configuration
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- RATE LIMITING (in-memory) ---
const rateLimitStore = new Map();

function rateLimit(maxRequests, windowMs) {
    return (req, res, next) => {
        const key = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        const now = Date.now();
        const record = rateLimitStore.get(key) || { count: 0, resetTime: now + windowMs };
        if (now > record.resetTime) {
            record.count = 0;
            record.resetTime = now + windowMs;
        }
        record.count++;
        rateLimitStore.set(key, record);
        if (record.count > maxRequests) {
            return res.status(429).json({ error: 'Çok fazla istek gönderildi. Lütfen bekleyin.' });
        }
        next();
    };
}

const loginRateLimit = rateLimit(10, 15 * 60 * 1000);   // 10 deneme / 15 dakika
const aiRateLimit    = rateLimit(20, 60 * 60 * 1000);   // 20 istek / saat

// --- API Endpoints ---

// 1. Get all documents
app.get('/api/documents', async (req, res) => {
    try {
        const { status } = req.query;
        const rows = status
            ? await db.query("SELECT * FROM documents WHERE status = ? ORDER BY id DESC", [status])
            : await db.query("SELECT * FROM documents ORDER BY id DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Add a new document
app.post('/api/documents', async (req, res) => {
    const { category, type, name, recipients, date, status, content } = req.body;
    try {
        const result = await db.run(
            `INSERT INTO documents (category, type, name, recipients, date, status, content) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [category, type, name, recipients, date, status || 'Bekliyor', content || '']
        );
        res.json({ id: result.id, category, type, name, recipients, date, status: status || 'Bekliyor' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Update document status
app.put('/api/documents/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const result = await db.run(
            `UPDATE documents SET status = ? WHERE id = ?`,
            [status, req.params.id]
        );
        res.json({ message: "Status updated", changes: result.changes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Generate AI Minute (Tutanak Oluştur)
app.post('/api/generate-minutes', aiRateLimit, async (req, res) => {
    try {
        const { prompt, context } = req.body;
        if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

        const province = context?.province || "[İl Belirtilmedi]";
        const district = context?.district || "[İlçe Belirtilmedi]";
        const school = context?.school || "[Okul Adı Belirtilmedi]";
        const year = context?.year || "[Eğitim Öğretim Yılı Belirtilmedi]";
        const docType = context?.documentType || "";

        const kurumBilgileri = `
Kurum Bilgileri:
İl: ${province} | İlçe: ${district} | Okul: ${school} | Öğretim Yılı: ${year}`;

        let docSpecificInstruction;
        if (docType === 'EduBot') {
            docSpecificInstruction = `Sen EduBot'sun — EduSync okul yönetim sistemi için tasarlanmış yardımcı bir asistansın.
Öğretmenlere aşağıdaki konularda yardımcı olursun:
- EduSync sisteminin nasıl kullanılacağı (yoklama, belge yükleme, AI tutanak oluşturma vb.)
- MEB mevzuatı, yönetmelikler, resmi yazışma kuralları
- Belge oluşturma ipuçları
- Sınıf yönetimi ve eğitim önerileri

Kurumsal bağlam: ${school} — ${year}

Yanıt kuralları:
- Türkçe yaz, kısa ve net ol (max 3-4 paragraf)
- Markdown yok; sadece düz metin
- Bilmiyorsan dürüstçe belirt, tahmin yürütme
- Resmi ama sıcak bir dil kullan`;
        } else if (docType.includes("İzin") || docType.includes("Dilekçe") || docType.includes("Başvuru")) {
            docSpecificInstruction = `Sen uzman bir MEB idari yazışma uzmanısın.
Verilen bilgileri kullanarak resmi bir DİLEKÇE veya İZİN TALEBİ taslağı hazırlayacaksın.

Uygulanacak Format:
1. Başlık: T.C. kurum hiyerarşisi (Valiliği → Kaymakamlığı → Okul Adı)
2. Konu: "...hakkında" ifadesiyle kısa ve net
3. Makam Hitabı: "Sayın Müdürüm," veya "Müdürlük Makamına,"
4. Gövde: Açık ve özlü, 1-3 paragraf, 1. tekil şahıs
5. Kapanış: "Gereğini saygılarımla arz ederim."
6. İmza Bloğu: Ad-Soyad, Unvan, Tarih, T.C. Kimlik No (opsiyonel)
${kurumBilgileri}`;
        } else if (docType.includes("Kaza") || docType.includes("Olay")) {
            docSpecificInstruction = `Sen uzman bir MEB idari yazışma uzmanısın.
Verilen bilgileri kullanarak resmi bir KAZA / OLAY TUTANAĞI taslağı hazırlayacaksın.

Uygulanacak Format:
1. Başlık: T.C. kurum hiyerarşisi
2. Tutanak Bilgileri: Tarih, Saat, Yer
3. İlgili Kişiler: Ad-soyad, sınıf/unvan bilgileri
4. Olayın Kronolojik Anlatımı: Tarafsız, gözlemlenebilir olgulara dayalı
5. Alınan Önlemler / Yapılan Bildirimler
6. Tutanağı Düzenleyenler: İmza bölümü (en az 2 yetkili)
${kurumBilgileri}`;
        } else if (docType.includes("Rapor") || docType.includes("Başarı")) {
            docSpecificInstruction = `Sen uzman bir MEB öğretmeni ve rehber öğretmenisin.
Verilen bilgileri kullanarak resmi bir ÖĞRENCİ BAŞARI RAPORU taslağı hazırlayacaksın.

Uygulanacak Format:
1. Öğrenci Bilgileri: Ad-Soyad, Sınıf, Öğrenci No
2. Değerlendirme Dönemi
3. Ders Bazında Başarı Durumu (tablo formatında)
4. Genel Değerlendirme: Güçlü yönler, geliştirilecek alanlar
5. Öğretmen Görüşü ve Önerileri
6. İmza: Sınıf Öğretmeni, Tarih
${kurumBilgileri}`;
        } else if (docType.includes("Görev") || docType.includes("Hizmet Belgesi")) {
            docSpecificInstruction = `Sen uzman bir MEB idari yazışma uzmanısın.
Verilen bilgileri kullanarak resmi bir GÖREV / HİZMET BELGESİ TALEBİ taslağı hazırlayacaksın.

Uygulanacak Format:
1. Başlık: T.C. kurum hiyerarşisi
2. Konu: Görev/hizmet belgesi talebi
3. Makam Hitabı
4. Talep Gerekçesi: Belgenin hangi amaçla istendiği
5. "Arz ederim." kapanışı
6. İmza Bloğu
${kurumBilgileri}`;
        } else if (docType.includes("Resmi Yazı")) {
            docSpecificInstruction = `Sen uzman bir MEB idarecisisin.
Verilen bilgileri kullanarak "RESMİ YAZIŞMA USUL VE ESASLARI HAKKINDA YÖNETMELİK" hükümlerine uygun bir RESMİ YAZI taslağı hazırlayacaksın.

Uygulanacak Format:
1. Başlık: T.C. kurum hiyerarşisi (tam ve eksiksiz)
2. Evrak No ve Tarih
3. Konu
4. İlgili Makam/Kurum
5. Yazı Gövdesi: 3. tekil şahıs veya edilgen yapı
6. GEREĞİ / BİLGİ dağıtım listesi (varsa)
7. İmza Bloğu: Ad-Soyad, Unvan, Mühür yeri
${kurumBilgileri}`;
        } else {
            docSpecificInstruction = `Sen uzman bir Milli Eğitim Bakanlığı (MEB) idarecisi ve öğretmenisin.
Sana verilen notları kullanarak, "RESMİ YAZIŞMA USUL VE ESASLARI HAKKINDA YÖNETMELİK" hükümlerine tam uygun bir resmi evrak taslağı oluşturacaksın.

Resmi Yazışma Kuralları:
1. Başlık: T.C. kurum hiyerarşisi (Valiliği → Kaymakamlığı → Okul)
2. Sayı ve Konu: Sol üstte
3. Tarih: Sağ üstte
4. Hitap veya GEREĞİ DÜŞÜNÜLDÜ ile başla
5. Dil: Resmi, 3. tekil şahıs veya edilgen yapı
6. İmza Bloğu: Unvan ve ad-soyad için yer bırak
${kurumBilgileri}`;
        }

        const systemInstruction = docSpecificInstruction + "\n\nÇıktı Kuralı: Markdown kullanma. Sadece düz metin. Resmi yazışma şablonuna sadık kal.";

        // Google Gen AI SDK (Gen 2) Client
        const { GoogleGenAI } = require('@google/genai');
        const aiModel = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        // API Key ile doğrulanmış aktif modeller
        const modelsToTry = [
            'gemini-flash-latest', 
            'gemini-2.0-flash', 
            'gemini-2.5-flash',
            'gemini-pro-latest'
        ];
        
        let lastError = null;
        let resultText = null;

        for (const modelName of modelsToTry) {
            try {
                console.log(`[AI] Deneniyor: ${modelName}`);
                const response = await aiModel.models.generateContent({
                    model: modelName,
                    contents: [{ role: 'user', parts: [{ text: prompt }] }],
                    config: {
                        systemInstruction: systemInstruction, // Gen 2'de direkt string veya obje olabilir
                        temperature: 0.7
                    }
                });

                if (response && response.text) {
                    resultText = response.text;
                    console.log(`[AI] Başarılı! Model: ${modelName}`);
                    break;
                }
            } catch (modelErr) {
                console.warn(`[AI] ${modelName} Hatası:`, modelErr.status, modelErr.message);
                lastError = modelErr;
                
                if (modelErr.status === 404) continue;
                if (modelErr.status === 429 || modelErr.status === 503) {
                    await new Promise(r => setTimeout(r, 1000));
                    continue;
                }
                break;
            }
        }

        if (!resultText) {
            throw lastError || new Error('Tüm modeller başarısız oldu.');
        }

        const watermark = "\n\n--------------------------------------------------\n[BU BELGE YAPAY ZEKA TARAFINDAN TASLAK OLARAK OLUŞTURULMUŞTUR, ISLAK İMZA ÖNCESİ İDARİ KONTROL ZORUNLUDUR]";
        res.json({ result: resultText + watermark });
    } catch (error) {
        console.error('AI Generation Error:', error);
        const statusCode = error.status || 500;
        const userMsg = statusCode === 503
            ? 'Yapay zeka servisi şu an yoğun. Lütfen birkaç saniye bekleyip tekrar deneyin.'
            : statusCode === 429
            ? 'API kota limiti aşıldı. Lütfen daha sonra tekrar deneyin.'
            : 'Tutanak oluşturulurken bir hata oluştu.';
        res.status(500).json({ error: userMsg, detail: error.message });
    }
});

app.get('/api/parent-info', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        let userClass = null;
        if (authHeader) {
            try {
                const token = authHeader.split(' ')[1];
                const decoded = jwt.verify(token, JWT_SECRET);
                userClass = decoded.student_class;
            } catch (e) {}
        }

        const todayStr = new Date().toLocaleDateString('tr-TR');
        let sql = "SELECT * FROM parent_info WHERE (target_class IS NULL OR target_class = '' OR target_class = ?)";
        const rows = await db.query(sql + " ORDER BY id DESC", [userClass || '']);
        
        // Granular filter: Duty (nobet) only for today
        const filtered = rows.filter(r => r.type !== 'nobet' || r.date === todayStr);
        res.json(filtered);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/parent-info', async (req, res) => {
    try {
        const { type, title, content, date, target_class } = req.body;
        const result = await db.run("INSERT INTO parent_info (type, title, content, date, target_class) VALUES (?, ?, ?, ?, ?)", 
            [type, title, content, date, target_class || '']);
        res.json({ success: true, id: result.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. Login API with bcrypt
app.post('/api/login', loginRateLimit, async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const user = await db.get("SELECT * FROM users WHERE username = ? AND role = ?", [username, role]);
        
        if (!user) return res.status(401).json({ error: "Kullanıcı bulunamadı" });

        const match = bcrypt.compareSync(password, user.password_hash);
        if (!match) return res.status(401).json({ error: "Hatalı şifre" });

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role, student_class: user.student_class },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        // Set cookie for page-level checkAuth
        res.cookie('edusync_token', token, { httpOnly: false, secure: process.env.NODE_ENV === 'production', maxAge: 2 * 60 * 60 * 1000 });
        
        res.json({ success: true, token, role: user.role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GEÇİCİ: Kullanıcı şifrelerini sıfırla (development only)
app.post('/api/reset-users', async (req, res) => {
    try {
        await db.run('DELETE FROM users');
        const h1 = bcrypt.hashSync('123456', 10);
        const h2 = bcrypt.hashSync('123456', 10);
        const h3 = bcrypt.hashSync('123456', 10);
        await db.run('INSERT INTO users (role, username, password_hash) VALUES (?, ?, ?)', ['admin', 'admin', h1]);
        await db.run('INSERT INTO users (role, username, password_hash) VALUES (?, ?, ?)', ['teacher', 'teacher1', h2]);
        await db.run('INSERT INTO users (role, username, password_hash) VALUES (?, ?, ?)', ['parent', '12345678900', h3]);
        const users = await db.query('SELECT id, role, username FROM users');
        res.json({ success: true, users });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 7. Attendance API
app.get('/api/attendance', async (req, res) => {
    try {
        const date = req.query.date || new Date().toLocaleDateString('tr-TR');
        const rows = await db.query("SELECT * FROM attendance WHERE date = ?", [date]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/attendance', async (req, res) => {
    try {
        const { date, student_id, student_name, status } = req.body;
        const row = await db.get("SELECT id FROM attendance WHERE date = ? AND student_id = ?", [date, student_id]);
        
        if (row) {
            const result = await db.run("UPDATE attendance SET status = ? WHERE id = ?", [status, row.id]);
            res.json({ success: true, id: row.id });
        } else {
            const result = await db.run("INSERT INTO attendance (date, student_id, student_name, status) VALUES (?, ?, ?, ?)",
                [date, student_id, student_name, status]);
            res.json({ success: true, id: result.id });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 8. Stats API
app.get('/api/stats', async (req, res) => {
    try {
        const total = await db.get("SELECT count(*) as total FROM documents");
        const pending = await db.get("SELECT count(*) as pending FROM documents WHERE status = 'Bekliyor'");
        const approved = await db.get("SELECT count(*) as approved FROM documents WHERE status = 'Onaylandı'");
        
        res.json({
            totalDocuments: total ? total.total : 0,
            pendingDocuments: pending ? pending.pending : 0,
            approvedDocuments: approved ? approved.approved : 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 9. Admin Stats API (connected directly to DB layer)
app.get('/api/admin/stats', checkAuth, async (req, res) => {
    try {
        const stats = await db.getCounts();
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 10. Teachers API
app.get('/api/teachers', async (req, res) => {
    try {
        const rows = await db.query("SELECT * FROM teachers ORDER BY id DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Single teacher create
app.post('/api/teachers', async (req, res) => {
    try {
        const teacher = integrations.transformTeacher(req.body);
        const validation = integrations.validateTeacher(teacher);
        if (!validation.isValid) return res.status(400).json({ error: validation.error });

        // Simple duplicate check (by name and branch)
        const existing = await db.get("SELECT id FROM teachers WHERE name = ? AND branch = ?", [teacher.name, teacher.branch]);
        if (existing) return res.status(409).json({ error: "Bu öğretmen zaten kayıtlı." });

        const result = await db.run("INSERT INTO teachers (name, branch, phone, email) VALUES (?, ?, ?, ?)",
            [teacher.name, teacher.branch, teacher.phone || '', teacher.email || '']);
        res.json({ success: true, id: result.id, ...teacher });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Batch import with de-duplication
app.post('/api/teachers/batch', async (req, res) => {
    const teachers = req.body; // Array of teacher objects
    if (!Array.isArray(teachers)) return res.status(400).json({ error: "Veri dizi formatında olmalı." });

    let added = 0;
    let skipped = 0;
    let errors = 0;

    for (let raw of teachers) {
        try {
            const t = integrations.transformTeacher(raw);
            const validation = integrations.validateTeacher(t);
            if (!validation.isValid) { skipped++; continue; }

            // Deduplication logic: Check name + branch
            const existing = await db.get("SELECT id FROM teachers WHERE name = ? AND branch = ?", [t.name, t.branch]);
            if (existing) {
                skipped++;
                continue;
            }

            await db.run("INSERT INTO teachers (name, branch, phone, email) VALUES (?, ?, ?, ?)",
                [t.name, t.branch, t.phone || '', t.email || '']);
            added++;
        } catch (err) {
            console.error('Batch item error:', err);
            errors++;
        }
    }

    res.json({ success: true, added, skipped, errors });
});

app.delete('/api/teachers/:id', async (req, res) => {
    try {
        const result = await db.run("DELETE FROM teachers WHERE id = ?", [req.params.id]);
        res.json({ success: true, changes: result.changes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 11. Delete Announcement
app.delete('/api/parent-info/:id', async (req, res) => {
    try {
        const result = await db.run("DELETE FROM parent_info WHERE id = ?", [req.params.id]);
        res.json({ success: true, changes: result.changes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- KVKK Endpoints ---

// KVKK onay kaydı (login sırasında)
app.post('/api/kvkk-consent', async (req, res) => {
    try {
        const { username, role } = req.body;
        const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        const now = new Date().toISOString();
        await db.run(
            "INSERT INTO kvkk_consents (username, role, ip, consented_at) VALUES (?, ?, ?, ?)",
            [username || 'anonymous', role || 'unknown', ip, now]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// KVKK Madde 11 - Kullanıcı veri silme talebi
app.delete('/api/user/data', checkAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const username = req.user.username;
        const role = req.user.role;

        if (role === 'admin') {
            return res.status(403).json({ error: 'Admin hesabı silinemez.' });
        }

        await db.run("DELETE FROM users WHERE id = ?", [userId]);
        await db.run("DELETE FROM kvkk_consents WHERE username = ?", [username]);

        const ip = req.ip || 'unknown';
        await db.run(
            "INSERT INTO audit_log (action, username, ip, detail, created_at) VALUES (?, ?, ?, ?, ?)",
            ['USER_DATA_DELETE', username, ip, `KVKK Madde 11 - kullanıcı kendi verisini sildi`, new Date().toISOString()]
        );

        res.clearCookie('edusync_token');
        res.json({ success: true, message: 'Kişisel verileriniz sistemden silindi.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
