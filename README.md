# Hukuk Bürosu Yönetim Sistemi

Mobil-öncelikli, Next.js ve Supabase tabanlı hukuk bürosu yönetim, finans ve görev otomasyon sistemi.

## 🚀 Özellikler

- ✅ Görev ve duruşma yönetimi (swipe actions ile)
- 💰 Gelir/gider takibi ve fatura hatırlatmaları
- 📅 Takvim görünümü
- 🔔 Telegram bot entegrasyonu
- 📱 Mobil-öncelikli tasarım (Bottom Navigation)
- 🌓 Dark/Light mode
- 📁 Dosya yönetimi (Supabase Storage)
- 🔐 Güvenli kimlik doğrulama (RLS)

## 📦 Kurulum

### 1. Bağımlılıkları Yükle

```bash
npm install
```

### 2. Supabase Projesini Oluştur

1. [Supabase Dashboard](https://app.supabase.com)'a git
2. Yeni proje oluştur
3. `supabase-schema.sql` dosyasındaki SQL kodunu SQL Editor'de çalıştır
4. Storage'da `documents` bucket'ı oluştur

### 3. Ortam Değişkenlerini Ayarla

`.env.local.example` dosyasını `.env.local` olarak kopyala ve değerleri doldur:

```bash
cp .env.local.example .env.local
```

### 4. Telegram Bot Kurulumu

1. [@BotFather](https://t.me/botfather) ile yeni bot oluştur
2. Bot token'ı al
3. [@userinfobot](https://t.me/userinfobot) ile chat ID'ni öğren
4. `.env.local` dosyasına ekle

### 5. Supabase Edge Functions Deploy

```bash
# Supabase CLI kur
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy daily-notifications
supabase functions deploy hearing-reminders
supabase functions deploy invoice-reminders

# Set secrets
supabase secrets set TELEGRAM_BOT_TOKEN=your_token
supabase secrets set TELEGRAM_CHAT_ID=your_chat_id
```

### 6. Cron Jobs Ayarla

Supabase Dashboard > Database > Cron Jobs:

```sql
-- Daily notifications at 10:00 AM
SELECT cron.schedule(
  'daily-notifications',
  '0 10 * * *',
  $$
  SELECT net.http_post(
    url:='https://your-project.supabase.co/functions/v1/daily-notifications',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  ) AS request_id;
  $$
);

-- Hearing reminders every hour
SELECT cron.schedule(
  'hearing-reminders',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url:='https://your-project.supabase.co/functions/v1/hearing-reminders',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  ) AS request_id;
  $$
);

-- Invoice reminders daily at 9:00 AM
SELECT cron.schedule(
  'invoice-reminders',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url:='https://your-project.supabase.co/functions/v1/invoice-reminders',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  ) AS request_id;
  $$
);
```

### 7. Telegram Webhook Ayarla

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://your-domain.com/api/telegram/webhook"
```

## 🏃 Çalıştırma

```bash
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini aç.

## 📱 Kullanım

### Telegram Bot Komutları

- `/bugun` - Bugünkü görevler
- `/durusmalar` - Yaklaşan duruşmalar
- `/gelirler` - Aylık gelir özeti
- `/yardim` - Yardım mesajı

### Mobil Swipe Actions

- **Sağa kaydır** → Görevi tamamla
- **Sola kaydır** → Görevi sil

## 🏗️ Proje Yapısı

```
├── app/                    # Next.js App Router
│   ├── page.tsx           # Ana sayfa (Dashboard)
│   ├── calendar/          # Takvim sayfası
│   ├── finance/           # Finans sayfası
│   ├── add/               # Yeni ekleme sayfası
│   ├── settings/          # Ayarlar sayfası
│   └── api/               # API routes
├── components/            # React bileşenleri
│   ├── dashboard/         # Dashboard bileşenleri
│   ├── forms/             # Form bileşenleri
│   ├── layout/            # Layout bileşenleri
│   ├── search/            # Arama bileşenleri
│   ├── settings/          # Ayar bileşenleri
│   ├── tasks/             # Görev bileşenleri
│   └── ui/                # Shadcn/ui bileşenleri
├── lib/                   # Utility fonksiyonlar
│   ├── supabase/          # Supabase client'lar
│   ├── telegram.ts        # Telegram helper'lar
│   └── utils.ts           # Genel utility'ler
├── supabase/
│   └── functions/         # Edge Functions
└── supabase-schema.sql    # Veritabanı şeması
```

## 🎨 Teknoloji Yığını

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Swipe**: react-swipeable
- **Theme**: next-themes

## 📝 Lisans

MIT
