'use client'

import { useState } from 'react'
import { COACHES } from '@/lib/coaches'
import { CoachKey } from '@/lib/types'
import { CoachCard } from '@/components/ui/CoachCard'

interface CoachSelectScreenProps {
  onSelect: (coach: CoachKey) => void
}

export function CoachSelectScreen({ onSelect }: CoachSelectScreenProps) {
  const [selected, setSelected] = useState<CoachKey | null>(null)

  return (
    <div className="min-h-screen p-6 flex flex-col animate-fadeUp">
      <div className="mb-8">
        <h2 className="text-2xl font-light text-[var(--text)] mb-2">
          Choose your coach
        </h2>
        <p className="text-sm text-[var(--text-muted)]">
          Each has a different approach. Pick what feels right.
        </p>
      </div>

      <div className="space-y-4 mb-8 flex-1">
        {(Object.keys(COACHES) as CoachKey[]).map((key) => (
          <CoachCard
            key={key}
            coach={COACHES[key]}
            selected={selected === key}
            onClick={() => setSelected(key)}
          />
        ))}
      </div>

      <button
        onClick={() => selected && onSelect(selected)}
        disabled={!selected}
        className="w-full py-4 bg-[var(--accent)] hover:bg-[#8c7aff] text-white font-medium rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 mt-auto"
      >
        Continue
      </button>
    </div>
  )
}
