'use client'

interface WelcomeScreenProps {
  onStart: () => void
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fadeUp">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-light tracking-[0.2em] text-[var(--accent)] mb-4">
          re·frame
        </h1>
        <p className="text-xl text-[var(--text)] mb-2 font-light">
          Shift how you see it
        </p>
        <p className="text-sm text-[var(--text-muted)] max-w-xs">
          A brief conversation with a CBT coach to reframe unhelpful thoughts
        </p>
      </div>

      <button
        onClick={onStart}
        className="px-8 py-4 bg-[var(--accent)] hover:bg-[#8c7aff] text-white font-medium rounded-full transition-all active:scale-95"
      >
        Start a session
      </button>
    </div>
  )
}
