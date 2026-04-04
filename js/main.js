/**
 * main.js (Teacher Dashboard)
 */
import { initAuthGuard } from './auth.js';
import { fetchAPI } from './api.js';
import { initThemeToggle, showNotification, switchTab } from './ui.js';
import { generateContent, generateOfficialPDF } from './ai-generator.js';
import { renderNavbar } from './components/Navbar.js';
import { renderFooter } from './components/Footer.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Auth Guard
    initAuthGuard('teacher');

    // 2. Render UI Components
    renderNavbar('navbar-root', {
        logoPath: 'edusync-logo.png',
        title: 'Öğretmen Çalışma Alanı',
        roleBadgeIcon: 'fa-user-circle',
        roleBadgeText: localStorage.getItem('teacherName') || 'Sayın Öğretmenim',
        roleBadgeId: 'headerTeacherName',
        logoutPath: 'index.html',
        navbarClass: 'header',
        brandClass: 'header-left',
        actionsClass: 'user-info'
    });
    renderFooter('footer-root', '');

    // 3. Initialize Shared Layout Services
    initThemeToggle();

    // 4. Local Variables & References
    let documents = [];
    
    // --- Fetch References lazily because they are dynamic or already in DOM
    const homeroomCheckbox = document.getElementById('isHomeroomTeacher');
    const clubCheckbox = document.getElementById('isClubAdvisor');
    const rehberlikTabBtn = document.getElementById('rehberlikTabBtn');
    const kulupTabBtn = document.getElementById('kulupTabBtn');
    const tabNav = document.querySelector('.tab-nav');

    const updateDashboardUI = () => {
        const name = localStorage.getItem('teacherName') || 'Öğretmen';
        const school = localStorage.getItem('instSchool') || 'Okul Belirtilmedi';
        const year = localStorage.getItem('instYear') || 'Yıl Belirtilmedi';
        
        const headerName = document.getElementById('headerTeacherName');
        if (headerName) headerName.textContent = name;
        const welcomeTitle = document.getElementById('welcomeTitle');
        if (welcomeTitle) welcomeTitle.textContent = `Hoş Geldiniz, Sayın ${name}`;
        const bannerSchool = document.getElementById('bannerSchool');
        if (bannerSchool) bannerSchool.innerHTML = `<i class="fas fa-school"></i> ${school}`;
        const bannerYear = document.getElementById('bannerYear');
        if (bannerYear) bannerYear.innerHTML = `<i class="fas fa-calendar-alt"></i> ${year}`;
    };

    const fetchDocuments = async () => {
        try {
            const res = await fetchAPI('/documents');
            if (res && res.ok) {
                documents = await res.json();
                renderDocuments();
            }
        } catch (error) {
            showNotification('Sunucuya bağlanılamadı.', 'error');
        }
    };

    const getIconForFile = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();
        if (ext === 'pdf') return '<i class="fas fa-file-pdf" style="color: #ef4444; margin-right: 0.5rem;"></i>';
        if (['doc', 'docx'].includes(ext)) return '<i class="fas fa-file-word" style="color: #2563eb; margin-right: 0.5rem;"></i>';
        return '<i class="fas fa-file" style="color: #64748b; margin-right: 0.5rem;"></i>';
    };

    const getStatusClass = (status) => ({ 'Bekliyor': 'status-waiting', 'Onaylandı': 'status-approved', 'Reddedildi': 'status-rejected' }[status] || 'status-waiting');
    const getStatusIcon = (status) => ({ 'Bekliyor': '<i class="fas fa-hourglass-half"></i>', 'Onaylandı': '<i class="fas fa-check-circle"></i>', 'Reddedildi': '<i class="fas fa-times-circle"></i>' }[status] || '');
    
    const getEmptyStateHTML = (category) => {
        const icons = { idari: 'fa-folder-open', rehberlik: 'fa-school', kulup: 'fa-users' };
        const texts = { idari: 'idari', rehberlik: 'rehberlik', kulup: 'kulüp' };
        return `<tr><td colspan="6" class="empty-state"><i class="fas ${icons[category]}"></i><div>Henüz ${texts[category]} belgesi yüklenmemiş</div></td></tr>`;
    };

    const renderDocuments = () => {
        document.querySelectorAll('.table tbody').forEach(tbody => {
            if(tbody.id !== 'attendanceTableBody') tbody.innerHTML = '';
        });

        if (documents.length === 0) {
            const el1 = document.querySelector('#idariContent tbody'); if(el1) el1.innerHTML = getEmptyStateHTML('idari');
            const el2 = document.querySelector('#rehberlikContent tbody'); if(el2) el2.innerHTML = getEmptyStateHTML('rehberlik');
            const el3 = document.querySelector('#kulupContent tbody'); if(el3) el3.innerHTML = getEmptyStateHTML('kulup');
            return;
        }

        documents.forEach(doc => {
            const targetTableBody = document.querySelector(`#${doc.category}Content tbody`);
            if (targetTableBody) {
                if (targetTableBody.querySelector('.empty-state')) targetTableBody.innerHTML = '';
                const row = document.createElement('tr');
                row.className = 'fade-in';
                row.innerHTML = `
                    <td>${getIconForFile(doc.name)} ${doc.name}</td>
                    <td>${doc.type}</td>
                    <td>${doc.recipients}</td>
                    <td>${doc.date}</td>
                    <td><span class="status-badge ${getStatusClass(doc.status)}">${getStatusIcon(doc.status)} ${doc.status}</span></td>
                    <td>
                        ${doc.status === 'Bekliyor' ? `
                            <button class="btn btn-success btn-sm approve-btn" data-id="${doc.id}"><i class="fas fa-check"></i> Onayla</button>
                            <button class="btn btn-danger btn-sm reject-btn" data-id="${doc.id}"><i class="fas fa-times"></i> Reddet</button>
                        ` : `<button class="btn btn-secondary btn-sm" disabled><i class="fas fa-lock"></i> Kilitli</button>`}
                    </td>
                `;
                targetTableBody.appendChild(row);
            }
        });
    };

    // Tabs
    if (tabNav) {
        tabNav.addEventListener('click', e => {
            if(e.target.matches('.tab-btn')) {
                switchTab(e.target.dataset.tab);
                if (e.target.dataset.tab === 'karardestek') loadStats();
            }
        });
    }

    if (homeroomCheckbox && rehberlikTabBtn) {
        homeroomCheckbox.addEventListener('change', () => toggleTabVisibility(rehberlikTabBtn, homeroomCheckbox.checked));
    }
    if (clubCheckbox && kulupTabBtn) {
        clubCheckbox.addEventListener('change', () => toggleTabVisibility(kulupTabBtn, clubCheckbox.checked));
    }

    const toggleTabVisibility = (tabButton, isVisible) => {
        if (tabButton) {
            tabButton.style.display = isVisible ? 'flex' : 'none';
            if (!isVisible && tabButton.classList.contains('active')) switchTab('idari');
        }
    };

    // AI Logic Listeners
    const generateAiBtn = document.getElementById('generateAiBtn');
    if (generateAiBtn) {
        generateAiBtn.addEventListener('click', async () => {
             const promptTxt = document.getElementById('aiPrompt').value.trim();
             if (!promptTxt) return showNotification('Lütfen yapay zekanın kullanacağı notları girin.', 'warning');
             
             generateAiBtn.innerHTML = '<span class="loading"></span> Üretiliyor...';
             generateAiBtn.disabled = true;

             const contextFields = {
                province: document.getElementById('instProvince').value || '',
                district: document.getElementById('instDistrict').value || '',
                school: document.getElementById('instSchool').value || '',
                year: document.getElementById('instYear').value || ''
             };

             try {
                const aiHTML = await generateContent(promptTxt, contextFields);
                document.getElementById('aiResult').value = aiHTML;
                document.getElementById('aiResultContainer').style.display = 'block';
                document.getElementById('aiSubmitBtn').disabled = false;
                document.getElementById('downloadPdfBtn').style.display = 'block';
                showNotification('Tutanak başarıyla üretildi.', 'success');
             } catch(e) {
                 showNotification('Tutanak üretilemedi.', 'error');
             } finally {
                generateAiBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Tutanağı Üret';
                generateAiBtn.disabled = false;
             }
        });
    }

    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', () => {
            const val = document.getElementById('aiResult').value;
             const contextFields = {
                province: document.getElementById('instProvince').value || '',
                district: document.getElementById('instDistrict').value || '',
                school: document.getElementById('instSchool').value || '',
                year: document.getElementById('instYear').value || '',
                documentType: document.getElementById('aiDocumentType')?.value || ''
             };
            generateOfficialPDF(val, contextFields);
        });
    }

    // Init Sequence
    updateDashboardUI();
    fetchDocuments();
});


/* --- ORIGINAL LOGIC RESTORED --- */
// ---- Inactivity Timeout ----
let inactivityTimer;
const TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        localStorage.removeItem('edusync_token');
        window.location.href = 'index.html';
    }, TIMEOUT_MS);
}

document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keypress', resetInactivityTimer);
document.addEventListener('click', resetInactivityTimer);
resetInactivityTimer();


    const API_URL = 'http://localhost:3000/api';

    // --- ELEMENT REFERANSLARI ---
    const themeToggle = document.getElementById('themeToggle');
    const homeroomCheckbox = document.getElementById('isHomeroomTeacher');
    const clubCheckbox = document.getElementById('isClubAdvisor');
    const rehberlikTabBtn = document.getElementById('rehberlikTabBtn');
    const kulupTabBtn = document.getElementById('kulupTabBtn');
    const tabNav = document.querySelector('.tab-nav');
    const uploadForm = document.getElementById('uploadForm');
    const mainCategorySelect = document.getElementById('mainCategory');
    const documentTypeSelect = document.getElementById('documentType');
    const fileUpload = document.getElementById('fileUpload');
    const fileUploadInput = document.getElementById('documentFile');
    const fileUploadText = document.getElementById('fileUploadText');
    const aiSubmitBtn = document.getElementById('aiSubmitBtn');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    const aiResultContainer = document.getElementById('aiResultContainer');
    const aiResult = document.getElementById('aiResult');

    // AI Form Elements
    const aiGeneratorForm = document.getElementById('aiGeneratorForm');
    const aiMainCategorySelect = document.getElementById('aiMainCategory');
    const aiDocumentTypeSelect = document.getElementById('aiDocumentType');
    const aiPrompt = document.getElementById('aiPrompt');
    const generateAiBtn = document.getElementById('generateAiBtn');

    // Institution Settings Elements
    const teacherNameInput = document.getElementById('teacherName');
    const instProvince = document.getElementById('instProvince');
    const instDistrict = document.getElementById('instDistrict');
    const instSchool = document.getElementById('instSchool');
    const instYear = document.getElementById('instYear');
    const saveInstBtn = document.getElementById('saveInstBtn');

    // UI Identity Elements
    const headerTeacherName = document.getElementById('headerTeacherName');
    const welcomeTitle = document.getElementById('welcomeTitle');
    const bannerSchool = document.getElementById('bannerSchool');
    const bannerYear = document.getElementById('bannerYear');

    // --- VERİ YÖNETİMİ ---
    const documentTypes = {
        idari: ["Yıllık İş Günü Çalışma Takvimi", "Ünitelendirilmiş Yıllık Plan", "Günlük Plan", "Haftalık Ders Programı", "Şube Öğretmenler Kurulu Tutanağı", "Zümre Öğretmenler Kurulu Tutanağı", "Diğer İdari Evraklar"],
        rehberlik: ["Sınıf Rehberlik Yıllık Planı", "Öğrenci Gözlem Formu", "Veli Görüşme Formu", "Risk Haritası Anket Sonuçları", "Diğer Rehberlik Evrakları"],
        kulup: ["Kulüp Yıllık Çalışma Planı", "Kulüp Karar Defteri Örneği", "Sosyal Etkinlik Formu", "Kulüp Üye Listesi", "Diğer Kulüp Evrakları"]
    };

    let documents = [];

    // --- FONKSİYONLAR ---

    // 1. TEMA YÖNETİMİ
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', theme);
    };

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        applyTheme(currentTheme === 'light' ? 'dark' : 'light');
    });

    // 2. BELGELERİ GETİR
    const fetchDocuments = async () => {
        try {
            const res = await fetch(`${API_URL}/documents`);
            if (res.ok) {
                documents = await res.json();
                renderDocuments();
            }
        } catch (error) {
            console.error('API Error:', error);
            showNotification('Sunucuya bağlanılamadı. Backend\'in çalıştığından emin olun.', 'error');
        }
    };

    // 3. BELGELERİ EKRANA ÇİZME (RENDER)
    const renderDocuments = () => {
        document.querySelectorAll('.table tbody').forEach(tbody => tbody.innerHTML = '');

        if (documents.length === 0) {
            document.querySelector('#idariContent tbody').innerHTML = getEmptyStateHTML('idari');
            document.querySelector('#rehberlikContent tbody').innerHTML = getEmptyStateHTML('rehberlik');
            document.querySelector('#kulupContent tbody').innerHTML = getEmptyStateHTML('kulup');
            return;
        }

        documents.forEach(doc => {
            const targetTableBody = document.querySelector(`#${doc.category}Content tbody`);
            if (targetTableBody) {
                if (targetTableBody.querySelector('.empty-state')) targetTableBody.innerHTML = '';
                const row = document.createElement('tr');
                row.className = 'fade-in';
                row.innerHTML = `
                    <td>${getIconForFile(doc.name)} ${doc.name}</td>
                    <td>${doc.type}</td>
                    <td>${doc.recipients}</td>
                    <td>${doc.date}</td>
                    <td><span class="status-badge ${getStatusClass(doc.status)}">${getStatusIcon(doc.status)} ${doc.status}</span></td>
                    <td>
                        ${doc.status === 'Bekliyor' ? `
                            <button class="btn btn-success btn-sm approve-btn" data-id="${doc.id}"><i class="fas fa-check"></i> Onayla</button>
                            <button class="btn btn-danger btn-sm reject-btn" data-id="${doc.id}"><i class="fas fa-times"></i> Reddet</button>
                        ` : `<button class="btn btn-secondary btn-sm" disabled><i class="fas fa-lock"></i> Kilitli</button>`}
                    </td>
                `;
                targetTableBody.appendChild(row);
            }
        });

        document.querySelectorAll('.table tbody').forEach(tbody => {
            if (tbody.children.length === 0) {
                const category = tbody.closest('.tab-content').id.replace('Content', '');
                tbody.innerHTML = getEmptyStateHTML(category);
            }
        });
    };

    // 4. BELGE İŞLEMLERİ (Onay, Red, Ekleme)
    document.querySelector('.main-container').addEventListener('click', e => {
        const target = e.target.closest('button');
        if (!target) return;

        const docId = target.dataset.id;
        if (target.classList.contains('approve-btn')) updateDocumentStatus(docId, 'Onaylandı');
        if (target.classList.contains('reject-btn')) updateDocumentStatus(docId, 'Reddedildi');
    });

    const updateDocumentStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`${API_URL}/documents/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                fetchDocuments();
                showNotification(`Belge başarıyla "${newStatus}" olarak işaretlendi.`, 'success');
            }
        } catch (error) {
            showNotification('Durum güncellenirken hata oluştu.', 'error');
        }
    };

    // 5. NORMAL FORM YÖNETİMİ
    uploadForm.addEventListener('submit', async e => {
        e.preventDefault();
        const typeStr = `${mainCategorySelect.options[mainCategorySelect.selectedIndex].text} / ${documentTypeSelect.value}`;
        const newDocument = {
            category: mainCategorySelect.value,
            type: typeStr,
            name: fileUploadInput.files[0].name,
            recipients: Array.from(document.querySelectorAll('input[name="recipient"]:checked')).map(cb => cb.value).join(', '),
            date: new Date().toLocaleDateString('tr-TR')
        };

        if (!newDocument.recipients) return showNotification('Lütfen en az bir gönderilecek grup seçin.', 'warning');

        submitBtn.innerHTML = '<span class="loading"></span> Yükleniyor...';
        submitBtn.disabled = true;

        try {
            const res = await fetch(`${API_URL}/documents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDocument)
            });
            if (res.ok) {
                fetchDocuments();
                switchTab(newDocument.category);
                uploadForm.reset();
                documentTypeSelect.innerHTML = '<option value="">Önce kategori seçin...</option>';
                documentTypeSelect.disabled = true;
                fileUploadText.textContent = 'Dosya seçin veya buraya sürükleyin';
                fileUpload.classList.remove('has-file');
                showNotification('Belge başarıyla yüklendi ve onaya gönderildi!', 'success');
            }
        } catch (error) {
            showNotification('Belge yüklenirken hata oluştu.', 'error');
        } finally {
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Yükle ve Onaya Gönder';
            submitBtn.disabled = false;
        }
    });

    // 6. YAPAY ZEKA FORMU YÖNETİMİ
    const handleCategoryChange = (catSelect, typeSelect) => {
        const selectedCategory = catSelect.value;
        typeSelect.innerHTML = '<option value="">Önce kategori seçin...</option>';
        typeSelect.disabled = true;
        if (selectedCategory && documentTypes[selectedCategory]) {
            typeSelect.innerHTML = '<option value="" disabled selected>Belge türü seçin...</option>';
            documentTypes[selectedCategory].forEach(type => typeSelect.add(new Option(type, type)));
            typeSelect.disabled = false;
        }
    };

    mainCategorySelect.addEventListener('change', () => handleCategoryChange(mainCategorySelect, documentTypeSelect));
    aiMainCategorySelect.addEventListener('change', () => handleCategoryChange(aiMainCategorySelect, aiDocumentTypeSelect));

    generateAiBtn.addEventListener('click', async () => {
        const promptTxt = aiPrompt.value.trim();
        if (!promptTxt) return showNotification('Lütfen yapay zekanın kullanacağı toplantı notlarını girin.', 'warning');

        const context = {
            province: instProvince.value.trim() || '[İl Girilmeli]',
            district: instDistrict.value.trim() || '[İlçe Girilmeli]',
            school: instSchool.value.trim() || '[Okul Adı Girilmeli]',
            year: instYear.value.trim() || '[Eğitim Yılı Girilmeli]'
        };

        generateAiBtn.innerHTML = '<span class="loading"></span> Üretiliyor...';
        generateAiBtn.disabled = true;

        try {
            const res = await fetch(`${API_URL}/generate-minutes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: promptTxt, context })
            });

            if (res.ok) {
                const data = await res.json();
                aiResult.value = data.result;
                aiResultContainer.style.display = 'block';
                aiSubmitBtn.disabled = false;
                downloadPdfBtn.style.display = 'block';
                showNotification('Tutanak başarıyla üretildi.', 'success');
            } else {
                throw new Error('API Hatası');
            }
        } catch (error) {
            showNotification('Tutanak üretilemedi. Backend ayarlarını veya API anahtarını kontrol edin.', 'error');
        } finally {
            generateAiBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Tutanağı Üret';
            generateAiBtn.disabled = false;
        }
    });

    // PDF Generator Logic
    const generateOfficialPDF = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'mm', format: 'a4' });
        
        const content = aiResult.value;
        const province = instProvince.value.toUpperCase() || '[İL]';
        const district = instDistrict.value.toUpperCase() || '[İLÇE]';
        const school = instSchool.value.toUpperCase() || '[OKUL ADI]';
        const year = instYear.value || '[YIL]';
        const date = new Date().toLocaleDateString('tr-TR');
        const teacherName = localStorage.getItem('teacherName') || '[İsim Soyisim]';
        
        // Settings
        const margin = 25;
        const pageWidth = doc.internal.pageSize.getWidth();
        const contentWidth = pageWidth - (2 * margin);
        let currentY = 25;

        // Header
        doc.setFont('times', 'bold');
        doc.setFontSize(12);
        doc.text('T.C.', pageWidth / 2, currentY, { align: 'center' });
        currentY += 6;
        doc.text(`${province} VALİLİĞİ`, pageWidth / 2, currentY, { align: 'center' });
        currentY += 6;
        doc.text(`${district} KAYMAKAMLIĞI`, pageWidth / 2, currentY, { align: 'center' });
        currentY += 6;
        doc.text(school, pageWidth / 2, currentY, { align: 'center' });
        
        currentY += 15;
        
        // Sayı & Konu & Tarih
        doc.setFontSize(11);
        doc.text('Sayı  :', margin, currentY);
        doc.text('Konu :', margin, currentY + 6);
        doc.setFont('times', 'normal');
        doc.text('E-70430156-020-2024-X', margin + 15, currentY); // Mock official number
        doc.text(aiDocumentTypeSelect.value || 'Toplantı Tutanağı', margin + 15, currentY + 6);
        
        doc.setFont('times', 'bold');
        doc.text(date, pageWidth - margin, currentY, { align: 'right' });
        
        currentY += 25;
        
        // Body (AI Content)
        doc.setFont('times', 'normal');
        doc.setFontSize(12);
        
        // Split text to fit width
        const lines = doc.splitTextToSize(content, contentWidth);
        doc.text(lines, margin, currentY);
        
        // Estimate end of text
        currentY += (lines.length * 6) + 20;
        
        // Signature
        if (currentY > 260) { doc.addPage(); currentY = 30; }
        doc.setFont('times', 'bold');
        doc.text(teacherName, pageWidth - margin - 50, currentY, { align: 'center' });
        doc.setFont('times', 'normal');
        doc.text('Öğretmen', pageWidth - margin - 50, currentY + 6, { align: 'center' });
        
        // Save
        const fileName = `Resmi_Tutanak_${date.replace(/\./g, '_')}.pdf`;
        doc.save(fileName);
        showNotification('Resmi PDF başarıyla oluşturuldu ve indirildi.', 'success');
    };

    downloadPdfBtn.addEventListener('click', generateOfficialPDF);

    aiGeneratorForm.addEventListener('submit', async e => {
        e.preventDefault();
        const typeStr = `${aiMainCategorySelect.options[aiMainCategorySelect.selectedIndex].text} / ${aiDocumentTypeSelect.value}`;
        const newDocument = {
            category: aiMainCategorySelect.value,
            type: typeStr,
            name: `AI_Tutanak_${new Date().toISOString().slice(0, 10)}.docx`,
            content: aiResult.value, // Human-in-the-Loop: Potentially edited content
            recipients: Array.from(document.querySelectorAll('input[name="aiRecipient"]:checked')).map(cb => cb.value).join(', '),
            date: new Date().toLocaleDateString('tr-TR')
        };

        if (!newDocument.recipients) return showNotification('Lütfen en az bir gönderilecek grup seçin.', 'warning');

        aiSubmitBtn.innerHTML = '<span class="loading"></span> Gönderiliyor...';
        aiSubmitBtn.disabled = true;

        try {
            const res = await fetch(`${API_URL}/documents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDocument)
            });
            if (res.ok) {
                fetchDocuments();
                switchTab(newDocument.category);
                aiGeneratorForm.reset();
                aiDocumentTypeSelect.innerHTML = '<option value="">Önce kategori seçin...</option>';
                aiDocumentTypeSelect.disabled = true;
                aiResultContainer.style.display = 'none';
                aiSubmitBtn.disabled = true;
                showNotification('AI Tutanağı başarıyla sisteme kaydedildi ve onaya gönderildi!', 'success');
            }
        } catch (error) {
            showNotification('Belge kaydedilirken hata oluştu.', 'error');
            aiSubmitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Üretilen Tutanağı Onaya Gönder';
            aiSubmitBtn.disabled = false;
        }
    });

    // 7. DOSYA YÜKLEME VE SÜRÜKLE-BIRAK
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => fileUpload.addEventListener(eventName, e => e.preventDefault(), false));

    fileUpload.addEventListener('dragover', () => fileUpload.classList.add('is-dragging'));
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
        if (fileUploadInput.files.length > 0) {
            updateFileUploadUI(fileUploadInput.files[0].name);
        }
    });

    const updateFileUploadUI = (fileName) => {
        fileUploadText.innerHTML = `<i class="fas fa-check-circle" style="color: var(--success-color);"></i> ${fileName}`;
        fileUpload.classList.add('has-file');
    };

    // 8. YARDIMCI FONKSİYONLAR
    const getIconForFile = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();
        if (ext === 'pdf') return '<i class="fas fa-file-pdf" style="color: #ef4444; margin-right: 0.5rem;"></i>';
        if (['doc', 'docx'].includes(ext)) return '<i class="fas fa-file-word" style="color: #2563eb; margin-right: 0.5rem;"></i>';
        return '<i class="fas fa-file" style="color: #64748b; margin-right: 0.5rem;"></i>';
    };

    const getStatusClass = (status) => ({ 'Bekliyor': 'status-waiting', 'Onaylandı': 'status-approved', 'Reddedildi': 'status-rejected' }[status] || 'status-waiting');
    const getStatusIcon = (status) => ({ 'Bekliyor': '<i class="fas fa-hourglass-half"></i>', 'Onaylandı': '<i class="fas fa-check-circle"></i>', 'Reddedildi': '<i class="fas fa-times-circle"></i>' }[status] || '');

    const getEmptyStateHTML = (category) => {
        const icons = { idari: 'fa-folder-open', rehberlik: 'fa-school', kulup: 'fa-users' };
        const texts = { idari: 'idari', rehberlik: 'rehberlik', kulup: 'kulüp' };
        return `<tr><td colspan="6" class="empty-state"><i class="fas ${icons[category]}"></i><div>Henüz ${texts[category]} belgesi yüklenmemiş</div></td></tr>`;
    };

    const showNotification = (message, type = 'success') => {
        const container = document.getElementById('notificationContainer') || document.body;
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
        container.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    };

    // 9. SEKME YÖNETİMİ VE YENİ MODÜLLER (U1, U2, U4)
    const toggleTabVisibility = (tabButton, isVisible) => {
        if (tabButton) {
            tabButton.style.display = isVisible ? 'flex' : 'none';
            if (!isVisible && tabButton.classList.contains('active')) switchTab('idari');
        }
    };

    const switchTab = (tabId) => {
        document.querySelectorAll('.tab-btn, .tab-content').forEach(el => el.classList.remove('active'));
        const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
        const content = document.getElementById(`${tabId}Content`);

        if (btn) btn.classList.add('active');
        if (content) content.classList.add('active');

        if (tabId === 'karardestek') {
            loadStats();
        }
    };

    // Add click listeners to all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabId = e.currentTarget.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Yoklama (U2)
    const attendanceForm = document.getElementById('attendanceForm');
    const attendanceDate = document.getElementById('attendanceDate');
    const attendanceTableBody = document.getElementById('attendanceTableBody');

    const mockStudents = [
        { id: '101', name: 'Ahmet Yılmaz' },
        { id: '102', name: 'Ayşe Demir' },
        { id: '103', name: 'Mehmet Kaya' },
        { id: '104', name: 'Fatma Çelik' },
        { id: '105', name: 'Ali Can' }
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
                        </tr>
                    `;
                }).join('');
            }
        } catch (error) {
            console.error('Yoklama yüklenemedi:', error);
        }
    };

    if (attendanceDate) {
        attendanceDate.valueAsDate = new Date();
        attendanceDate.addEventListener('change', (e) => loadAttendance(e.target.value));
        loadAttendance(attendanceDate.value);
    }

    if (attendanceForm) {
        attendanceForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const date = attendanceDate.value;
            const selects = attendanceTableBody.querySelectorAll('.status-select');
            const btn = attendanceForm.querySelector('button');
            btn.textContent = 'Kaydediliyor...';
            btn.disabled = true;

            try {
                for (let select of selects) {
                    await fetch(`${API_URL}/attendance`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            date, student_id: select.dataset.id, student_name: select.dataset.name, status: select.value
                        })
                    });
                }
                showNotification('Yoklama başarıyla kaydedildi.', 'success');
            } catch (error) {
                showNotification('Yoklama kaydedilirken hata oluştu.', 'error');
            } finally {
                btn.textContent = 'Yoklamayı Kaydet';
                btn.disabled = false;
            }
        });
    }

    // Karar Destek Paneli (U4)
    let docChart = null;
    const loadStats = async () => {
        try {
            const res = await fetch(`${API_URL}/stats`);
            if (res.ok) {
                const data = await res.json();
                document.getElementById('statsTotal').innerHTML = `Toplam Belge: <strong>${data.totalDocuments}</strong>`;
                document.getElementById('statsPending').innerHTML = `Onay Bekleyen: <strong>${data.pendingDocuments}</strong>`;
                document.getElementById('statsApproved').innerHTML = `Onaylanan: <strong>${data.approvedDocuments}</strong>`;

                const ctx = document.getElementById('documentChart');
                if (ctx) {
                    if (docChart) docChart.destroy();
                    docChart = new Chart(ctx, {
                        type: 'doughnut',
                        data: {
                            labels: ['Onaylanan', 'Bekleyen'],
                            datasets: [{
                                data: [data.approvedDocuments, data.pendingDocuments],
                                backgroundColor: ['#10b981', '#f59e0b']
                            }]
                        },
                        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
                    });
                }
            }
        } catch (error) {
            console.error('İstatistikler yüklenemedi', error);
        }
    };

    // Veli İletişim (U1)
    const parentAnnouncementForm = document.getElementById('parentAnnouncementForm');
    if (parentAnnouncementForm) {
        parentAnnouncementForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = parentAnnouncementForm.querySelector('button');
            btn.innerHTML = '<span class="loading"></span> Gönderiliyor...';
            btn.disabled = true;

            const payload = {
                type: document.getElementById('announcementType').value,
                title: document.getElementById('announcementTitle').value,
                content: document.getElementById('announcementContent').value,
                date: new Date().toLocaleDateString('tr-TR')
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
            } catch (error) {
                showNotification('Sunucu hatası.', 'error');
            } finally {
                btn.innerHTML = '<i class="fas fa-paper-plane"></i> Velilere Gönder';
                btn.disabled = false;
            }
        });
    }

    // (Removed duplicate tab management from bottom)

    const updateDashboardUI = () => {
        const name = localStorage.getItem('teacherName') || 'Öğretmen';
        const school = localStorage.getItem('instSchool') || 'Okul Belirtilmedi';
        const year = localStorage.getItem('instYear') || 'Yıl Belirtilmedi';

        if (headerTeacherName) headerTeacherName.textContent = name;
        if (welcomeTitle) welcomeTitle.textContent = `Hoş Geldiniz, Sayın ${name}`;
        if (bannerSchool) bannerSchool.innerHTML = `<i class="fas fa-school"></i> ${school}`;
        if (bannerYear) bannerYear.innerHTML = `<i class="fas fa-calendar-alt"></i> ${year}`;
    };

    const loadInstitutionSettings = () => {
        if (teacherNameInput) teacherNameInput.value = localStorage.getItem('teacherName') || '';
        if (instProvince) instProvince.value = localStorage.getItem('instProvince') || '';
        if (instDistrict) instDistrict.value = localStorage.getItem('instDistrict') || '';
        if (instSchool) instSchool.value = localStorage.getItem('instSchool') || '';
        if (instYear) instYear.value = localStorage.getItem('instYear') || '';
        updateDashboardUI();
    };

    if (saveInstBtn) {
        saveInstBtn.addEventListener('click', () => {
            localStorage.setItem('teacherName', teacherNameInput.value.trim());
            localStorage.setItem('instProvince', instProvince.value.trim());
            localStorage.setItem('instDistrict', instDistrict.value.trim());
            localStorage.setItem('instSchool', instSchool.value.trim());
            localStorage.setItem('instYear', instYear.value.trim());
            updateDashboardUI();
            showNotification('Kurum ve profil bilgileri başarıyla kaydedildi.', 'success');
        });
    }

    // --- BAŞLANGIÇ ---
    const init = () => {
        homeroomCheckbox.addEventListener('change', () => toggleTabVisibility(rehberlikTabBtn, homeroomCheckbox.checked));
        clubCheckbox.addEventListener('change', () => toggleTabVisibility(kulupTabBtn, clubCheckbox.checked));
        tabNav.addEventListener('click', e => e.target.matches('.tab-btn') && switchTab(e.target.dataset.tab));

        applyTheme(localStorage.getItem('theme') || 'light');
        loadInstitutionSettings();
        fetchDocuments(); // Sayfa yüklendiğinde verileri backendden çek
    };

    init();
