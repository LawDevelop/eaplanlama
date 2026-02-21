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

    // Test bot token by getting bot info
    const botInfoResponse = await fetch(
      `${TELEGRAM_API_URL}${botToken}/getMe`,
      { method: 'GET' }
    )

    const botInfo = await botInfoResponse.json()

    if (!botInfoResponse.ok || !botInfo.ok) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Geçersiz bot token',
          details: botInfo.description 
        },
        { status: 400 }
      )
    }

    // Send test message
    const testMessage = '✅ Bağlantı başarılı! Telegram botunuz düzgün çalışıyor.'
    
    const sendResponse = await fetch(
      `${TELEGRAM_API_URL}${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: testMessage,
          parse_mode: 'Markdown'
        })
      }
    )

    const sendData = await sendResponse.json()

    if (!sendResponse.ok || !sendData.ok) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Chat ID geçersiz veya bot mesaj gönderemiyor',
          details: sendData.description 
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Bağlantı başarılı! Test mesajı gönderildi.',
      botInfo: {
        id: botInfo.result.id,
        name: botInfo.result.first_name,
        username: botInfo.result.username
      }
    })
  } catch (error) {
    console.error('Telegram test error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Bağlantı hatası. Lütfen tekrar deneyin.' 
      },
      { status: 500 }
    )
  }
}
