'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Bell, Mail, MessageSquare, Clock, Shield, User, 
  Save, Check, AlertCircle, Info, ExternalLink 
} from 'lucide-react'

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<'notifications' | 'telegram' | 'email' | 'account'>('notifications')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-24">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gradient">Ayarlar</h1>
          <p className="text-[hsl(var(--muted-foreground))]">Sistem ayarlarınızı yönetin</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="elite-card p-2 space-y-1">
              {[
                { id: 'notifications', icon: Bell, label: 'Bildirimler' },
                { id: 'telegram', icon: MessageSquare, label: 'Telegram Bot' },
                { id: 'email', icon: Mail, label: 'E-posta' },
                { id: 'account', icon: User, label: 'Hesap' },
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all ${
                      isActive
                        ? 'gradient-primary text-white shadow-lg'
                        : 'hover:bg-[hsl(var(--secondary))]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="elite-card p-6 md:p-8">
              {activeTab === 'notifications' && <NotificationsTab onSave={handleSave} saved={saved} />}
              {activeTab === 'telegram' && <TelegramTab onSave={handleSave} saved={saved} />}
              {activeTab === 'email' && <EmailTab onSave={handleSave} saved={saved} />}
              {activeTab === 'account' && <AccountTab onSave={handleSave} saved={saved} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface TabProps {
  onSave: () => void
  saved: boolean
}

function NotificationsTab({ onSave, saved }: TabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Bildirim Ayarları</h2>
        <p className="text-[hsl(var(--muted-foreground))]">
          Bildirim tercihlerinizi yapılandırın
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[hsl(var(--secondary))]">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[hsl(var(--primary))]" />
            <div>
              <div className="font-medium">Günlük Bildirim Saati</div>
              <div className="text-sm text-[hsl(var(--muted-foreground))]">
                Her gün bu saatte özet gönderilir
              </div>
            </div>
          </div>
          <input
            type="time"
            defaultValue="10:00"
            className="elite-input w-32"
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-[hsl(var(--secondary))]">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-[hsl(var(--primary))]" />
            <div>
              <div className="font-medium">Duruşma Hatırlatma</div>
              <div className="text-sm text-[hsl(var(--muted-foreground))]">
                Duruşmadan kaç saat önce hatırlatılsın
              </div>
            </div>
          </div>
          <input
            type="number"
            defaultValue="24"
            className="elite-input w-24"
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-[hsl(var(--secondary))]">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[hsl(var(--primary))]" />
            <div>
              <div className="font-medium">Fatura Hatırlatma</div>
              <div className="text-sm text-[hsl(var(--muted-foreground))]">
                Ay sonundan kaç gün önce hatırlatılsın
              </div>
            </div>
          </div>
          <input
            type="number"
            defaultValue="3"
            className="elite-input w-24"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 pt-6 border-t border-[hsl(var(--card-border))]">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSave}
          className="elite-btn-primary w-full md:w-auto px-8"
        >
          {saved ? (
            <>
              <Check className="w-5 h-5 inline mr-2" />
              Kaydedildi!
            </>
          ) : (
            <>
              <Save className="w-5 h-5 inline mr-2" />
              Değişiklikleri Kaydet
            </>
          )}
        </motion.button>
      </div>
    </div>
  )
}

function TelegramTab({ onSave, saved }: TabProps) {
  const [botToken, setBotToken] = useState('')
  const [chatId, setChatId] = useState('')
  const [enabled, setEnabled] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{success: boolean; message: string} | null>(null)

  // Load saved settings on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('telegram_bot_token')
    const savedChatId = localStorage.getItem('telegram_chat_id')
    const savedEnabled = localStorage.getItem('telegram_enabled')
    
    if (savedToken) setBotToken(savedToken)
    if (savedChatId) setChatId(savedChatId)
    if (savedEnabled) setEnabled(savedEnabled === 'true')
  }, [])

  const handleSave = () => {
    localStorage.setItem('telegram_bot_token', botToken)
    localStorage.setItem('telegram_chat_id', chatId)
    localStorage.setItem('telegram_enabled', enabled.toString())
    onSave()
  }

  const handleTestConnection = async () => {
    if (!botToken || !chatId) {
      setTestResult({ success: false, message: 'Bot Token ve Chat ID gereklidir' })
      return
    }

    setTesting(true)
    setTestResult(null)

    try {
      const response = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botToken, chatId })
      })

      const data = await response.json()

      if (data.success) {
        setTestResult({
          success: true,
          message: `Bağlantı başarılı! Bot: ${data.botInfo?.name || 'Bilinmiyor'}`
        })
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Bağlantı başarısız'
        })
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Bağlantı hatası. Lütfen tekrar deneyin.'
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Telegram Bot Entegrasyonu</h2>
        <p className="text-[hsl(var(--muted-foreground))]">
          Telegram üzerinden bildirim alın ve sorgu yapın
        </p>
      </div>

      <div className="elite-card p-6 bg-[hsl(var(--info))]/10 border-[hsl(var(--info))]/20">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-[hsl(var(--info))] flex-shrink-0 mt-0.5" />
          <div className="text-sm space-y-2">
            <p className="font-medium">Telegram Bot Nasıl Kurulur?</p>
            <ol className="list-decimal list-inside space-y-1 text-[hsl(var(--muted-foreground))]">
              <li>Telegram'da @BotFather'ı açın</li>
              <li>/newbot komutunu gönderin</li>
              <li>Bot için bir isim ve kullanıcı adı belirleyin</li>
              <li>Aldığınız token'ı aşağıya yapıştırın</li>
              <li>@userinfobot ile Chat ID'nizi öğrenin</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-2">Bot Token</label>
          <input
            type="text"
            placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
            value={botToken}
            onChange={(e) => setBotToken(e.target.value)}
            className="elite-input"
          />
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            @BotFather'dan aldığınız token
          </p>
        </div>

        <div>
          <label className="block font-medium mb-2">Chat ID</label>
          <input
            type="text"
            placeholder="123456789"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            className="elite-input"
          />
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            @userinfobot'tan öğrendiğiniz ID
          </p>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[hsl(var(--secondary))]">
          <input
            type="checkbox"
            id="telegram-enabled"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="w-5 h-5 rounded accent-[hsl(var(--primary))]"
          />
          <label htmlFor="telegram-enabled" className="font-medium cursor-pointer">
            Telegram bildirimlerini aktif et
          </label>
        </div>

        {/* Test Connection Button */}
        <button
          onClick={handleTestConnection}
          disabled={testing || !botToken || !chatId}
          className={`w-full p-4 rounded-2xl font-medium transition-all ${
            testing
              ? 'bg-gray-200 text-gray-500 cursor-wait'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/30'
          } disabled:opacity-50`}
        >
          {testing ? 'Bağlantı Test Ediliyor...' : '🔌 Bağlantıyı Test Et'}
        </button>

        {/* Test Result */}
        {testResult && (
          <div className={`p-4 rounded-xl ${
            testResult.success
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <p className="font-medium">{testResult.message}</p>
          </div>
        )}
      </div>

      <div className="elite-card p-6 bg-[hsl(var(--success))]/10 border-[hsl(var(--success))]/20">
        <div className="flex gap-3">
          <Check className="w-5 h-5 text-[hsl(var(--success))] flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-2">Kullanılabilir Komutlar:</p>
            <div className="space-y-1 text-[hsl(var(--muted-foreground))]">
              <p><code className="px-2 py-1 rounded bg-black/10 dark:bg-white/10">/bugun</code> - Bugünkü görevler</p>
              <p><code className="px-2 py-1 rounded bg-black/10 dark:bg-white/10">/durusmalar</code> - Yaklaşan duruşmalar</p>
              <p><code className="px-2 py-1 rounded bg-black/10 dark:bg-white/10">/gelirler</code> - Aylık gelir özeti</p>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 pt-6 border-t border-[hsl(var(--card-border))]">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="elite-btn-primary w-full md:w-auto px-8"
        >
          {saved ? (
            <>
              <Check className="w-5 h-5 inline mr-2" />
              Kaydedildi!
            </>
          ) : (
            <>
              <Save className="w-5 h-5 inline mr-2" />
              Değişiklikleri Kaydet
            </>
          )}
        </motion.button>
      </div>
    </div>
  )
}

function EmailTab({ onSave, saved }: TabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">E-posta Ayarları</h2>
        <p className="text-[hsl(var(--muted-foreground))]">
          Gmail hesabınızı bağlayın ve e-posta bildirimleri alın
        </p>
      </div>

      <div className="elite-card p-6 bg-[hsl(var(--info))]/10 border-[hsl(var(--info))]/20">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-[hsl(var(--info))] flex-shrink-0 mt-0.5" />
          <div className="text-sm space-y-2">
            <p className="font-medium">Gmail App Password Nasıl Alınır?</p>
            <ol className="list-decimal list-inside space-y-1 text-[hsl(var(--muted-foreground))]">
              <li>Google Hesabınıza gidin</li>
              <li>Güvenlik → 2 Adımlı Doğrulama'yı aktif edin</li>
              <li>Güvenlik → Uygulama şifreleri'ne tıklayın</li>
              <li>"Diğer" seçeneğini seçin ve "Hukuk Sistemi" yazın</li>
              <li>Oluşturulan 16 haneli şifreyi aşağıya yapıştırın</li>
            </ol>
            <a
              href="https://myaccount.google.com/apppasswords"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[hsl(var(--primary))] hover:underline"
            >
              App Passwords sayfasına git
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-2">Gmail Adresi</label>
          <input
            type="email"
            placeholder="ornek@gmail.com"
            className="elite-input"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Gmail App Password</label>
          <input
            type="password"
            placeholder="xxxx xxxx xxxx xxxx"
            className="elite-input"
          />
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            16 haneli uygulama şifresi
          </p>
        </div>

        <div>
          <label className="block font-medium mb-2">Bildirim Alacak E-posta</label>
          <input
            type="email"
            placeholder="bildirim@example.com"
            className="elite-input"
          />
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            Bildirimlerin gönderileceği e-posta adresi
          </p>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[hsl(var(--secondary))]">
          <input
            type="checkbox"
            id="email-enabled"
            defaultChecked
            className="w-5 h-5 rounded accent-[hsl(var(--primary))]"
          />
          <label htmlFor="email-enabled" className="font-medium cursor-pointer">
            E-posta bildirimlerini aktif et
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 pt-6 border-t border-[hsl(var(--card-border))]">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSave}
          className="elite-btn-primary w-full md:w-auto px-8"
        >
          {saved ? (
            <>
              <Check className="w-5 h-5 inline mr-2" />
              Kaydedildi!
            </>
          ) : (
            <>
              <Save className="w-5 h-5 inline mr-2" />
              Değişiklikleri Kaydet
            </>
          )}
        </motion.button>
      </div>
    </div>
  )
}

function AccountTab({ onSave, saved }: TabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Hesap Bilgileri</h2>
        <p className="text-[hsl(var(--muted-foreground))]">
          Profil ve güvenlik ayarlarınız
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-2">Ad Soyad</label>
          <input
            type="text"
            placeholder="Av. Ahmet Yılmaz"
            className="elite-input"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">E-posta</label>
          <input
            type="email"
            placeholder="avukat@example.com"
            className="elite-input"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Telefon</label>
          <input
            type="tel"
            placeholder="+90 555 123 45 67"
            className="elite-input"
          />
        </div>

        <div className="pt-4 border-t border-[hsl(var(--card-border))]">
          <h3 className="font-semibold mb-4">Şifre Değiştir</h3>
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2">Mevcut Şifre</label>
              <input
                type="password"
                className="elite-input"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Yeni Şifre</label>
              <input
                type="password"
                className="elite-input"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Yeni Şifre (Tekrar)</label>
              <input
                type="password"
                className="elite-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 pt-6 border-t border-[hsl(var(--card-border))]">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSave}
          className="elite-btn-primary w-full md:w-auto px-8"
        >
          {saved ? (
            <>
              <Check className="w-5 h-5 inline mr-2" />
              Kaydedildi!
            </>
          ) : (
            <>
              <Save className="w-5 h-5 inline mr-2" />
              Değişiklikleri Kaydet
            </>
          )}
        </motion.button>
      </div>
    </div>
  )
}
