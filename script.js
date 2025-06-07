document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENT REFERANSLARI ---
    const homeroomCheckbox = document.getElementById('isHomeroomTeacher');
    const clubCheckbox = document.getElementById('isClubAdvisor');
    const rehberlikTabBtn = document.getElementById('rehberlikTabBtn');
    const kulupTabBtn = document.getElementById('kulupTabBtn');
    const tabNav = document.querySelector('.tab-nav');
    const tabContents = document.querySelectorAll('.tab-content');
    const uploadForm = document.getElementById('uploadForm');
    const mainCategorySelect = document.getElementById('mainCategory');
    const documentTypeSelect = document.getElementById('documentType');

    // --- BELGE TÜRÜ VERİLERİ ---
    const documentTypes = {
        idari: ["Yıllık İş Günü Çalışma Takvimi", "Ünitelendirilmiş Yıllık Plan", "Günlük Plan", "Haftalık Ders Programı", "Şube Öğretmenler Kurulu Tutanağı", "Zümre Öğretmenler Kurulu Tutanağı", "İl/İlçe Zümre Toplantı Tutanağı", "Proje Ödevi Çizelgesi/Ölçeği", "Ders İçi Performans Değerlendirme Ölçeği", "Gezi-Gözlem Planı", "Ortak Sınav Soruları ve Cevap Anahtarı", "Sınıfların Güncel Listesi", "Ortak Sınav Analiz Sonuçları", "Egzersiz Dosyası", "Diğer İdari Evraklar"],
        rehberlik: ["Şubenin Haftalık Ders Programı", "Sınıf Listesi", "Oturma Planı", "Uygulanan Test-Anket Formları", "Veli İletişim Bilgileri", "Veli Toplantı Tutanağı", "Öğrenci Tanıma ve Gözlem Formları", "Diğer Rehberlik Evrakları"],
        kulup: ["Sosyal Kulüp Öğrenci Listesi", "Sosyal Kulüp Yıllık Çalışma Planı", "Kulüp Toplantı Tutanağı", "Kulüp Görev Dağılım Çizelgesi", "Belirli Gün ve Haftalar Çizelgesi", "Diğer Kulüp Evrakları"]
    };

    // --- OLAY DİNLEYİCİLERİ ---

    // Rol seçim kutularını dinle
    homeroomCheckbox.addEventListener('change', () => toggleTabVisibility(rehberlikTabBtn, homeroomCheckbox.checked));
    clubCheckbox.addEventListener('change', () => toggleTabVisibility(kulupTabBtn, clubCheckbox.checked));

    // Sekme navigasyonunu dinle (Event Delegation)
    tabNav.addEventListener('click', (e) => {
        if (e.target.matches('.tab-btn')) {
            switchTab(e.target.dataset.tab);
        }
    });
    
    // Ana kategori seçimini dinle (Form için)
    mainCategorySelect.addEventListener('change', populateDocumentTypes);

    // Form gönderme işlemini dinle
    uploadForm.addEventListener('submit', handleFormSubmit);

    // Tüm tablolardaki onay butonlarını dinle (Event Delegation)
    document.querySelector('main.dashboard-container').addEventListener('click', (e) => {
        if (e.target.matches('.approve-btn')) {
            handleApproval(e.target);
        }
    });

    // --- FONKSİYONLAR ---

    // Sekme görünürlüğünü ayarla
    function toggleTabVisibility(tabButton, isVisible) {
        tabButton.style.display = isVisible ? 'inline-block' : 'none';
        // Eğer gizlenen sekme aktifse, varsayılan sekmeye dön
        if (!isVisible && tabButton.classList.contains('active')) {
            switchTab('idari');
        }
    }
    
    // Sekmeler arası geçiş yap
    function switchTab(tabId) {
        tabContents.forEach(content => content.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

        document.getElementById(`${tabId}Content`).classList.add('active');
        document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
    }

    // Belge türü menüsünü doldur
    function populateDocumentTypes() {
        const selectedCategory = mainCategorySelect.value;
        documentTypeSelect.innerHTML = '<option value="">Lütfen belge türü seçin...</option>';
        documentTypeSelect.disabled = true;

        if (selectedCategory && documentTypes[selectedCategory]) {
            documentTypes[selectedCategory].forEach(type => {
                const option = new Option(type, type);
                documentTypeSelect.add(option);
            });
            documentTypeSelect.disabled = false;
        }
    }
    
    // Form gönderme işlemini yönet
    function handleFormSubmit(event) {
        event.preventDefault();
        const mainCategoryText = mainCategorySelect.options[mainCategorySelect.selectedIndex].text;
        const documentType = documentTypeSelect.value;
        const documentFile = document.getElementById('documentFile').files[0];
        const recipientCheckboxes = document.querySelectorAll('input[name="recipient"]:checked');

        // Doğrulamalar
        if (!documentType) { alert('Lütfen bir belge türü seçin.'); return; }
        if (recipientCheckboxes.length === 0) { alert('Lütfen en az bir gönderilecek grup seçin.'); return; }
        if (!documentFile) { alert('Lütfen bir dosya seçin.'); return; }

        const recipients = Array.from(recipientCheckboxes).map(cb => cb.value).join(', ');
        
        // Aktif olan sekmenin tablosunu bul
        const activeTableBody = document.querySelector('.tab-content.active table tbody');
        if (!activeTableBody) {
             alert('Hata: Aktif tablo bulunamadı.');
             return;
        }

        const newRow = activeTableBody.insertRow(0); // Başa ekle
        newRow.innerHTML = `
            <td>${documentFile.name}</td>
            <td>${mainCategoryText} / ${documentType}</td>
            <td>${recipients}</td>
            <td>Siz (Kullanıcı)</td>
            <td>${new Date().toLocaleDateString('tr-TR')}</td>
            <td class="status-waiting">Onay Bekliyor</td>
            <td><button class="action-btn approve-btn">İncele ve Onayla</button></td>
        `;

        uploadForm.reset();
        populateDocumentTypes(); // Menüyü sıfırla
        alert('Belge başarıyla aktif dosyaya eklendi ve onaya gönderildi!');
    }

    // Onaylama işlemini yönet
    function handleApproval(button) {
        const row = button.closest('tr');
        const statusCell = row.cells[5]; // Durum hücresi (6. sütun)
        statusCell.textContent = 'Tamamlandı';
        statusCell.className = 'status-approved';
        button.textContent = 'Onaylandı';
        button.disabled = true;
        alert(`"${row.cells[0].textContent}" adlı belge onaylandı!`);
    }

});