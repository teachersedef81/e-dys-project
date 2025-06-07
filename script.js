document.addEventListener('DOMContentLoaded', () => {
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
    const submitBtn = document.getElementById('submitBtn');

    // --- VERİ YÖNETİMİ ---
    const documentTypes = {
        idari: ["Yıllık İş Günü Çalışma Takvimi", "Ünitelendirilmiş Yıllık Plan", "Günlük Plan", "Haftalık Ders Programı", "Şube Öğretmenler Kurulu Tutanağı", "Zümre Öğretmenler Kurulu Tutanağı", "Diğer İdari Evraklar"],
        rehberlik: ["Sınıf Rehberlik Yıllık Planı", "Öğrenci Gözlem Formu", "Veli Görüşme Formu", "Risk Haritası Anket Sonuçları", "Diğer Rehberlik Evrakları"],
        kulup: ["Kulüp Yıllık Çalışma Planı", "Kulüp Karar Defteri Örneği", "Sosyal Etkinlik Formu", "Kulüp Üye Listesi", "Diğer Kulüp Evrakları"]
    };

    // LocalStorage'dan belgeleri al veya boş bir dizi oluştur
    let documents = JSON.parse(localStorage.getItem('documents')) || [];

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

    // 2. BELGELERİ EKRANA ÇİZME (RENDER)
    const renderDocuments = () => {
        // Tüm tabloların içini temizle
        document.querySelectorAll('.table tbody').forEach(tbody => tbody.innerHTML = '');

        if (documents.length === 0) {
            // Eğer hiç belge yoksa tüm tablolara boş durum mesajı ekle
            document.querySelector('#idariContent tbody').innerHTML = getEmptyStateHTML('idari');
            document.querySelector('#rehberlikContent tbody').innerHTML = getEmptyStateHTML('rehberlik');
            document.querySelector('#kulupContent tbody').innerHTML = getEmptyStateHTML('kulup');
            return;
        }

        documents.forEach(doc => {
            const targetTableBody = document.querySelector(`#${doc.category}Content tbody`);
            if (targetTableBody) {
                 // Eğer tablo boş ise, boş mesajını kaldır
                if (targetTableBody.querySelector('.empty-state')) {
                    targetTableBody.innerHTML = '';
                }
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

         // Belge eklendikten sonra hala boş olan tablolara boş mesajı ekle
        document.querySelectorAll('.table tbody').forEach(tbody => {
            if (tbody.children.length === 0) {
                const category = tbody.closest('.tab-content').id.replace('Content', '');
                tbody.innerHTML = getEmptyStateHTML(category);
            }
        });
    };

    // 3. BELGE İŞLEMLERİ (Onay, Red, Ekleme)
    document.querySelector('.main-container').addEventListener('click', e => {
        const target = e.target.closest('button');
        if (!target) return;

        const docId = target.dataset.id;
        if (target.classList.contains('approve-btn')) updateDocumentStatus(docId, 'Onaylandı');
        if (target.classList.contains('reject-btn')) updateDocumentStatus(docId, 'Reddedildi');
    });
    
    const updateDocumentStatus = (id, newStatus) => {
        documents = documents.map(doc => doc.id === id ? { ...doc, status: newStatus } : doc);
        localStorage.setItem('documents', JSON.stringify(documents));
        renderDocuments();
        showNotification(`Belge başarıyla "${newStatus}" olarak işaretlendi.`, 'success');
    };

    // 4. FORM YÖNETİMİ
    uploadForm.addEventListener('submit', e => {
        e.preventDefault();
        const newDocument = {
            id: 'doc_' + Date.now(),
            category: mainCategorySelect.value,
            type: `${mainCategorySelect.options[mainCategorySelect.selectedIndex].text} / ${documentTypeSelect.value}`,
            name: fileUploadInput.files[0].name,
            recipients: Array.from(document.querySelectorAll('input[name="recipient"]:checked')).map(cb => cb.value).join(', '),
            date: new Date().toLocaleDateString('tr-TR'),
            status: 'Bekliyor'
        };

        if (!newDocument.recipients) {
            showNotification('Lütfen en az bir gönderilecek grup seçin.', 'warning');
            return;
        }

        submitBtn.innerHTML = '<span class="loading"></span> Yükleniyor...';
        submitBtn.disabled = true;

        setTimeout(() => { // Sunucuya yükleme simülasyonu
            documents.push(newDocument);
            localStorage.setItem('documents', JSON.stringify(documents));
            renderDocuments();
            switchTab(newDocument.category); // İlgili sekmeye geçiş yap
            uploadForm.reset();
            documentTypeSelect.innerHTML = '<option value="">Önce kategori seçin...</option>';
            documentTypeSelect.disabled = true;
            fileUploadText.textContent = 'Dosya seçin veya buraya sürükleyin';
            fileUpload.classList.remove('has-file');
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Yükle ve Onaya Gönder';
            submitBtn.disabled = false;
            showNotification('Belge başarıyla yüklendi ve onaya gönderildi!', 'success');
        }, 1000);
    });

    // 5. DOSYA YÜKLEME VE SÜRÜKLE-BIRAK
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

    // 6. YARDIMCI FONKSİYONLAR (İkon, Durum, Bildirim vb.)
    const getIconForFile = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();
        if (ext === 'pdf') return '<i class="fas fa-file-pdf" style="color: #ef4444; margin-right: 0.5rem;"></i>';
        if (['doc', 'docx'].includes(ext)) return '<i class="fas fa-file-word" style="color: #2563eb; margin-right: 0.5rem;"></i>';
        return '<i class="fas fa-file" style="color: #64748b; margin-right: 0.5rem;"></i>';
    };

    const getStatusClass = (status) => ({ 'Bekliyor': 'status-waiting', 'Onaylandı': 'status-approved', 'Reddedildi': 'status-rejected' }[status]);
    const getStatusIcon = (status) => ({ 'Bekliyor': '<i class="fas fa-hourglass-half"></i>', 'Onaylandı': '<i class="fas fa-check-circle"></i>', 'Reddedildi': '<i class="fas fa-times-circle"></i>' }[status]);
    
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

    // 7. SEKME YÖNETİMİ
    const toggleTabVisibility = (tabButton, isVisible) => {
        tabButton.style.display = isVisible ? 'flex' : 'none';
        if (!isVisible && tabButton.classList.contains('active')) switchTab('idari');
    };

    const switchTab = (tabId) => {
        document.querySelectorAll('.tab-btn, .tab-content').forEach(el => el.classList.remove('active'));
        document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(`${tabId}Content`).classList.add('active');
    };

    // --- BAŞLANGIÇ (INITIALIZATION) ---
    const init = () => {
        // Olay Dinleyicilerini Kur
        homeroomCheckbox.addEventListener('change', () => toggleTabVisibility(rehberlikTabBtn, homeroomCheckbox.checked));
        clubCheckbox.addEventListener('change', () => toggleTabVisibility(kulupTabBtn, clubCheckbox.checked));
        tabNav.addEventListener('click', e => e.target.matches('.tab-btn') && switchTab(e.target.dataset.tab));
        mainCategorySelect.addEventListener('change', () => {
             const selectedCategory = mainCategorySelect.value;
             documentTypeSelect.innerHTML = '<option value="">Önce kategori seçin...</option>';
             documentTypeSelect.disabled = true;
             if (selectedCategory && documentTypes[selectedCategory]) {
                 documentTypeSelect.innerHTML = '<option value="" disabled selected>Belge türü seçin...</option>';
                 documentTypes[selectedCategory].forEach(type => documentTypeSelect.add(new Option(type, type)));
                 documentTypeSelect.disabled = false;
             }
        });
        
        // Kayıtlı temayı uygula
        applyTheme(localStorage.getItem('theme') || 'light');
        
        // Kayıtlı belgeleri ekrana çiz
        renderDocuments();
    };

    init(); // Uygulamayı başlat
});