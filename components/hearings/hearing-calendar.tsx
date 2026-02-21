'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Hearing } from '@/hooks/use-supabase-data'

interface HearingCalendarProps {
  hearings: Hearing[]
  onHearingClick?: (hearing: Hearing) => void
}

export function HearingCalendar({ hearings, onHearingClick }: HearingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (number | null)[] = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }

  const getHearingsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return hearings.filter(h => h.hearing_date.startsWith(dateStr))
  }

  const days = getDaysInMonth(currentDate)
  const monthName = currentDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const selectedDayHearings = selectedDate ? getHearingsForDate(selectedDate.getDate()) : []

  return (
    <div className="space-y-6">
      <div className="elite-card p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold capitalize">{monthName}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={previousMonth}
              className="w-10 h-10 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMonth}
              className="w-10 h-10 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-[hsl(var(--muted-foreground))] py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            if (!day) return <div key={index} />

            const isToday = day === new Date().getDate() && 
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear()

            const dayHearings = getHearingsForDate(day)
            const isSelected = selectedDate?.getDate() === day &&
              selectedDate?.getMonth() === currentDate.getMonth() &&
              selectedDate?.getFullYear() === currentDate.getFullYear()

            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                className={`aspect-square rounded-2xl p-2 flex flex-col items-center justify-start cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[hsl(var(--primary))] text-white shadow-lg'
                    : isToday
                    ? 'bg-blue-500/20 border-2 border-blue-500'
                    : dayHearings.length > 0
                    ? 'bg-[hsl(var(--accent))] hover:bg-[hsl(var(--muted))]'
                    : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))]'
                }`}
              >
                <span className="text-sm font-semibold mb-1">{day}</span>
                {dayHearings.length > 0 && (
                  <div className="flex flex-wrap gap-1 justify-center">
                    {dayHearings.slice(0, 3).map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-500'}`} />
                    ))}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Selected Day Hearings */}
      {selectedDate && selectedDayHearings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="elite-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4">
            {selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })} - Duruşmalar
          </h3>
          <div className="space-y-3">
            {selectedDayHearings.map((hearing) => {
              const time = new Date(hearing.hearing_date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
              return (
                <div
                  key={hearing.id}
                  onClick={() => onHearingClick?.(hearing)}
                  className="p-4 rounded-2xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{hearing.title}</h4>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">{hearing.client_name}</p>
                      <div className="flex items-center gap-4 text-xs text-[hsl(var(--muted-foreground))]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {hearing.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </div>
  )
}
