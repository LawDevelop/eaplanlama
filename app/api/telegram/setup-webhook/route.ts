import { NextRequest, NextResponse } from 'next/server'

const TELEGRAM_API_URL = 'https://api.telegram.org/bot'

export async function POST(request: NextRequest) {
  try {
    const { botToken, chatId } = await request.json()

    if (!botToken || !chatId) {
      return NextResponse.json(
        { error: 'Bot token and chat ID are required' },
        { status: 400 }
      )
    }

    // Determine the webhook URL based on the request origin
    const origin = request.headers.get('origin') || request.nextUrl.origin
    const webhookUrl = `${origin}/api/telegram/webhook`

    // Set the webhook on Telegram
    const response = await fetch(
      `${TELEGRAM_API_URL}${botToken}/setWebhook`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ['message'],
          drop_pending_updates: true
        })
      }
    )

    const data = await response.json()

    if (!data.ok) {
      return NextResponse.json(
        { success: false, error: data.description || 'Webhook kurulumu başarısız' },
        { status: 400 }
      )
    }

    // Store bot token and chat ID as server-side cookie (httpOnly)
    const res = NextResponse.json({
      success: true,
      message: `Webhook başarıyla kuruldu: ${webhookUrl}`,
      webhookUrl
    })

    // Set httpOnly cookies for secure token storage (server-side only)
    res.cookies.set('tg_bot_token', botToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 365 // 1 year
    })
    res.cookies.set('tg_chat_id', chatId, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 365
    })

    return res
  } catch (error) {
    console.error('Webhook setup error:', error)
    return NextResponse.json(
      { success: false, error: 'Webhook kurulumu sırasında hata oluştu' },
      { status: 500 }
    )
  }
}

// DELETE - Remove webhook
export async function DELETE(request: NextRequest) {
  try {
    const { botToken } = await request.json()

    if (!botToken) {
      return NextResponse.json(
        { error: 'Bot token is required' },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${TELEGRAM_API_URL}${botToken}/deleteWebhook`,
      { method: 'POST' }
    )

    const data = await response.json()

    return NextResponse.json({
      success: data.ok,
      message: data.ok ? 'Webhook kaldırıldı' : data.description
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Webhook kaldırma hatası' },
      { status: 500 }
    )
  }
}
