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
        } else if (docType.includes("İzin Talep")) {
            systemPrompt = "\n\n[SİSTEM KOMUTU: Bu metni resmi MEB izin talep dilekçesi formatına getir. Başlık (T.C. kurum hiyerarşisi), tarih, konu (izin talebi hakkında), makam hitabı ('Sayın Müdürüm,'), izin sebebi ve süresi, 'Arz ederim.' kapanışı, imza (ad-soyad, unvan, tarih) bölümlerini mutlaka içer. Kısa, net ve resmi üslup kullan.]";
        } else if (docType.includes("Dilekçe") || docType.includes("Başvuru Formu")) {
            systemPrompt = "\n\n[SİSTEM KOMUTU: Bu metni resmi MEB dilekçe / başvuru formu formatına getir. T.C. kurum başlığı, tarih, konu, ilgili makama hitap, talep/başvuru gerekçesi, 'Gereğini saygılarımla arz ederim.' kapanışı, imza bölümü (ad-soyad, unvan, T.C. kimlik no, iletişim) içermelidir. Sade ve anlaşılır dil kullan.]";
        } else if (docType.includes("Görev") || docType.includes("Hizmet Belgesi")) {
            systemPrompt = "\n\n[SİSTEM KOMUTU: Bu metni resmi MEB görev/hizmet belgesi talep yazısı formatına getir. Talep eden kişinin bilgileri, görev yeri, talebin amacı (hangi kuruma ibraz edileceği), resmi hitap ve 'Arz ederim.' kapanışını içer. Kısa tutulacak, sadece gerekli bilgiler yer alacak.]";
        } else if (docType.includes("Kaza") || docType.includes("Olay Tutanağı")) {
            systemPrompt = "\n\n[SİSTEM KOMUTU: Bu metni resmi MEB kaza/olay tutanağı formatına getir. Olayın tarihi-saati-yeri, ilgili kişilerin (öğrenci/öğretmen) bilgileri, olayın tarafsız ve nesnel şekilde kronolojik anlatımı, alınan ilk önlemler, tutanağı düzenleyenlerin imza bölümü mutlaka yer almalıdır. Duygusal ifadelerden kaçın, sadece gözlemlenebilir olgulara dayandır.]";
        } else if (docType.includes("Başarı Raporu") || docType.includes("Rapor")) {
            systemPrompt = "\n\n[SİSTEM KOMUTU: Bu metni resmi MEB öğrenci başarı raporu formatına getir. Öğrencinin adı-sınıfı, değerlendirme dönemi, ders bazında başarı durumu, genel değerlendirme, güçlü yönler, geliştirilmesi gereken alanlar ve öğretmen görüşü bölümlerini içer. Yapıcı, nesnel ve öğrenci odaklı bir dil kullan.]";
        } else if (docType.includes("Resmi Yazı")) {
            systemPrompt = "\n\n[SİSTEM KOMUTU: Bu metni resmi MEB resmi yazı formatına getir. T.C. kurum başlığı (il valiliği → ilçe kaymakamlığı → okul hiyerarşisi), evrak numarası, konu, tarih, ilgili makama hitap, açık ve net yazı gövdesi, gereği/bilgi dağıtım listesi ve imza bloğu (ad-soyad, unvan, mühür yeri) içermelidir. Resmi yazışma yönetmeliğine uygun dil kullan.]";
        } else if (docType.includes("Genel") || docType.includes("Dilekçe")) {
            systemPrompt = "\n\n[SİSTEM KOMUTU: Bu metni standart MEB dilekçe formatına getir. T.C. kurum başlığı, tarih, konu, makam hitabı, açık ve kısa dilekçe metni, 'Gereğini saygılarımla arz ederim.' kapanışı ve imza bölümü içermelidir.]";
        } else {
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

        // Sunucudan gelen hata mesajını çıkar
        let errMsg = "Sunucu yanıt vermedi.";
        try {
            const errData = await response.json();
            errMsg = errData.error || errMsg;
        } catch (_) {}
        throw new Error(errMsg);
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
