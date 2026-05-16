/**
 * admin/script.js — EduSync İdareci Paneli
 * Tamamen yeniden yazıldı: sekme yönetimi, tema, API çağrıları
 */

const API_URL = '/api';

// ============================================================
// YARDIMCI: TOAST BİLDİRİMİ
// ============================================================
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer') || document.body;
    const toast = document.createElement('div');
    toast.className = `admin-toast ${type}`;
    const icon = type === 'success' ? 'fa-check-circle'
               : type === 'error'   ? 'fa-times-circle'
               : 'fa-exclamation-circle';
    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

// ============================================================
// SEKME YÖNETİMİ
// ============================================================
function switchAdminTab(tabId) {
    document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));

    const btn     = document.querySelector(`.admin-tab-btn[data-tab="${tabId}"]`);
    const content = document.getElementById(`tab-${tabId}`);

    if (btn)     btn.classList.add('active');
    if (content) content.classList.add('active');
}

// Tab butonlarına event listener ekle
document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        switchAdminTab(btn.dataset.tab);
    });
});

// ============================================================
// TEMA YÖNETİMİ
// ============================================================
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.innerHTML = theme === 'dark'
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
}

const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        applyTheme(current === 'light' ? 'dark' : 'light');
    });
}
applyTheme(localStorage.getItem('theme') || 'light');

// ============================================================
// ÇIKIŞ
// ============================================================
function logout() {
    localStorage.removeItem('edusync_token');
    window.location.href = '/index.html';
}

// ============================================================
// İSTATİSTİKLER VE GRAFİK
// ============================================================
let docChart = null;

async function loadStats() {
    try {
        const res = await fetch(`${API_URL}/stats`);
        if (!res.ok) return;
        const data = await res.json();

        const el = (id) => document.getElementById(id);
        if (el('statsTotal'))    el('statsTotal').textContent    = data.totalDocuments    ?? '-';
        if (el('statsPending'))  el('statsPending').textContent  = data.pendingDocuments  ?? '-';
        if (el('statsApproved')) el('statsApproved').textContent = data.approvedDocuments ?? '-';
        if (el('statDocuments')) el('statDocuments').textContent = data.pendingDocuments  ?? 0;

        const ctx = document.getElementById('documentChart');
        if (ctx && window.Chart) {
            if (docChart) docChart.destroy();
            docChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Onaylanan', 'Bekleyen', 'Reddedilen'],
                    datasets: [{
                        data: [
                            data.approvedDocuments ?? 0,
                            data.pendingDocuments  ?? 0,
                            data.rejectedDocuments ?? 0
                        ],
                        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { position: 'bottom' } }
                }
            });
        }
    } catch (err) {
        console.warn('İstatistikler yüklenemedi:', err);
    }
}

// ============================================================
// DUYURULAR
// ============================================================
async function loadAnnouncements() {
    try {
        const res = await fetch(`${API_URL}/parent-info`);
        if (!res.ok) return;
        const items = await res.json();

        const renderList = (containerId) => {
            const container = document.getElementById(containerId);
            if (!container) return;
            if (!items.length) {
                container.innerHTML = `<div class="admin-empty"><i class="fas fa-inbox"></i><p>Henüz duyuru yok.</p></div>`;
                return;
            }
            container.innerHTML = items.map(item => `
                <div class="announcement-item" style="padding:1rem;border-bottom:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;">
                    <div>
                        <strong>${item.title}</strong>
                        <p style="margin:0.25rem 0 0;font-size:0.85rem;color:var(--text-secondary);">${item.content}</p>
                        <small style="color:var(--text-secondary);">${item.date} · ${item.type}</small>
                    </div>
                    <button class="admin-btn" style="font-size:0.75rem;padding:0.35rem 0.6rem;flex-shrink:0;background:#ef4444;color:white;border:none;border-radius:6px;cursor:pointer;" onclick="deleteAnnouncement(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>`).join('');
        };

        renderList('recentAnnouncements');
        renderList('announcementList');
    } catch (err) {
        console.warn('Duyurular yüklenemedi:', err);
    }
}

async function deleteAnnouncement(id) {
    if (!confirm('Bu duyuruyu silmek istiyor musunuz?')) return;
    try {
        const res = await fetch(`${API_URL}/parent-info/${id}`, { method: 'DELETE' });
        if (res.ok) { showToast('Duyuru silindi.', 'success'); loadAnnouncements(); }
    } catch { showToast('Silme işlemi başarısız.', 'error'); }
}

const announcementForm = document.getElementById('announcementForm');
if (announcementForm) {
    announcementForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = announcementForm.querySelector('button[type="submit"]');
        if (btn) { btn.innerHTML = '<span>Gönderiliyor...</span>'; btn.disabled = true; }

        const payload = {
            type:         document.getElementById('annType')?.value,
            title:        document.getElementById('annTitle')?.value,
            content:      document.getElementById('annContent')?.value,
            date:         new Date().toLocaleDateString('tr-TR'),
            target_class: document.getElementById('annTarget')?.value || ''
        };

        try {
            const res = await fetch(`${API_URL}/parent-info`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                showToast('Duyuru başarıyla yayınlandı!', 'success');
                announcementForm.reset();
                loadAnnouncements();
            } else {
                showToast('Duyuru gönderilemedi.', 'error');
            }
        } catch { showToast('Sunucu bağlantısı kurulamadı.', 'error'); }
        finally {
            if (btn) {
                btn.innerHTML = '<i class="fas fa-paper-plane"></i> Tüm Velilere Yayınla';
                btn.disabled = false;
            }
        }
    });
}

// ============================================================
// ÖĞRETMEN LİSTESİ
// ============================================================
async function loadTeachers() {
    try {
        const res = await fetch(`${API_URL}/teachers`);
        if (!res.ok) return;
        const teachers = await res.json();
        const tbody = document.getElementById('teacherTableBody');
        if (!tbody) return;

        if (!teachers.length) {
            tbody.innerHTML = `<tr><td colspan="6" class="admin-empty"><i class="fas fa-user-slash"></i><p>Henüz öğretmen kaydı yok.</p></td></tr>`;
            return;
        }
        tbody.innerHTML = teachers.map((t, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${t.name}</td>
                <td>${t.branch}</td>
                <td>${t.phone || '-'}</td>
                <td>${t.email || '-'}</td>
                <td>
                    <button class="admin-btn" style="font-size:0.75rem;padding:0.35rem 0.6rem;background:#ef4444;color:white;border:none;border-radius:6px;cursor:pointer;" onclick="deleteTeacher(${t.id})">
                        <i class="fas fa-trash"></i> Sil
                    </button>
                </td>
            </tr>`).join('');

        const statTeachers = document.getElementById('statTeachers');
        if (statTeachers) statTeachers.textContent = teachers.length;
    } catch (err) {
        console.warn('Öğretmenler yüklenemedi:', err);
    }
}

async function deleteTeacher(id) {
    if (!confirm('Bu öğretmeni silmek istiyor musunuz?')) return;
    try {
        const res = await fetch(`${API_URL}/teachers/${id}`, { method: 'DELETE' });
        if (res.ok) { showToast('Öğretmen silindi.', 'success'); loadTeachers(); }
    } catch { showToast('Silme işlemi başarısız.', 'error'); }
}

const teacherForm = document.getElementById('teacherForm');
if (teacherForm) {
    teacherForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            name:   document.getElementById('tName')?.value?.trim(),
            branch: document.getElementById('tBranch')?.value?.trim(),
            phone:  document.getElementById('tPhone')?.value?.trim(),
            email:  document.getElementById('tEmail')?.value?.trim()
        };
        if (!payload.name || !payload.branch) return showToast('Ad ve branş zorunludur.', 'warning');

        try {
            const res = await fetch(`${API_URL}/teachers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                showToast('Öğretmen başarıyla eklendi!', 'success');
                teacherForm.reset();
                loadTeachers();
            } else {
                showToast(data.error || 'Ekleme başarısız.', 'error');
            }
        } catch { showToast('Sunucu bağlantısı kurulamadı.', 'error'); }
    });
}

// ============================================================
// EXCEL İÇE AKTARMA
// ============================================================
let parsedExcelData = [];

const excelFileInput = document.getElementById('excelFileInput');
if (excelFileInput) {
    excelFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        document.getElementById('excelFileName').textContent = file.name;

        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const wb = XLSX.read(ev.target.result, { type: 'binary' });
                const ws = wb.Sheets[wb.SheetNames[0]];
                const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

                parsedExcelData = rows.map(r => ({
                    name:   r['Ad Soyad']  || r['name']   || '',
                    branch: r['Branş']     || r['branch'] || '',
                    phone:  r['Telefon']   || r['phone']  || '',
                    email:  r['E-posta']   || r['email']  || ''
                })).filter(t => t.name && t.branch);

                document.getElementById('excelRowCount').textContent = parsedExcelData.length;
                document.getElementById('excelPreviewBody').innerHTML = parsedExcelData.map((t, i) =>
                    `<tr><td>${i+1}</td><td>${t.name}</td><td>${t.branch}</td><td>${t.phone||'-'}</td><td>${t.email||'-'}</td></tr>`
                ).join('');
                document.getElementById('excelPreview').style.display = 'block';
            } catch (err) {
                showToast('Excel dosyası okunamadı.', 'error');
            }
        };
        reader.readAsBinaryString(file);
    });
}

const excelImportBtn = document.getElementById('excelImportBtn');
if (excelImportBtn) {
    excelImportBtn.addEventListener('click', async () => {
        if (!parsedExcelData.length) return showToast('Önce Excel dosyası seçin.', 'warning');
        excelImportBtn.innerHTML = '<span>Aktarılıyor...</span>';
        excelImportBtn.disabled = true;
        try {
            const res = await fetch(`${API_URL}/teachers/batch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parsedExcelData)
            });
            const data = await res.json();
            if (res.ok) {
                showToast(`✅ ${data.added} öğretmen eklendi, ${data.skipped} atlandı.`, 'success');
                loadTeachers();
                document.getElementById('excelPreview').style.display = 'none';
                parsedExcelData = [];
                excelFileInput.value = '';
                document.getElementById('excelFileName').textContent = 'Dosya seçilmedi';
            } else {
                showToast('Aktarım başarısız.', 'error');
            }
        } catch { showToast('Sunucu bağlantısı kurulamadı.', 'error'); }
        finally {
            excelImportBtn.innerHTML = '<i class="fas fa-database"></i> Tümünü Sisteme Aktar';
            excelImportBtn.disabled = false;
        }
    });
}

// ============================================================
// SİSTEM AYARLARI
// ============================================================
const settingsForm = document.getElementById('settingsForm');
if (settingsForm) {
    // Kayıtlı değerleri yükle
    const load = (id, key) => { const el = document.getElementById(id); if (el && localStorage.getItem(key)) el.value = localStorage.getItem(key); };
    load('setSchool', 'admin_school'); load('setCity', 'admin_city');
    load('setYear', 'admin_year');     load('setCode', 'admin_code');
    load('setPrincipal', 'admin_principal'); load('setPhone', 'admin_phone');

    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const save = (id, key) => { const el = document.getElementById(id); if (el) localStorage.setItem(key, el.value); };
        save('setSchool', 'admin_school'); save('setCity', 'admin_city');
        save('setYear', 'admin_year');     save('setCode', 'admin_code');
        save('setPrincipal', 'admin_principal'); save('setPhone', 'admin_phone');
        showToast('Sistem ayarları kaydedildi!', 'success');
    });
}

// ============================================================
// MODAL (Kapatma)
// ============================================================
function closeMappingModal() {
    const modal = document.getElementById('mappingModal');
    if (modal) modal.style.display = 'none';
}

// ============================================================
// BELGE ONAYI (Admin)
// ============================================================
async function loadAdminDocuments() {
    const tbody = document.getElementById('adminDocTableBody');
    if (!tbody) return;

    const filterStatus = document.getElementById('docFilterStatus')?.value || '';
    const url = filterStatus ? `${API_URL}/documents?status=${encodeURIComponent(filterStatus)}` : `${API_URL}/documents`;

    try {
        const res = await fetch(url);
        if (!res.ok) { tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:#ef4444;">Belgeler yüklenemedi.</td></tr>`; return; }
        const docs = await res.json();

        if (!docs.length) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:#94a3b8;"><i class="fas fa-inbox"></i> Gösterilecek belge yok.</td></tr>`;
            return;
        }

        const statusColor = { 'Bekliyor': '#f59e0b', 'Onaylandı': '#10b981', 'Reddedildi': '#ef4444' };
        const statusIcon  = { 'Bekliyor': 'fa-hourglass-half', 'Onaylandı': 'fa-check-circle', 'Reddedildi': 'fa-times-circle' };

        tbody.innerHTML = docs.map(doc => `
            <tr style="border-bottom:1px solid #f1f5f9;" id="doc-row-${doc.id}">
                <td style="padding:0.75rem;">${doc.name}</td>
                <td style="padding:0.75rem;font-size:0.8rem;color:#64748b;">${doc.type || '-'}</td>
                <td style="padding:0.75rem;">${doc.recipients || '-'}</td>
                <td style="padding:0.75rem;font-size:0.8rem;">${doc.date || '-'}</td>
                <td style="padding:0.75rem;">
                    <span style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.25rem 0.6rem;border-radius:999px;background:${statusColor[doc.status] || '#94a3b8'}20;color:${statusColor[doc.status] || '#94a3b8'};font-size:0.78rem;font-weight:600;">
                        <i class="fas ${statusIcon[doc.status] || 'fa-circle'}"></i> ${doc.status || 'Bilinmiyor'}
                    </span>
                </td>
                <td style="padding:0.75rem;">
                    ${doc.status === 'Bekliyor' ? `
                    <div style="display:flex;gap:0.4rem;flex-wrap:wrap;">
                        <button onclick="updateDocStatus(${doc.id},'Onaylandı')" style="background:#10b981;color:white;border:none;border-radius:6px;padding:0.3rem 0.6rem;cursor:pointer;font-size:0.75rem;display:flex;align-items:center;gap:0.3rem;">
                            <i class="fas fa-check"></i> Onayla
                        </button>
                        <button onclick="updateDocStatus(${doc.id},'Reddedildi')" style="background:#ef4444;color:white;border:none;border-radius:6px;padding:0.3rem 0.6rem;cursor:pointer;font-size:0.75rem;display:flex;align-items:center;gap:0.3rem;">
                            <i class="fas fa-times"></i> Reddet
                        </button>
                        <button onclick="updateDocStatus(${doc.id},'Revize')" style="background:#f59e0b;color:white;border:none;border-radius:6px;padding:0.3rem 0.6rem;cursor:pointer;font-size:0.75rem;display:flex;align-items:center;gap:0.3rem;">
                            <i class="fas fa-edit"></i> Revize
                        </button>
                    </div>` : `<span style="color:#94a3b8;font-size:0.8rem;"><i class="fas fa-lock"></i> İşlem yapıldı</span>`}
                </td>
            </tr>`).join('');
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:#ef4444;">Sunucu bağlantısı kurulamadı.</td></tr>`;
    }
}

async function updateDocStatus(id, newStatus) {
    try {
        const res = await fetch(`${API_URL}/documents/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        if (res.ok) {
            showToast(`Belge "${newStatus}" olarak güncellendi.`, 'success');
            loadAdminDocuments();
            loadStats();
        } else {
            showToast('Güncelleme başarısız.', 'error');
        }
    } catch {
        showToast('Sunucu bağlantısı kurulamadı.', 'error');
    }
}

// Belge sekmesi açılınca yükle
document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    if (btn.dataset.tab === 'belgeler') {
        btn.addEventListener('click', loadAdminDocuments);
    }
});

// ============================================================
// BAŞLANGIÇ
// ============================================================
(async function init() {
    await loadStats();
    await loadAnnouncements();
    await loadTeachers();
})();