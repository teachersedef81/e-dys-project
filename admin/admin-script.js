document.addEventListener('DOMContentLoaded', () => {

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

            // Alt menüleri yönet
            if (link.classList.contains('has-submenu')) {
                const submenu = link.nextElementSibling;
                submenu.classList.toggle('open');
                return; // Alt menü başlığına tıklandığında sayfa değiştirme
            }

            // Aktif linki ayarla
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // İlgili bölümü göster
            if (sectionId) {
                sections.forEach(sec => sec.classList.remove('active'));
                const activeSection = document.getElementById(sectionId);
                if (activeSection) {
                    activeSection.classList.add('active');
                }
            }

            // Mobilde menüyü kapat
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('open');
            }
        });
    });
});