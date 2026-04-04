/**
 * EduSync MEB API & Webhook Integration Layer
 * This module prepares the system for future MEB API integrations.
 */

class MEBIntegration {
    constructor() {
        this.webhookUrl = process.env.MEB_WEBHOOK_URL || null;
    }

    /**
     * Standardizes teacher data from different formats (e-Okul, MEBBİS, etc.)
     * @param {Object} rawData 
     * @returns {Object} Standardized internal teacher object
     */
    transformTeacher(rawData) {
        return {
            name: (rawData.name || rawData.fullName || rawData.AD_SOYAD || '').trim(),
            branch: (rawData.branch || rawData.subject || rawData.BRANS || '').trim(),
            phone: (rawData.phone || rawData.tel || rawData.TELEFON || '').replace(/[^0-9]/g, ''),
            email: (rawData.email || rawData.mail || rawData.EPOSTA || '').toLowerCase().trim()
        };
    }

    /**
     * Validates teacher data before insertion
     * @param {Object} teacher 
     * @returns {Object} { isValid: boolean, error: string }
     */
    validateTeacher(teacher) {
        if (!teacher.name || teacher.name.length < 3) return { isValid: false, error: 'Geçersiz Ad Soyad' };
        if (!teacher.branch) return { isValid: false, error: 'Branş belirtilmedi' };
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (teacher.email && !emailRegex.test(teacher.email)) return { isValid: false, error: 'Geçersiz E-posta formatı' };
        
        return { isValid: true };
    }

    /**
     * Future placeholder for Webhook listener
     */
    async handleIncomingWebhook(req, res, next) {
        // MEB API'den gelen verileri karşılayan middleware
        console.log('Incoming MEB Webhook detected...');
        next();
    }
}

module.exports = new MEBIntegration();
