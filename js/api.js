/**
 * api.js
 * Modüler API Yönetimi
 */
const API_BASE_URL = '/api'; // Use /api since it's served from the same domain typically or update to 'http://localhost:3000/api' if strictly decoupled

export async function fetchAPI(endpoint, options = {}) {
    // Auth tokeng injection
    const token = localStorage.getItem('edusync_token');
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`; // JWT in header
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        // Handle 401 Unauthorized globally
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('edusync_token');
            window.location.href = window.location.origin + '/index.html?error=unauthorized';
            return null;
        }
        
        return response;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}
