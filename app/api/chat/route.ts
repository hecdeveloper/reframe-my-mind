import { GoogleGenerativeAI } from '@google/generative-ai'
import { COACHES, CORE_BEHAVIORAL_INSTRUCTIONS } from '@/lib/coaches'
import { CoachKey, Message } from '@/lib/types'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { messages, coachKey, emotion, exchangeCount } = await req.json()

    if (!messages || !coachKey || !emotion) {
      return new Response('Missing required fields', { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return new Response('AI service not configured', { status: 500 })
    }

    const coach = COACHES[coachKey as CoachKey]
    if (!coach) {
      return new Response('Invalid coach', { status: 400 })
    }

    const systemInstruction = `${coach.systemPrompt}\n\n${CORE_BEHAVIORAL_INSTRUCTIONS}\n\nUser's initial emotion: ${emotion}\nExchange count: ${exchangeCount}`

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction
    })

    const history = messages.slice(0, -1).map((msg: Message) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))

    const chat = model.startChat({ history })
    const lastMessage = messages[messages.length - 1]

    const result = await chat.sendMessageStream(lastMessage.content)

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          controller.error(error)
        }
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
    console.error('Chat API error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
