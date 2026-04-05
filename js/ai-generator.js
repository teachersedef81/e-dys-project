/**
 * ai-generator.js
 * Yapay Zeka Tutanak Oluşturma ve PDF Dışa Aktarma
 */

import { fetchAPI } from './api.js';
import { showNotification } from './ui.js';

export async function generateContent(promptTxt, context) {
    try {
        let systemPrompt = "";
        const docType = context.documentType || "";
        
        if (docType.includes("Şube Öğretmenler")) {
            systemPrompt = "\n\n[SİSTEM KOMUTU: Bu metni resmi MEB ŞÖK (Şube Öğretmenler Kurulu) tutanağı şablonuna getir. Eğitim-öğretim durumunun değerlendirilmesi, öğrenci başarıları, okul-aile işbirliği, alınacak kararlar ve önlemler başlıklarını kesinlikle içer. Resmi, kurumsal ve nesnel bir dil kullan. Sonuna katılımcıların imza atabileceği bir imza sirküsü tablosu ekle.]";
        } else if (docType.includes("Zümre Öğretmenler") || docType.includes("Zümre")) {
            systemPrompt = "\n\n[SİSTEM KOMUTU: Bu metni resmi MEB Zümre Öğretmenler Kurulu tutanağı şablonuna getir. Öğretim programlarının uygulanması, başarıyı artırıcı tedbirler, ortak sınavlar, proje ve performans görevleri değerlendirmeleri başlıklarını zorunlu tut. Saygıdeğer ve resmi bir dil kullan. Sonuna okul müdürü, zümre başkanı ve öğretmenlerin imzalayabileceği bir imza sirküsü tablosu ekle.]";
        } else {
            // Jenerik diğer evraklar için
            systemPrompt = "\n\n[SİSTEM KOMUTU: Bu metni resmi MEB evrak formatında ve profesyonel bir üslupla düzenle. Gerekli başlık ve maddeleri oluştur. Sonuna katılımcılar için imza sirküsü tablosu ekle.]";
        }

        const finalPrompt = promptTxt + systemPrompt;

        const response = await fetchAPI('/generate-minutes', {
            method: 'POST',
            body: JSON.stringify({ prompt: finalPrompt, context })
        });
        
        if (response && response.ok) {
            const data = await response.json();
            return data.result;
        }
        throw new Error("Sunucu yanıt vermedi.");
    } catch (e) {
        console.error("AI Generation Error", e);
        throw e;
    }
}

export function generateOfficialPDF(content, formValues) {
    // Requires Window.jspdf (usually from script tag loaded on the page)
    if (!window.jspdf) {
        showNotification("PDF Kütüphanesi Yüklenemedi", "error");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    
    const province = (formValues.province || '[İL]').toUpperCase();
    const district = (formValues.district || '[İLÇE]').toUpperCase();
    const school = (formValues.school || '[OKUL ADI]').toUpperCase();
    const year = formValues.year || '[YIL]';
    const date = new Date().toLocaleDateString('tr-TR');
    const teacherName = localStorage.getItem('teacherName') || '[İsim Soyisim]';
    
    // Settings
    const margin = 25;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (2 * margin);
    let currentY = 25;

    // Header
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.text('T.C.', pageWidth / 2, currentY, { align: 'center' });
    currentY += 6;
    doc.text(`${province} VALİLİĞİ`, pageWidth / 2, currentY, { align: 'center' });
    currentY += 6;
    doc.text(`${district} KAYMAKAMLIĞI`, pageWidth / 2, currentY, { align: 'center' });
    currentY += 6;
    doc.text(school, pageWidth / 2, currentY, { align: 'center' });
    
    currentY += 15;
    
    // Sayı & Konu & Tarih
    doc.setFontSize(11);
    doc.text('Sayı  :', margin, currentY);
    doc.text('Konu :', margin, currentY + 6);
    doc.setFont('times', 'normal');
    doc.text('E-70430156-020-2024-X', margin + 15, currentY); 
    doc.text(formValues.documentType || 'Toplantı Tutanağı', margin + 15, currentY + 6);
    
    doc.setFont('times', 'bold');
    doc.text(date, pageWidth - margin, currentY, { align: 'right' });
    
    currentY += 25;
    
    // Body (AI Content)
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    
    // Split text to fit width
    const lines = doc.splitTextToSize(content || '', contentWidth);
    doc.text(lines, margin, currentY);
    
    // Estimate end of text
    currentY += (lines.length * 6) + 20;
    
    // Signature
    if (currentY > 260) { doc.addPage(); currentY = 30; }
    doc.setFont('times', 'bold');
    doc.text(teacherName, pageWidth - margin - 50, currentY, { align: 'center' });
    doc.setFont('times', 'normal');
    doc.text('Öğretmen', pageWidth - margin - 50, currentY + 6, { align: 'center' });
    
    // Save
    const fileName = `Resmi_Tutanak_${date.replace(/\./g, '_')}.pdf`;
    doc.save(fileName);
    showNotification('Resmi PDF başarıyla oluşturuldu.', 'success');
}
