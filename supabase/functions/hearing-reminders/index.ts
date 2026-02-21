// Supabase Edge Function for Hearing Reminders
// Deploy: supabase functions deploy hearing-reminders

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID')

Deno.serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get settings for reminder hours
    const { data: settings } = await supabaseClient
      .from('settings')
      .select('hearing_reminder_hours')
      .single()

    const reminderHours = settings?.hearing_reminder_hours || 24

    // Calculate time range
    const now = new Date()
    const reminderTime = new Date(now.getTime() + reminderHours * 60 * 60 * 1000)
    const startRange = new Date(reminderTime.getTime() - 30 * 60 * 1000) // 30 min before
    const endRange = new Date(reminderTime.getTime() + 30 * 60 * 1000) // 30 min after

    // Get hearings that need reminders
    const { data: hearings } = await supabaseClient
      .from('hearings')
      .select('*')
      .gte('hearing_date', startRange.toISOString())
      .lte('hearing_date', endRange.toISOString())
      .eq('status', 'scheduled')
      .eq('reminder_sent', false)

    if (!hearings || hearings.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No hearings to remind' }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Send reminders
    for (const hearing of hearings) {
      const date = new Date(hearing.hearing_date)
      let message = '⚠️ <b>Duruşma Hatırlatması</b>\n\n'
      message += `<b>${hearing.title}</b>\n`
      message += `👤 ${hearing.client_name}\n`
      message += `📁 ${hearing.file_number}\n`
      message += `🏛️ ${hearing.court_name}\n`
      message += `📅 ${date.toLocaleDateString('tr-TR')} ${date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}\n`
      if (hearing.location) message += `📍 ${hearing.location}\n`

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

      // Mark reminder as sent
      await supabaseClient
        .from('hearings')
        .update({ reminder_sent: true })
        .eq('id', hearing.id)
    }

    return new Response(
      JSON.stringify({ success: true, count: hearings.length }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
