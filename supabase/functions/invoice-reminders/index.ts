// Supabase Edge Function for Invoice Reminders
// Deploy: supabase functions deploy invoice-reminders

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID')

Deno.serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get settings for reminder days
    const { data: settings } = await supabaseClient
      .from('settings')
      .select('invoice_reminder_days')
      .single()

    const reminderDays = settings?.invoice_reminder_days || 3

    // Check if we're within reminder period (last X days of month)
    const now = new Date()
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const daysUntilEndOfMonth = lastDayOfMonth - now.getDate()

    if (daysUntilEndOfMonth > reminderDays) {
      return new Response(
        JSON.stringify({ message: 'Not in reminder period' }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get incomes without invoices from this month
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]

    const { data: pendingInvoices } = await supabaseClient
      .from('financials')
      .select('*')
      .eq('type', 'income')
      .eq('invoice_issued', false)
      .gte('transaction_date', firstDay)
      .lte('transaction_date', lastDay)

    if (!pendingInvoices || pendingInvoices.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No pending invoices' }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Build message
    let message = '💰 <b>Fatura Hatırlatması</b>\n\n'
    message += `${pendingInvoices.length} adet tahsilat için fatura kesilmesi gerekiyor:\n\n`

    pendingInvoices.forEach((income: any, index: number) => {
      message += `${index + 1}. ${income.client_name || 'İsimsiz'}\n`
      message += `   💵 ${Number(income.amount).toLocaleString('tr-TR')} TL\n`
      message += `   📅 ${new Date(income.transaction_date).toLocaleDateString('tr-TR')}\n\n`
    })

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

    return new Response(
      JSON.stringify({ success: true, count: pendingInvoices.length }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
