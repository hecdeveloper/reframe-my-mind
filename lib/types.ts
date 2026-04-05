export type CoachKey = 'sage' | 'frank' | 'nova' | 'mirror'

export type Emotion = 'anxious' | 'sad' | 'angry' | 'overwhelmed' | 'not-sure' | 'something-else'

export interface Coach {
  name: string
  icon: string
  color: string
  bg: string
  tagline: string
  sample: string
  systemPrompt: string
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface SessionData {
  reframe: string
  distortion: string
  action: string
  coach: CoachKey
  emotion: Emotion | string
  messages: Message[]
  timestamp: number
}

export interface SessionComplete {
  __session_complete: true
  reframe: string
  distortion: string
  action: string
}

export interface SessionSteering {
  __steering: true
}
