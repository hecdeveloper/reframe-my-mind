'use client'

import { useState, useCallback } from 'react'
import { CoachKey, Emotion, Message, SessionComplete, SessionSteering } from '@/lib/types'

interface UseChatProps {
  coachKey: CoachKey
  emotion: Emotion | string
  onSessionComplete: (data: SessionComplete) => void
}

export function useChat({ coachKey, emotion, onSessionComplete }: UseChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = { role: 'user', content }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          coachKey,
          emotion,
          exchangeCount: Math.floor((messages.length + 1) / 2)
        })
      })

      if (!response.ok) throw new Error('Chat request failed')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') break

              try {
                const parsed = JSON.parse(data)
                fullResponse += parsed.text
              } catch (e) {
                // Ignore parse errors
              }
            }
          }
        }
      }

      // Check for session complete or steering markers
      const sessionCompleteMatch = fullResponse.match(/\{\"__session_complete\":true,.*?\}/)
      const steeringMatch = fullResponse.match(/\{\"__steering\":true\}/)

      let displayResponse = fullResponse

      if (sessionCompleteMatch) {
        const sessionData = JSON.parse(sessionCompleteMatch[0])
        displayResponse = fullResponse.replace(sessionCompleteMatch[0], '').trim()

        setMessages((prev) => [...prev, { role: 'assistant', content: displayResponse }])
        setIsTyping(false)

        // Trigger completion callback
        setTimeout(() => onSessionComplete(sessionData), 500)
        return
      }

      if (steeringMatch) {
        displayResponse = fullResponse.replace(steeringMatch[0], '').trim()
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: displayResponse }])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm having trouble connecting right now. Could you try that again?"
        }
      ])
    } finally {
      setIsTyping(false)
    }
  }, [messages, coachKey, emotion, onSessionComplete])

  return {
    messages,
    input,
    setInput,
    isTyping,
    sendMessage
  }
}
