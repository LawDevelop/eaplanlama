# Duruşmalar Modülü - Özellikler Listesi

## 🎯 Temel Özellikler (Uygulanacak)

### 1. Görünüm Modları
- **Liste Görünümü** - Klasik liste
- **Takvim Görünümü** - Aylık takvimde duruşmalar
- **Zaman Çizelgesi** - Kronolojik sıralama
- **Çöp Kutusu** - Silinen duruşmalar (7 gün)

### 2. Filtreleme & Arama
- Tarih aralığı filtresi
- Mahkeme bazlı filtreleme
- Durum filtresi (Planlandı, Ertelendi, Tamamlandı, İptal)
- Müvekkil bazlı arama
- Dosya numarası arama
- Kayıtlı filtreler

### 3. Duruşma Detayları
- Duruşma başlığı
- Müvekkil bilgileri
- Dosya numarası
- Mahkeme adı ve salon
- Duruşma tarihi ve saati
- Durum (Planlandı, Ertelendi, Tamamlandı, İptal)
- Notlar
- Ekler (belgeler)
- İlgili görevler
- Geçmiş (değişiklik logu)

### 4. Hatırlatıcılar
- 1 gün önce hatırlat
- 1 hafta önce hatırlat
- Özel hatırlatıcı
- E-posta bildirimi
- Telegram bildirimi
- SMS bildirimi (opsiyonel)

### 5. Toplu İşlemler
- Birden fazla duruşma seç
- Toplu erteleme
- Toplu iptal
- Toplu silme
- Toplu durum değiştirme

### 6. İstatistikler & Raporlar
- Toplam duruşma sayısı
- Yaklaşan duruşmalar
- Bu hafta/ay duruşmalar
- Tamamlanan duruşmalar
- Ertelenen duruşmalar
- İptal edilen duruşmalar
- Mahkeme bazlı dağılım
- Aylık duruşma grafiği
- Başarı oranı

### 7. Çöp Kutusu
- Silinen duruşmalar 7 gün saklanır
- Geri alma özelliği
- Kalıcı silme
- Otomatik temizleme (7 gün sonra)

---

## 🚀 Gelişmiş Özellikler

### 8. Duruşma Hazırlığı
- Hazırlık kontrol listesi
  - Dilekçe hazırlandı mı?
  - Belgeler toplandı mı?
  - Tanıklar bilgilendirildi mi?
  - Müvekkil ile görüşüldü mü?
- Hazırlık durumu (%)
- Eksik belgeler listesi

### 9. Duruşma Sonuçları
- Karar türü (Kabul, Red, Erteleme, vb.)
- Sonraki duruşma tarihi
- Mahkeme kararı özeti
- Karar belgesi ekleme
- Temyiz süresi takibi

### 10. Otomatik Görev Oluşturma
- Duruşma eklendiğinde:
  - 7 gün önce "Dilekçe hazırla" görevi
  - 3 gün önce "Belgeleri kontrol et" görevi
  - 1 gün önce "Müvekkil ile görüş" görevi
- Duruşma ertelendiğinde:
  - Yeni tarih için görevler oluştur
- Duruşma tamamlandığında:
  - "Karar belgesi al" görevi
  - "Müvekkile bilgi ver" görevi

### 11. Mahkeme Entegrasyonu
- UYAP entegrasyonu (gelecek)
- Otomatik duruşma çekme
- Duruşma değişikliklerini takip
- Mahkeme kararlarını çekme

### 12. Konum & Navigasyon
- Mahkeme konumu haritada göster
- Navigasyon başlat (Google Maps)
- Mahkemeye varış süresi
- Trafik durumu
- Park yeri önerileri

### 13. Duruşma Şablonları
- Sık kullanılan duruşma türleri
  - Boşanma davası
  - İş davası
  - Tazminat davası
  - İcra takibi
  - Ceza davası
- Şablon oluştur
- Şablondan duruşma ekle

### 14. Çakışma Kontrolü
- Aynı saatte başka duruşma var mı?
- Çakışan duruşmaları göster
- Alternatif tarih öner
- Çakışma uyarısı

### 15. Duruşma Kayıtları
- Ses kaydı
- Video kaydı (opsiyonel)
- Tutanak notları
- Otomatik transkripsiyon
- Kayıt arşivi

### 16. Masraf Takibi
- Duruşma masrafları
  - Harç
  - Ulaşım
  - Diğer masraflar
- Toplam masraf
- Müvekkile fatura

### 17. Tanık Yönetimi
- Tanık listesi
- Tanık iletişim bilgileri
- Tanık çağrısı durumu
- Tanık ifadeleri
- Tanık belgesi

### 18. Delil Yönetimi
- Delil listesi
- Delil türü (Belge, Fotoğraf, Video, vb.)
- Delil açıklaması
- Delil dosyaları
- Delil sunumu sırası

### 19. Karşı Taraf Bilgileri
- Karşı taraf avukatı
- İletişim bilgileri
- Önceki duruşma notları
- Strateji notları

### 20. Duruşma Sonrası Takip
- Sonraki adımlar
- Temyiz süresi
- İtiraz süresi
- Karar kesinleşme tarihi
- Takip görevleri

---

## 📊 Veritabanı Şeması Güncellemeleri

### Yeni Tablolar:

```sql
-- Duruşma hatırlatıcıları
CREATE TABLE hearing_reminders (
  id UUID PRIMARY KEY,
  hearing_id UUID REFERENCES hearings(id),
  remind_before_days INTEGER,
  reminder_type TEXT, -- 'email', 'telegram', 'sms'
  is_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ
);

-- Duruşma hazırlık kontrol listesi
CREATE TABLE hearing_checklist (
  id UUID PRIMARY KEY,
  hearing_id UUID REFERENCES hearings(id),
  item_title TEXT,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ
);

-- Duruşma sonuçları
CREATE TABLE hearing_results (
  id UUID PRIMARY KEY,
  hearing_id UUID REFERENCES hearings(id),
  decision_type TEXT, -- 'accepted', 'rejected', 'postponed'
  next_hearing_date TIMESTAMPTZ,
  decision_summary TEXT,
  decision_document_url TEXT,
  appeal_deadline DATE
);

-- Duruşma masrafları
CREATE TABLE hearing_expenses (
  id UUID PRIMARY KEY,
  hearing_id UUID REFERENCES hearings(id),
  expense_type TEXT, -- 'court_fee', 'transport', 'other'
  amount DECIMAL(10, 2),
  description TEXT,
  receipt_url TEXT
);

-- Tanıklar
CREATE TABLE witnesses (
  id UUID PRIMARY KEY,
  hearing_id UUID REFERENCES hearings(id),
  name TEXT,
  phone TEXT,
  email TEXT,
  is_notified BOOLEAN DEFAULT false,
  testimony TEXT
);

-- Deliller
CREATE TABLE evidence (
  id UUID PRIMARY KEY,
  hearing_id UUID REFERENCES hearings(id),
  evidence_type TEXT, -- 'document', 'photo', 'video', 'audio'
  title TEXT,
  description TEXT,
  file_url TEXT,
  presentation_order INTEGER
);

-- Duruşma kayıtları
CREATE TABLE hearing_recordings (
  id UUID PRIMARY KEY,
  hearing_id UUID REFERENCES hearings(id),
  recording_type TEXT, -- 'audio', 'video'
  file_url TEXT,
  duration_seconds INTEGER,
  transcription TEXT
);

-- Duruşma şablonları
CREATE TABLE hearing_templates (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT,
  hearing_type TEXT,
  default_checklist JSONB,
  default_reminders JSONB
);
```

### Güncellenecek Tablolar:

```sql
-- hearings tablosuna eklenecek alanlar
ALTER TABLE hearings ADD COLUMN deleted BOOLEAN DEFAULT false;
ALTER TABLE hearings ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE hearings ADD COLUMN permanent_delete_at TIMESTAMPTZ;
ALTER TABLE hearings ADD COLUMN preparation_progress INTEGER DEFAULT 0; -- 0-100
ALTER TABLE hearings ADD COLUMN location_lat DECIMAL(10, 8);
ALTER TABLE hearings ADD COLUMN location_lng DECIMAL(11, 8);
ALTER TABLE hearings ADD COLUMN opposing_lawyer TEXT;
ALTER TABLE hearings ADD COLUMN opposing_lawyer_phone TEXT;
ALTER TABLE hearings ADD COLUMN strategy_notes TEXT;
```

---

## 🎨 UI Bileşenleri

### Ana Bileşenler:
1. `hearings-view.tsx` - Ana sayfa
2. `hearing-detail-modal.tsx` - Detay modal
3. `hearing-calendar.tsx` - Takvim görünümü
4. `hearing-timeline.tsx` - Zaman çizelgesi
5. `add-hearing-modal.tsx` - Yeni duruşma
6. `hearing-stats-modal.tsx` - İstatistikler
7. `hearing-templates-modal.tsx` - Şablonlar
8. `hearing-checklist.tsx` - Hazırlık listesi
9. `hearing-result-modal.tsx` - Sonuç girişi
10. `bulk-hearing-edit-modal.tsx` - Toplu düzenleme

### Yardımcı Bileşenler:
- `swipeable-hearing.tsx` - Swipe ile sil/düzenle
- `hearing-card.tsx` - Duruşma kartı
- `hearing-filters.tsx` - Filtre bileşeni
- `hearing-reminder-settings.tsx` - Hatırlatıcı ayarları

---

## 📱 Kullanıcı Arayüzü

### Üst Butonlar:
1. **İstatistikler** (BarChart3) - Detaylı analitik
2. **Şablonlar** (FileText) - Duruşma şablonları
3. **Filtreler** (Filter) - Kayıtlı filtreler
4. **Toplu İşlem** (CheckSquare) - Bulk mode
5. **Dışa Aktar** (Download) - PDF/Excel export

### Görünüm Sekmeleri:
1. **Liste** - Klasik liste
2. **Takvim** - Aylık takvim
3. **Zaman Çizelgesi** - Kronolojik
4. **Çöp Kutusu** - Silinen duruşmalar

### Duruşma Detay Sekmeleri:
1. **Detaylar** - Temel bilgiler
2. **Hazırlık** - Kontrol listesi
3. **Notlar** - Duruşma notları
4. **Ekler** - Belgeler
5. **Tanıklar** - Tanık listesi
6. **Deliller** - Delil listesi
7. **Masraflar** - Masraf takibi
8. **Sonuç** - Duruşma sonucu
9. **Geçmiş** - Değişiklik logu

---

## 🔔 Bildirimler

### Otomatik Bildirimler:
- 7 gün önce: "Duruşmanıza 1 hafta kaldı"
- 3 gün önce: "Hazırlıklarınızı kontrol edin"
- 1 gün önce: "Yarın duruşmanız var"
- 2 saat önce: "Duruşmanıza 2 saat kaldı"
- Duruşma ertelendiğinde
- Duruşma iptal edildiğinde
- Yeni duruşma eklendiğinde

### Bildirim Kanalları:
- Uygulama içi bildirim
- E-posta
- Telegram
- SMS (opsiyonel)
- Push notification (mobil)

---

## 📈 İstatistikler

### Metrikler:
- Toplam duruşma sayısı
- Yaklaşan duruşmalar
- Bu hafta/ay duruşmalar
- Tamamlanan duruşmalar
- Ertelenen duruşmalar
- İptal edilen duruşmalar
- Ortalama hazırlık süresi
- Başarı oranı (kazanılan/kaybedilen)
- Mahkeme bazlı dağılım
- Aylık duruşma trendi

### Grafikler:
- Aylık duruşma bar chart
- Durum dağılımı pie chart
- Mahkeme dağılımı
- Başarı oranı trend
- Hazırlık durumu progress

---

## 🎯 Öncelik Sıralaması

### Yüksek Öncelik (Hemen):
1. ✅ Modern liste görünümü
2. ✅ Takvim görünümü
3. ✅ Çöp kutusu
4. ✅ Duruşma detay modal
5. ✅ Tarih aralığı filtresi
6. ✅ Toplu işlemler
7. ✅ İstatistikler
8. ✅ Hatırlatıcılar
9. ✅ Hazırlık kontrol listesi
10. ✅ Swipe ile sil/düzenle

### Orta Öncelik:
11. Duruşma şablonları
12. Duruşma sonuçları
13. Otomatik görev oluşturma
14. Çakışma kontrolü
15. Masraf takibi

### Düşük Öncelik (Gelecek):
16. UYAP entegrasyonu
17. Konum & navigasyon
18. Ses/video kayıt
19. Tanık yönetimi
20. Delil yönetimi

---

## 💡 Ek Fikirler

1. **Duruşma Simülasyonu** - Duruşma öncesi pratik yapma
2. **Hukuki Araştırma** - İlgili içtihatlar
3. **Duruşma Raporu** - Otomatik rapor oluşturma
4. **Müvekkil Portalı** - Müvekkilin duruşmaları görmesi
5. **Avukat Asistanı AI** - Duruşma önerileri
6. **Duruşma Analizi** - Geçmiş duruşma analizi
7. **Benchmark** - Diğer avukatlarla karşılaştırma
8. **Duruşma Takvimi Paylaşımı** - Takım ile paylaş
9. **Duruşma Videosu** - Duruşma kaydı izleme
10. **Duruşma Özeti** - AI ile otomatik özet

---

## 🚀 Sonuç

Toplam **20+ özellik** planlandı. İlk aşamada **10 yüksek öncelikli** özellik uygulanacak.

**Tahmini Süre:** 2-3 saat
**Kod Satırı:** ~2500+ satır
**Yeni Bileşen:** 10+
**Yeni Tablo:** 8+
