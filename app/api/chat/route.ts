import { GoogleGenerativeAI } from '@google/generative-ai'
import { COACHES, CORE_BEHAVIORAL_INSTRUCTIONS } from '@/lib/coaches'
import { CoachKey, Message } from '@/lib/types'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY)

    const { messages, coachKey, emotion, exchangeCount } = await req.json()

    if (!messages || !coachKey || !emotion) {
      return new Response('Missing required fields', { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set in environment variables')
      return new Response('AI service not configured', { status: 500 })
    }

    const coach = COACHES[coachKey as CoachKey]
    if (!coach) {
      return new Response('Invalid coach', { status: 400 })
    }

    const systemInstruction = `${coach.systemPrompt}\n\n${CORE_BEHAVIORAL_INSTRUCTIONS}\n\nUser's initial emotion: ${emotion}\nExchange count: ${exchangeCount}`

    console.log('Initializing Gemini with model: gemini-2.0-flash')
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash'
    })

    // Prepend system instruction to first user message
    const history = messages.slice(0, -1).map((msg: Message) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))

    const lastMessage = messages[messages.length - 1]
    const messageWithSystem = history.length === 0
      ? `${systemInstruction}\n\nUser: ${lastMessage.content}`
      : lastMessage.content

    const chat = model.startChat({ history })

    // Use non-streaming generateContent since streamGenerateContent isn't supported
    const result = await chat.sendMessage(messageWithSystem)
    const response = await result.response
    const text = response.text()

    // Return as SSE format for compatibility with frontend
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    })
  } catch (error) {
    console.error('Gemini error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    return new Response('Internal server error', { status: 500 })
  }
}
