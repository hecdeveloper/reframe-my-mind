'use client'

import { COACHES } from '@/lib/coaches'
import { CoachKey } from '@/lib/types'

interface CoachSwitcherModalProps {
  currentCoach: CoachKey
  onSelect: (coach: CoachKey) => void
  onClose: () => void
}

export function CoachSwitcherModal({ currentCoach, onSelect, onClose }: CoachSwitcherModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 max-w-sm w-full animate-fadeUp">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-[var(--text)]">Switch coach</h3>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text)] text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-2">
          {(Object.keys(COACHES) as CoachKey[]).map((key) => {
            const coach = COACHES[key]
            const isCurrent = key === currentCoach
            return (
              <button
                key={key}
                onClick={() => {
                  onSelect(key)
                  onClose()
                }}
                disabled={isCurrent}
                className="w-full p-4 rounded-xl border border-[var(--border)] bg-[var(--surface2)] hover:bg-[var(--surface)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{coach.icon}</span>
                  <div>
                    <div className="font-medium text-[var(--text)]">{coach.name}</div>
                    <div className="text-sm text-[var(--text-muted)]">{coach.tagline}</div>
                  </div>
                  {isCurrent && (
                    <span className="ml-auto text-xs text-[var(--accent)]">Current</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
