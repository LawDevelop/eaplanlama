'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Task } from '@/hooks/use-supabase-data'

interface TaskCalendarProps {
  tasks: Task[]
  onTaskClick?: (task: Task) => void
}

const priorityColors = {
  low: 'bg-blue-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
}

export function TaskCalendar({ tasks, onTaskClick }: TaskCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

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

  const getTasksForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return tasks.filter(task => task.due_date === dateStr)
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
          
          const dayTasks = day ? getTasksForDate(day) : []

          return (
            <motion.div
              key={index}
              whileHover={day ? { scale: 1.05 } : {}}
              className={`min-h-[80px] rounded-2xl p-2 flex flex-col transition-all ${
                day
                  ? isToday
                    ? 'gradient-primary text-white shadow-lg'
                    : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))]'
                  : ''
              } ${dayTasks.length > 0 ? 'cursor-pointer' : ''}`}
            >
              {day && (
                <>
                  <span className="text-sm font-semibold mb-1">{day}</span>
                  <div className="flex flex-col gap-1">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        onClick={() => onTaskClick?.(task)}
                        className={`w-full h-1.5 rounded-full ${priorityColors[task.priority]} cursor-pointer hover:opacity-80 transition-opacity`}
                        title={task.title}
                      />
                    ))}
                    {dayTasks.length > 3 && (
                      <span className="text-[10px] text-center">+{dayTasks.length - 3}</span>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-[hsl(var(--card-border))]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-sm text-[hsl(var(--muted-foreground))]">Düşük</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-sm text-[hsl(var(--muted-foreground))]">Orta</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span className="text-sm text-[hsl(var(--muted-foreground))]">Yüksek</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-sm text-[hsl(var(--muted-foreground))]">Kritik</span>
        </div>
      </div>
    </div>
  )
}
