import { SessionData } from './types'

export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export function saveSession(session: SessionData) {
  if (typeof window === 'undefined') return

  const sessions = getSessions()
  sessions.unshift(session)
  localStorage.setItem('reframe_sessions', JSON.stringify(sessions))
}

export function getSessions(): SessionData[] {
  if (typeof window === 'undefined') return []

  const data = localStorage.getItem('reframe_sessions')
  return data ? JSON.parse(data) : []
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
