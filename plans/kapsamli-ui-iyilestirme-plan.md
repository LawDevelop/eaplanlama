# Kapsamlı UI/UX İyileştirme Planı

## 📊 Mevcut Durum Analizi

### Tespit Edilen Sorunlar:
1. **Login sayfasında sidebar görünüyor** - Root layout her zaman sidebar render ediyor
2. **Sidebar daraltma durumu kayboluyor** - Sayfa yenilenince resetleniyor
3. **Dashboard hızlı işlemler çalışmıyor** - Butonlar sadece görsel
4. **Mobil uyumluluk sorunları** - Bazı sayfalarda responsive sorunlar var
5. **Modal taşma sorunları** - İstatistik modalleri sayfadan taşıyor
6. **Görev ekleme modal pozisyonu** - Kullanıcı sağ altta istiyor
7. **Sadece swipe ile silme/tamamlama** - Butonlar da isteniyor
8. **Sadece bugünkü görünüm** - Bu hafta görünümü de isteniyor (varsayılan)
9. **Duruşma düzenleme yok** - Sadece ekleme var
10. **Takvim entegrasyonu eksik** - Görevler/duruşmalar takvimde görünmüyor

---

## 🎯 İyileştirme Planı

### PHASE 1: Temel Yapı Düzeltmeleri

#### 1.1 Sidebar Login Sayfasında Gizle
- **Dosya**: `app/layout.tsx`
- **Değişiklik**: pathname kontrolü ile `/login` sayfasında sidebar'ı gizle
```tsx
const pathname = usePathname()
const isLoginPage = pathname?.startsWith('/login')
{!isLoginPage && <DesktopSidebar />}
```

#### 1.2 Sidebar Daraltma Durumu Kaydet
- **Dosya**: `components/layout/desktop-sidebar.tsx`
- **Değişiklik**: `localStorage` ile collapsed durumunu kaydet
```tsx
const [collapsed, setCollapsed] = useState(() => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('sidebar-collapsed') === 'true'
  }
  return false
})
```

---

### PHASE 2: Dashboard Yeniden Tasarım

#### 2.1 Gelişmiş Dashboard Bileşeni
- **Dosya**: `components/dashboard/dashboard-view.tsx`
- **Özellikler**:
  - Bugün/Bu Hafta toggle (Bu Hafta varsayılan)
  - Quick Actions butonları gerçek işlevsellik
  - Daha iyi görsel hiyerarşi
  - Responsive grid sistemi

#### 2.2 Dashboard Kart Bileşenleri
```
┌─────────────────────────────────────────────────────────────┐
│  HOŞGELDİNİZ                                                  │
│  Güneaydın, Avukat Bey 👋                                   │
│  21 Şubat Perşembe                                           │
├─────────────────────────────────────────────────────────────┤
│  [🔍 Arama Kutusu]                                          │
├─────────────────────────────────────────────────────────────┤
│  [📊 Bugün] [📅 Bu Hafta] ← Toggle (Varsayılan: Bu Hafta)  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  DURUŞMALAR (Bu Hafta: 5)                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 🟢 10:00 Boşanma Davası - Salon 3        [→] [✓]    │   │
│  │ 🟡 14:00 İş Davası - Salon 1                [→] [✓]    │   │
│  │ ⚪ 25 Şub Tazminat Davası - Salon 2         [→] [✓]    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  GÖREVLER (Bu Hafta: 12)                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 🔴 Dilekçe hazırla                        [→] [✓]    │   │
│  │ 🟡 Belge toplama                         [→] [✓]    │   │
│  │ ⚪ Dosya inceleme                        [→] [✓]    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

### PHASE 3: Mobil Uyumluluk

#### 3.1 Responsive Grid Sistemi
- **Dosya**: `app/globals.css`
- **Özellikler**:
  - Tüm kartlar ekran genişliğine göre otomatik yeniden boyutlanır
  - Mobilde tek sütun, tablet'de 2 sütun, desktop'ta 3 sütun
  - Safe area desteği (iPhone çentikleri için)

#### 3.2 Mobil Buton Boyutları
- Minimum 44x44px dokunma alanı
- Readable font sizes (min 16px body)

---

### PHASE 4: Görevler Sayfası İyileştirmeleri

#### 4.1 Görev Listesi Kartları
- **Dosya**: `components/tasks/tasks-view.tsx`
- **Özellikler**:
  - Her görev kartında açık sil ve tamamlama butonları
  - Swipe + buton kombinasyonu
  - Düzenleme butonu

```
┌─────────────────────────────────────────────────────────────┐
│  GÖREVLER                                                     │
│  [📋 Tümü] [📅 Bugün] [📅 Bu Hafta] [⚙️ Filtre]            │
│  [📊 İstatistik] [➕ Yeni Görev]                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  🔴 Dilekçe hazırla                    [düzenle]            │
│  Mehmet Demir • 2024/123                                     │
│  Son: 22 Şubat 2024                    [✓] [🗑️]             │
│                                                               │
│  🟡 Belge toplama                      [düzenle]            │
│  Ayşe Kaya • 2024/124                                        │
│  Son: 23 Şubat 2024                      [✓] [🗑️]         │
└─────────────────────────────────────────────────────────────┘
```

#### 4.2 İstatistik Modal Düzeltmesi
- **Dosya**: `components/tasks/task-stats-modal.tsx`
- Modal overflow yerine scrollable içeri
- Aşağı sürükleyebilir (drag down to close)

#### 4.3 Görev Ekleme Modal Pozisyonu
- **Dosya**: `components/modals/add-task-modal.tsx`
- Sağ alt köşede floating button
- Tıklayınca modal açılır

---

### PHASE 5: Duruşmalar Sayfası İyileştirmeleri

#### 5.1 Duruşma Listesi Kartları
- **Dosya**: `components/hearings/hearings-view.tsx`
- **Özellikler**:
  - Sil, tamamlama ve düzenleme butonları
  - Bugün/Bu Hafta toggle (Bu Hafta varsayılan)
  - Hazırlık progress bar'ı

```
┌─────────────────────────────────────────────────────────────┐
│  DURUŞMALAR                                                  │
│  [📋 Tümü] [📅 Bugün] [📅 Bu Hafta] [🗓️ Takvim]            │
│  [📊 İstatistik] [➕ Yeni Duruşma]                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  🔴 Boşanma Davası                      [düzenle]         │
│  Ahmet Yılmaz • Ankara 5. Aile Mah.                          │
│  25 Şub 10:00 • Salon 3                    [✓] [🗑️]       │
│  Hazırlık: ███████░░░ 75%                                   │
│                                                               │
│  🟡 İş Davası                          [düzenle]         │
│  Zeynep Kara • İstanbul 12. İş Mah.                          │
│  28 Şub 14:00 • Salon 1                    [✓] [🗑️]       │
│  Hazırlık: ██████░░░░░ 45%                                   │
└─────────────────────────────────────────────────────────────┘
```

#### 5.2 Duruşma Düzenleme Modalı
- Mevcut AddHearingForm'u edit için de kullanılabilir yap

---

### PHASE 6: Modern UI Tasarım

#### 6.1 Güncellenmiş CSS Değişkenleri
- **Dosya**: `app/globals.css`
- Yeni renk paleti
- Yeni shadow sistemi
- Yeni border radius değerleri

#### 6.2 Button Tasarımları
- Primary, Secondary, Danger, Success varyasyonları
- Hover ve active durumları
- Loading state'i

#### 6.3 Card Tasarımları
- Glassmorphism efekti
- Gradient borders
- Hover efektleri

---

### PHASE 7: Takvim Entegrasyonu

#### 7.1 Takvim Bileşeni Güncellemesi
- **Dosya**: `components/calendar/calendar-view.tsx`
- **Özellikler**:
  - Görevleri takvimde göster (badge veya nokta olarak)
  - Duruşmaları takvimde göster (renkli noktalar)
  - Tıklayınca detay modal'ı açılır

#### 7.2 Unified Calendar
- Tüm etkinlikleri tek bir takvimde göster
- Renk kodlaması:
  - 🔵 Mavi: Duruşmalar
  - 🟣 Mor: Görevler
  - 🟢 Yeşil: Tamamlananlar

---

## 📁 Etkilenecek Dosyalar

### Yeni Dosyalar:
- `components/dashboard/week-hearings.tsx` - Bu haftaki duruşmalar
- `components/dashboard/week-tasks.tsx` - Bu haftaki görevler
- `components/ui/action-buttons.tsx` - Aksiyon butonları bileşeni
- `hooks/use-sidebar-persist.ts` - Sidebar persist hook

### Güncellenecek Dosyalar:
- `app/layout.tsx` - Login kontrolü
- `app/globals.css` - Responsive ve modern CSS
- `components/layout/desktop-sidebar.tsx` - Persist ekle
- `components/dashboard/dashboard-view.tsx` - Yeniden tasarım
- `components/dashboard/today-hearings.tsx` - Aksiyon butonları
- `components/dashboard/weekly-tasks.tsx` - Aksiyon butonları
- `components/tasks/tasks-view.tsx` - Butonlar, mobil fix
- `components/tasks/task-stats-modal.tsx` - Overflow fix
- `components/modals/add-task-modal.tsx` - Pozisyon değişikliği
- `components/hearings/hearings-view.tsx` - Butonlar, mobil fix
- `components/hearings/hearing-stats-modal.tsx` - Overflow fix
- `components/forms/add-hearing-form.tsx` - Edit desteği
- `components/calendar/calendar-view.tsx` - Görev/duruşma gösterimi

---

## 🎨 Tasarım Prensipleri

### Renk Paleti
```
Primary:    #1e3a8a (Koyu Mavi)
Secondary:  #64748b (Gri)
Success:    #10b981 (Yeşil)
Warning:    #f59e0b (Turuncu)
Danger:     #ef4444 (Kırmızı)
Info:       #3b82f6 (Açık Mavi)
Background: #f8fafc (Açık Gri)
Surface:    #ffffff (Beyaz)
```

### Typography
- Headings: Poppins Bold 700
- Body: Poppins Regular 400
- Small: Poppins Light 300

### Spacing
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

---

## ✅ Kullanıcı Onayı

Bu planı onaylıyor musunuz? Değişiklik önerileriniz varsa lütfen belirtin.

Onaylarsanız Code mode'a geçip adım adım uygulayacağım.
