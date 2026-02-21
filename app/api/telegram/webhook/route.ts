import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const message = body.message

    if (!message || !message.text) {
      return NextResponse.json({ ok: true })
    }

    const chatId = message.chat.id
    const text = message.text.trim()

    let responseText = ''

    // Handle commands
    if (text === '/bugun' || text === '/today') {
      responseText = await getTodayTasks()
    } else if (text === '/durusmalar' || text === '/hearings') {
      responseText = await getUpcomingHearings()
    } else if (text === '/gelirler' || text === '/income') {
      responseText = await getMonthlyIncome()
    } else if (text === '/help' || text === '/yardim') {
      responseText = `
<b>Kullanılabilir Komutlar:</b>

/bugun - Bugünkü görevler
/durusmalar - Yaklaşan duruşmalar
/gelirler - Aylık gelir özeti
/yardim - Bu yardım mesajı
      `
    } else {
      responseText = 'Bilinmeyen komut. /yardim yazarak komutları görebilirsiniz.'
    }

    // Send response
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: responseText,
          parse_mode: 'HTML',
        }),
      }
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Telegram webhook error:', error)
    return NextResponse.json({ ok: true })
  }
}

async function getTodayTasks(): Promise<string> {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .gte('due_date', today)
    .lte('due_date', today + 'T23:59:59')
    .eq('status', 'todo')

  if (!tasks || tasks.length === 0) {
    return '✅ Bugün için görev yok!'
  }

  let message = '<b>📋 Bugünkü Görevler:</b>\n\n'
  tasks.forEach((task, index) => {
    message += `${index + 1}. ${task.title}\n`
    if (task.client_name) message += `   👤 ${task.client_name}\n`
    message += '\n'
  })

  return message
}

async function getUpcomingHearings(): Promise<string> {
  const supabase = await createClient()
  const today = new Date().toISOString()

  const { data: hearings } = await supabase
    .from('hearings')
    .select('*')
    .gte('hearing_date', today)
    .eq('status', 'scheduled')
    .order('hearing_date', { ascending: true })
    .limit(5)

  if (!hearings || hearings.length === 0) {
    return '✅ Yaklaşan duruşma yok!'
  }

  let message = '<b>⚖️ Yaklaşan Duruşmalar:</b>\n\n'
  hearings.forEach((hearing, index) => {
    const date = new Date(hearing.hearing_date)
    message += `${index + 1}. ${hearing.title}\n`
    message += `   📅 ${date.toLocaleDateString('tr-TR')}\n`
    message += `   👤 ${hearing.client_name}\n`
    message += `   🏛️ ${hearing.court_name}\n\n`
  })

  return message
}

async function getMonthlyIncome(): Promise<string> {
  const supabase = await createClient()
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]

  const { data: incomes } = await supabase
    .from('financials')
    .select('amount')
    .eq('type', 'income')
    .gte('transaction_date', firstDay)
    .lte('transaction_date', lastDay)

  const total = incomes?.reduce((sum, item) => sum + Number(item.amount), 0) || 0

  return `<b>💰 Bu Ay Gelir:</b>\n\n${total.toLocaleString('tr-TR')} TL`
}
