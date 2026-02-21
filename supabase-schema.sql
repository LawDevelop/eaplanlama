-- ADIM 1: Supabase SQL Şemaları ve RLS Politikaları
-- Hukuk Bürosu Yönetim Sistemi - Tek Kullanıcılı (Solo Admin)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. SETTINGS TABLE (Sistem Ayarları)
-- ============================================
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

-- ============================================
-- 2.5. CLIENTS TABLE (Müvekkiller)
-- ============================================
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Temel Bilgiler
  name TEXT NOT NULL,
  tc_no TEXT, -- TC Kimlik No
  tax_no TEXT, -- Vergi No (Şirketler için)
  client_type TEXT CHECK (client_type IN ('individual', 'corporate')) DEFAULT 'individual',
  
  -- İletişim
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  
  -- Ek Bilgiler
  occupation TEXT,
  notes TEXT,
  tags TEXT[],
  
  -- İstatistikler
  total_cases INTEGER DEFAULT 0,
  active_cases INTEGER DEFAULT 0,
  total_hearings INTEGER DEFAULT 0,
  total_paid DECIMAL(15, 2) DEFAULT 0,
  total_debt DECIMAL(15, 2) DEFAULT 0,
  
  -- Durum
  status TEXT CHECK (status IN ('active', 'inactive', 'archived')) DEFAULT 'active',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_name ON clients(name);
CREATE INDEX idx_clients_status ON clients(status);

-- Enable RLS
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

-- ============================================
-- 2.6. CASES TABLE (Dosyalar/Davalar)
-- ============================================
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  
  -- Dosya Bilgileri
  file_number TEXT NOT NULL UNIQUE,
  case_type TEXT NOT NULL, -- Boşanma, İş Davası, Tazminat, vb.
  court_name TEXT,
  court_file_number TEXT, -- Mahkeme dosya numarası
  
  -- Durum
  status TEXT CHECK (status IN ('active', 'pending', 'completed', 'archived')) DEFAULT 'active',
  case_stage TEXT, -- Dilekçe hazırlığı, İlk duruşma, Delil toplama, vb.
  
  -- Tarihler
  start_date DATE NOT NULL,
  expected_end_date DATE,
  actual_end_date DATE,
  
  -- Finansal
  agreed_fee DECIMAL(15, 2),
  paid_amount DECIMAL(15, 2) DEFAULT 0,
  remaining_amount DECIMAL(15, 2),
  
  -- Karşı Taraf
  opposing_party TEXT,
  opposing_lawyer TEXT,
  opposing_lawyer_phone TEXT,
  
  -- Notlar
  description TEXT,
  strategy_notes TEXT,
  
  -- İstatistikler
  total_hearings INTEGER DEFAULT 0,
  total_documents INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cases_user_id ON cases(user_id);
CREATE INDEX idx_cases_client_id ON cases(client_id);
CREATE INDEX idx_cases_file_number ON cases(file_number);
CREATE INDEX idx_cases_status ON cases(status);

-- Enable RLS
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

-- ============================================
-- 2. TASK TEMPLATES (Görev Şablonları)
-- ============================================
CREATE TABLE task_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  default_priority TEXT CHECK (default_priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  default_tags TEXT[],
  checklist_items JSONB, -- Alt görev şablonları
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. TASK TAGS (Etiketler)
-- ============================================
CREATE TABLE task_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL, -- hex color code
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- ============================================
-- 4. TASKS TABLE (Görevler) - ENHANCED
-- ============================================
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
  tags TEXT[], -- Array of tag names
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE, -- For sub-tasks
  
  -- Çöp kutusu için
  deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,
  permanent_delete_at TIMESTAMPTZ,
  
  -- Yeni özellikler
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT, -- 'daily', 'weekly', 'monthly', 'yearly'
  recurrence_interval INTEGER DEFAULT 1,
  recurrence_end_date TIMESTAMPTZ,
  next_recurrence_date TIMESTAMPTZ,
  
  -- Zaman takibi
  time_spent_minutes INTEGER DEFAULT 0,
  time_tracking_active BOOLEAN DEFAULT false,
  time_tracking_started_at TIMESTAMPTZ,
  
  -- Paylaşım
  share_token TEXT UNIQUE,
  is_shared BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4.1. TASK DEPENDENCIES (Görev Bağımlılıkları)
-- ============================================
CREATE TABLE task_dependencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  depends_on_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  dependency_type TEXT CHECK (dependency_type IN ('blocks', 'blocked_by', 'related')) DEFAULT 'blocks',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(task_id, depends_on_task_id)
);

-- ============================================
-- 4.2. TASK AUTOMATIONS (Görev Otomasyonları)
-- ============================================
CREATE TABLE task_automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  
  -- Trigger (Tetikleyici)
  trigger_type TEXT CHECK (trigger_type IN ('task_created', 'task_completed', 'task_overdue', 'hearing_created', 'file_created', 'date_reached')) NOT NULL,
  trigger_conditions JSONB, -- Ek koşullar
  
  -- Action (Aksiyon)
  action_type TEXT CHECK (action_type IN ('create_task', 'send_notification', 'update_task', 'archive_tasks', 'send_email')) NOT NULL,
  action_config JSONB NOT NULL, -- Aksiyon parametreleri
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4.3. SAVED FILTERS (Kayıtlı Filtreler)
-- ============================================
CREATE TABLE saved_filters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  filter_config JSONB NOT NULL, -- Filtre parametreleri
  is_favorite BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4.4. TASK REMINDERS (Akıllı Hatırlatıcılar)
-- ============================================
CREATE TABLE task_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  reminder_type TEXT CHECK (reminder_type IN ('time_based', 'location_based', 'context_based')) NOT NULL,
  
  -- Zaman bazlı
  remind_at TIMESTAMPTZ,
  remind_before_minutes INTEGER, -- Görevden X dakika önce
  
  -- Konum bazlı
  location_name TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_radius_meters INTEGER,
  
  -- Bağlam bazlı
  context_type TEXT, -- 'client_call', 'court_visit', etc.
  
  is_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4.5. POMODORO SESSIONS (Pomodoro Oturumları)
-- ============================================
CREATE TABLE pomodoro_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  duration_minutes INTEGER DEFAULT 25,
  completed BOOLEAN DEFAULT false,
  session_type TEXT CHECK (session_type IN ('work', 'short_break', 'long_break')) DEFAULT 'work',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4.6. TASK ANALYTICS (Görev Analitiği)
-- ============================================
CREATE TABLE task_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  
  -- Günlük metrikler
  tasks_created INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  tasks_overdue INTEGER DEFAULT 0,
  total_time_spent_minutes INTEGER DEFAULT 0,
  pomodoros_completed INTEGER DEFAULT 0,
  
  -- Öncelik bazlı
  critical_completed INTEGER DEFAULT 0,
  high_completed INTEGER DEFAULT 0,
  medium_completed INTEGER DEFAULT 0,
  low_completed INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- ============================================
-- 5. TASK NOTES (Görev Notları)
-- ============================================
CREATE TABLE task_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  note_type TEXT CHECK (note_type IN ('text', 'audio')) DEFAULT 'text',
  audio_url TEXT, -- Ses kaydı URL'si
  audio_duration_seconds INTEGER, -- Ses kaydı süresi
  transcription TEXT, -- Otomatik transkripsiyon
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. TASK ATTACHMENTS (Görev Ekleri)
-- ============================================
CREATE TABLE task_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Supabase Storage path
  file_size BIGINT,
  file_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. TASK HISTORY (Görev Geçmişi)
-- ============================================
CREATE TABLE task_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'created', 'updated', 'completed', 'deleted', 'status_changed', etc.
  field_name TEXT, -- Hangi alan değişti
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. TASK CHECKLIST (Alt Görevler)
-- ============================================
CREATE TABLE task_checklist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  position INTEGER DEFAULT 0, -- Sıralama için
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_parent ON tasks(parent_task_id);
CREATE INDEX idx_tasks_share_token ON tasks(share_token);
CREATE INDEX idx_task_notes_task_id ON task_notes(task_id);
CREATE INDEX idx_task_attachments_task_id ON task_attachments(task_id);
CREATE INDEX idx_task_history_task_id ON task_history(task_id);
CREATE INDEX idx_task_checklist_task_id ON task_checklist(task_id);

-- ============================================
-- 3. HEARINGS TABLE (Duruşmalar)
-- ============================================
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
  
  -- Çöp kutusu
  deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,
  permanent_delete_at TIMESTAMPTZ,
  
  -- Hazırlık
  preparation_progress INTEGER DEFAULT 0, -- 0-100
  preparation_notes TEXT,
  
  -- Konum
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  travel_time_minutes INTEGER,
  
  -- Karşı taraf
  opposing_lawyer TEXT,
  opposing_lawyer_phone TEXT,
  strategy_notes TEXT,
  
  -- Sonuç
  result_type TEXT CHECK (result_type IN ('accepted', 'rejected', 'postponed', 'partial', 'pending')),
  result_summary TEXT,
  next_hearing_date TIMESTAMPTZ,
  
  -- Masraflar
  total_expenses DECIMAL(10, 2) DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hearings_user_id ON hearings(user_id);
CREATE INDEX idx_hearings_date ON hearings(hearing_date);
CREATE INDEX idx_hearings_status ON hearings(status);
CREATE INDEX idx_hearings_deleted ON hearings(deleted);

-- ============================================
-- 3.1. HEARING REMINDERS (Duruşma Hatırlatıcıları)
-- ============================================
CREATE TABLE hearing_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hearing_id UUID REFERENCES hearings(id) ON DELETE CASCADE,
  remind_before_days INTEGER NOT NULL,
  reminder_type TEXT CHECK (reminder_type IN ('email', 'telegram', 'sms', 'push')) DEFAULT 'email',
  is_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3.2. HEARING CHECKLIST (Duruşma Hazırlık Listesi)
-- ============================================
CREATE TABLE hearing_checklist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hearing_id UUID REFERENCES hearings(id) ON DELETE CASCADE,
  item_title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3.3. HEARING RESULTS (Duruşma Sonuçları)
-- ============================================
CREATE TABLE hearing_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hearing_id UUID REFERENCES hearings(id) ON DELETE CASCADE,
  decision_type TEXT CHECK (decision_type IN ('accepted', 'rejected', 'postponed', 'partial', 'other')),
  next_hearing_date TIMESTAMPTZ,
  decision_summary TEXT,
  decision_document_url TEXT,
  appeal_deadline DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3.4. HEARING EXPENSES (Duruşma Masrafları)
-- ============================================
CREATE TABLE hearing_expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hearing_id UUID REFERENCES hearings(id) ON DELETE CASCADE,
  expense_type TEXT CHECK (expense_type IN ('court_fee', 'transport', 'accommodation', 'other')) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  receipt_url TEXT,
  expense_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3.5. WITNESSES (Tanıklar)
-- ============================================
CREATE TABLE witnesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hearing_id UUID REFERENCES hearings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  is_notified BOOLEAN DEFAULT false,
  notified_at TIMESTAMPTZ,
  testimony TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3.6. EVIDENCE (Deliller)
-- ============================================
CREATE TABLE evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hearing_id UUID REFERENCES hearings(id) ON DELETE CASCADE,
  evidence_type TEXT CHECK (evidence_type IN ('document', 'photo', 'video', 'audio', 'other')) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  presentation_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3.7. HEARING RECORDINGS (Duruşma Kayıtları)
-- ============================================
CREATE TABLE hearing_recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hearing_id UUID REFERENCES hearings(id) ON DELETE CASCADE,
  recording_type TEXT CHECK (recording_type IN ('audio', 'video')) NOT NULL,
  file_url TEXT NOT NULL,
  duration_seconds INTEGER,
  transcription TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3.8. HEARING TEMPLATES (Duruşma Şablonları)
-- ============================================
CREATE TABLE hearing_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  hearing_type TEXT,
  default_checklist JSONB,
  default_reminders JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. FINANCIALS TABLE (Gelir/Gider)
-- ============================================
CREATE TABLE financials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  category TEXT NOT NULL, -- Kira, Vergi, Ulaşım, Kırtasiye, Harçlar, Vekalet Ücreti, etc.
  amount DECIMAL(15, 2) NOT NULL,
  description TEXT,
  client_name TEXT, -- For income
  file_number TEXT, -- For income
  
  -- Taksit/Bakiye Takibi (Income only)
  total_agreed DECIMAL(15, 2), -- Toplam anlaşılan tutar
  total_received DECIMAL(15, 2), -- Toplam alınan
  remaining_balance DECIMAL(15, 2), -- Kalan bakiye
  
  -- Fatura Durumu
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
CREATE INDEX idx_financials_invoice ON financials(invoice_issued) WHERE type = 'income';

-- ============================================
-- 5. FILES TABLE (Dosya Yönetimi)
-- ============================================
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Supabase Storage path
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

-- ============================================
-- 6. AUTH_LOGS TABLE (Giriş-Çıkış Logları)
-- ============================================
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

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE hearings ENABLE ROW LEVEL SECURITY;
ALTER TABLE financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_logs ENABLE ROW LEVEL SECURITY;

-- Settings Policies (Solo Admin Only)
CREATE POLICY "Users can view their own settings" ON settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Tasks Policies
CREATE POLICY "Users can view their own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Hearings Policies
CREATE POLICY "Users can view their own hearings" ON hearings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own hearings" ON hearings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hearings" ON hearings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hearings" ON hearings
  FOR DELETE USING (auth.uid() = user_id);

-- Financials Policies
CREATE POLICY "Users can view their own financials" ON financials
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own financials" ON financials
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own financials" ON financials
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own financials" ON financials
  FOR DELETE USING (auth.uid() = user_id);

-- Files Policies
CREATE POLICY "Users can view their own files" ON files
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own files" ON files
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own files" ON files
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own files" ON files
  FOR DELETE USING (auth.uid() = user_id);

-- Auth Logs Policies
CREATE POLICY "Users can view their own auth logs" ON auth_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own auth logs" ON auth_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hearings_updated_at BEFORE UPDATE ON hearings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financials_updated_at BEFORE UPDATE ON financials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate remaining balance for financials
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

-- ============================================
-- STORAGE BUCKETS (Run in Supabase Dashboard)
-- ============================================
-- Create a bucket named 'documents' for file uploads
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Storage Policy for documents bucket
-- CREATE POLICY "Users can upload their own documents" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can view their own documents" ON storage.objects
--   FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can delete their own documents" ON storage.objects
--   FOR DELETE USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
