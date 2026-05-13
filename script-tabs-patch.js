/**
 * EduSync Tab System Patch
 * Fixes tab switching functionality in dashboard
 * This should be loaded AFTER tabs-fix.js
 */

document.addEventListener('DOMContentLoaded', () => {
    // Fix tab navigation in dashboard
    const tabNavButtons = document.querySelectorAll('.tab-nav .tab-btn');
    
    if (tabNavButtons.length > 0) {
        tabNavButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                const tabName = button.getAttribute('data-tab');
                
                // Remove active class from all buttons
                tabNavButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Hide all tab contents
                const allContents = document.querySelectorAll('.tab-content');
                allContents.forEach(content => {
                    content.classList.remove('active');
                    content.style.display = 'none';
                });
                
                // Show selected tab content
                const targetContent = document.getElementById(tabName + 'Content');
                if (targetContent) {
                    targetContent.classList.add('active');
                    targetContent.style.display = 'block';
                }
            });
        });
    }

    // Fix profile settings checkboxes
    const homeroomCheckbox = document.getElementById('isHomeroomTeacher');
    const clubCheckbox = document.getElementById('isClubAdvisor');
    const rehberlikTabBtn = document.getElementById('rehberlikTabBtn');
    const kulupTabBtn = document.getElementById('kulupTabBtn');

    if (homeroomCheckbox && rehberlikTabBtn) {
        homeroomCheckbox.addEventListener('change', () => {
            if (homeroomCheckbox.checked) {
                rehberlikTabBtn.style.display = 'inline-block';
            } else {
                rehberlikTabBtn.style.display = 'none';
            }
        });
    }

    if (clubCheckbox && kulupTabBtn) {
        clubCheckbox.addEventListener('change', () => {
            if (clubCheckbox.checked) {
                kulupTabBtn.style.display = 'inline-block';
            } else {
                kulupTabBtn.style.display = 'none';
            }
        });
    }

    // Fix form submission and file upload
    const uploadForm = document.getElementById('uploadForm');
    const fileUpload = document.getElementById('fileUpload');
    const fileUploadInput = document.getElementById('documentFile');
    const fileUploadText = document.getElementById('fileUploadText');

    if (fileUpload && fileUploadInput) {
        // Drag and drop support
        fileUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUpload.classList.add('has-file');
        });

        fileUpload.addEventListener('dragleave', () => {
            fileUpload.classList.remove('has-file');
        });

        fileUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadInput.files = e.dataTransfer.files;
            updateFileUploadUI();
        });

        fileUploadInput.addEventListener('change', updateFileUploadUI);
    }

    function updateFileUploadUI() {
        if (fileUploadInput.files.length > 0) {
            fileUpload.classList.add('has-file');
            fileUploadText.textContent = fileUploadInput.files[0].name;
        } else {
            fileUpload.classList.remove('has-file');
            fileUploadText.textContent = 'Dosya seçin veya buraya sürükleyin';
        }
    }

    // Fix category-dependent select
    const mainCategorySelect = document.getElementById('mainCategory');
    const documentTypeSelect = document.getElementById('documentType');

    if (mainCategorySelect && documentTypeSelect) {
        const documentTypes = {
            idari: ["Yıllık İş Günü Çalışma Takvimi", "Ünitelendirilmiş Yıllık Plan", "Günlük Plan", "Haftalık Ders Programı", "Şube Öğretmenler Kurulu Tutanağı", "Zümre Öğretmenler Kurulu Tutanağı", "Diğer İdari Evraklar"],
            rehberlik: ["Sınıf Rehberlik Yıllık Planı", "Öğrenci Gözlem Formu", "Veli Görüşme Formu", "Risk Haritası Anket Sonuçları", "Diğer Rehberlik Evrakları"],
            kulup: ["Kulüp Yıllık Çalışma Planı", "Kulüp Karar Defteri Örneği", "Sosyal Etkinlik Formu", "Kulüp Üye Listesi", "Diğer Kulüp Evrakları"]
        };

        mainCategorySelect.addEventListener('change', () => {
            const selectedCategory = mainCategorySelect.value;
            documentTypeSelect.innerHTML = '<option value="">Önce kategori seçin...</option>';
            documentTypeSelect.disabled = true;

            if (selectedCategory && documentTypes[selectedCategory]) {
                documentTypeSelect.innerHTML = '<option value="" disabled selected>Belge türü seçin...</option>';
                documentTypes[selectedCategory].forEach(type => {
                    const option = document.createElement('option');
                    option.value = type;
                    option.textContent = type;
                    documentTypeSelect.appendChild(option);
                });
                documentTypeSelect.disabled = false;
            }
        });
    }

    // Fix AI form category
    const aiMainCategorySelect = document.getElementById('aiMainCategory');
    const aiDocumentTypeSelect = document.getElementById('aiDocumentType');

    if (aiMainCategorySelect && aiDocumentTypeSelect) {
        const documentTypes = {
            idari: ["Yıllık İş Günü Çalışma Takvimi", "Ünitelendirilmiş Yıllık Plan", "Günlük Plan", "Haftalık Ders Programı", "Şube Öğretmenler Kurulu Tutanağı", "Zümre Öğretmenler Kurulu Tutanağı", "Diğer İdari Evraklar"],
            rehberlik: ["Sınıf Rehberlik Yıllık Planı", "Öğrenci Gözlem Formu", "Veli Görüşme Formu", "Risk Haritası Anket Sonuçları", "Diğer Rehberlik Evrakları"],
            kulup: ["Kulüp Yıllık Çalışma Planı", "Kulüp Karar Defteri Örneği", "Sosyal Etkinlik Formu", "Kulüp Üye Listesi", "Diğer Kulüp Evrakları"]
        };

        aiMainCategorySelect.addEventListener('change', () => {
            const selectedCategory = aiMainCategorySelect.value;
            aiDocumentTypeSelect.innerHTML = '<option value="">Önce kategori seçin...</option>';
            aiDocumentTypeSelect.disabled = true;

            if (selectedCategory && documentTypes[selectedCategory]) {
                aiDocumentTypeSelect.innerHTML = '<option value="" disabled selected>Belge türü seçin...</option>';
                documentTypes[selectedCategory].forEach(type => {
                    const option = document.createElement('option');
                    option.value = type;
                    option.textContent = type;
                    aiDocumentTypeSelect.appendChild(option);
                });
                aiDocumentTypeSelect.disabled = false;
            }
        });
    }
});