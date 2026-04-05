'use client'

import { Coach } from '@/lib/types'
import { cn } from '@/lib/utils'

interface CoachCardProps {
  coach: Coach
  selected: boolean
  onClick: () => void
}

export function CoachCard({ coach, selected, onClick }: CoachCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-6 rounded-2xl border transition-all text-left',
        'hover:scale-[1.02] active:scale-[0.98]',
        selected
          ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
          : 'border-[var(--border)] bg-[var(--surface)]'
      )}
      style={{
        '--coach-color': coach.color,
        '--coach-bg': coach.bg
      } as React.CSSProperties}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{coach.icon}</span>
        <div>
          <div className="font-medium text-[var(--text)]">{coach.name}</div>
          <div className="text-sm text-[var(--text-muted)]">{coach.tagline}</div>
        </div>
      </div>
      {selected && (
        <div
          className="text-sm leading-relaxed mt-4 p-3 rounded-lg animate-fadeIn"
          style={{ background: coach.bg, color: coach.color }}
        >
          {coach.sample}
        </div>
      )}
    </button>
  )
}
