/**
 * Footer.js
 */

export function renderFooter(containerId, rootPath = '') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <footer class="footer" style="margin-top:4rem;">
            <div class="footer-content" style="max-width:1152px; margin:0 auto; padding:3rem 1.5rem; display:grid; grid-template-columns:2fr repeat(3, 1fr); gap:2rem;">
                <div class="footer-section footer-brand">
                    <div class="footer-logo" style="display:flex; align-items:center; gap:1rem; margin-bottom:1rem;">
                        <img src="${rootPath}edusync-logo.png" alt="EduSync Logo" style="width:40px;height:40px;border-radius:8px;">
                        <h3 style="color:var(--warning-color); font-size:1.5rem; font-weight:700; margin:0;">EduSync</h3>
                    </div>
                    <p style="color:var(--text-secondary); font-size:0.9rem; line-height:1.6;">Geleceğin eğitim yönetimi. Tüm işlemlerinizi tek bir ortak alandan planlayın, takip edin ve yönetin.</p>
                </div>
                <div class="footer-section">
                    <h4 style="color:var(--text-primary); margin-bottom:1rem; font-weight:600;">Hızlı Erişim</h4>
                    <div class="footer-links" style="display:flex; flex-direction:column; gap:0.75rem;">
                        <a href="#" style="color:var(--text-secondary); text-decoration:none;"><i class="fas fa-file-alt"></i> Belgeler</a>
                        <a href="#" style="color:var(--text-secondary); text-decoration:none;"><i class="fas fa-calendar-check"></i> Yoklama</a>
                        <a href="#" style="color:var(--text-secondary); text-decoration:none;"><i class="fas fa-chart-pie"></i> Karar Destek</a>
                    </div>
                </div>
                <div class="footer-section">
                    <h4 style="color:var(--text-primary); margin-bottom:1rem; font-weight:600;">Kurumsal</h4>
                    <div class="footer-links" style="display:flex; flex-direction:column; gap:0.75rem;">
                        <a href="#" style="color:var(--text-secondary); text-decoration:none;"><i class="fas fa-info-circle"></i> Hakkımızda</a>
                        <a href="#" style="color:var(--text-secondary); text-decoration:none;"><i class="fas fa-shield-alt"></i> Güvenlik</a>
                        <a href="#" style="color:var(--text-secondary); text-decoration:none;"><i class="fas fa-envelope"></i> İletişim</a>
                    </div>
                </div>
                <div class="footer-section">
                    <h4 style="color:var(--text-primary); margin-bottom:1rem; font-weight:600;">Destek</h4>
                    <div class="footer-links" style="display:flex; flex-direction:column; gap:0.75rem;">
                        <a href="#" style="color:var(--text-secondary); text-decoration:none;"><i class="fas fa-question-circle"></i> SSS</a>
                        <a href="#" style="color:var(--text-secondary); text-decoration:none;"><i class="fas fa-book"></i> Kullanım Kılavuzu</a>
                        <a href="#" style="color:var(--text-secondary); text-decoration:none;"><i class="fas fa-bug"></i> Hata Bildir</a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom" style="background:#fff; border-top:1px solid var(--border-color); padding:1.5rem 0;">
                <div class="footer-bottom-content" style="max-width:1152px; margin:0 auto; padding:0 1.5rem; display:flex; justify-content:space-between; align-items:center; color:var(--text-secondary); font-size:0.9rem;">
                    <p>© 2026 EduSync Tüm hakları saklıdır.</p>
                </div>
            </div>
        </footer>
    `;
}
