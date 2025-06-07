// Sayfanın tamamen yüklendiğinden emin olmak için olay dinleyici ekliyoruz.
document.addEventListener('DOMContentLoaded', () => {

    const uploadForm = document.getElementById('uploadForm');
    const documentTableBody = document.querySelector('#documentTable tbody');

    // OLAY YÖNETİMİ (EVENT DELEGATION)
    // Onaylama işlemini doğrudan butonlara değil, tüm tabloya atıyoruz.
    // Bu sayede, sonradan eklenen satırlardaki butonlar da çalışır.
    if (documentTableBody) {
        documentTableBody.addEventListener('click', (event) => {
            // Tıklanan elemanın "approve-btn" sınıfına sahip bir buton olup olmadığını kontrol et
            if (event.target.classList.contains('approve-btn')) {
                handleApproval(event.target);
            }
        });
    }

    // YENİ BELGE YÜKLEME FORMUNU YÖNETME
    if (uploadForm) {
        uploadForm.addEventListener('submit', (event) => {
            // Formun varsayılan gönderme işlemini engelle
            event.preventDefault();

            // Formdaki verileri al
            const documentType = document.getElementById('documentType').value;
            const documentFile = document.getElementById('documentFile').files[0];
            const recipientCheckboxes = document.querySelectorAll('input[name="recipient"]:checked');
            
            // En az bir alıcı seçildi mi kontrol et
            if (recipientCheckboxes.length === 0) {
                alert('Lütfen en az bir gönderilecek grup seçin.');
                return;
            }
            
            if (!documentFile) {
                alert('Lütfen bir dosya seçin.');
                return;
            }

            // Seçilen alıcıları bir diziye topla
            const recipients = Array.from(recipientCheckboxes).map(cb => cb.value);

            // Yeni tablo satırını oluştur
            const newRow = document.createElement('tr');
            
            // Satırın içeriğini HTML olarak ata
            newRow.innerHTML = `
                <td>${documentFile.name}</td>
                <td>${documentType}</td>
                <td>${recipients.join(', ')}</td>
                <td>Siz (Kullanıcı)</td>
                <td>${new Date().toLocaleDateString('tr-TR')}</td>
                <td class="status-waiting">Onay Bekliyor</td>
                <td><button class="action-btn approve-btn">İncele ve Onayla</button></td>
            `;

            // Yeni satırı tablonun başına ekle
            documentTableBody.prepend(newRow);

            // Formu temizle
            uploadForm.reset();

            // Başarı mesajı göster
            alert('Belge başarıyla yüklendi ve onaya gönderildi!');
        });
    }

    // Onaylama işlemini yapan fonksiyon
    function handleApproval(button) {
        const row = button.closest('tr');
        const statusCell = row.querySelector('td:nth-child(6)'); // Durum 6. sütun oldu

        statusCell.textContent = 'Tamamlandı';
        statusCell.classList.remove('status-waiting');
        statusCell.classList.add('status-approved');

        button.textContent = 'Onaylandı';
        button.disabled = true;

        alert(`"${row.querySelector('td:first-child').textContent}" adlı belge onaylandı!`);
    }
});