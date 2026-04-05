'use client'

import { useState } from 'react'
import { SessionData } from '@/lib/types'
import { COACHES } from '@/lib/coaches'
import { formatDate } from '@/lib/utils'

interface HistoryScreenProps {
  sessions: SessionData[]
  onBack: () => void
}

export function HistoryScreen({ sessions, onBack }: HistoryScreenProps) {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div className="min-h-screen p-6 animate-fadeUp">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="text-2xl text-[var(--text-muted)] hover:text-[var(--text)]"
        >
          ←
        </button>
        <div>
          <h2 className="text-2xl font-light text-[var(--text)]">Your recaps</h2>
          <p className="text-sm text-[var(--text-muted)]">{sessions.length} sessions</p>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-12 text-[var(--text-muted)]">
          No sessions yet. Start your first one!
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session, i) => {
            const coach = COACHES[session.coach]
            const isExpanded = expanded === i

            return (
              <div
                key={i}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 cursor-pointer hover:bg-[var(--surface2)] transition-all"
                onClick={() => setExpanded(isExpanded ? null : i)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{coach.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-[var(--text-muted)]">
                        {formatDate(session.timestamp)}
                      </span>
                      <span className="text-xs text-[var(--text-dim)]">·</span>
                      <span className="text-xs text-[var(--text-dim)] capitalize">
                        {session.emotion}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text)] font-serif italic line-clamp-2">
                      {session.reframe}
                    </p>
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-3 animate-fadeIn">
                        <div>
                          <div className="text-xs text-[var(--text-muted)] mb-1">Pattern</div>
                          <span className="inline-block px-3 py-1 bg-[var(--accent-soft)] text-[var(--accent)] rounded-full text-xs">
                            {session.distortion}
                          </span>
                        </div>
                        <div>
                          <div className="text-xs text-[var(--text-muted)] mb-1">Action</div>
                          <p className="text-sm text-[var(--text-dim)]">{session.action}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
