import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Telegram webhook structure
    if (body.message) {
      const chatId = body.message.chat.id
      const text = body.message.text || ''
      const username = body.message.from.username || body.message.from.first_name || 'Kullanıcı'

      console.log('Telegram message received:', { chatId, text, username })

      let responseText = ''

      // Mock hearing data
      const mockHearings = [
        { id: '1', title: 'Boşanma Davası', clientName: 'Ahmet Yılmaz', courtName: 'Aile Mahkemesi', hearingDate: '2025-01-22', time: '10:00', location: 'Salon 3' },
        { id: '2', title: 'İş Davası', clientName: 'Zeynep Kara', courtName: 'İş Mahkemesi', hearingDate: '2025-01-24', time: '14:00', location: 'Salon 1' },
        { id: '3', title: 'Tazminat Davası', clientName: 'Mehmet Demir', courtName: 'Asliye Hukuk', hearingDate: '2025-01-27', time: '11:00', location: 'Salon 2' },
        { id: '4', title: 'Kira Tahliye', clientName: 'Ayşe Kaya', courtName: 'İcra Hukuk', hearingDate: '2025-01-29', time: '09:30', location: 'Salon 4' },
        { id: '5', title: 'Evlilik Öncesi Mal Rehin', clientName: 'Ali Öz', courtName: 'Sulh Hukuk', hearingDate: '2025-01-30', time: '15:00', location: 'Salon 2' },
      ]

      // Mock task data
      const mockTasks = [
        { id: '1', title: 'Dilekçe hazırla', clientName: 'Mehmet Demir', priority: 'high', completed: false },
        { id: '2', title: 'Belge toplama', clientName: 'Ayşe Kaya', priority: 'medium', completed: false },
        { id: '3', title: 'Mahkeme dosyası inceleme', clientName: 'Ali Yılmaz', priority: 'critical', completed: false },
        { id: '4', title: 'Müvekkil görüşmesi', clientName: 'Fatma Öz', priority: 'low', completed: true },
      ]

      // Mock finance data
      const monthlyIncome = 125000
      const monthlyExpense = 45000
      const balance = monthlyIncome - monthlyExpense

      // Handle commands
      switch (text.toLowerCase()) {
        case '/start':
          responseText = `👋 Merhaba ${username}!\n\nHukuk Bürosu yönetim sistemine hoş geldiniz.\n\nKullanılabilir komutlar:\n/bugun - Bugünkü görevler\n/durusmalar - Yaklaşan duruşmalar\n/gelirler - Aylık gelir özeti\n/yardim - Yardım`
          break

        case '/bugun':
          const todayTasks = mockTasks.filter(t => !t.completed)
          if (todayTasks.length === 0) {
            responseText = `✅ *Bugün yapılacak görev yok!*`
          } else {
            responseText = `📅 *Bugünkü Görevler* (${todayTasks.length} adet)\n\n`
            todayTasks.forEach((task, i) => {
              const priorityEmoji = task.priority === 'critical' ? '🔴' : task.priority === 'high' ? '🟠' : task.priority === 'medium' ? '🟡' : '🔵'
              responseText += `${priorityEmoji} ${task.title}\n   👤 ${task.clientName}\n\n`
            })
          }
          break

        case '/durusmalar':
          const upcomingHearings = mockHearings.slice(0, 5)
          responseText = `⚖️ *Yaklaşan Duruşmalar* (${upcomingHearings.length} adet)\n\n`
          upcomingHearings.forEach((hearing) => {
            const date = new Date(hearing.hearingDate).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })
            responseText += `📅 ${date} - ${hearing.time}\n⚖️ ${hearing.title}\n👤 ${hearing.clientName}\n📍 ${hearing.courtName} - ${hearing.location}\n\n`
          })
          break

        case '/gelirler':
          responseText = `💰 *Aylık Gelir Özeti*\n\n`
          responseText += `📈 Toplam Gelir: ${monthlyIncome.toLocaleString('tr-TR')} ₺\n`
          responseText += `📉 Toplam Gider: ${monthlyExpense.toLocaleString('tr-TR')} ₺\n`
          responseText += `💵 *Net Bakiye: ${balance.toLocaleString('tr-TR')} ₺*`
          break

        case '/yardim':
        case '/help':
          responseText = `📚 *Yardım*\n\nKullanılabilir komutlar:\n/start - Botu başlat\n/bugun - Bugünkü görevler\n/durusmalar - Yaklaşan duruşmalar\n/gelirler - Aylık gelir özeti\n/yardim - Bu mesaj`
          break

        default:
          responseText = `❓ Bilinmeyen komut. /yardim yazarak kullanılabilir komutları görebilirsiniz.`
      }

      // Send response to Telegram
      if (responseText) {
        // Get bot token from URL query parameter (set during webhook setup) or environment
        const botToken = request.nextUrl.searchParams.get('token') || process.env.TELEGRAM_BOT_TOKEN
        
        if (!botToken) {
          return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 })
        }

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: responseText,
            parse_mode: 'Markdown'
          })
        })
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Telegram webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Get webhook info
export async function GET(request: NextRequest) {
  try {
    const tokenParam = request.nextUrl.searchParams.get('token')
    const botToken = tokenParam || request.cookies.get('tg_bot_token')?.value || process.env.TELEGRAM_BOT_TOKEN

    if (!botToken) {
      return NextResponse.json({ error: 'Bot token not configured' }, { status: 400 })
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`)
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get webhook info' }, { status: 500 })
  }
}
