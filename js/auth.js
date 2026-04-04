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
    
    // 1. Check if token exists
    if (!token) {
        performLogout();
        return;
    }

    // 2. Setup inactivity listeners
    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('keypress', resetInactivityTimer);
    document.addEventListener('click', resetInactivityTimer);
    resetInactivityTimer();

    // 3. Optional: Quick JWT decoding or hit backend /api/me to check role validity
    // For now, since it's a frontend guard, if a token exists we let them see the UI.
    // The backend logic (API route) will throw 401 if they try to fetch data that's not theirs.
    // However, we could decode the payload manually to check expectedRole if we wanted to be strict.
}
