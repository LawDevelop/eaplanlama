// Supabase Edge Function for Daily Notifications
// Deploy: supabase functions deploy daily-notifications

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID')

Deno.serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const today = new Date().toISOString().split('T')[0]

    // Get today's tasks
    const { data: tasks } = await supabaseClient
      .from('tasks')
      .select('*')
      .gte('due_date', today)
      .lte('due_date', today + 'T23:59:59')
      .eq('status', 'todo')

    // Get today's hearings
    const { data: hearings } = await supabaseClient
      .from('hearings')
      .select('*')
      .gte('hearing_date', today)
      .lte('hearing_date', today + 'T23:59:59')
      .eq('status', 'scheduled')

    // Get overdue tasks
    const { data: overdueTasks } = await supabaseClient
      .from('tasks')
      .select('*')
      .lt('due_date', today)
      .eq('status', 'todo')

    // Build notification message
    let message = '🌅 <b>Günlük Özet</b>\n\n'

    if (hearings && hearings.length > 0) {
      message += '⚖️ <b>Bugünkü Duruşmalar:</b>\n'
      hearings.forEach((h: any) => {
        const time = new Date(h.hearing_date).toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
        })
        message += `• ${time} - ${h.title} (${h.client_name})\n`
      })
      message += '\n'
    }

    if (tasks && tasks.length > 0) {
      message += '📋 <b>Bugünkü Görevler:</b>\n'
      tasks.forEach((t: any) => {
        message += `• ${t.title}`
        if (t.client_name) message += ` (${t.client_name})`
        message += '\n'
      })
      message += '\n'
    }

    if (overdueTasks && overdueTasks.length > 0) {
      message += `⚠️ <b>Gecikmiş Görevler:</b> ${overdueTasks.length} adet\n\n`
    }

    if (!hearings?.length && !tasks?.length && !overdueTasks?.length) {
      message += '✅ Bugün için görev veya duruşma yok!\n'
    }

    // Send Telegram notification
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML',
          }),
        }
      )
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
