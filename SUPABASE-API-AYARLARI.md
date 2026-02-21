# Supabase API Anahtarları - Nasıl Bulunur ve Kaydedilir

## 🔑 Supabase API Anahtarlarını Bulma

### Adım 1: Supabase Dashboard'a Giriş

1. [supabase.com](https://supabase.com) adresine gidin
2. Email ve şifrenizle giriş yapın
3. Ana sayfada projenizi göreceksiniz, projenizin üzerine tıklayın

### Adım 2: Settings > API Bölümü

Projenin içindeyken sol menüden:

1. ⚙️ **Settings** ikonuna tıklayın (en altta)
2. Açılan menüden **API** seçeneğine tıklayın

### Adım 3: API Anahtarlarını Görme ve Kopyalama

**API** sayfasında şunları göreceksiniz:

```
┌─────────────────────────────────────────────────────────┐
│  Project URL                                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │ https://abc123xyz.supabase.co          [Copy] │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  Project API keys                                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │ anon public                           [Copy/Regenerate] │  │
│  │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...         │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ service_role secret                    [Copy/Regenerate] │  │
│  │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...         │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Hangi değerin ne olduğunu anlayın:**

| Gördüğünüz | Kopyalayın | Environment Variable |
|------------|-----------|---------------------|
| Project URL kutusundaki URL | `https://abc123xyz.supabase.co` | `NEXT_PUBLIC_SUPABASE_URL` |
| "anon public" kutusundaki değer | Uzumn JWT token | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| "service_role secret" kutusundaki değer | Uzumn JWT token | `SUPABASE_SERVICE_ROLE_KEY` |

---

## 📝 .env.local Dosyasını Oluşturma ve Kaydetme

### Yöntem 1: VS Code ile (Önerilen)

1. VS Code'da projeyi açın
2. `Ctrl + N` ile yeni dosya oluşturun
3. `.env.local` yazın (dot ile başlıyor!)
4. Aşağıdaki içeriği yapıştırın:

```env
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon_key_buraya_gelecek
SUPABASE_SERVICE_ROLE_KEY=service_role_key_buraya_gelecek
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Project URL, anon key ve service_role key değerlerini kendi değerlerinizle değiştirin
6. `Ctrl + S` ile kaydedin (proje kök dizinine kaydedilmeli)

### Yöntem 2: Komut Satırı ile

```bash
# Windows CMD/PowerShell
cd C:\Users\avemr\OneDrive\Masaüstü\HATIRLATICI
notepad .env.local

# Veya PowerShell'de
New-Item -Path .env.local -ItemType File
code .env.local
```

---

## 🔍 Görsel Rehber - Ekran Görüntüsü ile

```
Supabase Dashboard
│
└─> Projenizi Seçin
     │
     └─> Sol Menüden ⚙️ Settings
          │
          └─> API Sekmesini Tıklayın
               │
               ┌─────────────────────────────────────────────────────────────┐
               │  Project API Configuration                                  │
               │  ┌─────────────────────────────────────────────────────────┐  │
               │  │ Project URL                                          │  │
               │  │ [https://abc123xyz.supabase.co              📋]  │  │
               │  │                                                       │  │
               │  │ Project API Keys                                      │  │
               │  │                                                       │  │
               │  │ anon public key                  📋 🔁              │  │
               │  │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhd...  │  │
               │  │                                                       │  │
               │  │ service_role secret key            📋 🔁              │  │
               │  │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhd...  │  │
               │  └─────────────────────────────────────────────────────────┘  │
               └─────────────────────────────────────────────────────────────┘
```

---

## ⚠️ ÖNEMLİ GÜVENLİK UYARILARI

### 1. .env.local Dosyası Git'e Push Edilmez
`.gitignore` dosyası zaten bunu içeriyor, ancak kontrol edin:

```gitignore
# .gitignore dosyasında bu satır olmalı
.env.local
.env*.local
```

### 2. API Anahtarlarını Asla Paylaşmayın
- ✅ `.env.local` dosyası local'de kalır
- ✅ GitHub'a push edilmez (gitignore sayesinde)
- ❌ API anahtarlarını asla kod içinde kullanmayın
- ❌ API anahtarlarını hiçbir yere yapıştırmayın

### 3. Service Role Key Önemli
- `service_role` key admin yetkilerine sahiptir
- Sadece sunucu tarafında (server-side) kullanılır
- Client-side'da asla kullanılmamalı

---

## 🖥️ Tamamlanmış .env.local Dosyası Örneği

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://abcxyz123def.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_W0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🔐 Nasıl Çalışır?

```
┌────────────────────────────────────────────────────────────┐
│  .env.local (Lokal - Git'e DEĞİL)                          │
│  ┌────────────────────────────────────────────────────────┐│
│  │ NEXT_PUBLIC_SUPABASE_URL=...                          ││
│  │ NEXT_PUBLIC_SUPABASE_ANON_KEY=...                     ││
│  └────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────┘
                           │
                           │ Next.js otomatik okur
                           ▼
┌────────────────────────────────────────────────────────────┐
│  Uygulama (Browser)                                        │
│  - Veritabanı bağlantısı                                  │
│  - Authentication                                         │
│  - CRUD işlemleri                                        │
└────────────────────────────────────────────────────────────┘
```

---

## 🚀 Sonraki Adımlar

.env.local dosyasını oluşturduktan sonra:

1. **Dev server'ı yeniden başlatın:**
   ```bash
   npm run dev
   ```

2. **Tarayıcıyı açın:**
   ```
   http://localhost:3000/login
   ```

3. **Test edin:**
   - Supabase'de oluşturduğunuz kullanıcı ile giriş yapın
   - Dashboard'a yönlendirilmelisiniz

---

## 📱 Vercel İçin Environment Variables

Vercel'e deploy ederken aynı değerleri şuraya ekleyin:

**Vercel Dashboard > Project > Settings > Environment Variables:**

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | ✅ Production<br>✅ Preview<br>✅ Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | ✅ Production<br>✅ Preview<br>✅ Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | ✅ Production<br>✅ Preview<br>✅ Development |
| `NEXT_PUBLIC_APP_URL` | `https://app.vercel.app` | ✅ Production<br>✅ Preview<br>✅ Development |

---

## ❓ SSS (Sık Sorulan Sorular)

**Q: API anahtarlarımı kaybettim, ne yapmalıyım?**
A: Supabase Dashboard > Settings > API sayfasında "Regenerate" butonuna tıklayın

**Q: Hangi key'i kullanmalıyım?**
A: Çoğu durumda `anon public` key kullanılır. `service_role` key sadece admin işlemleri için sunucu tarafında kullanılır

**Q: Production ve development için farklı anahtar kullanmalı mıyım?**
A: Hayır, aynı anahtarları kullanırsınız. Sadece `NEXT_PUBLIC_APP_URL` değişir

**Q: .env.local dosyasını açtığımda boş görünüyor?**
A: Gizli dosya olabilir, VS Code'da "Show Hidden Files" seçeneğini açın
