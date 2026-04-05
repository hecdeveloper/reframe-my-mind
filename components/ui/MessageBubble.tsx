'use client'

import { Message } from '@/lib/types'
import { Coach } from '@/lib/types'

interface MessageBubbleProps {
  message: Message
  coach?: Coach
}

export function MessageBubble({ message, coach }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-msgIn`}>
      <div
        className={`max-w-[80%] p-4 rounded-2xl ${
          isUser
            ? 'bg-[var(--accent)] text-white'
            : 'bg-[var(--surface2)] text-[var(--text)]'
        }`}
        style={
          !isUser && coach
            ? {
                background: coach.bg,
                color: coach.color,
                borderLeft: `3px solid ${coach.color}`
              }
            : undefined
        }
      >
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
      </div>
    </div>
  )
}
