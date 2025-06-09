document.addEventListener('DOMContentLoaded', () => {
    // ===================================================
    // TEMEL PANEL İŞLEVLERİ
    // ===================================================
    const themeToggle = document.getElementById('themeToggle');
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    
    // Tema Değiştirme
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    };
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        applyTheme(currentTheme === 'light' ? 'dark' : 'light');
    });
    applyTheme(localStorage.getItem('theme') || 'light');

    // Mobil menü açma/kapama
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Sidebar menü geçişleri
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const sections = document.querySelectorAll('.dashboard-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.dataset.section;

            if (link.classList.contains('has-submenu')) {
                const submenu = link.nextElementSibling;
                submenu.classList.toggle('open');
                return;
            }

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            if (sectionId) {
                sections.forEach(sec => sec.classList.remove('active'));
                const activeSection = document.getElementById(sectionId);
                if (activeSection) {
                    activeSection.classList.add('active');
                }
            }

            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('open');
            }
        });
    });

    // =================================================================
    // ----- TOPLU VERİ AKTARMA MODAL İŞLEVLERİ (GENELLEŞTİRİLDİ) -----
    // =================================================================

    const importModal = document.getElementById('importModal');
    const closeImportModalBtn = document.getElementById('closeImportModalBtn');
    const closeImportModalAfterSuccessBtn = document.getElementById('closeImportModalAfterSuccessBtn');
    const importDropzone = document.getElementById('importDropzone');
    const importFileInput = document.getElementById('importFileInput');
    const processImportBtn = document.getElementById('processImportBtn');
    const importStep1 = document.getElementById('import-step-1');
    const importStep2 = document.getElementById('import-step-2');
    const importResultDiv = document.querySelector('.import-result');
    const modalTitle = document.querySelector('#importModal .modal-title');
    const modalDescription = document.querySelector('#importModal .modal-description');
    const templateLink = document.querySelector('#importModal .template-download a');

    const importConfigs = {
        teachers: {
            title: 'Toplu Öğretmen Aktarma',
            description: 'E-Okul\'dan indirdiğiniz öğretmen listesini (.xlsx veya .csv) aşağıdaki alana sürükleyin.',
            templateText: 'Öğretmen aktarım şablonunu indirin.'
        },
        classes: {
            title: 'Toplu Sınıf ve Şube Aktarma',
            description: 'Sınıf ve şube listelerini içeren dosyayı (.xlsx veya .csv) aşağıdaki alana sürükleyin.',
            templateText: 'Sınıf/şube aktarım şablonunu indirin.'
        },
        schedule: {
            title: 'Haftalık Ders Programı Aktarma',
            description: 'Tüm okulun veya belirli sınıfların ders programını içeren dosyayı (.xlsx veya .csv) yükleyin.',
            templateText: 'Ders programı şablonunu indirin.'
        },
        exams: {
            title: 'Sınav Takvimi Aktarma',
            description: 'Okul geneli ortak sınav takvimini içeren dosyayı (.xlsx veya .csv) yükleyin.',
            templateText: 'Sınav takvimi şablonunu indirin.'
        },
        parents: {
            title: 'Toplu Veli Aktarma',
            description: 'E-Okul\'dan indirdiğiniz veli listesini (.xlsx veya .csv) aşağıdaki alana sürükleyin.',
            templateText: 'Veli aktarım şablonunu indirin.'
        }
    };

    const openModal = (importType) => {
        const config = importConfigs[importType];
        if (config) {
            modalTitle.textContent = config.title;
            modalDescription.textContent = config.description;
            const templateSpan = templateLink.querySelector('span') || templateLink;
            if (templateLink.querySelector('i')) {
                templateLink.innerHTML = `<i class="fas fa-file-excel"></i> <span>${config.templateText}</span>`;
            } else {
                templateLink.textContent = config.templateText;
            }
        }
        importModal.style.display = 'flex';
        setTimeout(() => importModal.classList.add('visible'), 10);
    };

    const closeModal = () => {
        importModal.classList.remove('visible');
        setTimeout(() => {
            importModal.style.display = 'none';
            importStep1.style.display = 'block';
            importStep2.style.display = 'none';
            importDropzone.classList.remove('has-file');
            const dropzoneContent = importDropzone.querySelector('.dropzone-content');
            dropzoneContent.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <span id="importFileText">Dosyayı buraya sürükleyin</span>
                <small>veya seçmek için tıklayın</small>
            `;
            processImportBtn.disabled = true;
        }, 300);
    };

    document.body.addEventListener('click', (e) => {
        const targetButton = e.target.closest('.open-import-modal-btn');
        if (targetButton) {
            e.preventDefault(); // Link davranışını engellemek için
            const importType = targetButton.dataset.importType;
            openModal(importType);
        }
    });

    closeImportModalBtn.addEventListener('click', closeModal);
    closeImportModalAfterSuccessBtn.addEventListener('click', closeModal);
    importModal.addEventListener('click', (e) => {
        if (e.target === importModal) closeModal();
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        importDropzone.addEventListener(eventName, e => e.preventDefault(), false);
    });
    importDropzone.addEventListener('dragover', () => importDropzone.classList.add('is-dragging'));
    importDropzone.addEventListener('dragleave', () => importDropzone.classList.remove('is-dragging'));
    importDropzone.addEventListener('drop', e => {
        importDropzone.classList.remove('is-dragging');
        handleFiles(e.dataTransfer.files);
    });
    importFileInput.addEventListener('change', e => handleFiles(e.target.files));

    function handleFiles(files) {
        if (files.length === 0) return;
        const file = files[0];
        const dropzoneContent = importDropzone.querySelector('.dropzone-content');
        dropzoneContent.innerHTML = `<i class="fas fa-check-circle" style="color:var(--success-color);"></i><span>${file.name}</span><small>Dosya seçildi</small>`;
        importDropzone.classList.add('has-file');
        processImportBtn.disabled = false;
    }

    processImportBtn.addEventListener('click', () => {
        importResultDiv.innerHTML = `
            <div class="loading" style="margin: 0 auto; border-top-color: var(--primary-color);"></div>
            <h3>Dosya İşleniyor...</h3>
            <p>Veriler sisteme aktarılıyor, lütfen bekleyin.</p>
        `;
        importStep1.style.display = 'none';
        importStep2.style.display = 'block';
        setTimeout(() => {
            const itemCount = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
            importResultDiv.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <h3>Aktarım Başarılı!</h3>
                <p><strong>${itemCount}</strong> kayıt başarıyla sisteme aktarıldı.</p>
            `;
            // Global bir bildirim fonksiyonunuz varsa burada çağırabilirsiniz.
            // showNotification(`${itemCount} kayıt başarıyla aktarıldı`, 'success');
        }, 2500);
    });

}); // <-- BÜTÜN KODLAR BU FONKSİYONUN İÇİNDE KALMALI