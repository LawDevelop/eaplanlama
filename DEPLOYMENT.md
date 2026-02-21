# Deployment Rehberi

## Vercel'e Deploy

### 1. Vercel Hesabı Oluştur

[Vercel](https://vercel.com) hesabı oluştur ve GitHub'ı bağla.

### 2. Projeyi Import Et

```bash
# Vercel CLI kur
npm i -g vercel

# Deploy
vercel
```

### 3. Environment Variables Ekle

Vercel Dashboard > Settings > Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 4. Telegram Webhook Güncelle

Deploy sonrası webhook URL'ini güncelle:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://your-domain.vercel.app/api/telegram/webhook"
```

## Supabase Edge Functions

### Deploy

```bash
supabase functions deploy daily-notifications
supabase functions deploy hearing-reminders
supabase functions deploy invoice-reminders
```

### Secrets Ayarla

```bash
supabase secrets set TELEGRAM_BOT_TOKEN=your_token
supabase secrets set TELEGRAM_CHAT_ID=your_chat_id
```

## Cron Jobs (Supabase)

Supabase Dashboard > Database > Extensions > pg_cron'u aktifleştir.

SQL Editor'de çalıştır:

```sql
-- Enable pg_cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Daily notifications at 10:00 AM (UTC)
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

-- Invoice reminders daily at 9:00 AM (UTC)
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

## Storage Bucket Oluştur

Supabase Dashboard > Storage > Create Bucket:

- Name: `documents`
- Public: `false`

Storage Policies (SQL Editor):

```sql
-- Users can upload their own documents
CREATE POLICY "Users can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can view their own documents
CREATE POLICY "Users can view documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own documents
CREATE POLICY "Users can delete documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## Production Checklist

- [ ] Supabase projesi oluşturuldu
- [ ] SQL şeması çalıştırıldı
- [ ] RLS politikaları aktif
- [ ] Storage bucket oluşturuldu
- [ ] Edge Functions deploy edildi
- [ ] Cron jobs ayarlandı
- [ ] Telegram bot oluşturuldu
- [ ] Telegram webhook ayarlandı
- [ ] Vercel'e deploy edildi
- [ ] Environment variables ayarlandı
- [ ] Domain bağlandı (opsiyonel)

## Monitoring

### Supabase Logs

Dashboard > Logs > Edge Functions

### Vercel Logs

Dashboard > Deployments > Logs

### Telegram Bot Test

```bash
# Test webhook
curl -X POST "https://your-domain.vercel.app/api/telegram/webhook" \
  -H "Content-Type: application/json" \
  -d '{"message":{"text":"/bugun","chat":{"id":"YOUR_CHAT_ID"}}}'
```
