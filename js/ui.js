/**
 * ui.js
 * Arayüz fonksiyonları, bildirimler, karanlık tema, sekmeler
 */

export function showNotification(message, type = 'success') {
    let container = document.getElementById('notificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificationContainer';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
    }

    const notification = document.createElement('div');
    // Using existing CSS classes from style.css for notification
    notification.className = `notification ${type}`;
    notification.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    
    container.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

export function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
}

export function initThemeToggle() {
    // Determine default mode
    const loadedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(loadedTheme);

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            applyTheme(currentTheme === 'light' ? 'dark' : 'light');
        });
    }
}

// Sekme yönetim mantığı pürüzsüz çalışması için
export function switchTab(tabId) {
    if (!tabId) return;
    console.log("Switching to tab:", tabId);
    
    // Tüm aktif sınıfları temizle
    document.querySelectorAll('.tab-btn, .admin-tab-btn').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-content, .admin-tab-content').forEach(el => el.classList.remove('active'));

    // Butonu bul: data-tab="tabId" olan her türlü buton
    const btn = document.querySelector(`[data-tab="${tabId}"]`);

    // İçerik panelini bul: önce tabIdContent dene, sonra tab-tabId dene (admin farkı)
    const content = document.getElementById(`${tabId}Content`)
                 || document.getElementById(`tab-${tabId}`)
                 || document.getElementById(tabId);

    if (btn) {
        btn.classList.add('active');
        console.log("Active class added to button");
    } else {
        console.warn("Tab button not found:", tabId);
    }
    
    if (content) {
        content.classList.add('active');
        console.log("Active class added to content");
    } else {
        console.warn("Tab content not found:", tabId);
    }
}
