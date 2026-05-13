/**
 * auth.js
 * Güvenlik Duvarı, Role Checker, Inactivity Timer
 */

import { fetchAPI } from './api.js';

// Timer variable
let inactivityTimer;
const TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

export function performLogout() {
    localStorage.removeItem('edusync_token');
    // Using absolute root to avoid relative path issues from /admin or /parent
    window.location.href = window.location.origin + '/index.html'; 
}

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        performLogout();
    }, TIMEOUT_MS);
}

export function initAuthGuard(expectedRole = null) {
    const token = localStorage.getItem('edusync_token');
    const isOnServer = window.location.protocol.startsWith('http');

    // 1. Token yoksa: sadece sunucu üzerinde çalışıyorken yönlendir
    //    file:// protokolünde yönlendirme döngüsüne girer, bu yüzden atla
    if (!token && isOnServer) {
        performLogout();
        return;
    }

    // 2. Hareketsizlik dinleyicileri kur
    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('keypress',  resetInactivityTimer);
    document.addEventListener('click',     resetInactivityTimer);
    resetInactivityTimer();
}
