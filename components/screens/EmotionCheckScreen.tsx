'use client'

import { Emotion } from '@/lib/types'
import { EmotionButton } from '@/components/ui/EmotionButton'

interface EmotionCheckScreenProps {
  onSelect: (emotion: Emotion | string) => void
}

const EMOTIONS = [
  { emotion: 'anxious' as Emotion, label: 'Anxious', emoji: '😰' },
  { emotion: 'sad' as Emotion, label: 'Sad', emoji: '😔' },
  { emotion: 'angry' as Emotion, label: 'Angry', emoji: '😤' },
  { emotion: 'overwhelmed' as Emotion, label: 'Overwhelmed', emoji: '😵' },
  { emotion: 'not-sure' as Emotion, label: 'Not sure', emoji: '🤷' },
  { emotion: 'something-else' as Emotion, label: 'Something else', emoji: '✏️' }
]

export function EmotionCheckScreen({ onSelect }: EmotionCheckScreenProps) {
  return (
    <div className="min-h-screen p-6 flex flex-col animate-fadeUp">
      <div className="mb-8">
        <h2 className="text-2xl font-light text-[var(--text)] mb-2">
          How are you feeling?
        </h2>
        <p className="text-sm text-[var(--text-muted)]">
          No right or wrong answer. Just a starting point.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {EMOTIONS.map(({ emotion, label, emoji }) => (
          <EmotionButton
            key={emotion}
            emotion={emotion}
            label={label}
            emoji={emoji}
            onClick={() => onSelect(emotion)}
          />
        ))}
      </div>
    </div>
  )
}
