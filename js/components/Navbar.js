/**
 * Navbar.js
 */

export function renderNavbar(containerId, config) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Config defaults
    const {
        logoPath = 'edusync-logo.png',
        title = 'EduSync',
        roleBadgeIcon = 'fa-user-circle',
        roleBadgeText = 'Kullanıcı',
        roleBadgeId = 'headerTeacherName',
        logoutPath = 'index.html',
        themeToggleStyle = '',
        customLinks = '',
        navbarClass = 'header', // default to teacher
        brandClass = 'header-left',
        actionsClass = 'user-info'
    } = config;

    container.innerHTML = `
        <header class="${navbarClass}">
            <div class="${brandClass}">
                <img src="${logoPath}" alt="EduSync" style="height: 44px; border-radius: 8px;">
                <h1 class="header-title" style="margin:0;">${title}</h1>
            </div>
            <div class="${actionsClass}">
                ${customLinks}
                <span class="user-badge" style="display:flex;align-items:center;gap:0.5rem;"><i class="fas ${roleBadgeIcon}"></i> <span id="${roleBadgeId}">${roleBadgeText}</span></span>
                <button class="theme-toggle" id="themeToggle" title="Temayı Değiştir" style="${themeToggleStyle}">
                    <i class="fas fa-moon"></i>
                </button>
                <button class="btn btn-secondary btn-nav danger" style="background:#ef4444; color:white; border:none; padding:10px 15px; border-radius:8px; cursor:pointer;" id="logoutBtn">
                    <i class="fas fa-sign-out-alt"></i> Çıkış
                </button>
            </div>
        </header>
    `;

    // Attach Event Handlers specifically for injected component
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('edusync_token');
        window.location.href = window.location.origin + '/' + logoutPath;
    });
}
