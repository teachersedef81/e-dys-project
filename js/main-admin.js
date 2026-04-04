/**
 * main-admin.js
 */
import { initAuthGuard } from '../js/auth.js';
import { fetchAPI } from '../js/api.js';
import { initThemeToggle, showNotification, switchTab } from '../js/ui.js';
import { renderNavbar } from '../js/components/Navbar.js';
import { renderFooter } from '../js/components/Footer.js';

document.addEventListener('DOMContentLoaded', () => {
    // Auth
    initAuthGuard('admin');

    // UI Components
    renderNavbar('navbar-root', {
        logoPath: '../edusync-logo.png',
        title: 'EduSync İdare',
        roleBadgeIcon: 'fa-shield-alt',
        roleBadgeText: 'Kurum İdaresi',
        roleBadgeId: 'headerAdminName',
        logoutPath: 'index.html',
        navbarClass: 'admin-navbar',
        brandClass: 'brand',
        actionsClass: 'nav-actions'
    });
    // Add custom buttons or overrides if needed...
    renderFooter('footer-root', '../');

    // Theme logic handled by UI
    initThemeToggle();

    // Tab Logic
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabId = e.currentTarget.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Let's copy/paste the loadStats, loadTeachers etc directly from old script-admin.js 
    // They are straightforward fetch wrappers.
    window.loadStats = async function() {
        try {
            const res = await fetchAPI('/admin/stats');
            if (res && res.ok) {
                const d = await res.json();
                document.getElementById('statTeachers').textContent = d.totalTeachers || 0;
                // other stats ...
            }
        } catch(e) {}
    }
    window.loadTeachers = async function() {
        try {
             const res = await fetchAPI('/teachers');
             if(res && res.ok) {
                 const t = await res.json();
                 console.log("Teachers loaded", t);
             }
        } catch(e) {}
    }

    window.loadStats();
    window.loadTeachers();
});


/* --- ORIGINAL LOGIC RESTORED --- */
/* ============================================
   EduSync Admin Dashboard — JavaScript
   ============================================ */
const API = '/api';
const token = localStorage.getItem('edusync_token');
const AUTH_HEADER = { 'Authorization': `Bearer ${token}` };

// ---- Inactivity Timeout ----
let inactivityTimer;
const TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(logout, TIMEOUT_MS);
}

document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keypress', resetInactivityTimer);
document.addEventListener('click', resetInactivityTimer);
resetInactivityTimer();

function logout() {
    localStorage.removeItem('edusync_token');
    window.location.href = '../index.html';
}

// ---- Toast Notification ----
function toast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const el = document.createElement('div');
    el.className = `admin-toast ${type}`;
    el.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i> ${message}`;
    container.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => el.remove(), 350);
    }, 3000);
}

// ---- Tab Logic ----
document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(`tab-${tabId}`).classList.add('active');
    });
});

// ---- Animated Counter ----
function animateCount(el, target, duration = 1200) {
    let start = 0;
    const step = (ts) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        el.textContent = Math.floor(progress * target);
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

// ---- Load Stats ----
let docChart = null;

async function loadStats() {
    try {
        const res = await fetch(`${API}/admin/stats`, { headers: AUTH_HEADER });
        if (!res.ok) return;
        const d = await res.json();

        // Stat cards
        animateCount(document.getElementById('statTeachers'), d.totalTeachers);
        animateCount(document.getElementById('statStudents'), d.totalStudents);
        animateCount(document.getElementById('statAnnouncements'), d.totalAnnouncements);
        animateCount(document.getElementById('statDocuments'), d.pendingDocuments);

        // Stat detail
        document.getElementById('statsTotal').textContent = d.totalDocuments;
        document.getElementById('statsPending').textContent = d.pendingDocuments;
        document.getElementById('statsApproved').textContent = d.approvedDocuments;

        // Chart
        const ctx = document.getElementById('documentChart');
        if (ctx) {
            if (docChart) docChart.destroy();
            docChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Onaylanan', 'Bekleyen', 'Diğer'],
                    datasets: [{
                        data: [
                            d.approvedDocuments,
                            d.pendingDocuments,
                            Math.max(0, d.totalDocuments - d.approvedDocuments - d.pendingDocuments)
                        ],
                        backgroundColor: ['#10b981', '#f59e0b', '#e2e8f0'],
                        borderWidth: 0,
                        hoverOffset: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    cutout: '72%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                font: { family: "'Outfit', sans-serif", size: 13 },
                                padding: 16,
                                usePointStyle: true,
                                pointStyleWidth: 10
                            }
                        }
                    }
                }
            });
        }
    } catch (e) {
        console.error('Stats load error:', e);
    }
}

// ---- Announcements ----
async function loadAnnouncements() {
    try {
        const res = await fetch(`${API}/parent-info`, { headers: AUTH_HEADER });
        if (!res.ok) return;
        const items = await res.json();

        // Recent (tab 1)
        const recentEl = document.getElementById('recentAnnouncements');
        // Full list (tab 2)
        const listEl = document.getElementById('announcementList');

        if (items.length === 0) {
            const empty = '<div class="admin-empty"><i class="fas fa-inbox"></i><p>Henüz duyuru yok.</p></div>';
            recentEl.innerHTML = empty;
            listEl.innerHTML = empty;
            return;
        }

        const typeLabels = {
            duyuru: 'Genel Duyuru',
            ders_programi: 'Ders Programı',
            nobet: 'Nöbet / Etkinlik',
            toplanti: 'Veli Toplantısı'
        };

        const typeBadge = {
            duyuru: 'info',
            ders_programi: 'warning',
            nobet: 'success',
            toplanti: 'danger'
        };

        // Recent — max 5
        recentEl.innerHTML = items.slice(0, 5).map(a => `
            <div class="announcement-item">
                <div class="ann-info">
                    <h4>${escHtml(a.title)}</h4>
                    <p><span class="badge ${typeBadge[a.type] || 'info'}">${typeLabels[a.type] || a.type}</span> &middot; ${a.date || ''}</p>
                </div>
            </div>
        `).join('');

        // Full list with delete
        listEl.innerHTML = items.map(a => `
            <div class="announcement-item">
                <div class="ann-info">
                    <h4>${escHtml(a.title)}</h4>
                    <p><span class="badge ${typeBadge[a.type] || 'info'}">${typeLabels[a.type] || a.type}</span> &middot; ${a.date || ''}</p>
                </div>
                <div class="ann-actions">
                    <button class="admin-btn danger sm" onclick="deleteAnnouncement(${a.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

    } catch (e) {
        console.error('Announcements load error:', e);
    }
}

async function deleteAnnouncement(id) {
    if (!confirm('Bu duyuruyu silmek istediğinize emin misiniz?')) return;
    try {
        const res = await fetch(`${API}/parent-info/${id}`, { method: 'DELETE', headers: AUTH_HEADER });
        if (res.ok) {
            toast('Duyuru silindi.', 'success');
            loadAnnouncements();
            loadStats();
        } else {
            toast('Silme başarısız.', 'error');
        }
    } catch (e) {
        toast('Sunucu hatası.', 'error');
    }
}

// Announcement Form
document.getElementById('announcementForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('annSubmitBtn');
    btn.innerHTML = '<span class="spinner"></span> Gönderiliyor...';
    btn.disabled = true;

    const payload = {
        type: document.getElementById('annType').value,
        title: document.getElementById('annTitle').value,
        content: document.getElementById('annContent').value,
        target_class: document.getElementById('annTarget').value,
        date: new Date().toLocaleDateString('tr-TR')
    };

    try {
        const res = await fetch(`${API}/parent-info`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...AUTH_HEADER },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            toast('Duyuru tüm velilere başarıyla yayınlandı!', 'success');
            e.target.reset();
            loadAnnouncements();
            loadStats();
        } else {
            toast('Gönderim başarısız.', 'error');
        }
    } catch (err) {
        toast('Sunucu hatası: ' + err.message, 'error');
    } finally {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Tüm Velilere Yayınla';
        btn.disabled = false;
    }
});

// ---- Teachers ----
async function loadTeachers() {
    try {
        const res = await fetch(`${API}/teachers`, { headers: AUTH_HEADER });
        if (!res.ok) return;
        const teachers = await res.json();
        const tbody = document.getElementById('teacherTableBody');

        if (teachers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="admin-empty"><i class="fas fa-user-slash"></i><p>Henüz öğretmen kaydı yok.</p></td></tr>';
            return;
        }

        tbody.innerHTML = teachers.map((t, i) => `
            <tr>
                <td>${i + 1}</td>
                <td><strong>${escHtml(t.name)}</strong></td>
                <td>${escHtml(t.branch)}</td>
                <td>${escHtml(t.phone || '-')}</td>
                <td>${escHtml(t.email || '-')}</td>
                <td>
                    <button class="admin-btn danger sm" onclick="deleteTeacher(${t.id})">
                        <i class="fas fa-trash"></i> Sil
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (e) {
        console.error('Teachers load error:', e);
    }
}

async function deleteTeacher(id) {
    if (!confirm('Bu öğretmeni silmek istediğinize emin misiniz?')) return;
    try {
        const res = await fetch(`${API}/teachers/${id}`, { method: 'DELETE', headers: AUTH_HEADER });
        if (res.ok) {
            toast('Öğretmen silindi.', 'success');
            loadTeachers();
            loadStats();
        } else {
            toast('Silme başarısız.', 'error');
        }
    } catch (e) {
        toast('Sunucu hatası.', 'error');
    }
}

// Teacher Form
document.getElementById('teacherForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        name: document.getElementById('tName').value,
        branch: document.getElementById('tBranch').value,
        phone: document.getElementById('tPhone').value,
        email: document.getElementById('tEmail').value
    };

    try {
        const res = await fetch(`${API}/teachers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...AUTH_HEADER },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            toast(`${payload.name} başarıyla eklendi!`, 'success');
            e.target.reset();
            loadTeachers();
            loadStats();
        } else {
            toast('Ekleme başarısız.', 'error');
        }
    } catch (err) {
        toast('Sunucu hatası.', 'error');
    }
});

// ---- Settings (local save) ----
document.getElementById('settingsForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const settings = {
        school: document.getElementById('setSchool').value,
        city: document.getElementById('setCity').value,
        year: document.getElementById('setYear').value,
        code: document.getElementById('setCode').value,
        principal: document.getElementById('setPrincipal').value,
        phone: document.getElementById('setPhone').value
    };
    localStorage.setItem('edusync_settings', JSON.stringify(settings));
    toast('Ayarlar başarıyla kaydedildi!', 'success');
});

// Load saved settings
function loadSettings() {
    const saved = localStorage.getItem('edusync_settings');
    if (saved) {
        try {
            const s = JSON.parse(saved);
            if (s.school) document.getElementById('setSchool').value = s.school;
            if (s.city) document.getElementById('setCity').value = s.city;
            if (s.year) document.getElementById('setYear').value = s.year;
            if (s.code) document.getElementById('setCode').value = s.code;
            if (s.principal) document.getElementById('setPrincipal').value = s.principal;
            if (s.phone) document.getElementById('setPhone').value = s.phone;
        } catch (e) { /* ignore */ }
    }
}

// ---- Utilities ----
function escHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
}

function logout() {
    window.location.href = '../index.html';
}

// ---- Excel Import with Mapping & De-duplication ----
let excelRawData = [];
let excelHeaders = [];

const MAPPING_FIELDS = [
    { key: 'name', label: 'Ad Soyad', priority: ['ad soyad', 'ad', 'isim', 'fullname', 'name'] },
    { key: 'branch', label: 'Branş', priority: ['branş', 'brans', 'alan', 'branch', 'subject'] },
    { key: 'phone', label: 'Telefon', priority: ['telefon', 'tel', 'phone', 'gsm'] },
    { key: 'email', label: 'E-posta', priority: ['e-posta', 'eposta', 'email', 'mail'] }
];

document.getElementById('excelFileInput')?.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    document.getElementById('excelFileName').textContent = file.name;

    const reader = new FileReader();
    reader.onload = function (evt) {
        try {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            
            // Get raw rows
            excelRawData = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });
            if (excelRawData.length === 0) {
                toast('Excel dosyası boş veya okunamadı.', 'error');
                return;
            }

            // Get headers
            excelHeaders = Object.keys(excelRawData[0]);
            showMappingModal();

        } catch (err) {
            console.error('Excel parse error:', err);
            toast('Dosya okunamadı.', 'error');
        }
    };
    reader.readAsArrayBuffer(file);
});

function showMappingModal() {
    const modal = document.getElementById('mappingModal');
    const container = document.getElementById('mappingContainer');
    modal.classList.add('show');

    container.innerHTML = MAPPING_FIELDS.map(f => {
        // Find best match for header
        let bestMatch = excelHeaders.find(h => f.priority.includes(h.toLowerCase().trim())) || '';
        
        return `
            <div class="mapping-row">
                <label>${f.label}</label>
                <select class="admin-select mapping-select" data-field="${f.key}">
                    <option value="">-- Sütun Seçin --</option>
                    ${excelHeaders.map(h => `<option value="${h}" ${h === bestMatch ? 'selected' : ''}>${h}</option>`).join('')}
                </select>
            </div>
        `;
    }).join('');
}

function closeMappingModal() {
    document.getElementById('mappingModal').classList.remove('show');
}

document.getElementById('confirmMappingBtn')?.addEventListener('click', () => {
    const selects = document.querySelectorAll('.mapping-select');
    const mapping = {};
    selects.forEach(s => {
        mapping[s.getAttribute('data-field')] = s.value;
    });

    if (!mapping.name || !mapping.branch) {
        toast('Lütfen en az "Ad Soyad" ve "Branş" sütunlarını eşleştirin.', 'error');
        return;
    }

    // Process data with mapping
    const processedRows = excelRawData.map(row => ({
        name: row[mapping.name] || '',
        branch: row[mapping.branch] || '',
        phone: row[mapping.phone] || '',
        email: row[mapping.email] || ''
    })).filter(r => r.name.trim() !== '');

    pendingExcelRows = processedRows;
    closeMappingModal();

    // Show preview
    document.getElementById('excelPreview').style.display = 'block';
    document.getElementById('excelRowCount').textContent = pendingExcelRows.length;

    const previewBody = document.getElementById('excelPreviewBody');
    previewBody.innerHTML = pendingExcelRows.map((r, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${escHtml(r.name)}</td>
            <td>${escHtml(r.branch)}</td>
            <td>${escHtml(r.phone)}</td>
            <td>${escHtml(r.email)}</td>
        </tr>
    `).join('');

    toast('Eşleştirme tamamlandı. Önizlemeyi kontrol edin.', 'success');
});

document.getElementById('excelImportBtn')?.addEventListener('click', async function () {
    if (pendingExcelRows.length === 0) return;

    const btn = this;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Aktarılıyor (Tekilleştirme Aktif)...';

    try {
        const res = await fetch(`${API}/teachers/batch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...AUTH_HEADER },
            body: JSON.stringify(pendingExcelRows)
        });
        const d = await res.json();
        
        if (d.success) {
            toast(`${d.added} öğretmen eklendi, ${d.skipped} mükerrer/geçersiz kayıt atlandı.`, 'success');
        } else {
            toast('Aktarım sırasında hata oluştu.', 'error');
        }
    } catch (err) {
        toast('Sunucu hatası: ' + err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-database"></i> Tümünü Sisteme Aktar';
        document.getElementById('excelPreview').style.display = 'none';
        pendingExcelRows = [];
        loadTeachers();
        loadStats();
    }
});

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadAnnouncements();
    loadTeachers();
    loadSettings();
});


// ---- Theme Toggle ----
const themeToggle = document.getElementById('themeToggle');
const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', theme);
};
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(currentTheme === 'light' ? 'dark' : 'light');
});
// Initialize theme on load
applyTheme(localStorage.getItem('theme') || 'light');

