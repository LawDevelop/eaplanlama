'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List, Clock, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

interface Event {
  id: string
  title: string
  type: 'task' | 'hearing'
  date: string
  time?: string
  clientName?: string
  location?: string
  priority?: 'low' | 'medium' | 'high' | 'critical'
  completed?: boolean
}

// Mock data
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Dilekçe hazırla',
    type: 'task',
    date: '2024-02-21',
    clientName: 'Mehmet Demir',
    priority: 'high',
    completed: false
  },
  {
    id: '2',
    title: 'Boşanma Davası',
    type: 'hearing',
    date: '2024-02-22',
    time: '10:00',
    clientName: 'Ahmet Yılmaz',
    location: 'Salon 3'
  },
  {
    id: '3',
    title: 'Belge toplama',
    type: 'task',
    date: '2024-02-23',
    clientName: 'Ayşe Kaya',
    priority: 'medium',
    completed: false
  },
]

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'list'>('month')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek }
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return mockEvents.filter(event => event.date === dateStr)
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ]

  const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']

  return (
    <div className="min-h-screen pb-24 lg:pb-6">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gradient">Takvim</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView(view === 'month' ? 'list' : 'month')}
                className="px-4 py-2 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] flex items-center gap-2 transition-colors"
              >
                {view === 'month' ? <List className="w-4 h-4" /> : <CalendarIcon className="w-4 h-4" />}
                {view === 'month' ? 'Liste' : 'Takvim'}
              </button>
            </div>
          </div>
        </div>

        {view === 'month' ? (
          /* Month View */
          <div className="elite-card p-4 sm:p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={goToPreviousMonth}
                className="w-10 h-10 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button
                  onClick={goToToday}
                  className="text-sm text-[hsl(var(--primary))] hover:underline mt-1"
                >
                  Bugüne Git
                </button>
              </div>

              <button
                onClick={goToNextMonth}
                className="w-10 h-10 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {/* Day Headers */}
              {dayNames.map(day => (
                <div key={day} className="text-center font-semibold text-sm sm:text-base p-2 text-[hsl(var(--muted-foreground))]">
                  {day}
                </div>
              ))}

              {/* Empty cells for days before month starts */}
              {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}

              {/* Calendar days */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1
                const events = getEventsForDate(day)
                const today = isToday(day)

                return (
                  <motion.div
                    key={day}
                    whileHover={{ scale: 1.05 }}
                    className={`aspect-square rounded-xl p-1 sm:p-2 cursor-pointer transition-all ${
                      today
                        ? 'bg-[hsl(var(--primary))] text-white'
                        : events.length > 0
                          ? 'bg-blue-50 hover:bg-blue-100 border border-blue-200'
                          : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))]'
                    }`}
                    onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                  >
                    <div className="text-sm sm:text-base font-semibold mb-1">{day}</div>
                    <div className="space-y-0.5">
                      {events.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className={`text-[10px] sm:text-xs px-1 py-0.5 rounded truncate ${
                            event.type === 'hearing'
                              ? 'bg-blue-500 text-white'
                              : 'bg-purple-500 text-white'
                          }`}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                      {events.length > 2 && (
                        <div className="text-[10px] text-center opacity-70">
                          +{events.length - 2}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-500" />
                <span>Duruşma</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-purple-500" />
                <span>Görev</span>
              </div>
            </div>
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {mockEvents.length === 0 ? (
              <div className="elite-card p-12 text-center">
                <CalendarIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-[hsl(var(--muted-foreground))]">Henüz etkinlik yok</p>
              </div>
            ) : (
              mockEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`elite-card p-4 hover:shadow-md transition-all ${
                    event.completed ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      event.type === 'hearing' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                    }`}>
                      {event.type === 'hearing' ? (
                        <CalendarIcon className="w-6 h-6" />
                      ) : (
                        <Clock className="w-6 h-6" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className={`font-semibold text-lg ${event.completed ? 'line-through' : ''}`}>
                          {event.title}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-lg ${
                          event.type === 'hearing' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                        }`}>
                          {event.type === 'hearing' ? 'Duruşma' : 'Görev'}
                        </span>
                      </div>

                      {event.clientName && (
                        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">
                          {event.clientName}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-sm text-[hsl(var(--muted-foreground))]">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {new Date(event.date).toLocaleDateString('tr-TR')}
                        </span>
                        {event.time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {event.time}
                          </span>
                        )}
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
