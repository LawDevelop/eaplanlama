import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service Role Key ile admin erişimi (RLS bypass)
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    )
  : null

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
          responseText = `👋 Merhaba ${username}!\n\nHukuk Bürosu yönetim sistemine hoş geldiniz.\n\nKullanılabilir komutlar:\n/bugun - Bugünkü görevler\n/durusmalar - Yaklaşan duruşmalar\n/gelirler - Aylık gelir özeti\n/yardim - Yardım`
          break

        case '/bugun':
          if (supabase) {
            // Bugünkü görevleri Supabase'den al
            const today = new Date().toISOString().split('T')[0]
            const { data: tasks, error } = await supabase
              .from('tasks')
              .select('title, client_name, priority')
              .eq('completed', false)
              .lte('due_date', today)
              .order('priority', { ascending: false })
              .limit(10)

            if (error || !tasks || tasks.length === 0) {
              responseText = `✅ *Bugün yapılacak görev yok!*`
            } else {
              responseText = `📅 *Bugünkü Görevler* (${tasks.length} adet)\n\n`
              tasks.forEach((task: any) => {
                const priorityEmoji = task.priority === 'critical' ? '🔴' : task.priority === 'high' ? '🟠' : task.priority === 'medium' ? '🟡' : '🔵'
                responseText += `${priorityEmoji} ${task.title}\n   👤 ${task.client_name || 'Belirtilmemiş'}\n\n`
              })
            }
          } else {
            responseText = `⚠️ Supabase bağlantısı kurulamadı. Lütfen environment variables ayarlayın.`
          }
          break

        case '/durusmalar':
          if (supabase) {
            // Yaklaşan duruşmaları Supabase'den al
            const today = new Date().toISOString().split('T')[0]
            const { data: hearings, error } = await supabase
              .from('hearings')
              .select('*')
              .gte('hearing_date', today)
              .order('hearing_date', { ascending: true })
              .limit(5)

            if (error || !hearings || hearings.length === 0) {
              responseText = `📋 *Yaklaşan duruşma bulunmamaktadır.*`
            } else {
              responseText = `⚖️ *Yaklaşan Duruşmalar* (${hearings.length} adet)\n\n`
              hearings.forEach((hearing: any) => {
                const date = new Date(hearing.hearing_date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })
                const time = hearing.time || 'Belirtilmemiş'
                responseText += `📅 ${date} - ${time}\n⚖️ ${hearing.title || 'Duruşma'}\n👤 ${hearing.client_name || 'Belirtilmemiş'}\n📍 ${hearing.court_name || 'Mahkeme'} - ${hearing.location || 'Salon'}\n\n`
              })
            }
          } else {
            responseText = `⚠️ Supabase bağlantısı kurulamadı. Lütfen environment variables ayarlayın.`
          }
          break

        case '/gelirler':
          if (supabase) {
            // Bu ayın gelir ve giderlerini hesapla
            const now = new Date()
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()

            // Gelirler
            const { data: income } = await supabase
              .from('finance_transactions')
              .select('amount')
              .eq('type', 'income')
              .gte('transaction_date', firstDay)
              .lte('transaction_date', lastDay)

            // Giderler
            const { data: expenses } = await supabase
              .from('finance_transactions')
              .select('amount')
              .eq('type', 'expense')
              .gte('transaction_date', firstDay)
              .lte('transaction_date', lastDay)

            const totalIncome = income?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0
            const totalExpense = expenses?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0
            const balance = totalIncome - totalExpense

            responseText = `💰 *Aylık Gelir Özeti*\n\n`
            responseText += `📈 Toplam Gelir: ${totalIncome.toLocaleString('tr-TR')} ₺\n`
            responseText += `📉 Toplam Gider: ${totalExpense.toLocaleString('tr-TR')} ₺\n`
            responseText += `💵 *Net Bakiye: ${balance.toLocaleString('tr-TR')} ₺*`
          } else {
            responseText = `⚠️ Supabase bağlantısı kurulamadı. Lütfen environment variables ayarlayın.`
          }
          break

        case '/yardim':
        case '/help':
          responseText = `📚 *Yardım*\n\nKullanılabilir komutlar:\n/start - Botu başlat\n/bugun - Bugünkü görevler\n/durusmalar - Yaklaşan duruşmalar\n/gelirler - Aylık gelir özeti\n/yardim - Bu mesaj`
          break

        default:
          responseText = `❓ Bilinmeyen komut. /yardım yazarak kullanılabilir komutları görebilirsiniz.`
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
