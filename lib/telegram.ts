export async function sendTelegramNotification(message: string) {
  try {
    const response = await fetch('/api/telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })

    if (!response.ok) {
      throw new Error('Failed to send Telegram notification')
    }

    return true
  } catch (error) {
    console.error('Telegram notification error:', error)
    return false
  }
}

export function formatTaskNotification(task: any): string {
  let message = `📋 <b>Görev Hatırlatması</b>\n\n`
  message += `<b>${task.title}</b>\n`
  if (task.client_name) message += `👤 ${task.client_name}\n`
  if (task.file_number) message += `📁 ${task.file_number}\n`
  if (task.due_date) {
    const date = new Date(task.due_date)
    message += `📅 ${date.toLocaleDateString('tr-TR')}\n`
  }
  return message
}

export function formatHearingNotification(hearing: any): string {
  let message = `⚖️ <b>Duruşma Hatırlatması</b>\n\n`
  message += `<b>${hearing.title}</b>\n`
  message += `👤 ${hearing.client_name}\n`
  message += `📁 ${hearing.file_number}\n`
  message += `🏛️ ${hearing.court_name}\n`
  const date = new Date(hearing.hearing_date)
  message += `📅 ${date.toLocaleDateString('tr-TR')} ${date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}\n`
  if (hearing.location) message += `📍 ${hearing.location}\n`
  return message
}

export function formatInvoiceReminder(count: number): string {
  return `💰 <b>Fatura Hatırlatması</b>\n\n${count} adet tahsilat için fatura kesilmesi gerekiyor.`
}
