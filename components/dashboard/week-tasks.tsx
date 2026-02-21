'use client'

import { useState } from 'react'
import { CheckCircle, Circle, Clock, AlertTriangle, Flag } from 'lucide-react'
import { motion } from 'framer-motion'

interface Task {
  id: string
  title: string
  clientName: string
  fileNumber: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  dueDate: string
  completed: boolean
}

interface WeekTasksProps {
  view: 'today' | 'week'
  onToggleView: () => void
}

export function WeekTasks({ view, onToggleView }: WeekTasksProps) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Dilekçe hazırla',
      clientName: 'Mehmet Demir',
      fileNumber: '2024/123',
      priority: 'high',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false
    },
    {
      id: '2',
      title: 'Belge toplama',
      clientName: 'Ayşe Kaya',
      fileNumber: '2024/124',
      priority: 'medium',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false
    },
    {
      id: '3',
      title: 'Mahkeme dosyası inceleme',
      clientName: 'Ali Yılmaz',
      fileNumber: '2024/125',
      priority: 'critical',
      dueDate: new Date().toISOString(),
      completed: false
    },
    {
      id: '4',
      title: 'Müvekkil toplantısı',
      clientName: 'Fatma Çelik',
      fileNumber: '2024/126',
      priority: 'low',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false
    }
  ])

  const getWeekTasks = () => {
    const now = new Date()
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    return tasks.filter(t => {
      const dueDate = new Date(t.dueDate)
      return dueDate <= weekFromNow
    })
  }

  const getTodayTasks = () => {
    const today = new Date().toDateString()
    return tasks.filter(t => new Date(t.dueDate).toDateString() === today)
  }

  const displayTasks = view === 'week' ? getWeekTasks() : getTodayTasks()
  const displayCount = displayTasks.length
  const completedCount = displayTasks.filter(t => t.completed).length

  const priorityConfig = {
    critical: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Kritik', icon: AlertTriangle },
    high: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'Yüksek', icon: Flag },
    medium: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Orta', icon: Flag },
    low: { color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200', label: 'Düşük', icon: Flag },
  }

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Bugün'
    if (diffDays === 1) return 'Yarın'
    if (diffDays === -1) return 'Dün'
    if (diffDays < -1) return `${Math.abs(diffDays)} gün gecikmiş`
    return `${diffDays} gün kaldı`
  }

  const isOverdue = (dateString: string) => {
    return new Date(dateString) < new Date()
  }

  const toggleComplete = (id: string) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">Görevler</h3>
            <p className="text-sm text-gray-500">
              {completedCount}/{displayCount} tamamlandı
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleView}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              view === 'today'
                ? 'bg-purple-50 text-purple-600'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            Bugün
          </button>
          <button
            onClick={onToggleView}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              view === 'week'
                ? 'bg-purple-50 text-purple-600'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            Bu Hafta
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
          style={{ width: `${displayCount > 0 ? (completedCount / displayCount) * 100 : 0}%` }}
        />
      </div>

      {/* Tasks List */}
      {displayTasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
          <CheckCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Planlanmış görev yok</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayTasks.map((task, index) => {
            const config = priorityConfig[task.priority]
            const overdue = isOverdue(task.dueDate) && !task.completed

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl border p-4 transition-all ${
                  task.completed 
                    ? 'border-green-200 opacity-60' 
                    : overdue
                      ? 'border-red-200 bg-red-50/30'
                      : 'border-gray-100 hover:border-purple-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Priority Badge */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center`}>
                    <config.icon className={`w-5 h-5 ${config.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold text-gray-900 ${
                      task.completed ? 'line-through' : ''
                    }`}>
                      {task.title}
                    </h4>
                    <div className="text-sm text-gray-500 mt-1">
                      {task.clientName} • {task.fileNumber}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg ${
                        overdue ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {formatRelativeDate(task.dueDate)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-lg ${config.bg} ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleComplete(task.id)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        task.completed
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-600'
                      }`}
                      title="Tamamla"
                    >
                      {task.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all"
                      title="Sil"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* View All Link */}
      <button className="w-full py-3 text-center text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors">
        Tüm Görevleri Gör →
      </button>
    </div>
  )
}
