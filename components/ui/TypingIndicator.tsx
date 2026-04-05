'use client'

import { Coach } from '@/lib/types'

interface TypingIndicatorProps {
  coach: Coach
}

export function TypingIndicator({ coach }: TypingIndicatorProps) {
  return (
    <div className="flex justify-start animate-msgIn">
      <div
        className="p-4 rounded-2xl flex items-center gap-1"
        style={{
          background: coach.bg,
          color: coach.color,
          borderLeft: `3px solid ${coach.color}`
        }}
      >
        <div className="w-2 h-2 rounded-full bg-current animate-pulse [animation-delay:0ms]" />
        <div className="w-2 h-2 rounded-full bg-current animate-pulse [animation-delay:150ms]" />
        <div className="w-2 h-2 rounded-full bg-current animate-pulse [animation-delay:300ms]" />
      </div>
    </div>
  )
}
