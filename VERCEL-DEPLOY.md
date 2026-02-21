# Vercel Deploy Rehberi

## 🚀 Vercel'e Deployment Adımları

### 1. Vercel'de Proje Oluşturma

1. [Vercel Dashboard](https://vercel.com/dashboard)'a gidin
2. **"Add New..."** > **"Project"** butonuna tıklayın
3. **"Import Git Repository"** seçeneğini seçin
4. GitHub hesabınızı bağlayın (henüz bağlı değilse)
5. `LawDevelop/eaplanlama` repository'sini bulun ve **"Import"** yapın

### 2. Proje Ayarları

#### Framework Preset
- **Framework:** Next.js (otomatik algılanır)
- **Build Command:** `npm run build` (varsayılan)
- **Output Directory:** `.next` (varsayılan)
- **Install Command:** `npm install` (varsayılan)

#### Root Directory
- **Root Directory:** `./` (proje kök dizini)

### 3. Environment Variables (Ortam Değişkenleri)

Aşağıdaki environment variables'ları ekleyin:

#### Gerekli Değişkenler:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

#### Opsiyonel Değişkenler (Telegram entegrasyonu için):

```env
# Telegram Bot (Opsiyonel)
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-chat-id
```

#### Environment Variables Ekleme:
1. Vercel proje ayarlarında **"Environment Variables"** sekmesine gidin
2. Her bir değişken için:
   - **Name:** Değişken adı (örn: `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value:** Değişken değeri
   - **Environment:** Production, Preview, Development (hepsini seçin)
3. **"Save"** butonuna tıklayın

### 4. Supabase Ayarları

#### Supabase Dashboard'da:

1. [Supabase Dashboard](https://supabase.com/dashboard)'a gidin
2. Projenizi seçin
3. **Settings** > **API** bölümüne gidin
4. Aşağıdaki değerleri kopyalayın:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

#### Supabase Authentication Callback URL:

1. Supabase Dashboard > **Authentication** > **URL Configuration**
2. **Site URL:** `https://your-domain.vercel.app`
3. **Redirect URLs** ekleyin:
   ```
   https://your-domain.vercel.app/auth/callback
   https://your-domain.vercel.app/login
   https://your-domain.vercel.app
   ```

### 5. Deploy

1. Tüm ayarları yaptıktan sonra **"Deploy"** butonuna tıklayın
2. Vercel otomatik olarak projeyi build edip deploy edecektir
3. Deploy tamamlandığında size bir domain verilecektir (örn: `eaplanlama.vercel.app`)

### 6. Custom Domain (Opsiyonel)

Kendi domain'inizi bağlamak için:

1. Vercel Dashboard > **Settings** > **Domains**
2. **"Add"** butonuna tıklayın
3. Domain adınızı girin (örn: `eaplanlama.com`)
4. DNS kayıtlarını domain sağlayıcınızda güncelleyin:
   ```
   Type: CNAME
   Name: www (veya @)
   Value: cname.vercel-dns.com
   ```

## 🔄 Otomatik Deployment

GitHub'a her push yaptığınızda Vercel otomatik olarak:
- **main branch** → Production deployment
- **Diğer branch'ler** → Preview deployment

## 🧪 Test Etme

Deployment tamamlandıktan sonra:

1. Verilen URL'yi ziyaret edin
2. `/login` sayfasını test edin
3. Dashboard'u test edin
4. Authentication'ı test edin (Supabase ile)

## ⚙️ Build & Output Ayarları

### Next.js Configuration
Proje zaten optimize edilmiş Next.js ayarlarına sahip:

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig
```

### Node Version
Vercel otomatik olarak en son LTS Node.js versiyonunu kullanır. Özel bir versiyon istiyorsanız `package.json`'a ekleyin:

```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## 🐛 Troubleshooting

### Build Hataları

**Problem:** Build sırasında hata alıyorsanız
**Çözüm:** 
- Vercel build logs'ları kontrol edin
- Lokal olarak `npm run build` çalıştırın ve hataları düzeltin
- GitHub'a push edin, Vercel otomatik re-deploy eder

### Environment Variables

**Problem:** Supabase bağlanamıyor
**Çözüm:**
- Environment variables'ların doğru ayarlandığını kontrol edin
- `NEXT_PUBLIC_` prefix'i olan değişkenlerin client-side'da kullanılabilir olduğunu unutmayın
- Vercel Dashboard > Settings > Environment Variables'dan değerleri kontrol edin

### Middleware Redirects

**Problem:** Sayfalar açılmıyor, sürekli redirect oluyor
**Çözüm:**
- Supabase callback URL'lerinin doğru ayarlandığını kontrol edin
- Middleware.ts dosyasının production ortamında çalıştığını doğrulayın

## 📊 Monitoring

Vercel Dashboard'dan:
- **Analytics:** Sayfa görüntülemeleri, kullanıcı istatistikleri
- **Logs:** Runtime ve build logs
- **Deployments:** Deployment geçmişi ve rollback

## 🔐 Güvenlik

1. **Environment Variables:** Hassas bilgileri asla kodda tutmayın
2. **Service Role Key:** Bu key'i sadece server-side'da kullanın
3. **CORS:** Supabase'de production domain'inizi whitelist'e ekleyin
4. **Rate Limiting:** Supabase'de rate limiting ayarlarını yapın

## ✅ Checklist

Deployment öncesi kontrol listesi:

- [ ] GitHub repository'sine pushlandı
- [ ] `.env.local.example` dosyası güncellendi
- [ ] Supabase credentials hazır
- [ ] Vercel hesabı oluşturuldu
- [ ] Environment variables ayarlandı
- [ ] Supabase callback URLs ayarlandı
- [ ] Build lokal olarak başarılı
- [ ] .gitignore dosyası düzgün yapılandırılmış

## 🎯 Production URL Örnekleri

Deploy tamamlandıktan sonra şu URL'ler çalışır olacak:

- **Production:** `https://eaplanlama.vercel.app`
- **Login:** `https://eaplanlama.vercel.app/login`
- **Dashboard:** `https://eaplanlama.vercel.app/`
- **Tasks:** `https://eaplanlama.vercel.app/tasks`
- **Hearings:** `https://eaplanlama.vercel.app/hearings`

## 📞 Destek

Herhangi bir sorunla karşılaşırsanız:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
