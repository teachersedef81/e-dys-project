// Sample data for classes (extended)
        const classData = {
            '5A': {
                homeroomTeacher: 'Mustafa TOPCAN',
                currentLesson: {
                    name: 'Matematik',
                    time: '10:00 - 10:40',
                    teacher: 'Eşref AKKAŞ',
                    classroom: '5A'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Türkçe', teacher: 'Tuba Ovalı İNAN', classroom: '105', status: 'normal' },
                    { time: '09:20 - 10:00', subject: 'Fen Bilimleri', teacher: 'Celil ÖZTÜRK', classroom: 'Lab-1', status: 'normal' },
                    { time: '10:00 - 10:40', subject: 'Matematik', teacher: 'Eşref AKKAŞ', classroom: '205', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Sosyal Bilgiler', teacher: 'Elif Uzun ÖZEN', classroom: '105', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'İngilizce', teacher: 'Sümeyye KARADUMAN', classroom: '203', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'Beden Eğitimi', teacher: 'Bünyamin KAAHRAMAN', classroom: 'Spor Salonu', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Müzik', teacher: 'Ceren ÇİFTÇİ', classroom: 'Müzik Odası', status: 'upcoming' }
                ],
                substitutes: [],
                dutyTeachers: [
                    { name: 'Tuba Ovalı İNAN', area: 'Bahçe ve Kantin' },
                    { name: 'Can Demir', area: 'Spor Salonu ve Koridorlar' }
                ]
            },
            '5B': {
                homeroomTeacher: 'Cem ÖNCÜ',
                currentLesson: {
                    name: 'Türkçe',
                    time: '10:00 - 10:40',
                    teacher: 'Vedat YÜKSEL',
                    classroom: '106'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Matematik', teacher: 'Ümit ATAR', classroom: '106', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Fen Bilimleri', teacher: 'Cem ÖNCÜ', classroom: 'Lab-1', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Türkçe', teacher: 'Vedat YÜKSEL', classroom: '105', status: 'completed'},
                    { time: '10:00 - 10:40', subject: 'Türkçe', teacher: 'Vedat YÜKSEL', classroom: '106', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'İngilizce', teacher: 'Elif FERGANE', classroom: '203', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'Sosyal Bilgiler', teacher: 'Elif Uzun ÖZEN', classroom: '106', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'Görsel Sanatlar', teacher: 'Elçin KAHRAMAN', classroom: 'Sanat Odası', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Bilişim Teknolojileri', teacher: 'Muhammet ÖZCAN', classroom: 'Bilgisayar Lab', status: 'upcoming' }
                ],
                substitutes: [],
                dutyTeachers: [
                    { name: 'Zeynep Korkmaz', area: 'Bahçe ve Kantin' },
                    { name: 'Mehmet Kaya', area: 'Giriş ve Koridorlar' }
                ]
            },
            '5C': {
                homeroomTeacher: 'Güldeniz YILMAZ',
                currentLesson: {
                    name: 'Görsel Sanatlar',
                    time: '10:00 - 10:40',
                    teacher: 'Selin Tekin',
                    classroom: 'Sanat Odası'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Sosyal Bilgiler', teacher: 'Mehmet Kaya', classroom: '107', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Türkçe', teacher: 'Hasan Aydın', classroom: '107', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Görsel Sanatlar', teacher: 'Selin Tekin', classroom: 'Sanat Odası', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Matematik', teacher: 'Ahmet Yıldız', classroom: '107', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'Fen Bilimleri', teacher: 'Zeynep Korkmaz', classroom: 'Lab-1', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'İngilizce', teacher: 'David Smith', classroom: '203', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Müzik', teacher: 'Elif Güneş', classroom: 'Müzik Odası', status: 'upcoming' }
                ],
                substitutes: [],
                dutyTeachers: [
                    { name: 'Hasan Aydın', area: 'Bahçe ve Kantin' },
                    { name: 'Selin Tekin', area: 'Müzik ve Sanat Koridoru' }
                ]
            },
            '5D': {
                homeroomTeacher: 'Barkın KILINÇOĞLU',
                currentLesson: {
                    name: 'Görsel Sanatlar',
                    time: '10:00 - 10:40',
                    teacher: 'Elçin KAHRAMAN',
                    classroom: 'Sanat Odası'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Sosyal Bilgiler', teacher: 'Mehmet Kaya', classroom: '107', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Türkçe', teacher: 'Hasan Aydın', classroom: '107', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Görsel Sanatlar', teacher: 'Selin Tekin', classroom: 'Sanat Odası', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Matematik', teacher: 'Ahmet Yıldız', classroom: '107', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'Fen Bilimleri', teacher: 'Zeynep Korkmaz', classroom: 'Lab-1', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'İngilizce', teacher: 'David Smith', classroom: '203', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Müzik', teacher: 'Elif Güneş', classroom: 'Müzik Odası', status: 'upcoming' }
                ],
                substitutes: [],
                dutyTeachers: [
                    { name: 'Hasan Aydın', area: 'Bahçe ve Kantin' },
                    { name: 'Selin Tekin', area: 'Müzik ve Sanat Koridoru' }
                ]
            },
            '5E': {
                homeroomTeacher: 'Vedat YÜKSEL',
                currentLesson: {
                    name: 'Görsel Sanatlar',
                    time: '10:00 - 10:40',
                    teacher: 'Selin Tekin',
                    classroom: 'Sanat Odası'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Sosyal Bilgiler', teacher: 'Mehmet Kaya', classroom: '107', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Türkçe', teacher: 'Hasan Aydın', classroom: '107', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Görsel Sanatlar', teacher: 'Selin Tekin', classroom: 'Sanat Odası', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Matematik', teacher: 'Ahmet Yıldız', classroom: '107', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'Fen Bilimleri', teacher: 'Zeynep Korkmaz', classroom: 'Lab-1', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'İngilizce', teacher: 'David Smith', classroom: '203', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Müzik', teacher: 'Elif Güneş', classroom: 'Müzik Odası', status: 'upcoming' }
                ],
                substitutes: [],
                dutyTeachers: [
                    { name: 'Hasan Aydın', area: 'Bahçe ve Kantin' },
                    { name: 'Selin Tekin', area: 'Müzik ve Sanat Koridoru' }
                ]
            },
            '5F': {
                homeroomTeacher: 'Elif FERGANE',
                currentLesson: {
                    name: 'Görsel Sanatlar',
                    time: '10:00 - 10:40',
                    teacher: 'Selin Tekin',
                    classroom: 'Sanat Odası'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Sosyal Bilgiler', teacher: 'Mehmet Kaya', classroom: '107', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Türkçe', teacher: 'Hasan Aydın', classroom: '107', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Görsel Sanatlar', teacher: 'Selin Tekin', classroom: 'Sanat Odası', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Matematik', teacher: 'Ahmet Yıldız', classroom: '107', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'Fen Bilimleri', teacher: 'Zeynep Korkmaz', classroom: 'Lab-1', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'İngilizce', teacher: 'David Smith', classroom: '203', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Müzik', teacher: 'Elif Güneş', classroom: 'Müzik Odası', status: 'upcoming' }
                ],
                substitutes: [],
                dutyTeachers: [
                    { name: 'Hasan Aydın', area: 'Bahçe ve Kantin' },
                    { name: 'Selin Tekin', area: 'Müzik ve Sanat Koridoru' }
                ]
            },
            '6A': {
                homeroomTeacher: 'Ümit ATAR',
                currentLesson: {
                    name: 'Bilişim Teknolojileri',
                    time: '10:00 - 10:40',
                    teacher: 'Murat Şen',
                    classroom: 'Bilgisayar Lab'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Matematik', teacher: 'Fatma Yılmaz', classroom: '205', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Türkçe', teacher: 'Ali Öztürk', classroom: '205', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Bilişim Teknolojileri', teacher: 'Murat Şen', classroom: 'Bilgisayar Lab', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Fen Bilimleri', teacher: 'Zeynep Korkmaz', classroom: 'Lab-1', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'Sosyal Bilgiler', teacher: 'Mehmet Kaya', classroom: '205', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'İngilizce', teacher: 'Sarah Johnson', classroom: '203', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Beden Eğitimi', teacher: 'Can Demir', classroom: 'Spor Salonu', status: 'upcoming' }
                ],
                substitutes: [],
                dutyTeachers: [
                    { name: 'Fatma Yılmaz', area: 'Üst Kat Koridorları' },
                    { name: 'Murat Şen', area: 'Teknoloji Laboratuvarları' }
                ]
            },
            '6B': {
                homeroomTeacher: 'Gökçe Mine UZDUR',
                currentLesson: {
                    name: 'Türkçe',
                    time: '10:00 - 10:40',
                    teacher: 'Ali Öztürk',
                    classroom: '206'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Fen Bilimleri', teacher: 'Zeynep Korkmaz', classroom: 'Lab-1', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Matematik', teacher: 'Fatma Yılmaz', classroom: '206', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Türkçe', teacher: 'Ali Öztürk', classroom: '206', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Bilişim Teknolojileri', teacher: 'Murat Şen', classroom: 'Bilgisayar Lab', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'İngilizce', teacher: 'Sarah Johnson', classroom: '203', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'Görsel Sanatlar', teacher: 'Selin Tekin', classroom: 'Sanat Odası', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Müzik', teacher: 'Elif Güneş', classroom: 'Müzik Odası', status: 'upcoming' }
                ],
                substitutes: [
                    { originalTeacher: 'Elif Güneş', substituteTeacher: 'Ayşe Yılmaz', reason: 'Rapor' }
                ],
                dutyTeachers: [
                    { name: 'Ali Öztürk', area: 'Alt Kat Koridorları' },
                    { name: 'Sarah Johnson', area: 'Yabancı Dil Sınıfları' }
                ]
            },
            '6C': {
                homeroomTeacher: 'Nurdan KÜÇÜKAKBULUT',
                currentLesson: {
                    name: 'Görsel Sanatlar',
                    time: '10:00 - 10:40',
                    teacher: 'Selin Tekin',
                    classroom: 'Sanat Odası'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Sosyal Bilgiler', teacher: 'Mehmet Kaya', classroom: '107', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Türkçe', teacher: 'Hasan Aydın', classroom: '107', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Görsel Sanatlar', teacher: 'Selin Tekin', classroom: 'Sanat Odası', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Matematik', teacher: 'Ahmet Yıldız', classroom: '107', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'Fen Bilimleri', teacher: 'Zeynep Korkmaz', classroom: 'Lab-1', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'İngilizce', teacher: 'David Smith', classroom: '203', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Müzik', teacher: 'Elif Güneş', classroom: 'Müzik Odası', status: 'upcoming' }
                ],
                substitutes: [],
                dutyTeachers: [
                    { name: 'Hasan Aydın', area: 'Bahçe ve Kantin' },
                    { name: 'Selin Tekin', area: 'Müzik ve Sanat Koridoru' }
                ]
            },
            '6D': {
                homeroomTeacher: 'Halil DURDU',
                currentLesson: {
                    name: 'Görsel Sanatlar',
                    time: '10:00 - 10:40',
                    teacher: 'Selin Tekin',
                    classroom: 'Sanat Odası'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Sosyal Bilgiler', teacher: 'Mehmet Kaya', classroom: '107', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Türkçe', teacher: 'Hasan Aydın', classroom: '107', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Görsel Sanatlar', teacher: 'Selin Tekin', classroom: 'Sanat Odası', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Matematik', teacher: 'Ahmet Yıldız', classroom: '107', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'Fen Bilimleri', teacher: 'Zeynep Korkmaz', classroom: 'Lab-1', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'İngilizce', teacher: 'David Smith', classroom: '203', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Müzik', teacher: 'Elif Güneş', classroom: 'Müzik Odası', status: 'upcoming' }
                ],
                substitutes: [],
                dutyTeachers: [
                    { name: 'Hasan Aydın', area: 'Bahçe ve Kantin' },
                    { name: 'Selin Tekin', area: 'Müzik ve Sanat Koridoru' }
                ]
            },
            '6E': {
                homeroomTeacher: 'Semahat YILMAZ',
                currentLesson: {
                    name: 'Görsel Sanatlar',
                    time: '10:00 - 10:40',
                    teacher: 'Selin Tekin',
                    classroom: 'Sanat Odası'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Sosyal Bilgiler', teacher: 'Mehmet Kaya', classroom: '107', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Türkçe', teacher: 'Hasan Aydın', classroom: '107', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Görsel Sanatlar', teacher: 'Selin Tekin', classroom: 'Sanat Odası', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Matematik', teacher: 'Ahmet Yıldız', classroom: '107', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'Fen Bilimleri', teacher: 'Zeynep Korkmaz', classroom: 'Lab-1', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'İngilizce', teacher: 'David Smith', classroom: '203', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Müzik', teacher: 'Elif Güneş', classroom: 'Müzik Odası', status: 'upcoming' }
                ],
                substitutes: [],
                dutyTeachers: [
                    { name: 'Hasan Aydın', area: 'Bahçe ve Kantin' },
                    { name: 'Selin Tekin', area: 'Müzik ve Sanat Koridoru' }
                ]
            },
            '6F': {
                homeroomTeacher: 'Sümeyye BİLGİN',
                currentLesson: {
                    name: 'Görsel Sanatlar',
                    time: '10:00 - 10:40',
                    teacher: 'Selin Tekin',
                    classroom: 'Sanat Odası'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Sosyal Bilgiler', teacher: 'Mehmet Kaya', classroom: '107', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Türkçe', teacher: 'Hasan Aydın', classroom: '107', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Görsel Sanatlar', teacher: 'Selin Tekin', classroom: 'Sanat Odası', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Matematik', teacher: 'Ahmet Yıldız', classroom: '107', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'Fen Bilimleri', teacher: 'Zeynep Korkmaz', classroom: 'Lab-1', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'İngilizce', teacher: 'David Smith', classroom: '203', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Müzik', teacher: 'Elif Güneş', classroom: 'Müzik Odası', status: 'upcoming' }
                ],
                substitutes: [],
                dutyTeachers: [
                    { name: 'Hasan Aydın', area: 'Bahçe ve Kantin' },
                    { name: 'Selin Tekin', area: 'Müzik ve Sanat Koridoru' }
                ]
            },
            '6G': {
                homeroomTeacher: 'Hatice TEKİN',
                currentLesson: {
                    name: 'Görsel Sanatlar',
                    time: '10:00 - 10:40',
                    teacher: 'Selin Tekin',
                    classroom: 'Sanat Odası'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Sosyal Bilgiler', teacher: 'Mehmet Kaya', classroom: '107', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Türkçe', teacher: 'Hasan Aydın', classroom: '107', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Görsel Sanatlar', teacher: 'Selin Tekin', classroom: 'Sanat Odası', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Matematik', teacher: 'Ahmet Yıldız', classroom: '107', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'Fen Bilimleri', teacher: 'Zeynep Korkmaz', classroom: 'Lab-1', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'İngilizce', teacher: 'David Smith', classroom: '203', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Müzik', teacher: 'Elif Güneş', classroom: 'Müzik Odası', status: 'upcoming' }
                ],
                substitutes: [],
                dutyTeachers: [
                    { name: 'Hasan Aydın', area: 'Bahçe ve Kantin' },
                    { name: 'Selin Tekin', area: 'Müzik ve Sanat Koridoru' }
                ]
            },
            '6H': {
                homeroomTeacher: 'N. Güler TAŞKIRAN',
                currentLesson: {
                    name: 'Görsel Sanatlar',
                    time: '10:00 - 10:40',
                    teacher: 'Selin Tekin',
                    classroom: 'Sanat Odası'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Sosyal Bilgiler', teacher: 'Mehmet Kaya', classroom: '107', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Türkçe', teacher: 'Hasan Aydın', classroom: '107', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Görsel Sanatlar', teacher: 'Selin Tekin', classroom: 'Sanat Odası', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Matematik', teacher: 'Ahmet Yıldız', classroom: '107', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'Fen Bilimleri', teacher: 'Zeynep Korkmaz', classroom: 'Lab-1', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'İngilizce', teacher: 'David Smith', classroom: '203', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Müzik', teacher: 'Elif Güneş', classroom: 'Müzik Odası', status: 'upcoming' }
                ],
                substitutes: [],
                dutyTeachers: [
                    { name: 'Hasan Aydın', area: 'Bahçe ve Kantin' },
                    { name: 'Selin Tekin', area: 'Müzik ve Sanat Koridoru' }
                ]
            },
            '7A': {
                homeroomTeacher: 'Recep AYDIN',
                currentLesson: {
                    name: 'Matematik',
                    time: '10:00 - 10:40',
                    teacher: 'Fatma Yılmaz',
                    classroom: '305'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Türkçe', teacher: 'Ali Öztürk', classroom: '305', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Sosyal Bilgiler', teacher: 'Buse Akar', classroom: '305', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Matematik', teacher: 'Fatma Yılmaz', classroom: '305', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Fen Bilimleri', teacher: 'Osman Kara', classroom: 'Lab-2', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'İngilizce', teacher: 'Sarah Johnson', classroom: '203', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'Din Kültürü', teacher: 'Ahmet Yücel', classroom: '305', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Müzik', teacher: 'Elif Güneş', classroom: 'Müzik Odası', status: 'upcoming' }
                ],
                substitutes: [
                    { originalTeacher: 'Osman Kara', substituteTeacher: 'Zeynep Korkmaz', reason: 'İzin' }
                ],
                dutyTeachers: [
                    { name: 'Buse Akar', area: 'Giriş ve Bahçe' },
                    { name: 'Osman Kara', area: 'Fen Laboratuvarları' }
                ]
            },
            '7B': {
                homeroomTeacher: 'Kemal KÜÇÜKAKBULUT',
                currentLesson: {
                    name: 'Sosyal Bilgiler',
                    time: '10:00 - 10:40',
                    teacher: 'Harika ÇAKICI',
                    classroom: '305'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Türkçe', teacher: 'Ali Öztürk', classroom: '305', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Sosyal Bilgiler', teacher: 'Buse Akar', classroom: '305', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Matematik', teacher: 'Fatma Yılmaz', classroom: '305', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Fen Bilimleri', teacher: 'Osman Kara', classroom: 'Lab-2', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'İngilizce', teacher: 'Sarah Johnson', classroom: '203', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'Din Kültürü', teacher: 'Ahmet Yücel', classroom: '305', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Müzik', teacher: 'Elif Güneş', classroom: 'Müzik Odası', status: 'upcoming' }
                ],
                substitutes: [
                    { originalTeacher: 'Osman Kara', substituteTeacher: 'Zeynep Korkmaz', reason: 'İzin' }
                ],
                dutyTeachers: [
                    { name: 'Buse Akar', area: 'Giriş ve Bahçe' },
                    { name: 'Osman Kara', area: 'Fen Laboratuvarları' }
                ]
            },
            '7C': {
                homeroomTeacher: 'Figen E. KARAGÜZEL',
                currentLesson: {
                    name: 'Görsel Sanatlar',
                    time: '10:00 - 10:40',
                    teacher: 'Selin Tekin',
                    classroom: 'Sanat Odası'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Sosyal Bilgiler', teacher: 'Mehmet Kaya', classroom: '107', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Türkçe', teacher: 'Hasan Aydın', classroom: '107', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Görsel Sanatlar', teacher: 'Selin Tekin', classroom: 'Sanat Odası', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Matematik', teacher: 'Ahmet Yıldız', classroom: '107', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'Fen Bilimleri', teacher: 'Zeynep Korkmaz', classroom: 'Lab-1', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'İngilizce', teacher: 'David Smith', classroom: '203', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Müzik', teacher: 'Elif Güneş', classroom: 'Müzik Odası', status: 'upcoming' }
                ],
                substitutes: [],
                dutyTeachers: [
                    { name: 'Hasan Aydın', area: 'Bahçe ve Kantin' },
                    { name: 'Selin Tekin', area: 'Müzik ve Sanat Koridoru' }
                ]
            },
            '7D': {
                homeroomTeacher: 'Cem İ. BAĞRIAÇIK',
                currentLesson: {
                    name: 'Görsel Sanatlar',
                    time: '10:00 - 10:40',
                    teacher: 'Selin Tekin',
                    classroom: 'Sanat Odası'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Sosyal Bilgiler', teacher: 'Mehmet Kaya', classroom: '107', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Türkçe', teacher: 'Hasan Aydın', classroom: '107', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Görsel Sanatlar', teacher: 'Selin Tekin', classroom: 'Sanat Odası', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Matematik', teacher: 'Ahmet Yıldız', classroom: '107', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'Fen Bilimleri', teacher: 'Zeynep Korkmaz', classroom: 'Lab-1', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'İngilizce', teacher: 'David Smith', classroom: '203', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Müzik', teacher: 'Elif Güneş', classroom: 'Müzik Odası', status: 'upcoming' }
                ],
                substitutes: [],
                dutyTeachers: [
                    { name: 'Hasan Aydın', area: 'Bahçe ve Kantin' },
                    { name: 'Selin Tekin', area: 'Müzik ve Sanat Koridoru' }
                ]
            },
            '7E': {
                homeroomTeacher: 'S. Demet ÖZDOĞAN',
                currentLesson: {
                    name: 'Görsel Sanatlar',
                    time: '10:00 - 10:40',
                    teacher: 'Selin Tekin',
                    classroom: 'Sanat Odası'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Sosyal Bilgiler', teacher: 'Mehmet Kaya', classroom: '107', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Türkçe', teacher: 'Hasan Aydın', classroom: '107', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Görsel Sanatlar', teacher: 'Selin Tekin', classroom: 'Sanat Odası', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Matematik', teacher: 'Ahmet Yıldız', classroom: '107', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'Fen Bilimleri', teacher: 'Zeynep Korkmaz', classroom: 'Lab-1', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'İngilizce', teacher: 'David Smith', classroom: '203', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Müzik', teacher: 'Elif Güneş', classroom: 'Müzik Odası', status: 'upcoming' }
                ],
                substitutes: [],
                dutyTeachers: [
                    { name: 'Hasan Aydın', area: 'Bahçe ve Kantin' },
                    { name: 'Selin Tekin', area: 'Müzik ve Sanat Koridoru' }
                ]
            },
            '7F': {
                homeroomTeacher: 'Yasemin ERGEÇ',
                currentLesson: {
                    name: 'Görsel Sanatlar',
                    time: '10:00 - 10:40',
                    teacher: 'Selin Tekin',
                    classroom: 'Sanat Odası'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Sosyal Bilgiler', teacher: 'Mehmet Kaya', classroom: '107', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Türkçe', teacher: 'Hasan Aydın', classroom: '107', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Görsel Sanatlar', teacher: 'Selin Tekin', classroom: 'Sanat Odası', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Matematik', teacher: 'Ahmet Yıldız', classroom: '107', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'Fen Bilimleri', teacher: 'Zeynep Korkmaz', classroom: 'Lab-1', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'İngilizce', teacher: 'David Smith', classroom: '203', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Müzik', teacher: 'Elif Güneş', classroom: 'Müzik Odası', status: 'upcoming' }
                ],
                substitutes: [],
                dutyTeachers: [
                    { name: 'Hasan Aydın', area: 'Bahçe ve Kantin' },
                    { name: 'Selin Tekin', area: 'Müzik ve Sanat Koridoru' }
                ]
            },
            '7G': {
                homeroomTeacher: 'Cihan YÜKSEL',
                currentLesson: {
                    name: 'Görsel Sanatlar',
                    time: '10:00 - 10:40',
                    teacher: 'Selin Tekin',
                    classroom: 'Sanat Odası'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Sosyal Bilgiler', teacher: 'Mehmet Kaya', classroom: '107', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Türkçe', teacher: 'Hasan Aydın', classroom: '107', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Görsel Sanatlar', teacher: 'Selin Tekin', classroom: 'Sanat Odası', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Matematik', teacher: 'Ahmet Yıldız', classroom: '107', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'Fen Bilimleri', teacher: 'Zeynep Korkmaz', classroom: 'Lab-1', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'İngilizce', teacher: 'David Smith', classroom: '203', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Müzik', teacher: 'Elif Güneş', classroom: 'Müzik Odası', status: 'upcoming' }
                ],
                substitutes: [],
                dutyTeachers: [
                    { name: 'Hasan Aydın', area: 'Bahçe ve Kantin' },
                    { name: 'Selin Tekin', area: 'Müzik ve Sanat Koridoru' }
                ]
            },
            '7H': {
                homeroomTeacher: 'Zuhal HALICI',
                currentLesson: {
                    name: 'Görsel Sanatlar',
                    time: '10:00 - 10:40',
                    teacher: 'Selin Tekin',
                    classroom: 'Sanat Odası'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Sosyal Bilgiler', teacher: 'Mehmet Kaya', classroom: '107', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Türkçe', teacher: 'Hasan Aydın', classroom: '107', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Görsel Sanatlar', teacher: 'Selin Tekin', classroom: 'Sanat Odası', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Matematik', teacher: 'Ahmet Yıldız', classroom: '107', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'Fen Bilimleri', teacher: 'Zeynep Korkmaz', classroom: 'Lab-1', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'İngilizce', teacher: 'David Smith', classroom: '203', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Müzik', teacher: 'Elif Güneş', classroom: 'Müzik Odası', status: 'upcoming' }
                ],
                substitutes: [],
                dutyTeachers: [
                    { name: 'Hasan Aydın', area: 'Bahçe ve Kantin' },
                    { name: 'Selin Tekin', area: 'Müzik ve Sanat Koridoru' }
                ]
            },
            '8A': {
                homeroomTeacher: 'Saliha LİKOS',
                currentLesson: {
                    name: 'Sosyal Bilgiler',
                    time: '10:00 - 10:40',
                    teacher: 'Buse Akar',
                    classroom: '405'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Matematik', teacher: 'Kemal Demir', classroom: '405', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Fen Bilimleri', teacher: 'Osman Kara', classroom: 'Lab-2', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Sosyal Bilgiler', teacher: 'Buse Akar', classroom: '405', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Türkçe', teacher: 'Sevgi Yaman', classroom: '405', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'İngilizce', teacher: 'Sarah Johnson', classroom: '203', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'Beden Eğitimi', teacher: 'Can Demir', classroom: 'Spor Salonu', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Teknoloji Tasarım', teacher: 'Murat Şen', classroom: 'Teknoloji Sınıfı', status: 'upcoming' }
                ],
                substitutes: [],
                dutyTeachers: [
                    { name: 'Kemal Demir', area: 'Üst Kat Koridorları' },
                    { name: 'Sevgi Yaman', area: 'Kütüphane ve Okuma Alanları' }
                ]
            },
            '8B': {
                homeroomTeacher: 'Özlem ATEŞ',
                currentLesson: {
                    name: 'Görsel Sanatlar',
                    time: '10:00 - 10:40',
                    teacher: 'Selin Tekin',
                    classroom: 'Sanat Odası'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Sosyal Bilgiler', teacher: 'Mehmet Kaya', classroom: '107', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Türkçe', teacher: 'Hasan Aydın', classroom: '107', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Görsel Sanatlar', teacher: 'Selin Tekin', classroom: 'Sanat Odası', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Matematik', teacher: 'Ahmet Yıldız', classroom: '107', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'Fen Bilimleri', teacher: 'Zeynep Korkmaz', classroom: 'Lab-1', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'İngilizce', teacher: 'David Smith', classroom: '203', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Müzik', teacher: 'Elif Güneş', classroom: 'Müzik Odası', status: 'upcoming' }
                ],
                substitutes: [],
                dutyTeachers: [
                    { name: 'Hasan Aydın', area: 'Bahçe ve Kantin' },
                    { name: 'Selin Tekin', area: 'Müzik ve Sanat Koridoru' }
                ]
            },
            '8C': {
                homeroomTeacher: 'Seher YILMAZ',
                currentLesson: {
                    name: 'Görsel Sanatlar',
                    time: '10:00 - 10:40',
                    teacher: 'Selin Tekin',
                    classroom: 'Sanat Odası'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Sosyal Bilgiler', teacher: 'Mehmet Kaya', classroom: '107', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Türkçe', teacher: 'Hasan Aydın', classroom: '107', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Görsel Sanatlar', teacher: 'Selin Tekin', classroom: 'Sanat Odası', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Matematik', teacher: 'Ahmet Yıldız', classroom: '107', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'Fen Bilimleri', teacher: 'Zeynep Korkmaz', classroom: 'Lab-1', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'İngilizce', teacher: 'David Smith', classroom: '203', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Müzik', teacher: 'Elif Güneş', classroom: 'Müzik Odası', status: 'upcoming' }
                ],
                substitutes: [],
                dutyTeachers: [
                    { name: 'Hasan Aydın', area: 'Bahçe ve Kantin' },
                    { name: 'Selin Tekin', area: 'Müzik ve Sanat Koridoru' }
                ]
            },
            '8D': {
                homeroomTeacher: 'Eşref AKKAŞ',
                currentLesson: {
                    name: 'Görsel Sanatlar',
                    time: '10:00 - 10:40',
                    teacher: 'Selin Tekin',
                    classroom: 'Sanat Odası'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Sosyal Bilgiler', teacher: 'Mehmet Kaya', classroom: '107', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Türkçe', teacher: 'Hasan Aydın', classroom: '107', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Görsel Sanatlar', teacher: 'Selin Tekin', classroom: 'Sanat Odası', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Matematik', teacher: 'Ahmet Yıldız', classroom: '107', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'Fen Bilimleri', teacher: 'Zeynep Korkmaz', classroom: 'Lab-1', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'İngilizce', teacher: 'David Smith', classroom: '203', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Müzik', teacher: 'Elif Güneş', classroom: 'Müzik Odası', status: 'upcoming' }
                ],
                substitutes: [],
                dutyTeachers: [
                    { name: 'Hasan Aydın', area: 'Bahçe ve Kantin' },
                    { name: 'Selin Tekin', area: 'Müzik ve Sanat Koridoru' }
                ]
            },
            '8E': {
                homeroomTeacher: 'Merve A. TANK',
                currentLesson: {
                    name: 'Görsel Sanatlar',
                    time: '10:00 - 10:40',
                    teacher: 'Selin Tekin',
                    classroom: 'Sanat Odası'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Sosyal Bilgiler', teacher: 'Mehmet Kaya', classroom: '107', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Türkçe', teacher: 'Hasan Aydın', classroom: '107', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Görsel Sanatlar', teacher: 'Selin Tekin', classroom: 'Sanat Odası', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Matematik', teacher: 'Ahmet Yıldız', classroom: '107', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'Fen Bilimleri', teacher: 'Zeynep Korkmaz', classroom: 'Lab-1', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'İngilizce', teacher: 'David Smith', classroom: '203', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Müzik', teacher: 'Elif Güneş', classroom: 'Müzik Odası', status: 'upcoming' }
                ],
                substitutes: [],
                dutyTeachers: [
                    { name: 'Hasan Aydın', area: 'Bahçe ve Kantin' },
                    { name: 'Selin Tekin', area: 'Müzik ve Sanat Koridoru' }
                ]
            },
            '8F': {
                homeroomTeacher: 'Nesrin Eda TOZCU',
                currentLesson: {
                    name: 'Görsel Sanatlar',
                    time: '10:00 - 10:40',
                    teacher: 'Selin Tekin',
                    classroom: 'Sanat Odası'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Sosyal Bilgiler', teacher: 'Mehmet Kaya', classroom: '107', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Türkçe', teacher: 'Hasan Aydın', classroom: '107', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Görsel Sanatlar', teacher: 'Selin Tekin', classroom: 'Sanat Odası', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Matematik', teacher: 'Ahmet Yıldız', classroom: '107', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'Fen Bilimleri', teacher: 'Zeynep Korkmaz', classroom: 'Lab-1', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'İngilizce', teacher: 'David Smith', classroom: '203', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Müzik', teacher: 'Elif Güneş', classroom: 'Müzik Odası', status: 'upcoming' }
                ],
                substitutes: [],
                dutyTeachers: [
                    { name: 'Hasan Aydın', area: 'Bahçe ve Kantin' },
                    { name: 'Selin Tekin', area: 'Müzik ve Sanat Koridoru' }
                ]
            },
            '8G': {
                homeroomTeacher: 'Semra ÖZTÜRK',
                currentLesson: {
                    name: 'Görsel Sanatlar',
                    time: '10:00 - 10:40',
                    teacher: 'Selin Tekin',
                    classroom: 'Sanat Odası'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Sosyal Bilgiler', teacher: 'Mehmet Kaya', classroom: '107', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Türkçe', teacher: 'Hasan Aydın', classroom: '107', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Görsel Sanatlar', teacher: 'Selin Tekin', classroom: 'Sanat Odası', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Matematik', teacher: 'Ahmet Yıldız', classroom: '107', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'Fen Bilimleri', teacher: 'Zeynep Korkmaz', classroom: 'Lab-1', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'İngilizce', teacher: 'David Smith', classroom: '203', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Müzik', teacher: 'Elif Güneş', classroom: 'Müzik Odası', status: 'upcoming' }
                ],
                substitutes: [],
                dutyTeachers: [
                    { name: 'Hasan Aydın', area: 'Bahçe ve Kantin' },
                    { name: 'Selin Tekin', area: 'Müzik ve Sanat Koridoru' }
                ]
            },
            '8H': {
                homeroomTeacher: 'Celil ÖZTÜRK',
                currentLesson: {
                    name: 'Görsel Sanatlar',
                    time: '10:00 - 10:40',
                    teacher: 'Selin Tekin',
                    classroom: 'Sanat Odası'
                },
                schedule: [
                    { time: '08:30 - 09:10', subject: 'Sosyal Bilgiler', teacher: 'Mehmet Kaya', classroom: '107', status: 'completed' },
                    { time: '09:20 - 10:00', subject: 'Türkçe', teacher: 'Hasan Aydın', classroom: '107', status: 'completed' },
                    { time: '10:00 - 10:40', subject: 'Görsel Sanatlar', teacher: 'Selin Tekin', classroom: 'Sanat Odası', status: 'current' },
                    { time: '10:50 - 11:30', subject: 'Matematik', teacher: 'Ahmet Yıldız', classroom: '107', status: 'upcoming' },
                    { time: '11:40 - 12:20', subject: 'Fen Bilimleri', teacher: 'Zeynep Korkmaz', classroom: 'Lab-1', status: 'upcoming' },
                    { time: '13:00 - 13:40', subject: 'İngilizce', teacher: 'David Smith', classroom: '203', status: 'upcoming' },
                    { time: '13:50 - 14:30', subject: 'Müzik', teacher: 'Elif Güneş', classroom: 'Müzik Odası', status: 'upcoming' }
                ],
                substitutes: [],
                dutyTeachers: [
                    { name: 'Hasan Aydın', area: 'Bahçe ve Kantin' },
                    { name: 'Selin Tekin', area: 'Müzik ve Sanat Koridoru' }
                ]
            }
        };

        // DOM Elements
        const classCardsContainer = document.getElementById('class-cards-container');
        const classInfoContainer = document.getElementById('classInfoContainer');
        const classInfoTemplate = document.getElementById('classInfoTemplate');
        const classCardTemplate = document.getElementById('classCardTemplate');
        const notificationButton = document.getElementById('notificationButton');
        const notificationsDropdown = document.getElementById('notificationsDropdown');

        // Function to initialize the page
        function initializePage() {
            // Generate class cards
            generateClassCards();
            
            // Setup event listeners
            setupEventListeners();
            
            // Show 5A class data by default
            showClassInfo('5A');
            
            // Update current class indicator periodically
            setInterval(updateCurrentLessonIndicator, 60000);
        }

        // Function to generate class cards
        function generateClassCards() {
            // Clear container
            classCardsContainer.innerHTML = '';
            
            // Generate cards for each class
            for (const className in classData) {
                const classInfo = classData[className];
                
                // Clone the template
                const cardClone = classCardTemplate.content.cloneNode(true);
                
                // Set class name
                cardClone.querySelector('.class-name').textContent = className;
                
                // Set teacher name
                cardClone.querySelector('.teacher-name').textContent = `Sınıf Öğretmeni: ${classInfo.homeroomTeacher}`;
                
                // Set current lesson
                cardClone.querySelector('.current-lesson span').textContent = `Şu an: ${classInfo.currentLesson.name}`;
                
                // Check if there are any substitute teachers
                if (classInfo.substitutes && classInfo.substitutes.length > 0) {
                    const absentTeacherElement = cardClone.querySelector('.absent-teacher');
                    absentTeacherElement.classList.remove('hidden');
                    absentTeacherElement.querySelector('span span').textContent = `${classInfo.substitutes.length} Öğretmen Devamsız`;
                }
                
                // Add class name as data attribute
                const card = cardClone.querySelector('.class-card');
                card.dataset.className = className;
                
                // Add click event listener
                card.addEventListener('click', function() {
                    showClassInfo(this.dataset.className);
                    
                    // Update active state for cards
                    document.querySelectorAll('.class-card').forEach(card => {
                        card.classList.remove('from-blue-100', 'to-blue-200', 'border-blue-400');
                        card.classList.add('from-blue-50', 'to-blue-100', 'border-blue-200');
                    });
                    
                    this.classList.remove('from-blue-50', 'to-blue-100', 'border-blue-200');
                    this.classList.add('from-blue-100', 'to-blue-200', 'border-blue-400');
                });
                
                // Append the card to the container
                classCardsContainer.appendChild(cardClone);
            }
        }

        // Function to show class information
        function showClassInfo(className) {
            const classInfo = classData[className];
            
            if (!classInfo) return;
            
            // Clone the template
            const infoClone = classInfoTemplate.content.cloneNode(true);
            
            // Set class name
            infoClone.querySelector('#className').textContent = className;
            
            // Set last updated
            const now = new Date();
            const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                              now.getMinutes().toString().padStart(2, '0');
            infoClone.querySelector('#lastUpdated').textContent = `Son güncelleme: ${timeString}`;
            
            // Set current lesson information
            infoClone.querySelector('#currentLessonName').textContent = classInfo.currentLesson.name;
            infoClone.querySelector('#currentLessonTime').textContent = classInfo.currentLesson.time;
            infoClone.querySelector('#currentTeacher').textContent = `Öğretmen: ${classInfo.currentLesson.teacher}`;
            infoClone.querySelector('#currentClassroom').textContent = `Derslik: ${classInfo.currentLesson.classroom}`;
            
            // Generate schedule table
            const scheduleTable = infoClone.querySelector('#scheduleTable');
            scheduleTable.innerHTML = '';
            
            classInfo.schedule.forEach(lesson => {
                const row = document.createElement('tr');
                
                // Add status-based styling
                if (lesson.status === 'current') {
                    row.classList.add('bg-blue-50');
                } else if (lesson.status === 'completed') {
                    row.classList.add('text-gray-400');
                }
                
                // Time column
                const timeCell = document.createElement('td');
                timeCell.classList.add('py-2', 'px-4');
                timeCell.textContent = lesson.time;
                row.appendChild(timeCell);
                
                // Subject column
                const subjectCell = document.createElement('td');
                subjectCell.classList.add('py-2', 'px-4', 'font-medium');
                subjectCell.textContent = lesson.subject;
                row.appendChild(subjectCell);
                
                // Teacher column
                const teacherCell = document.createElement('td');
                teacherCell.classList.add('py-2', 'px-4');
                teacherCell.textContent = lesson.teacher;
                row.appendChild(teacherCell);
                
                // Classroom column
                const classroomCell = document.createElement('td');
                classroomCell.classList.add('py-2', 'px-4');
                classroomCell.textContent = lesson.classroom;
                row.appendChild(classroomCell);
                
                // Status column
                const statusCell = document.createElement('td');
                statusCell.classList.add('py-2', 'px-4');
                
                if (lesson.status === 'current') {
                    statusCell.innerHTML = '<span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Devam Ediyor</span>';
                } else if (lesson.status === 'completed') {
                    statusCell.innerHTML = '<span class="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">Tamamlandı</span>';
                } else {
                    statusCell.innerHTML = '<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Bekleniyor</span>';
                }
                
                row.appendChild(statusCell);
                
                scheduleTable.appendChild(row);
            });
            
            // Set substitute teachers information
            const substituteTeachersContainer = infoClone.querySelector('#substituteTeachers');
            
            if (classInfo.substitutes && classInfo.substitutes.length > 0) {
                substituteTeachersContainer.innerHTML = '';
                
                classInfo.substitutes.forEach(sub => {
                    const substituteDiv = document.createElement('div');
                    substituteDiv.classList.add('flex', 'items-center', 'text-yellow-800', 'mb-2');
                    substituteDiv.innerHTML = `
                        <i class="fas fa-user-clock mr-2"></i>
                        <span class="font-medium">${sub.originalTeacher}</span>
                        <span class="mx-2">→</span>
                        <span>${sub.substituteTeacher}</span>
                        <span class="ml-2 bg-yellow-200 px-2 py-1 rounded-full text-xs">${sub.reason}</span>
                    `;
                    
                    substituteTeachersContainer.appendChild(substituteDiv);
                });
            } else {
                substituteTeachersContainer.innerHTML = `
                    <div class="flex items-center text-yellow-800">
                        <i class="fas fa-info-circle mr-2"></i>
                        <span>Bugün devamsız öğretmen bulunmamaktadır.</span>
                    </div>
                `;
            }
            
            // Set duty teachers information
            const dutyTeachersContainer = infoClone.querySelector('#dutyTeachers');
            dutyTeachersContainer.innerHTML = '';
            
            classInfo.dutyTeachers.forEach(teacher => {
                const dutyTeacherDiv = document.createElement('div');
                dutyTeacherDiv.classList.add('bg-blue-50', 'border', 'border-blue-200', 'rounded-lg', 'p-4');
                dutyTeacherDiv.innerHTML = `
                    <div class="flex items-center">
                        <div class="bg-blue-100 text-blue-800 p-2 rounded-full mr-3">
                            <i class="fas fa-user"></i>
                        </div>
                        <div>
                            <div class="font-medium">${teacher.name}</div>
                            <div class="text-sm text-gray-600">${teacher.area}</div>
                        </div>
                    </div>
                `;
                
                dutyTeachersContainer.appendChild(dutyTeacherDiv);
            });
            
            // Clear container and append the new content
            classInfoContainer.innerHTML = '';
            classInfoContainer.appendChild(infoClone);
        }

        // Function to setup event listeners
        function setupEventListeners() {
            // Notification button click
            notificationButton.addEventListener('click', function() {
                notificationsDropdown.classList.toggle('hidden');
                
                // Reset notification badge
                document.getElementById('notificationBadge').classList.add('hidden');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(event) {
                if (!notificationButton.contains(event.target) && !notificationsDropdown.contains(event.target)) {
                    notificationsDropdown.classList.add('hidden');
                }
            });
            
            // Grade level filter buttons
            document.querySelectorAll('.grade-level-btn').forEach(button => {
                button.addEventListener('click', function() {
                    // Update active state
                    document.querySelectorAll('.grade-level-btn').forEach(btn => {
                        btn.classList.remove('bg-blue-600', 'text-white');
                        btn.classList.add('bg-gray-200', 'text-gray-700');
                    });
                    
                    this.classList.remove('bg-gray-200', 'text-gray-700');
                    this.classList.add('bg-blue-600', 'text-white');
                    
                    // Filter classes based on grade level
                    filterClasses(this.textContent);
                });
            });
            
            // Section filter buttons
            document.querySelectorAll('.section-btn').forEach(button => {
                button.addEventListener('click', function() {
                    // Update active state
                    document.querySelectorAll('.section-btn').forEach(btn => {
                        btn.classList.remove('bg-blue-600', 'text-white');
                        btn.classList.add('bg-gray-200', 'text-gray-700');
                    });
                    
                    this.classList.remove('bg-gray-200', 'text-gray-700');
                    this.classList.add('bg-blue-600', 'text-white');
                    
                    // Filter classes based on section
                    filterClassesBySection(this.textContent);
                });
            });
        }

        // Function to filter classes based on grade level
        function filterClasses(gradeLevel) {
            const classCards = document.querySelectorAll('.class-card');
            
            classCards.forEach(card => {
                const className = card.dataset.className;
                const classGradeLevel = className.charAt(0);
                
                if (classGradeLevel === gradeLevel) {
                    card.parentElement.classList.remove('hidden');
                } else {
                    card.parentElement.classList.add('hidden');
                }
            });
            
            // Update sections based on selected grade
            updateSections(gradeLevel);
        }

        // Function to filter classes based on section
        function filterClassesBySection(section) {
            const classCards = document.querySelectorAll('.class-card:not(.hidden)');
            
            classCards.forEach(card => {
                const className = card.dataset.className;
                const classSection = className.charAt(1);
                
                if (classSection === section) {
                    card.parentElement.classList.remove('hidden');
                } else {
                    card.parentElement.classList.add('hidden');
                }
            });
        }

        // Function to update sections based on selected grade
        function updateSections(gradeLevel) {
            const sectionsContainer = document.getElementById('sections-container');
            sectionsContainer.innerHTML = '';
            
            // Get unique sections for selected grade
            const sections = new Set();
            Object.keys(classData).forEach(className => {
                if (className.charAt(0) === gradeLevel) {
                    sections.add(className.charAt(1));
                }
            });
            
            // Create section buttons
            sections.forEach((section, index) => {
                const button = document.createElement('button');
                button.classList.add('section-btn', 'py-2', 'rounded-lg', 'font-medium');
                
                if (index === 0) {
                    button.classList.add('bg-blue-600', 'text-white');
                } else {
                    button.classList.add('bg-gray-200', 'text-gray-700');
                }
                
                button.textContent = section;
                
                button.addEventListener('click', function() {
                    // Update active state
                    document.querySelectorAll('.section-btn').forEach(btn => {
                        btn.classList.remove('bg-blue-600', 'text-white');
                        btn.classList.add('bg-gray-200', 'text-gray-700');
                    });
                    
                    this.classList.remove('bg-gray-200', 'text-gray-700');
                    this.classList.add('bg-blue-600', 'text-white');
                    
                    // Filter classes based on section
                    filterClassesBySection(this.textContent);
                });
                
                sectionsContainer.appendChild(button);
            });
        }

        // Function to update current lesson indicator
        function updateCurrentLessonIndicator() {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            
            // Update each class data with current lesson
            for (const className in classData) {
                const schedule = classData[className].schedule;
                let currentLesson = null;
                
                for (const lesson of schedule) {
                    const [startTime, endTime] = lesson.time.split(' - ');
                    const [startHour, startMinute] = startTime.split(':').map(Number);
                    const [endHour, endMinute] = endTime.split(':').map(Number);
                    
                    const lessonStartTime = startHour * 60 + startMinute;
                    const lessonEndTime = endHour * 60 + endMinute;
                    const currentTime = currentHour * 60 + currentMinute;
                    
                    if (currentTime >= lessonStartTime && currentTime < lessonEndTime) {
                        currentLesson = lesson;
                        break;
                    }
                }
                
                if (currentLesson) {
                    classData[className].currentLesson = {
                        name: currentLesson.subject,
                        time: currentLesson.time,
                        teacher: currentLesson.teacher,
                        classroom: currentLesson.classroom
                    };
                }
            }
            
            // Update UI to reflect the new current lessons
            updateClassCards();
            
            // Refresh currently shown class info if any
            const currentlyShownClass = document.querySelector('#className');
            if (currentlyShownClass) {
                showClassInfo(currentlyShownClass.textContent);
            }
        }

        // Function to update class cards
        function updateClassCards() {
            document.querySelectorAll('.class-card').forEach(card => {
                const className = card.dataset.className;
                const currentLesson = classData[className].currentLesson;
                
                card.querySelector('.current-lesson span').textContent = `Şu an: ${currentLesson.name}`;
            });
        }

        // Function to fetch data from server
        function fetchData() {
            // This function would be used to fetch real data from a backend
            // For now, we're using the sample data defined above
            
            // Example of how you would fetch from API
            /*
            fetch('/api/classes')
                .then(response => response.json())
                .then(data => {
                    classData = data;
                    updateUI();
                })
                .catch(error => {
                    console.error('Error fetching class data:', error);
                });
            */
            
            // Simulate real-time updates
            setInterval(simulateDataUpdates, 60000);
        }

        // Function to simulate data updates (for demo purposes)
        function simulateDataUpdates() {
            // Simulate a random teacher absence
            const randomClass = Object.keys(classData)[Math.floor(Math.random() * Object.keys(classData).length)];
            const randomClassData = classData[randomClass];
            
            // 10% chance of a teacher being absent
            if (Math.random() < 0.1 && randomClassData.substitutes.length === 0) {
                const randomScheduleIndex = Math.floor(Math.random() * randomClassData.schedule.length);
                const affectedLesson = randomClassData.schedule[randomScheduleIndex];
                
                // Create substitute teacher entry
                const availableTeachers = Object.values(classData)
                    .flatMap(c => c.schedule.map(s => s.teacher))
                    .filter(t => t !== affectedLesson.teacher);
                
                const substituteTeacher = availableTeachers[Math.floor(Math.random() * availableTeachers.length)];
                
                randomClassData.substitutes.push({
                    originalTeacher: affectedLesson.teacher,
                    substituteTeacher: substituteTeacher,
                    reason: Math.random() < 0.5 ? 'Rapor' : 'İzin'
                });
                
                // Update UI to show the change
                updateClassCards();
                showNotification(`${randomClass} sınıfının ${affectedLesson.subject} dersi için öğretmen değişikliği`);
            }
        }

        // Function to show a notification
        function showNotification(message) {
            // Show notification badge
            const badge = document.getElementById('notificationBadge');
            badge.classList.remove('hidden');
            
// Increment notification count
const currentCount = parseInt(badge.textContent);
badge.textContent = currentCount + 1;

// Add to notifications dropdown
const notificationsContainer = document.getElementById('notificationsDropdown').querySelector('.max-h-96');
const notificationElement = document.createElement('div');
notificationElement.classList.add('p-3', 'hover:bg-gray-50', 'border-b', 'border-gray-100');

notificationElement.innerHTML = `
    <div class="flex">
        <div class="flex-shrink-0 bg-yellow-100 rounded-full p-2">
            <i class="fas fa-user-clock text-yellow-600"></i>
        </div>
        <div class="ml-3">
            <p class="text-sm font-medium text-gray-800">Öğretmen Değişikliği</p>
            <p class="text-xs text-gray-500">${message}</p>
            <p class="text-xs text-gray-400 mt-1">Şimdi</p>
        </div>
    </div>
`;

notificationsContainer.insertBefore(notificationElement, notificationsContainer.firstChild);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    fetchData();
});

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const notificationContainer = document.getElementById('notificationContainer');
    const notificationsDropdown = document.getElementById('notificationsDropdown');
    
    if (!notificationContainer.contains(event.target)) {
        notificationsDropdown.classList.add('hidden');
    }
});