'use client'

import { useRef, useEffect } from 'react'
import { COACHES } from '@/lib/coaches'
import { CoachKey, Message } from '@/lib/types'
import { MessageBubble } from '@/components/ui/MessageBubble'
import { TypingIndicator } from '@/components/ui/TypingIndicator'
import { CoachSwitcherModal } from '@/components/ui/CoachSwitcherModal'

interface ChatScreenProps {
  coachKey: CoachKey
  messages: Message[]
  isTyping: boolean
  input: string
  onInputChange: (value: string) => void
  onSend: () => void
  onExit: () => void
  showCoachSwitcher: boolean
  onToggleCoachSwitcher: () => void
  onSwitchCoach: (coach: CoachKey) => void
}

export function ChatScreen({
  coachKey,
  messages,
  isTyping,
  input,
  onInputChange,
  onSend,
  onExit,
  showCoachSwitcher,
  onToggleCoachSwitcher,
  onSwitchCoach
}: ChatScreenProps) {
  const coach = COACHES[coachKey]
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim()) onSend()
    }
  }

  return (
    <div className="flex flex-col h-screen animate-fadeUp">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{coach.icon}</span>
          <div>
            <div className="font-medium text-[var(--text)]">{coach.name}</div>
            <div className="text-xs text-[var(--text-muted)] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              online
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleCoachSwitcher}
            className="px-3 py-1 text-xs border border-[var(--border)] rounded-full text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-all"
          >
            Switch
          </button>
          <button
            onClick={onExit}
            className="text-2xl text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors"
          >
            ×
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} coach={msg.role === 'assistant' ? coach : undefined} />
        ))}
        {isTyping && <TypingIndicator coach={coach} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            className="flex-1 bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] resize-none focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
          <button
            onClick={onSend}
            disabled={!input.trim()}
            className="px-6 py-3 bg-[var(--accent)] hover:bg-[#8c7aff] text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            Send
          </button>
        </div>
      </div>

      {/* Coach Switcher Modal */}
      {showCoachSwitcher && (
        <CoachSwitcherModal
          currentCoach={coachKey}
          onSelect={onSwitchCoach}
          onClose={onToggleCoachSwitcher}
        />
      )}
    </div>
  )
}
