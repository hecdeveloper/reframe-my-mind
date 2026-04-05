'use client'

import { useState, useEffect } from 'react'
import { CoachKey, Emotion, SessionData, SessionComplete } from '@/lib/types'
import { saveSession, getSessions } from '@/lib/utils'
import { useChat } from '@/hooks/useChat'
import { WelcomeScreen } from '@/components/screens/WelcomeScreen'
import { CoachSelectScreen } from '@/components/screens/CoachSelectScreen'
import { EmotionCheckScreen } from '@/components/screens/EmotionCheckScreen'
import { ChatScreen } from '@/components/screens/ChatScreen'
import { SummaryScreen } from '@/components/screens/SummaryScreen'
import { HistoryScreen } from '@/components/screens/HistoryScreen'

type Screen = 'welcome' | 'coach-select' | 'emotion-check' | 'chat' | 'summary' | 'history'

export default function Home() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [selectedCoach, setSelectedCoach] = useState<CoachKey | null>(null)
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | string | null>(null)
  const [sessionComplete, setSessionComplete] = useState<SessionComplete | null>(null)
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [showCoachSwitcher, setShowCoachSwitcher] = useState(false)

  // Load sessions from localStorage
  useEffect(() => {
    setSessions(getSessions())
  }, [screen])

  const chat = useChat({
    coachKey: selectedCoach!,
    emotion: selectedEmotion!,
    onSessionComplete: (data) => {
      setSessionComplete(data)
      setScreen('summary')

      // Save session to localStorage
      const sessionData: SessionData = {
        ...data,
        coach: selectedCoach!,
        emotion: selectedEmotion!,
        messages: chat.messages,
        timestamp: Date.now()
      }
      saveSession(sessionData)
    }
  })

  const handleNewSession = () => {
    setScreen('coach-select')
    setSelectedCoach(null)
    setSelectedEmotion(null)
    setSessionComplete(null)
  }

  const handleSwitchCoach = (newCoach: CoachKey) => {
    setSelectedCoach(newCoach)
  }

  const handleExitChat = () => {
    if (confirm('Exit this session? Your progress will be lost.')) {
      handleNewSession()
    }
  }

  return (
    <main className="min-h-screen">
      {screen === 'welcome' && (
        <WelcomeScreen onStart={() => setScreen('coach-select')} />
      )}

      {screen === 'coach-select' && (
        <CoachSelectScreen
          onSelect={(coach) => {
            setSelectedCoach(coach)
            setScreen('emotion-check')
          }}
        />
      )}

      {screen === 'emotion-check' && (
        <EmotionCheckScreen
          onSelect={(emotion) => {
            setSelectedEmotion(emotion)
            setScreen('chat')
          }}
        />
      )}

      {screen === 'chat' && selectedCoach && selectedEmotion && (
        <ChatScreen
          coachKey={selectedCoach}
          messages={chat.messages}
          isTyping={chat.isTyping}
          input={chat.input}
          onInputChange={chat.setInput}
          onSend={() => chat.sendMessage(chat.input)}
          onExit={handleExitChat}
          showCoachSwitcher={showCoachSwitcher}
          onToggleCoachSwitcher={() => setShowCoachSwitcher(!showCoachSwitcher)}
          onSwitchCoach={handleSwitchCoach}
        />
      )}

      {screen === 'summary' && sessionComplete && selectedCoach && (
        <SummaryScreen
          reframe={sessionComplete.reframe}
          distortion={sessionComplete.distortion}
          action={sessionComplete.action}
          coachKey={selectedCoach}
          onNewSession={handleNewSession}
          onViewHistory={() => setScreen('history')}
        />
      )}

      {screen === 'history' && (
        <HistoryScreen
          sessions={sessions}
          onBack={() => setScreen('welcome')}
        />
      )}
    </main>
  )
}
