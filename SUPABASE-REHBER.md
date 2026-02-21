# Supabase Entegrasyon Rehberi

## 📋 Adım Adım Supabase Kurulumu

### 1. Supabase Projesi Oluşturma

1. [supabase.com](https://supabase.com) adresine gidin
2. "Start your project" veya "New project" tıklayın
3. Aşağıdaki bilgileri girin:
   - **Name:** eaplanlama (veya istediğiniz isim)
   - **Database Password:** Güçlü bir şifre belirleyin (kaydedin!)
   - **Region:** EU West (Frankfurt) - Türkiye'ye en yakın
4. "Create new project" tıklayın (2-3 dakika sürebilir)

### 2. API Anahtarlarını Alma

1. Proje oluşturulduktan sonra **Settings** > **API** bölümüne gidin
2. Şu değerleri kopyalayın:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret key** → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Veritabanı Tablolarını Oluşturma

#### Yöntem A: SQL Editor (Önerilen)
1. Supabase Dashboard'da **SQL Editor** sekmesine gidin
2. **"New query"** tıklayın
3. Aşağıdaki SQL kodlarını **SIRAYLA** çalıştırın

---

## 🗄️ SQL Kodları

### ADIM 1: Temel Fonksiyon (İlk Çalıştırın!)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to update updated_at timestamp (TÜM TABLOLARDA KULLANILACAK)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### ADIM 2: Settings Tablosu

```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_time TIME DEFAULT '10:00:00',
  hearing_reminder_hours INTEGER DEFAULT 24,
  invoice_reminder_days INTEGER DEFAULT 3,
  telegram_enabled BOOLEAN DEFAULT true,
  email_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own settings" ON settings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own settings" ON settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### ADIM 3: Clients (Müvekkiller) Tablosu

```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tc_no TEXT,
  tax_no TEXT,
  client_type TEXT CHECK (client_type IN ('individual', 'corporate')) DEFAULT 'individual',
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  occupation TEXT,
  notes TEXT,
  tags TEXT[],
  total_cases INTEGER DEFAULT 0,
  active_cases INTEGER DEFAULT 0,
  total_hearings INTEGER DEFAULT 0,
  total_paid DECIMAL(15, 2) DEFAULT 0,
  total_debt DECIMAL(15, 2) DEFAULT 0,
  status TEXT CHECK (status IN ('active', 'inactive', 'archived')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_name ON clients(name);
CREATE INDEX idx_clients_status ON clients(status);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own clients" ON clients
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own clients" ON clients
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own clients" ON clients
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own clients" ON clients
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### ADIM 4: Cases (Davalar) Tablosu

```sql
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  file_number TEXT NOT NULL UNIQUE,
  case_type TEXT NOT NULL,
  court_name TEXT,
  court_file_number TEXT,
  status TEXT CHECK (status IN ('active', 'pending', 'completed', 'archived')) DEFAULT 'active',
  case_stage TEXT,
  start_date DATE NOT NULL,
  expected_end_date DATE,
  actual_end_date DATE,
  agreed_fee DECIMAL(15, 2),
  paid_amount DECIMAL(15, 2) DEFAULT 0,
  remaining_amount DECIMAL(15, 2),
  opposing_party TEXT,
  opposing_lawyer TEXT,
  opposing_lawyer_phone TEXT,
  description TEXT,
  strategy_notes TEXT,
  total_hearings INTEGER DEFAULT 0,
  total_documents INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cases_user_id ON cases(user_id);
CREATE INDEX idx_cases_client_id ON cases(client_id);
CREATE INDEX idx_cases_file_number ON cases(file_number);
CREATE INDEX idx_cases_status ON cases(status);

ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cases" ON cases
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own cases" ON cases
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own cases" ON cases
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own cases" ON cases
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### ADIM 5: Tasks (Görevler) Tablosu

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  client_name TEXT,
  file_number TEXT,
  court_name TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('todo', 'in_progress', 'completed', 'archived')) DEFAULT 'todo',
  tags TEXT[],
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,
  permanent_delete_at TIMESTAMPTZ,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT,
  recurrence_interval INTEGER DEFAULT 1,
  recurrence_end_date TIMESTAMPTZ,
  next_recurrence_date TIMESTAMPTZ,
  time_spent_minutes INTEGER DEFAULT 0,
  time_tracking_active BOOLEAN DEFAULT false,
  time_tracking_started_at TIMESTAMPTZ,
  share_token TEXT UNIQUE,
  is_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_parent ON tasks(parent_task_id);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### ADIM 6: Hearings (Duruşmalar) Tablosu

```sql
CREATE TABLE hearings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  hearing_type TEXT CHECK (hearing_type IN ('first', 'interim', 'decision', 'appeal', 'other')) DEFAULT 'first',
  court_name TEXT NOT NULL,
  hearing_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  room_number TEXT,
  notes TEXT,
  status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled', 'postponed')) DEFAULT 'scheduled',
  reminder_sent BOOLEAN DEFAULT false,
  deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,
  permanent_delete_at TIMESTAMPTZ,
  preparation_progress INTEGER DEFAULT 0,
  preparation_notes TEXT,
  opposing_lawyer TEXT,
  opposing_lawyer_phone TEXT,
  strategy_notes TEXT,
  result_type TEXT CHECK (result_type IN ('accepted', 'rejected', 'postponed', 'partial', 'pending')),
  result_summary TEXT,
  next_hearing_date TIMESTAMPTZ,
  total_expenses DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hearings_user_id ON hearings(user_id);
CREATE INDEX idx_hearings_date ON hearings(hearing_date);
CREATE INDEX idx_hearings_status ON hearings(status);

ALTER TABLE hearings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own hearings" ON hearings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own hearings" ON hearings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own hearings" ON hearings
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own hearings" ON hearings
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_hearings_updated_at BEFORE UPDATE ON hearings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### ADIM 7: Financials (Gelir/Gider) Tablosu

```sql
CREATE TABLE financials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  description TEXT,
  client_name TEXT,
  file_number TEXT,
  total_agreed DECIMAL(15, 2),
  total_received DECIMAL(15, 2),
  remaining_balance DECIMAL(15, 2),
  invoice_issued BOOLEAN DEFAULT false,
  invoice_date DATE,
  invoice_reminder_sent BOOLEAN DEFAULT false,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_financials_user_id ON financials(user_id);
CREATE INDEX idx_financials_type ON financials(type);
CREATE INDEX idx_financials_date ON financials(transaction_date);

ALTER TABLE financials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own financials" ON financials
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own financials" ON financials
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own financials" ON financials
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own financials" ON financials
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_financials_updated_at BEFORE UPDATE ON financials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Bakiye hesaplama fonksiyonu
CREATE OR REPLACE FUNCTION calculate_remaining_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'income' AND NEW.total_agreed IS NOT NULL THEN
    NEW.remaining_balance := NEW.total_agreed - COALESCE(NEW.total_received, 0);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_financials_balance BEFORE INSERT OR UPDATE ON financials
  FOR EACH ROW EXECUTE FUNCTION calculate_remaining_balance();
```

### ADIM 8: Files (Dosya Yönetimi) Tablosu

```sql
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  description TEXT,
  tags TEXT[],
  related_client TEXT,
  related_file_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_files_user_id ON files(user_id);
CREATE INDEX idx_files_name ON files(file_name);

ALTER TABLE files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own files" ON files
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own files" ON files
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own files" ON files
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own files" ON files
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### ADIM 9: Auth Logs Tablosu

```sql
CREATE TABLE auth_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT CHECK (action IN ('login', 'logout', 'failed_login')) NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_auth_logs_user_id ON auth_logs(user_id);
CREATE INDEX idx_auth_logs_created_at ON auth_logs(created_at);

ALTER TABLE auth_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own auth logs" ON auth_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own auth logs" ON auth_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### ADIM 10: Storage Bucket Oluşturma

```sql
-- Documents bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Storage Policies
CREATE POLICY "Users can upload their own documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents" ON storage.objects
  FOR DELETE USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## 4. Authentication Ayarları

### Supabase Dashboard'da:

1. **Authentication** > **Providers** bölümüne gidin
2. **Email** provider'ını etkinleştirin:
   - **Enable Email provider:** ✅
   - **Confirm email:** İsteğe bağlı (geliştirmede kapatın)
   - **Double confirm email changes:** ❌

3. **Authentication** > **URL Configuration** bölümüne gidin:
   - **Site URL:** `https://your-domain.vercel.app` (veya `http://localhost:3000` geliştirme için)
   - **Redirect URLs:** Aşağıdakileri ekleyin:
     ```
     http://localhost:3000/auth/callback
     https://your-domain.vercel.app/auth/callback
     ```

### İlk Kullanıcı Oluşturma:

1. **Authentication** > **Users** > **Add user** tıklayın
2. E-posta ve şifre girin
3. "Auto-confirm user?" seçeneğini işaretleyin
4. "Create user" tıklayın

---

## 5. Environment Variables Ayarlama

### Lokal Geliştirme (.env.local)

Proje dizininde `.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...YOUR_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Vercel Deployment

Vercel Dashboard > Settings > Environment Variables:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` | Production |

---

## 6. Bağlantı Testi

Tüm ayarları yaptıktan sonra:

1. Uygulamayı çalıştırın: `npm run dev`
2. `http://localhost:3000/login` adresine gidin
3. Oluşturduğunuz kullanıcı bilgileriyle giriş yapın
4. Dashboard'a yönlendirilmeniz gerekir

---

## 7. Önemli Notlar

### Güvenlik
- `SUPABASE_SERVICE_ROLE_KEY` sadece sunucu tarafında kullanılır, asla client'ta kullanmayın
- `NEXT_PUBLIC_` ile başlayan değişkenler tarayıcıda görünür - bu normaldir
- RLS (Row Level Security) tüm tablolarda aktiftir - her kullanıcı sadece kendi verilerini görebilir

### Performans
- İndeksler önemli sorgu alanlarında oluşturulmuştur
- Büyük veri setleri için pagination kullanın
- Supabase'in realtime özelliğini gerçek zamanlı güncellemeler için kullanabilirsiniz

### Yedekleme
- Supabase otomatik yedekleme yapar (Pro plan'da)
- Manuel yedekleme için SQL dump kullanabilirsiniz
