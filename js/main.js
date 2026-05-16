/**
 * main.js (Teacher Dashboard)
 * Temiz, tekil ve modüler versiyon — legacy blok kaldırıldı.
 */
import { initAuthGuard } from './auth.js';
import { fetchAPI } from './api.js';
import { initThemeToggle, showNotification, switchTab } from './ui.js';
import { generateContent, generateOfficialPDF } from './ai-generator.js';
import { renderNavbar } from './components/Navbar.js';
import { renderFooter } from './components/Footer.js';

document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // 1. AUTH GUARD
    // ============================================================
    initAuthGuard('teacher');

    // ============================================================
    // 2. NAVBAR & FOOTER BİLEŞENLERİ
    // ============================================================
    renderNavbar('navbar-root', {
        logoPath: 'edusync-logo.png',
        title: 'Öğretmen Çalışma Alanı',
        roleBadgeIcon: 'fa-chalkboard-teacher',
        roleBadgeText: localStorage.getItem('teacherName') || 'Sayın Öğretmenim',
        roleBadgeId: 'headerTeacherName',
        logoutPath: 'index.html',
        navbarClass: 'header',
        brandClass: 'header-left',
        actionsClass: 'header-right'
    });
    renderFooter('footer-root', '');

    // ============================================================
    // 3. TEMA
    // ============================================================
    initThemeToggle();

    // ============================================================
    // 4. ELEMENT REFERANSLARI
    // ============================================================
    const API_URL = '/api';

    const homeroomCheckbox     = document.getElementById('isHomeroomTeacher');
    const clubCheckbox         = document.getElementById('isClubAdvisor');
    const rehberlikTabBtn      = document.getElementById('rehberlikTabBtn');
    const kulupTabBtn          = document.getElementById('kulupTabBtn');
    const tabNav               = document.querySelector('.tab-nav');

    const uploadForm           = document.getElementById('uploadForm');
    const mainCategorySelect   = document.getElementById('mainCategory');
    const documentTypeSelect   = document.getElementById('documentType');
    const fileUpload           = document.getElementById('fileUpload');
    const fileUploadInput      = document.getElementById('documentFile');
    const fileUploadText       = document.getElementById('fileUploadText');
    const submitBtn            = document.getElementById('submitBtn');       // ← EKSİK OLAN REFERANS DÜZELTİLDİ

    const aiGeneratorForm      = document.getElementById('aiGeneratorForm');
    const aiMainCategorySelect = document.getElementById('aiMainCategory');
    const aiDocumentTypeSelect = document.getElementById('aiDocumentType');
    const aiPromptEl           = document.getElementById('aiPrompt');
    const generateAiBtn        = document.getElementById('generateAiBtn');
    const aiSubmitBtn          = document.getElementById('aiSubmitBtn');
    const downloadPdfBtn       = document.getElementById('downloadPdfBtn');
    const aiResultContainer    = document.getElementById('aiResultContainer');
    const aiResultEl           = document.getElementById('aiResult');
    const copyResultBtn        = document.getElementById('copyResultBtn');

    const teacherNameInput     = document.getElementById('teacherName');
    const instProvince         = document.getElementById('instProvince');
    const instDistrict         = document.getElementById('instDistrict');
    const instSchool           = document.getElementById('instSchool');
    const instYear             = document.getElementById('instYear');
    const saveInstBtn          = document.getElementById('saveInstBtn');

    const attendanceForm       = document.getElementById('attendanceForm');
    const attendanceDate       = document.getElementById('attendanceDate');
    const attendanceTableBody  = document.getElementById('attendanceTableBody');
    const parentAnnouncementForm = document.getElementById('parentAnnouncementForm');

    // ============================================================
    // 5. VERİ: BELGE TÜRLERİ
    // ============================================================
    const documentTypes = {
        idari: [
            "Yıllık İş Günü Çalışma Takvimi",
            "Ünitelendirilmiş Yıllık Plan",
            "Günlük Plan",
            "Haftalık Ders Programı",
            "Şube Öğretmenler Kurulu Tutanağı",
            "Zümre Öğretmenler Kurulu Tutanağı",
            "Diğer İdari Evraklar"
        ],
        rehberlik: [
            "Sınıf Rehberlik Yıllık Planı",
            "Öğrenci Gözlem Formu",
            "Veli Görüşme Formu",
            "Risk Haritası Anket Sonuçları",
            "Diğer Rehberlik Evrakları"
        ],
        kulup: [
            "Kulüp Yıllık Çalışma Planı",
            "Kulüp Karar Defteri Örneği",
            "Sosyal Etkinlik Formu",
            "Kulüp Üye Listesi",
            "Diğer Kulüp Evrakları"
        ],
        'resmi-yazi': [
            "İzin Talep Dilekçesi",
            "Veli Dilekçesi / Başvuru Formu",
            "Görev / Hizmet Belgesi Talebi",
            "Kaza / Olay Tutanağı",
            "Okul Müdürlüğüne Resmi Yazı",
            "Öğrenci Başarı Raporu",
            "Genel Amaçlı Dilekçe"
        ]
    };

    let documents = [];

    // ============================================================
    // 6. DASHBOARD UI GÜNCELLEME
    // ============================================================
    const updateDashboardUI = () => {
        const name   = localStorage.getItem('teacherName') || 'Öğretmen';
        const school = localStorage.getItem('instSchool')  || 'Okul Belirtilmedi';
        const year   = localStorage.getItem('instYear')    || 'Yıl Belirtilmedi';

        const headerName = document.getElementById('headerTeacherName');
        if (headerName) headerName.textContent = name;

        const welcomeTitle = document.getElementById('welcomeTitle');
        if (welcomeTitle) welcomeTitle.textContent = `Hoş Geldiniz, Sayın ${name}`;

        const bannerSchool = document.getElementById('bannerSchool');
        if (bannerSchool) bannerSchool.innerHTML = `<i class="fas fa-school"></i> ${school}`;

        const bannerYear = document.getElementById('bannerYear');
        if (bannerYear) bannerYear.innerHTML = `<i class="fas fa-calendar-alt"></i> ${year}`;
    };

    const loadInstitutionSettings = () => {
        if (teacherNameInput) teacherNameInput.value = localStorage.getItem('teacherName') || '';
        if (instProvince)     instProvince.value     = localStorage.getItem('instProvince') || '';
        if (instDistrict)     instDistrict.value     = localStorage.getItem('instDistrict') || '';
        if (instSchool)       instSchool.value       = localStorage.getItem('instSchool') || '';
        if (instYear)         instYear.value         = localStorage.getItem('instYear') || '';
        updateDashboardUI();
    };

    // ============================================================
    // 7. BELGE KATEGORİ DEĞİŞİMİ → BELGE TÜRÜ DROPDOWN
    // ============================================================
    const handleCategoryChange = (catSelect, typeSelect) => {
        const selectedCategory = catSelect.value;
        typeSelect.innerHTML = '<option value="" disabled selected>Belge türü seçin...</option>';
        typeSelect.disabled = true;

        if (selectedCategory && documentTypes[selectedCategory]) {
            documentTypes[selectedCategory].forEach(type => {
                typeSelect.add(new Option(type, type));
            });
            typeSelect.disabled = false;
        }
    };

    if (mainCategorySelect && documentTypeSelect) {
        mainCategorySelect.addEventListener('change', () =>
            handleCategoryChange(mainCategorySelect, documentTypeSelect)
        );
    }

    if (aiMainCategorySelect && aiDocumentTypeSelect) {
        aiMainCategorySelect.addEventListener('change', () =>
            handleCategoryChange(aiMainCategorySelect, aiDocumentTypeSelect)
        );
    }

    // 8. SEKME YÖNETİMİ
    // ============================================================
    const toggleTabVisibility = (tabButton, isVisible) => {
        if (!tabButton) return;
        tabButton.style.display = isVisible ? 'flex' : 'none';
        if (!isVisible && tabButton.classList.contains('active')) switchTab('profil');
    };

    // Global Sekme ve İşlem Dinleyicisi
    document.addEventListener('click', e => {
        // En yakın butonu veya tab-btn'i bul
        const btn = e.target.closest('button, .tab-btn');
        if (!btn) return;
        
        // SEKME GEÇİŞİ: btn.dataset.tab varsa bu bir sekme butonudur
        if (btn.dataset.tab) {
            e.preventDefault();
            switchTab(btn.dataset.tab);
            if (btn.dataset.tab === 'karardestek') loadStats();
            return;
        }

        // DOKÜMAN ONAY/RED: btn.dataset.id varsa bu bir doküman butonudur
        if (btn.dataset.id) {
            e.preventDefault();
            const docId = btn.dataset.id;
            if (btn.classList.contains('approve-btn')) updateDocumentStatus(docId, 'Onaylandı');
            if (btn.classList.contains('reject-btn'))  updateDocumentStatus(docId, 'Reddedildi');
        }
    });

    const getIconForFile = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();
        if (ext === 'pdf')                         return '<i class="fas fa-file-pdf"  style="color:#ef4444;margin-right:0.5rem;"></i>';
        if (['doc','docx'].includes(ext))          return '<i class="fas fa-file-word" style="color:#2563eb;margin-right:0.5rem;"></i>';
        return '<i class="fas fa-file" style="color:#64748b;margin-right:0.5rem;"></i>';
    };

    const getStatusClass = status => ({ 'Bekliyor':'status-waiting','Onaylandı':'status-approved','Reddedildi':'status-rejected' }[status] || 'status-waiting');
    const getStatusIcon  = status => ({ 'Bekliyor':'<i class="fas fa-hourglass-half"></i>','Onaylandı':'<i class="fas fa-check-circle"></i>','Reddedildi':'<i class="fas fa-times-circle"></i>' }[status] || '');

    const getEmptyStateHTML = (category) => {
        const icons = { idari:'fa-folder-open', rehberlik:'fa-school', kulup:'fa-users' };
        const texts = { idari:'idari', rehberlik:'rehberlik', kulup:'kulüp' };
        return `<tr><td colspan="6" class="empty-state"><i class="fas ${icons[category]}"></i><div>Henüz ${texts[category]} belgesi yüklenmemiş</div></td></tr>`;
    };

    const renderDocuments = () => {
        document.querySelectorAll('.table tbody').forEach(tbody => {
            if (tbody.id !== 'attendanceTableBody') tbody.innerHTML = '';
        });

        const idariBody     = document.querySelector('#idariContent tbody');
        const rehberlikBody = document.querySelector('#rehberlikContent tbody');
        const kulupBody     = document.querySelector('#kulupContent tbody');

        if (documents.length === 0) {
            if (idariBody)     idariBody.innerHTML     = getEmptyStateHTML('idari');
            if (rehberlikBody) rehberlikBody.innerHTML = getEmptyStateHTML('rehberlik');
            if (kulupBody)     kulupBody.innerHTML     = getEmptyStateHTML('kulup');
            return;
        }

        documents.forEach(doc => {
            const targetBody = document.querySelector(`#${doc.category}Content tbody`);
            if (!targetBody) return;
            if (targetBody.querySelector('.empty-state')) targetBody.innerHTML = '';
            const row = document.createElement('tr');
            row.className = 'fade-in';
            row.innerHTML = `
                <td>${getIconForFile(doc.name)} ${doc.name}</td>
                <td>${doc.type}</td>
                <td>${doc.recipients}</td>
                <td>${doc.date}</td>
                <td><span class="status-badge ${getStatusClass(doc.status)}">${getStatusIcon(doc.status)} ${doc.status}</span></td>
                <td>
                    ${doc.status === 'Bekliyor'
                        ? `<button class="btn btn-success btn-sm approve-btn" data-id="${doc.id}"><i class="fas fa-check"></i> Onayla</button>
                           <button class="btn btn-danger  btn-sm reject-btn"  data-id="${doc.id}"><i class="fas fa-times"></i> Reddet</button>`
                        : `<button class="btn btn-secondary btn-sm" disabled><i class="fas fa-lock"></i> Kilitli</button>`
                    }
                </td>`;
            targetBody.appendChild(row);
        });

        // Boş kalan kategorileri işaretle
        [['idari', idariBody], ['rehberlik', rehberlikBody], ['kulup', kulupBody]].forEach(([cat, body]) => {
            if (body && body.children.length === 0) body.innerHTML = getEmptyStateHTML(cat);
        });
    };

    const fetchDocuments = async () => {
        try {
            const res = await fetch(`${API_URL}/documents`);
            if (res.ok) {
                documents = await res.json();
                renderDocuments();
            }
        } catch (error) {
            console.warn('Backend bağlantısı yok, offline modda çalışılıyor.');
            renderDocuments();
        }
    };

    const updateDocumentStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`${API_URL}/documents/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                fetchDocuments();
                showNotification(`Belge "${newStatus}" olarak işaretlendi.`, 'success');
            }
        } catch (error) {
            showNotification('Durum güncellenemedi.', 'error');
        }
    };

    // ============================================================
    // 10. NORMAL BELGE YÜKLEME FORMU
    // ============================================================
    if (uploadForm) {
        uploadForm.addEventListener('submit', async e => {
            e.preventDefault();

            const category = mainCategorySelect.value;
            const catText  = mainCategorySelect.options[mainCategorySelect.selectedIndex].text;
            const typeVal  = documentTypeSelect.value;

            if (!category || !typeVal) {
                return showNotification('Lütfen kategori ve belge türü seçin.', 'warning');
            }
            if (!fileUploadInput.files[0]) {
                return showNotification('Lütfen bir dosya seçin.', 'warning');
            }

            const recipients = Array.from(document.querySelectorAll('input[name="recipient"]:checked'))
                                    .map(cb => cb.value).join(', ');
            if (!recipients) return showNotification('Lütfen en az bir grup seçin.', 'warning');

            const newDocument = {
                category,
                type: `${catText} / ${typeVal}`,
                name: fileUploadInput.files[0].name,
                recipients,
                date: new Date().toLocaleDateString('tr-TR')
            };

            if (submitBtn) { submitBtn.innerHTML = '<span class="loading"></span> Yükleniyor...'; submitBtn.disabled = true; }

            try {
                const res = await fetch(`${API_URL}/documents`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newDocument)
                });
                if (res.ok) {
                    fetchDocuments();
                    switchTab(category);
                    uploadForm.reset();
                    documentTypeSelect.innerHTML = '<option value="">Önce kategori seçin...</option>';
                    documentTypeSelect.disabled = true;
                    if (fileUploadText) fileUploadText.textContent = 'Dosya seçin veya buraya sürükleyin';
                    if (fileUpload) fileUpload.classList.remove('has-file');
                    showNotification('Belge başarıyla yüklendi ve onaya gönderildi!', 'success');
                } else {
                    showNotification('Belge yüklenemedi. Sunucu hatası.', 'error');
                }
            } catch (error) {
                showNotification('Sunucu bağlantısı kurulamadı.', 'error');
            } finally {
                if (submitBtn) { submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Yükle ve Onaya Gönder'; submitBtn.disabled = false; }
            }
        });
    }

    // ============================================================
    // 11. DOSYA SÜRÜKLE-BIRAK
    // ============================================================
    if (fileUpload && fileUploadInput) {
        ['dragenter','dragover','dragleave','drop'].forEach(ev =>
            fileUpload.addEventListener(ev, e => e.preventDefault(), false)
        );
        fileUpload.addEventListener('dragover',  () => fileUpload.classList.add('is-dragging'));
        fileUpload.addEventListener('dragleave', () => fileUpload.classList.remove('is-dragging'));
        fileUpload.addEventListener('drop', e => {
            fileUpload.classList.remove('is-dragging');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileUploadInput.files = files;
                updateFileUploadUI(files[0].name);
            }
        });
        fileUploadInput.addEventListener('change', () => {
            if (fileUploadInput.files.length > 0) updateFileUploadUI(fileUploadInput.files[0].name);
        });
    }

    const updateFileUploadUI = (fileName) => {
        if (fileUploadText) fileUploadText.innerHTML = `<i class="fas fa-check-circle" style="color:var(--success-color);"></i> ${fileName}`;
        if (fileUpload) fileUpload.classList.add('has-file');
    };

    // ============================================================
    // 12. YAPAY ZEKA TUTANAK ÜRETİCİ
    // ============================================================
    if (generateAiBtn) {
        generateAiBtn.addEventListener('click', async () => {
            const promptTxt = aiPromptEl ? aiPromptEl.value.trim() : '';
            if (!promptTxt) return showNotification('Lütfen toplantı notlarını girin.', 'warning');

            const context = {
                province:     instProvince ? instProvince.value.trim() || '[İl Girilmeli]'        : '[İl]',
                district:     instDistrict ? instDistrict.value.trim() || '[İlçe Girilmeli]'      : '[İlçe]',
                school:       instSchool   ? instSchool.value.trim()   || '[Okul Adı Girilmeli]'  : '[Okul]',
                year:         instYear     ? instYear.value.trim()     || '[Eğitim Yılı Girilmeli]': '[Yıl]',
                documentType: aiDocumentTypeSelect ? aiDocumentTypeSelect.value : ''
            };

            generateAiBtn.innerHTML = '<span class="loading"></span> Üretiliyor...';
            generateAiBtn.disabled = true;

            try {
                const aiText = await generateContent(promptTxt, context);
                if (aiResultEl)        aiResultEl.value = aiText;
                if (aiResultContainer) aiResultContainer.style.display = 'block';
                if (aiSubmitBtn)       aiSubmitBtn.disabled = false;
                if (downloadPdfBtn)    downloadPdfBtn.style.display = 'flex';
                showNotification('Tutanak başarıyla üretildi.', 'success');
            } catch (e) {
                const msg = e?.message || 'Tutanak üretilemedi.';
                showNotification(msg, 'error');
            } finally {
                generateAiBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Tutanağı Üret';
                generateAiBtn.disabled = false;
            }
        });
    }

    // Sonucu kopyala
    if (copyResultBtn) {
        copyResultBtn.addEventListener('click', async () => {
            const text = aiResultEl ? aiResultEl.value : '';
            if (!text) return;
            try {
                await navigator.clipboard.writeText(text);
                copyResultBtn.innerHTML = '<i class="fas fa-check"></i> Kopyalandı!';
                copyResultBtn.style.color = '#059669';
                setTimeout(() => {
                    copyResultBtn.innerHTML = '<i class="fas fa-copy"></i> Kopyala';
                    copyResultBtn.style.color = '#6B7280';
                }, 2000);
            } catch {
                showNotification('Kopyalama başarısız.', 'error');
            }
        });
    }

    // PDF indirme
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', () => {
            const content = aiResultEl ? aiResultEl.value : '';
            const formValues = {
                province:     instProvince ? instProvince.value : '',
                district:     instDistrict ? instDistrict.value : '',
                school:       instSchool   ? instSchool.value   : '',
                year:         instYear     ? instYear.value     : '',
                documentType: aiDocumentTypeSelect ? aiDocumentTypeSelect.value : ''
            };
            generateOfficialPDF(content, formValues);
        });
    }

    // AI Formu Gönder (Dijital Arşive)
    if (aiGeneratorForm) {
        aiGeneratorForm.addEventListener('submit', async e => {
            e.preventDefault();

            const category = aiMainCategorySelect ? aiMainCategorySelect.value : '';
            const catText  = aiMainCategorySelect
                ? aiMainCategorySelect.options[aiMainCategorySelect.selectedIndex].text
                : '';
            const typeVal  = aiDocumentTypeSelect ? aiDocumentTypeSelect.value : '';

            if (!category || !typeVal) {
                return showNotification('Lütfen kategori ve belge türü seçin.', 'warning');
            }

            const recipients = Array.from(document.querySelectorAll('input[name="aiRecipient"]:checked'))
                                    .map(cb => cb.value).join(', ');
            if (!recipients) return showNotification('Lütfen en az bir grup seçin.', 'warning');

            const newDocument = {
                category,
                type: `${catText} / ${typeVal}`,
                name: `AI_Tutanak_${new Date().toISOString().slice(0,10)}.docx`,
                content: aiResultEl ? aiResultEl.value : '',
                recipients,
                date: new Date().toLocaleDateString('tr-TR')
            };

            if (aiSubmitBtn) { aiSubmitBtn.innerHTML = '<span class="loading"></span> Gönderiliyor...'; aiSubmitBtn.disabled = true; }

            try {
                const res = await fetch(`${API_URL}/documents`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newDocument)
                });
                if (res.ok) {
                    fetchDocuments();
                    switchTab(category);
                    aiGeneratorForm.reset();
                    if (aiDocumentTypeSelect) { aiDocumentTypeSelect.innerHTML = '<option value="">Önce kategori seçin...</option>'; aiDocumentTypeSelect.disabled = true; }
                    if (aiResultContainer) aiResultContainer.style.display = 'none';
                    if (aiSubmitBtn) aiSubmitBtn.disabled = true;
                    if (downloadPdfBtn) downloadPdfBtn.style.display = 'none';
                    showNotification('AI Tutanağı dijital arşive kaydedildi!', 'success');
                } else {
                    showNotification('Gönderim başarısız.', 'error');
                    if (aiSubmitBtn) { aiSubmitBtn.innerHTML = '<i class="fas fa-leaf"></i> Doğayı Koru: Dijital Arşive Gönder'; aiSubmitBtn.disabled = false; }
                }
            } catch (error) {
                showNotification('Bağlantı hatası.', 'error');
                if (aiSubmitBtn) { aiSubmitBtn.innerHTML = '<i class="fas fa-leaf"></i> Doğayı Koru: Dijital Arşive Gönder'; aiSubmitBtn.disabled = false; }
            }
        });
    }

    // ============================================================
    // 13. YOKLAMA MODÜLü
    // ============================================================
    const mockStudents = [
        { id: '101', name: 'Ahmet Yılmaz' },
        { id: '102', name: 'Ayşe Demir'  },
        { id: '103', name: 'Mehmet Kaya' },
        { id: '104', name: 'Fatma Çelik' },
        { id: '105', name: 'Ali Can'     }
    ];

    const loadAttendance = async (date) => {
        try {
            const res = await fetch(`${API_URL}/attendance?date=${date}`);
            const data = res.ok ? await res.json() : [];

            if (attendanceTableBody) {
                attendanceTableBody.innerHTML = mockStudents.map(student => {
                    const record = data.find(d => d.student_id === student.id);
                    const status = record ? record.status : 'var';
                    return `
                        <tr>
                            <td>${student.id} - ${student.name}</td>
                            <td>
                                <select class="form-select status-select" data-id="${student.id}" data-name="${student.name}">
                                    <option value="var" ${status === 'var' ? 'selected' : ''}>Var</option>
                                    <option value="yok" ${status === 'yok' ? 'selected' : ''}>Yok</option>
                                    <option value="gec" ${status === 'gec' ? 'selected' : ''}>Geç</option>
                                </select>
                            </td>
                        </tr>`;
                }).join('');
            }
        } catch {
            if (attendanceTableBody) {
                attendanceTableBody.innerHTML = mockStudents.map(student => `
                    <tr>
                        <td>${student.id} - ${student.name}</td>
                        <td>
                            <select class="form-select status-select" data-id="${student.id}" data-name="${student.name}">
                                <option value="var" selected>Var</option>
                                <option value="yok">Yok</option>
                                <option value="gec">Geç</option>
                            </select>
                        </td>
                    </tr>`).join('');
            }
        }
    };

    if (attendanceDate) {
        attendanceDate.valueAsDate = new Date();
        attendanceDate.addEventListener('change', e => loadAttendance(e.target.value));
        loadAttendance(attendanceDate.value);
    }

    if (attendanceForm) {
        attendanceForm.addEventListener('submit', async e => {
            e.preventDefault();
            const date    = attendanceDate ? attendanceDate.value : '';
            const selects = attendanceTableBody ? attendanceTableBody.querySelectorAll('.status-select') : [];
            const btn     = attendanceForm.querySelector('button[type="submit"]');
            if (btn) { btn.textContent = 'Kaydediliyor...'; btn.disabled = true; }

            try {
                for (const select of selects) {
                    await fetch(`${API_URL}/attendance`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            date,
                            student_id:   select.dataset.id,
                            student_name: select.dataset.name,
                            status:       select.value
                        })
                    });
                }
                showNotification('Yoklama başarıyla kaydedildi.', 'success');
            } catch {
                showNotification('Yoklama kaydedilemedi.', 'error');
            } finally {
                if (btn) { btn.textContent = 'Yoklamayı Kaydet'; btn.disabled = false; }
            }
        });
    }

    // ============================================================
    // 14. KARAR DESTEK PANELİ (İstatistikler & Grafik)
    // ============================================================
    let docChart = null;
    const loadStats = async () => {
        try {
            const res = await fetch(`${API_URL}/stats`);
            if (res.ok) {
                const data = await res.json();
                const statsTotal    = document.getElementById('statsTotal');
                const statsPending  = document.getElementById('statsPending');
                const statsApproved = document.getElementById('statsApproved');

                if (statsTotal)    statsTotal.innerHTML    = `Toplam Belge: <strong>${data.totalDocuments}</strong>`;
                if (statsPending)  statsPending.innerHTML  = `Onay Bekleyen: <strong>${data.pendingDocuments}</strong>`;
                if (statsApproved) statsApproved.innerHTML = `Onaylanan: <strong>${data.approvedDocuments}</strong>`;

                const ctx = document.getElementById('documentChart');
                if (ctx && window.Chart) {
                    if (docChart) docChart.destroy();
                    docChart = new Chart(ctx, {
                        type: 'doughnut',
                        data: {
                            labels: ['Onaylanan','Bekleyen'],
                            datasets: [{ data: [data.approvedDocuments, data.pendingDocuments], backgroundColor: ['#10b981','#f59e0b'] }]
                        },
                        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
                    });
                }
            }
        } catch {
            console.warn('İstatistikler yüklenemedi.');
        }
    };

    // ============================================================
    // 15. VELİ İLETİŞİM PORTALI
    // ============================================================
    if (parentAnnouncementForm) {
        parentAnnouncementForm.addEventListener('submit', async e => {
            e.preventDefault();
            const btn = parentAnnouncementForm.querySelector('button[type="submit"]');
            if (btn) { btn.innerHTML = '<span class="loading"></span> Gönderiliyor...'; btn.disabled = true; }

            const payload = {
                type:         document.getElementById('announcementType')?.value,
                title:        document.getElementById('announcementTitle')?.value,
                content:      document.getElementById('announcementContent')?.value,
                target_class: document.getElementById('announcementTarget')?.value || 'tum',
                date:         new Date().toLocaleDateString('tr-TR')
            };

            try {
                const res = await fetch(`${API_URL}/parent-info`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    showNotification('Duyuru velilere başarıyla gönderildi.', 'success');
                    parentAnnouncementForm.reset();
                } else {
                    showNotification('Gönderim başarısız.', 'error');
                }
            } catch {
                showNotification('Sunucu hatası.', 'error');
            } finally {
                if (btn) { btn.innerHTML = '<i class="fas fa-paper-plane"></i> Velilere Gönder'; btn.disabled = false; }
            }
        });
    }

    // ============================================================
    // 16. KURUM BİLGİLERİ KAYDET
    // ============================================================
    if (saveInstBtn) {
        saveInstBtn.addEventListener('click', () => {
            if (teacherNameInput) localStorage.setItem('teacherName',  teacherNameInput.value.trim());
            if (instProvince)     localStorage.setItem('instProvince', instProvince.value.trim());
            if (instDistrict)     localStorage.setItem('instDistrict', instDistrict.value.trim());
            if (instSchool)       localStorage.setItem('instSchool',   instSchool.value.trim());
            if (instYear)         localStorage.setItem('instYear',     instYear.value.trim());
            updateDashboardUI();
            showNotification('Kurum ve profil bilgileri başarıyla kaydedildi.', 'success');
        });
    }

    // ============================================================
    // 17. BAŞLANGIÇ
    // ============================================================
    loadInstitutionSettings();
    fetchDocuments();

    // ============================================================
    // 18. KARAR DESTEK — NOT GİRİŞİ, RADAR CHART, RİSK ANALİZİ
    // ============================================================
    const SUBJECTS = ['Türkçe','Matematik','Fen Bilimleri','Sosyal Bilgiler','İngilizce','Din Kültürü','Görsel Sanatlar','Beden Eğitimi'];

    const gradeStudentSelect = document.getElementById('gradeStudentSelect');
    const gradeTermSelect    = document.getElementById('gradeTermSelect');
    const gradeEntryTable    = document.getElementById('gradeEntryTable');
    let radarChartInstance   = null;

    // Öğrenci listesini dropdown'a doldur (mockStudents kullanır)
    const populateGradeStudents = () => {
        if (!gradeStudentSelect) return;
        mockStudents.forEach(s => {
            gradeStudentSelect.add(new Option(`${s.id} - ${s.name}`, s.id));
        });
    };

    // Seçili öğrenci için not giriş tablosunu render et
    const renderGradeEntry = async (studentId, term) => {
        if (!gradeEntryTable || !studentId) return;
        const student = mockStudents.find(s => s.id === studentId);
        if (!student) return;

        let existingGrades = [];
        try {
            const res = await fetch(`${API_URL}/grades?student_id=${studentId}&term=${term}`);
            if (res.ok) existingGrades = await res.json();
        } catch { /* offline */ }

        const scoreMap = {};
        existingGrades.forEach(g => { scoreMap[g.subject] = g.score; });

        gradeEntryTable.innerHTML = `
            <table class="table" style="margin-top:1rem;">
                <thead><tr><th>Ders</th><th style="width:160px;">Not (0–100)</th><th>Durum</th></tr></thead>
                <tbody>
                    ${SUBJECTS.map(sub => `
                    <tr>
                        <td>${sub}</td>
                        <td>
                            <input type="number" min="0" max="100"
                                class="form-input grade-input"
                                style="padding:0.4rem 0.6rem;"
                                data-student-id="${studentId}"
                                data-student-name="${student.name}"
                                data-subject="${sub}"
                                data-term="${term}"
                                value="${scoreMap[sub] !== undefined ? scoreMap[sub] : ''}">
                        </td>
                        <td id="grade-status-${sub.replace(/\s/g,'_')}" style="font-size:0.8rem;color:var(--text-secondary);">
                            ${scoreMap[sub] !== undefined ? '<i class="fas fa-check-circle" style="color:#10b981;"></i> Kayıtlı' : '—'}
                        </td>
                    </tr>`).join('')}
                </tbody>
            </table>
            <button id="saveGradesBtn" class="btn btn-primary btn-sm" style="margin-top:0.75rem;">
                <i class="fas fa-save"></i> Notları Kaydet
            </button>`;

        document.getElementById('saveGradesBtn')?.addEventListener('click', saveGrades);
    };

    const saveGrades = async () => {
        const inputs = gradeEntryTable ? gradeEntryTable.querySelectorAll('.grade-input') : [];
        const btn = document.getElementById('saveGradesBtn');
        if (btn) { btn.innerHTML = '<span class="loading"></span> Kaydediliyor...'; btn.disabled = true; }

        let saved = 0;
        for (const input of inputs) {
            const score = parseFloat(input.value);
            if (isNaN(score) || input.value === '') continue;
            if (score < 0 || score > 100) continue;
            try {
                const res = await fetch(`${API_URL}/grades`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        student_id:   input.dataset.studentId,
                        student_name: input.dataset.studentName,
                        subject:      input.dataset.subject,
                        score,
                        term:         input.dataset.term
                    })
                });
                if (res.ok) {
                    const statusEl = document.getElementById(`grade-status-${input.dataset.subject.replace(/\s/g,'_')}`);
                    if (statusEl) statusEl.innerHTML = '<i class="fas fa-check-circle" style="color:#10b981;"></i> Kayıtlı';
                    saved++;
                }
            } catch { /* offline */ }
        }

        if (btn) { btn.innerHTML = '<i class="fas fa-save"></i> Notları Kaydet'; btn.disabled = false; }
        showNotification(saved > 0 ? `${saved} not başarıyla kaydedildi.` : 'Kaydedilecek not bulunamadı.', saved > 0 ? 'success' : 'warning');
    };

    if (gradeStudentSelect) {
        gradeStudentSelect.addEventListener('change', () =>
            renderGradeEntry(gradeStudentSelect.value, gradeTermSelect?.value || '1'));
    }
    if (gradeTermSelect) {
        gradeTermSelect.addEventListener('change', () => {
            if (gradeStudentSelect?.value) renderGradeEntry(gradeStudentSelect.value, gradeTermSelect.value);
        });
    }

    // Radar Chart — sınıf ders ortalamaları
    const renderRadarChart = async (term) => {
        try {
            const res = await fetch(`${API_URL}/grades/stats${term ? '?term=' + term : ''}`);
            if (!res.ok) return;
            const data = await res.json();

            const labels = data.subjectAverages.map(s => s.subject);
            const values = data.subjectAverages.map(s => Math.round(s.class_avg * 10) / 10);

            const ctx = document.getElementById('radarChart');
            if (!ctx || !window.Chart) return;

            if (radarChartInstance) radarChartInstance.destroy();
            radarChartInstance = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels,
                    datasets: [{
                        label: 'Sınıf Ortalaması',
                        data: values,
                        backgroundColor: 'rgba(30,64,175,0.15)',
                        borderColor: '#1e40af',
                        borderWidth: 2,
                        pointBackgroundColor: '#1e40af'
                    }]
                },
                options: {
                    responsive: true,
                    scales: { r: { beginAtZero: true, max: 100, ticks: { stepSize: 20 } } },
                    plugins: { legend: { display: false } }
                }
            });
        } catch { /* veri yok */ }
    };

    // Risk Analizi
    const loadRiskAnalysis = async () => {
        const tbody = document.getElementById('riskTableBody');
        if (!tbody) return;

        try {
            const res = await fetch(`${API_URL}/grades/stats`);
            if (!res.ok) { tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#ef4444;">Veri yüklenemedi.</td></tr>`; return; }
            const data = await res.json();

            // Öğrenci bazında veri birleştir
            const studentMap = {};
            data.avgByStudent.forEach(s => {
                studentMap[s.student_id] = { name: s.student_name, avg: Math.round(s.overall_avg * 10) / 10, absent: 0, late: 0 };
            });
            data.absences.forEach(a => {
                if (studentMap[a.student_id]) {
                    studentMap[a.student_id].absent = a.absent || 0;
                    studentMap[a.student_id].late   = a.late   || 0;
                }
            });

            // Notu olmayan öğrencileri de ekle (sadece devamsızlık)
            data.absences.forEach(a => {
                if (!studentMap[a.student_id] && a.student_id) {
                    studentMap[a.student_id] = { name: a.student_name, avg: null, absent: a.absent || 0, late: a.late || 0 };
                }
            });

            if (!Object.keys(studentMap).length) {
                tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-secondary);padding:1.5rem;">Henüz not veya devamsızlık verisi yok.</td></tr>`;
                return;
            }

            const getRiskLevel = (avg, absent) => {
                const score = (avg !== null && avg < 50 ? 2 : avg !== null && avg < 60 ? 1 : 0)
                            + (absent >= 10 ? 2 : absent >= 5 ? 1 : 0);
                if (score >= 3) return { label: 'Yüksek Risk', color: '#ef4444', icon: 'fa-exclamation-triangle' };
                if (score >= 1) return { label: 'Takip',       color: '#f59e0b', icon: 'fa-eye' };
                return              { label: 'Normal',          color: '#10b981', icon: 'fa-check-circle' };
            };

            tbody.innerHTML = Object.values(studentMap).map(s => {
                const risk = getRiskLevel(s.avg, s.absent);
                return `<tr>
                    <td>${s.name}</td>
                    <td><strong>${s.avg !== null ? s.avg : '—'}</strong></td>
                    <td>${s.absent} gün</td>
                    <td>${s.late} kez</td>
                    <td><span style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.2rem 0.6rem;border-radius:999px;background:${risk.color}20;color:${risk.color};font-size:0.8rem;font-weight:600;">
                        <i class="fas ${risk.icon}"></i> ${risk.label}
                    </span></td>
                </tr>`;
            }).join('');

            await renderRadarChart();
        } catch { tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#ef4444;padding:1.5rem;">Sunucu bağlantısı kurulamadı.</td></tr>`; }
    };

    document.getElementById('refreshRiskBtn')?.addEventListener('click', loadRiskAnalysis);

    // Karar Destek sekmesine geçince verileri yükle
    document.addEventListener('click', e => {
        const btn = e.target.closest('[data-tab]');
        if (btn?.dataset.tab === 'karardestek') {
            loadStats();
            loadRiskAnalysis();
        }
    });

    // ============================================================
    // 19. İZİN TALEBİ FORMU
    // ============================================================
    const permissionRequestForm = document.getElementById('permissionRequestForm');
    if (permissionRequestForm) {
        permissionRequestForm.addEventListener('submit', async e => {
            e.preventDefault();
            const btn = permissionRequestForm.querySelector('button[type="submit"]');
            if (btn) { btn.innerHTML = '<span class="loading"></span> Gönderiliyor...'; btn.disabled = true; }

            const payload = {
                teacher_name:     localStorage.getItem('teacherName') || 'Öğretmen',
                teacher_username: '',
                request_type:     document.getElementById('permType')?.value,
                reason:           document.getElementById('permReason')?.value,
                start_date:       document.getElementById('permStartDate')?.value,
                end_date:         document.getElementById('permEndDate')?.value
            };

            try {
                const res = await fetch(`${API_URL}/permission-requests`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    showNotification('İzin talebiniz idariye iletildi.', 'success');
                    permissionRequestForm.reset();
                    loadMyPermissions();
                } else {
                    showNotification('Talep gönderilemedi.', 'error');
                }
            } catch {
                showNotification('Sunucu bağlantısı kurulamadı.', 'error');
            } finally {
                if (btn) { btn.innerHTML = '<i class="fas fa-paper-plane"></i> Talep Gönder'; btn.disabled = false; }
            }
        });
    }

    const loadMyPermissions = async () => {
        const tbody = document.getElementById('myPermissionsBody');
        if (!tbody) return;
        try {
            const res = await fetch(`${API_URL}/permission-requests`);
            if (!res.ok) return;
            const items = await res.json();

            if (!items.length) {
                tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-secondary);padding:1.5rem;">Talep bulunamadı.</td></tr>`;
                return;
            }

            const statusStyle = {
                'Bekliyor':   { color:'#f59e0b', icon:'fa-hourglass-half' },
                'Onaylandı':  { color:'#10b981', icon:'fa-check-circle' },
                'Reddedildi': { color:'#ef4444', icon:'fa-times-circle' }
            };

            tbody.innerHTML = items.map(item => {
                const st = statusStyle[item.status] || statusStyle['Bekliyor'];
                return `<tr>
                    <td>${item.request_type}</td>
                    <td>${item.start_date || '—'} / ${item.end_date || '—'}</td>
                    <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${item.reason}">${item.reason}</td>
                    <td><span style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.2rem 0.6rem;border-radius:999px;background:${st.color}20;color:${st.color};font-size:0.78rem;font-weight:600;">
                        <i class="fas ${st.icon}"></i> ${item.status}
                    </span></td>
                    <td style="font-size:0.8rem;color:var(--text-secondary);">${item.reviewer_note || '—'}</td>
                </tr>`;
            }).join('');
        } catch { /* offline */ }
    };

    // İzin sekmesi açılınca geçmiş talepleri yükle
    document.addEventListener('click', e => {
        const btn = e.target.closest('[data-tab]');
        if (btn?.dataset.tab === 'izintalebi') loadMyPermissions();
    });

    // Not giriş dropdown'ını başlat
    populateGradeStudents();

    // ============================================================
    // 18. HERKES BURADA BUTONU
    // ============================================================
    const allPresentBtn = document.getElementById('allPresentBtn');
    if (allPresentBtn) {
        allPresentBtn.addEventListener('click', () => {
            const selects = attendanceTableBody
                ? attendanceTableBody.querySelectorAll('.status-select')
                : [];
            selects.forEach(sel => { sel.value = 'var'; });
            if (selects.length > 0) showNotification(`${selects.length} öğrenci "Var" olarak işaretlendi.`, 'success');
        });
    }

    // ============================================================
    // 19. SESLE KOMUT (Web Speech API)
    // ============================================================
    const voiceInputBtn = document.getElementById('voiceInputBtn');
    if (voiceInputBtn && aiPromptEl) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.lang = 'tr-TR';
            recognition.continuous = false;
            recognition.interimResults = false;

            let listening = false;

            voiceInputBtn.addEventListener('click', () => {
                if (listening) {
                    recognition.stop();
                    return;
                }
                recognition.start();
            });

            recognition.onstart = () => {
                listening = true;
                voiceInputBtn.style.background = '#fee2e2';
                voiceInputBtn.style.borderColor = '#ef4444';
                voiceInputBtn.style.color = '#ef4444';
                voiceInputBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
                showNotification('Dinleniyor... Konuşun.', 'success');
            };

            recognition.onresult = (e) => {
                const transcript = e.results[0][0].transcript;
                aiPromptEl.value += (aiPromptEl.value ? '\n' : '') + transcript;
            };

            recognition.onend = () => {
                listening = false;
                voiceInputBtn.style.background = '';
                voiceInputBtn.style.borderColor = '';
                voiceInputBtn.style.color = '';
                voiceInputBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            };

            recognition.onerror = () => {
                listening = false;
                voiceInputBtn.style.background = '';
                voiceInputBtn.style.borderColor = '';
                voiceInputBtn.style.color = '';
                voiceInputBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                showNotification('Ses tanıma hatası. Mikrofon erişimine izin verdiğinizden emin olun.', 'error');
            };
        } else {
            voiceInputBtn.title = 'Tarayıcınız ses tanımayı desteklemiyor';
            voiceInputBtn.style.opacity = '0.4';
            voiceInputBtn.disabled = true;
        }
    }

    // ============================================================
    // 20. EduBot SOHBET BOTU
    // ============================================================
    const edubotToggle  = document.getElementById('edubot-toggle');
    const edubotWindow  = document.getElementById('edubot-window');
    const edubotClose   = document.getElementById('edubot-close');
    const edubotInput   = document.getElementById('edubot-input');
    const edubotSend    = document.getElementById('edubot-send');
    const edubotMsgs    = document.getElementById('edubot-messages');
    const edubotBadge   = document.getElementById('edubot-badge');

    if (edubotToggle && edubotWindow) {
        let isOpen = false;

        const openBot = () => {
            edubotWindow.style.display = 'flex';
            isOpen = true;
            edubotBadge.style.display = 'none';
            if (edubotInput) edubotInput.focus();
        };
        const closeBot = () => {
            edubotWindow.style.display = 'none';
            isOpen = false;
        };

        edubotToggle.addEventListener('click', () => isOpen ? closeBot() : openBot());
        if (edubotClose) edubotClose.addEventListener('click', closeBot);

        const appendMsg = (text, role) => {
            const div = document.createElement('div');
            div.className = role === 'user' ? 'user-msg' : 'bot-msg';
            div.textContent = text;
            edubotMsgs.appendChild(div);
            edubotMsgs.scrollTop = edubotMsgs.scrollHeight;
            return div;
        };

        const sendBotMessage = async (userText) => {
            appendMsg(userText, 'user');
            const thinking = appendMsg('Düşünüyor...', 'bot');
            thinking.classList.add('typing');

            try {
                const res = await fetch('/api/generate-minutes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt: userText,
                        context: {
                            documentType: 'EduBot',
                            school: localStorage.getItem('instSchool') || '',
                            year:   localStorage.getItem('instYear')   || ''
                        }
                    })
                });
                const data = await res.json();
                thinking.remove();
                appendMsg(data.result || data.error || 'Bir yanıt oluşturulamadı.', 'bot');
            } catch {
                thinking.remove();
                appendMsg('Sunucu bağlantısı kurulamadı. Lütfen tekrar deneyin.', 'bot');
            }
        };

        const handleSend = () => {
            const text = edubotInput ? edubotInput.value.trim() : '';
            if (!text) return;
            edubotInput.value = '';
            sendBotMessage(text);
        };

        if (edubotSend) edubotSend.addEventListener('click', handleSend);
        if (edubotInput) {
            edubotInput.addEventListener('keydown', e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
            });
        }
    }

}); // DOMContentLoaded sonu
