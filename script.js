document.addEventListener('DOMContentLoaded', () => {

    // Belge türlerini sağlanan dosyaya göre yapılandıralım
    const documentTypes = {
        idari: [
            "Yıllık İş Günü Çalışma Takvimi",
            "Ünitelendirilmiş Yıllık Plan",
            "Günlük Plan",
            "Haftalık Ders Programı",
            "Şube Öğretmenler Kurulu Tutanağı",
            "Zümre Öğretmenler Kurulu Tutanağı",
            "İl/İlçe Zümre Toplantı Tutanağı",
            "Proje Ödevi Çizelgesi/Ölçeği",
            "Ders İçi Performans Değerlendirme Ölçeği",
            "Gezi-Gözlem Planı",
            "Ortak Sınav Soruları ve Cevap Anahtarı",
            "Sınıfların Güncel Listesi",
            "Ortak Sınav Analiz Sonuçları",
            "Egzersiz Dosyası",
            "Diğer İdari Evraklar"
        ],
        rehberlik: [
            "Şubenin Haftalık Ders Programı",
            "Sınıf Listesi",
            "Oturma Planı",
            "Uygulanan Test-Anket Formları",
            "Veli İletişim Bilgileri",
            "Veli Toplantı Tutanağı",
            "Öğrenci Tanıma ve Gözlem Formları",
            "Diğer Rehberlik Evrakları"
        ],
        kulup: [
            "Sosyal Kulüp Öğrenci Listesi",
            "Sosyal Kulüp Yıllık Çalışma Planı",
            "Kulüp Toplantı Tutanağı",
            "Kulüp Görev Dağılım Çizelgesi",
            "Belirli Gün ve Haftalar Çizelgesi",
            "Diğer Kulüp Evrakları"
        ]
    };

    const mainCategorySelect = document.getElementById('mainCategory');
    const documentTypeSelect = document.getElementById('documentType');
    const uploadForm = document.getElementById('uploadForm');
    const documentTableBody = document.querySelector('#documentTable tbody');

    // Ana kategori değiştiğinde, belge türü menüsünü güncelle
    mainCategorySelect.addEventListener('change', (event) => {
        const selectedCategory = event.target.value;
        
        // Önceki seçenekleri temizle
        documentTypeSelect.innerHTML = '<option value="">Lütfen belge türü seçin...</option>';
        documentTypeSelect.disabled = true;

        if (selectedCategory && documentTypes[selectedCategory]) {
            // Yeni seçenekleri ekle
            documentTypes[selectedCategory].forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                documentTypeSelect.appendChild(option);
            });
            documentTypeSelect.disabled = false;
        }
    });

    // Onaylama işlemini event delegation ile yönet
    if (documentTableBody) {
        documentTableBody.addEventListener('click', (event) => {
            if (event.target.classList.contains('approve-btn')) {
                handleApproval(event.target);
            }
        });
    }

    // Form gönderme işlemini yönet
    if (uploadForm) {
        uploadForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const mainCategoryText = mainCategorySelect.options[mainCategorySelect.selectedIndex].text;
            const documentType = documentTypeSelect.value;
            const documentFile = document.getElementById('documentFile').files[0];
            const recipientCheckboxes = document.querySelectorAll('input[name="recipient"]:checked');

            if (!documentType) {
                alert('Lütfen bir belge türü seçin.');
                return;
            }
            if (recipientCheckboxes.length === 0) {
                alert('Lütfen en az bir gönderilecek grup seçin.');
                return;
            }
            if (!documentFile) {
                alert('Lütfen bir dosya seçin.');
                return;
            }

            const recipients = Array.from(recipientCheckboxes).map(cb => cb.value);
            const newRow = document.createElement('tr');

            // Yeni tablo satırını oluştur
            newRow.innerHTML = `
                <td>${documentFile.name}</td>
                <td>${mainCategoryText} / ${documentType}</td>
                <td>${recipients.join(', ')}</td>
                <td>Siz (Kullanıcı)</td>
                <td>${new Date().toLocaleDateString('tr-TR')}</td>
                <td class="status-waiting">Onay Bekliyor</td>
                <td><button class="action-btn approve-btn">İncele ve Onayla</button></td>
            `;

            documentTableBody.prepend(newRow);
            uploadForm.reset();
            documentTypeSelect.innerHTML = '<option value="">Önce kategori seçin...</option>';
            documentTypeSelect.disabled = true;
            alert('Belge başarıyla yüklendi ve onaya gönderildi!');
        });
    }

    // Onaylama işlemini yapan fonksiyon
    function handleApproval(button) {
        const row = button.closest('tr');
        const statusCell = row.querySelector('td:nth-child(6)');
        statusCell.textContent = 'Tamamlandı';
        statusCell.classList.remove('status-waiting');
        statusCell.classList.add('status-approved');
        button.textContent = 'Onaylandı';
        button.disabled = true;
        alert(`"${row.querySelector('td:first-child').textContent}" adlı belge onaylandı!`);
    }
});