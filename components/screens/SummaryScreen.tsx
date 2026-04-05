'use client'

import { useState } from 'react'
import { COACHES } from '@/lib/coaches'
import { CoachKey } from '@/lib/types'

interface SummaryScreenProps {
  reframe: string
  distortion: string
  action: string
  coachKey: CoachKey
  onNewSession: () => void
  onViewHistory: () => void
}

export function SummaryScreen({
  reframe,
  distortion,
  action,
  coachKey,
  onNewSession,
  onViewHistory
}: SummaryScreenProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sent, setSent] = useState(false)

  const coach = COACHES[coachKey]

  const handleSendEmail = async () => {
    if (!name || !email) return

    setIsSending(true)
    try {
      const response = await fetch('/api/send-recap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          session: { reframe, distortion, action, coach: coachKey }
        })
      })

      if (response.ok) {
        setSent(true)
      }
    } catch (error) {
      console.error('Failed to send email:', error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen p-6 flex flex-col animate-fadeUp">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{coach.icon}</span>
          <span className="text-sm text-[var(--text-muted)]">Session complete</span>
        </div>
        <h2 className="text-3xl font-serif italic text-[var(--text)] leading-relaxed mb-6">
          {reframe}
        </h2>
        <div className="inline-block px-4 py-2 bg-[var(--accent-soft)] text-[var(--accent)] rounded-full text-sm font-medium mb-6">
          {distortion}
        </div>
        <p className="text-[var(--text-dim)] leading-relaxed">
          {action}
        </p>
      </div>

      {!sent ? (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 mb-6">
          <h3 className="text-sm font-medium text-[var(--text)] mb-4">
            Get this recap by email
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
            />
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSendEmail}
                disabled={!name || !email || isSending}
                className="flex-1 py-3 bg-[var(--accent)] hover:bg-[#8c7aff] text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {isSending ? 'Sending...' : 'Send'}
              </button>
              <button
                onClick={() => setSent(true)}
                className="px-4 py-3 text-[var(--text-muted)] hover:text-[var(--text)] text-sm transition-colors"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 mb-6 text-center">
          <div className="text-3xl mb-2">✓</div>
          <p className="text-sm text-[var(--text-muted)]">
            Recap sent to {email}
          </p>
        </div>
      )}

      <div className="mt-auto space-y-3">
        <button
          onClick={onNewSession}
          className="w-full py-4 bg-[var(--accent)] hover:bg-[#8c7aff] text-white font-medium rounded-full transition-all active:scale-95"
        >
          New session
        </button>
        <button
          onClick={onViewHistory}
          className="w-full py-4 border border-[var(--border)] text-[var(--text)] font-medium rounded-full hover:bg-[var(--surface)] transition-all active:scale-95"
        >
          All recaps
        </button>
      </div>
    </div>
  )
}
