'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { motion } from 'framer-motion'

const mockEvents = [
  { date: '2024-02-25', type: 'hearing', title: 'Boşanma Davası' },
  { date: '2024-02-22', type: 'task', title: 'Dilekçe hazırla' },
  { date: '2024-02-28', type: 'hearing', title: 'İş Davası' },
]

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week'>('month')

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }

  const days = getDaysInMonth(currentDate)
  const monthName = currentDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-24">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gradient">Takvim</h1>
          <p className="text-[hsl(var(--muted-foreground))]">Görevler ve duruşmalarınızı görüntüleyin</p>
        </div>

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
              const isToday = day === new Date().getDate() && 
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear()

              return (
                <motion.div
                  key={index}
                  whileHover={day ? { scale: 1.05 } : {}}
                  className={`aspect-square rounded-2xl p-2 flex flex-col items-center justify-center cursor-pointer transition-all ${
                    day
                      ? isToday
                        ? 'gradient-primary text-white shadow-lg'
                        : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))]'
                      : ''
                  }`}
                >
                  {day && (
                    <>
                      <span className="text-lg font-semibold">{day}</span>
                      <div className="flex gap-1 mt-1">
                        {/* Event indicators */}
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      </div>
                    </>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-[hsl(var(--card-border))]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-[hsl(var(--muted-foreground))]">Duruşma</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-sm text-[hsl(var(--muted-foreground))]">Görev</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
