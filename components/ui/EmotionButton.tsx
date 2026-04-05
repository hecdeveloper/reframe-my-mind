'use client'

import { Emotion } from '@/lib/types'

interface EmotionButtonProps {
  emotion: Emotion
  label: string
  emoji: string
  onClick: () => void
}

export function EmotionButton({ label, emoji, onClick }: EmotionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface2)] hover:border-[var(--accent)] transition-all active:scale-95"
    >
      <div className="text-3xl mb-2">{emoji}</div>
      <div className="text-sm font-medium text-[var(--text)]">{label}</div>
    </button>
  )
}
