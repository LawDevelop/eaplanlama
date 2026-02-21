import { NextRequest, NextResponse } from 'next/server'

// Telegram API base URL
const TELEGRAM_API_URL = 'https://api.telegram.org/bot'

interface TelegramMessage {
  chat_id: string
  text: string
  parse_mode?: 'Markdown' | 'HTML'
  disable_web_page_preview?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const { botToken, chatId, message, parseMode = 'Markdown' } = await request.json()

    if (!botToken || !chatId || !message) {
      return NextResponse.json(
        { error: 'Bot token, chat ID and message are required' },
        { status: 400 }
      )
    }

    const telegramMessage: TelegramMessage = {
      chat_id: chatId,
      text: message,
      parse_mode: parseMode,
      disable_web_page_preview: true
    }

    const response = await fetch(
      `${TELEGRAM_API_URL}${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(telegramMessage),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.description || 'Failed to send message' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      data
    })
  } catch (error) {
    console.error('Telegram send error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
