'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Coffee, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

interface PomodoroTimerProps {
  taskId: string
  onSessionComplete?: (duration: number) => void
}

type SessionType = 'work' | 'short_break' | 'long_break'

export function PomodoroTimer({ taskId, onSessionComplete }: PomodoroTimerProps) {
  const [sessionType, setSessionType] = useState<SessionType>('work')
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 dakika
  const [isRunning, setIsRunning] = useState(false)
  const [completedPomodoros, setCompletedPomodoros] = useState(0)

  const durations = {
    work: 25 * 60,
    short_break: 5 * 60,
    long_break: 15 * 60,
  }

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleSessionComplete()
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const handleSessionComplete = () => {
    setIsRunning(false)
    
    if (sessionType === 'work') {
      const newCount = completedPomodoros + 1
      setCompletedPomodoros(newCount)
      onSessionComplete?.(25)
      
      // 4 pomodoro sonra uzun mola
      if (newCount % 4 === 0) {
        setSessionType('long_break')
        setTimeLeft(durations.long_break)
      } else {
        setSessionType('short_break')
        setTimeLeft(durations.short_break)
      }
    } else {
      setSessionType('work')
      setTimeLeft(durations.work)
    }

    // Bildirim gönder
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Tamamlandı!', {
        body: sessionType === 'work' ? 'Mola zamanı!' : 'Çalışma zamanı!',
        icon: '/logo.png'
      })
    }
  }

  const toggleTimer = () => {
    if (!isRunning && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(durations[sessionType])
  }

  const switchSession = (type: SessionType) => {
    setSessionType(type)
    setTimeLeft(durations[type])
    setIsRunning(false)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const progress = ((durations[sessionType] - timeLeft) / durations[sessionType]) * 100

  return (
    <div className="elite-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Pomodoro Timer</h3>
        <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
          <Clock className="w-4 h-4" />
          <span>{completedPomodoros} tamamlandı</span>
        </div>
      </div>

      {/* Session Type Selector */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => switchSession('work')}
          className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
            sessionType === 'work'
              ? 'gradient-primary text-white'
              : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))]'
          }`}
        >
          Çalışma
        </button>
        <button
          onClick={() => switchSession('short_break')}
          className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
            sessionType === 'short_break'
              ? 'gradient-success text-white'
              : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))]'
          }`}
        >
          Kısa Mola
        </button>
        <button
          onClick={() => switchSession('long_break')}
          className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
            sessionType === 'long_break'
              ? 'gradient-success text-white'
              : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))]'
          }`}
        >
          Uzun Mola
        </button>
      </div>

      {/* Timer Display */}
      <div className="relative mb-6">
        <svg className="w-full h-48" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="hsl(var(--secondary))"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <motion.circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke={sessionType === 'work' ? 'hsl(var(--primary))' : 'hsl(var(--success))'}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 80}`}
            strokeDashoffset={`${2 * Math.PI * 80 * (1 - progress / 100)}`}
            transform="rotate(-90 100 100)"
            initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 80 * (1 - progress / 100) }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        
        {/* Time text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-bold">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <div className="text-sm text-[hsl(var(--muted-foreground))] mt-2">
            {sessionType === 'work' ? 'Çalışma' : sessionType === 'short_break' ? 'Kısa Mola' : 'Uzun Mola'}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={toggleTimer}
          className="flex-1 elite-btn-primary flex items-center justify-center gap-2"
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5" />
              Duraklat
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Başlat
            </>
          )}
        </button>
        <button
          onClick={resetTimer}
          className="px-4 py-3 rounded-2xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Stats */}
      <div className="mt-6 pt-6 border-t border-[hsl(var(--card-border))]">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-[hsl(var(--primary))]">
              {completedPomodoros}
            </div>
            <div className="text-xs text-[hsl(var(--muted-foreground))]">Pomodoro</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[hsl(var(--success))]">
              {completedPomodoros * 25}
            </div>
            <div className="text-xs text-[hsl(var(--muted-foreground))]">Dakika</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[hsl(var(--warning))]">
              {Math.floor(completedPomodoros / 4)}
            </div>
            <div className="text-xs text-[hsl(var(--muted-foreground))]">Döngü</div>
          </div>
        </div>
      </div>
    </div>
  )
}
