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

      // Handle commands
      switch (text.toLowerCase()) {
        case '/start':
          responseText = `👋 Merhaba ${username}!\\n\\nHukuk Bürosu yönetim sistemine hoş geldiniz.\\n\\nKullanılabilir komutlar:\\n/bugun - Bugünkü görevler\\n/durusmalar - Yaklaşan duruşmalar\\n/gelirler - Aylık gelir özeti\\n/yardim - Yardım`
          break

        case '/bugun':
          responseText = `📅 *Bugünkü Görevler*\\n\\nℹ️ Bu özellik için Supabase entegrasyonu gereklidir.`
          break

        case '/durusmalar':
          responseText = `⚖️ *Yaklaşan Duruşmalar*\\n\\nℹ️ Bu özellik için Supabase entegrasyonu gereklidir.`
          break

        case '/gelirler':
          responseText = `💰 *Aylık Gelir Özeti*\\n\\nℹ️ Bu özellik için Supabase entegrasyonu gereklidir.`
          break

        case '/yardim':
        case '/help':
          responseText = `📚 *Yardım*\\n\\nKullanılabilir komutlar:\\n/start - Botu başlat\\n/bugun - Bugünkü görevler\\n/durusmalar - Yaklaşan duruşmalar\\n/gelirler - Aylık gelir özeti\\n/yardim - Bu mesaj`
          break

        default:
          responseText = `❓ Bilinmeyen komut. /yardim yazarak kullanılabilir komutları görebilirsiniz.`
      }

      // Send response to Telegram
      if (responseText) {
        // Get bot token from environment or settings
        const botToken = process.env.TELEGRAM_BOT_TOKEN
        
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
