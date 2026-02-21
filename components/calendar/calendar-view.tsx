'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List, Clock, MapPin, CheckSquare } from 'lucide-react'
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

// Combined mock data from tasks and hearings
const mockTasks: Event[] = [
  {
    id: 't1',
    title: 'Dilekçe hazırla',
    type: 'task',
    date: '2025-01-21',
    clientName: 'Mehmet Demir',
    priority: 'high',
    completed: false
  },
  {
    id: 't2',
    title: 'Belge toplama',
    type: 'task',
    date: '2025-01-22',
    clientName: 'Ayşe Kaya',
    priority: 'medium',
    completed: false
  },
  {
    id: 't3',
    title: 'Mahkeme dosyası inceleme',
    type: 'task',
    date: '2025-01-23',
    clientName: 'Ali Yılmaz',
    priority: 'critical',
    completed: false
  },
  {
    id: 't4',
    title: 'Müvekkil görüşmesi',
    type: 'task',
    date: '2025-01-24',
    clientName: 'Fatma Öz',
    priority: 'low',
    completed: true
  },
  {
    id: 't5',
    title: 'İbraznamesi hazırla',
    type: 'task',
    date: '2025-01-25',
    clientName: 'Hasan Kara',
    priority: 'medium',
    completed: false
  },
]

const mockHearings: Event[] = [
  {
    id: 'h1',
    title: 'Boşanma Davası',
    type: 'hearing',
    date: '2025-01-22',
    time: '10:00',
    clientName: 'Ahmet Yılmaz',
    location: 'Salon 3'
  },
  {
    id: 'h2',
    title: 'İş Davası',
    type: 'hearing',
    date: '2025-01-24',
    time: '14:00',
    clientName: 'Zeynep Kara',
    location: 'Salon 1'
  },
  {
    id: 'h3',
    title: 'Tazminat Davası',
    type: 'hearing',
    date: '2025-01-27',
    time: '11:00',
    clientName: 'Mehmet Demir',
    location: 'Salon 2'
  },
]

// Combine all events
const allEvents = [...mockTasks, ...mockHearings]

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
    return allEvents.filter(event => event.date === dateStr)
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  // Get priority color
  const getPriorityColor = (priority?: string, completed?: boolean) => {
    if (completed) return 'bg-gray-400'
    switch (priority) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-purple-500'
    }
  }

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ]

  const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']

  // Stats for the current month
  const monthStats = useMemo(() => {
    const tasks = allEvents.filter(e => e.type === 'task')
    const hearings = allEvents.filter(e => e.type === 'hearing')
    const completed = tasks.filter(t => t.completed).length
    const pending = tasks.length - completed
    
    return {
      totalEvents: allEvents.length,
      tasks: tasks.length,
      hearings: hearings.length,
      completed,
      pending
    }
  }, [])

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
          
          {/* Month Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="glass-card p-3 text-center">
              <div className="text-xl font-bold text-blue-600">{monthStats.totalEvents}</div>
              <div className="text-xs text-gray-500">Toplam</div>
            </div>
            <div className="glass-card p-3 text-center">
              <div className="text-xl font-bold text-purple-600">{monthStats.tasks}</div>
              <div className="text-xs text-gray-500">Görev</div>
            </div>
            <div className="glass-card p-3 text-center">
              <div className="text-xl font-bold text-blue-600">{monthStats.hearings}</div>
              <div className="text-xs text-gray-500">Duruşma</div>
            </div>
            <div className="glass-card p-3 text-center">
              <div className="text-xl font-bold text-green-600">{monthStats.completed}</div>
              <div className="text-xs text-gray-500">Tamamlanan</div>
            </div>
          </div>
        </div>

        {view === 'month' ? (
          /* Month View */
          <div className="glass-card p-4 sm:p-6">
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
                        ? 'bg-[hsl(var(--primary))] text-white shadow-lg shadow-blue-500/30'
                        : events.length > 0
                          ? 'bg-blue-50 hover:bg-blue-100 border border-blue-200'
                          : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))]'
                    }`}
                    onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                  >
                    <div className="text-sm sm:text-base font-semibold mb-1">{day}</div>
                    <div className="space-y-0.5">
                      {events.slice(0, 3).map(event => (
                        <div
                          key={event.id}
                          className={`text-[10px] sm:text-xs px-1 py-0.5 rounded truncate ${
                            event.type === 'hearing'
                              ? 'bg-blue-500 text-white'
                              : getPriorityColor(event.priority, event.completed) + ' text-white'
                          } ${event.completed ? 'opacity-50' : ''}`}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                      {events.length > 3 && (
                        <div className="text-[10px] text-center opacity-70">
                          +{events.length - 3}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-500" />
                <span>Duruşma</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500" />
                <span>Kritik Görev</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-orange-500" />
                <span>Yüksek Görev</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-500" />
                <span>Orta Görev</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gray-400" />
                <span>Tamamlanan</span>
              </div>
            </div>
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {allEvents.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <CalendarIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-[hsl(var(--muted-foreground))]">Henüz etkinlik yok</p>
              </div>
            ) : (
              allEvents
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`glass-card p-4 hover:shadow-md transition-all ${event.completed ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-semibold ${
                      event.type === 'hearing'
                        ? 'bg-blue-100 text-blue-600'
                        : getPriorityColor(event.priority, event.completed) + ' text-white'
                    }`}>
                      {event.type === 'hearing' ? '⚖️' : '📋'}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className={`font-semibold text-base ${event.completed ? 'line-through text-gray-400' : ''}`}>
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
                          {new Date(event.date).toLocaleDateString('tr-TR', { 
                            day: '2-digit', 
                            month: 'short' 
                          })}
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
                        {event.priority && !event.completed && (
                          <span className={`text-xs px-2 py-0.5 rounded-lg ${
                            event.priority === 'critical' ? 'bg-red-100 text-red-600' :
                            event.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                            event.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {event.priority === 'critical' ? 'Kritik' :
                             event.priority === 'high' ? 'Yüksek' :
                             event.priority === 'medium' ? 'Orta' : 'Düşük'}
                          </span>
                        )}
                      </div>
                    </div>

                    {event.type === 'task' && (
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        event.completed 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-gray-300 hover:border-green-500'
                      }`}>
                        {event.completed && <CheckSquare className="w-4 h-4 text-white" />}
                      </div>
                    )}
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
