'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, Clock, Trash2, Archive } from 'lucide-react'

interface Task {
  id: string
  title: string
  clientName?: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  dueDate?: string
  urgent?: boolean
  important?: boolean
}

interface EisenhowerMatrixProps {
  tasks: Task[]
  onTaskClick?: (task: Task) => void
  onTaskMove?: (taskId: string, quadrant: string) => void
}

export function EisenhowerMatrix({ tasks, onTaskClick, onTaskMove }: EisenhowerMatrixProps) {
  // Görevleri kuadranlara ayır
  const categorizeTask = (task: Task) => {
    const isUrgent = task.urgent ?? (task.priority === 'critical' || task.priority === 'high')
    const isImportant = task.important ?? (task.priority === 'critical' || task.priority === 'high')
    
    if (isUrgent && isImportant) return 'urgent-important'
    if (!isUrgent && isImportant) return 'not-urgent-important'
    if (isUrgent && !isImportant) return 'urgent-not-important'
    return 'not-urgent-not-important'
  }

  const quadrants = {
    'urgent-important': tasks.filter(t => categorizeTask(t) === 'urgent-important'),
    'not-urgent-important': tasks.filter(t => categorizeTask(t) === 'not-urgent-important'),
    'urgent-not-important': tasks.filter(t => categorizeTask(t) === 'urgent-not-important'),
    'not-urgent-not-important': tasks.filter(t => categorizeTask(t) === 'not-urgent-not-important'),
  }

  const quadrantConfig = {
    'urgent-important': {
      title: 'Acil & Önemli',
      subtitle: 'Hemen Yap',
      icon: AlertCircle,
      color: 'red',
      bgClass: 'bg-red-500/10 border-red-500/20',
      textClass: 'text-red-600 dark:text-red-400',
    },
    'not-urgent-important': {
      title: 'Önemli',
      subtitle: 'Planla',
      icon: Clock,
      color: 'blue',
      bgClass: 'bg-blue-500/10 border-blue-500/20',
      textClass: 'text-blue-600 dark:text-blue-400',
    },
    'urgent-not-important': {
      title: 'Acil',
      subtitle: 'Delege Et',
      icon: Trash2,
      color: 'yellow',
      bgClass: 'bg-yellow-500/10 border-yellow-500/20',
      textClass: 'text-yellow-600 dark:text-yellow-400',
    },
    'not-urgent-not-important': {
      title: 'Ne Acil Ne Önemli',
      subtitle: 'Sil/Ertele',
      icon: Archive,
      color: 'gray',
      bgClass: 'bg-gray-500/10 border-gray-500/20',
      textClass: 'text-gray-600 dark:text-gray-400',
    },
  }

  return (
    <div className="space-y-4">
      {/* Matrix Header */}
      <div className="elite-card p-4">
        <h3 className="text-lg font-semibold mb-2">Eisenhower Matrisi</h3>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Görevlerinizi aciliyet ve önem derecesine göre önceliklendirin
        </p>
      </div>

      {/* Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(quadrants).map(([key, quadrantTasks]) => {
          const config = quadrantConfig[key as keyof typeof quadrantConfig]
          const Icon = config.icon

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`elite-card p-4 border-2 ${config.bgClass} min-h-[300px]`}
            >
              {/* Quadrant Header */}
              <div className="flex items-start gap-3 mb-4 pb-4 border-b border-[hsl(var(--card-border))]">
                <div className={`p-2 rounded-xl ${config.bgClass}`}>
                  <Icon className={`w-5 h-5 ${config.textClass}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{config.title}</h4>
                  <p className={`text-sm ${config.textClass}`}>{config.subtitle}</p>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    {quadrantTasks.length} görev
                  </span>
                </div>
              </div>

              {/* Tasks */}
              <div className="space-y-2">
                {quadrantTasks.length === 0 ? (
                  <div className="text-center py-8 text-sm text-[hsl(var(--muted-foreground))]">
                    Görev yok
                  </div>
                ) : (
                  quadrantTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => onTaskClick?.(task)}
                      className="p-3 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--card-border))] hover:shadow-md transition-all cursor-pointer"
                    >
                      <h5 className="font-medium text-sm mb-1">{task.title}</h5>
                      {task.clientName && (
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">
                          {task.clientName}
                        </p>
                      )}
                      {task.dueDate && (
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                          {new Date(task.dueDate).toLocaleDateString('tr-TR', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </p>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="elite-card p-4">
        <h4 className="font-semibold mb-3 text-sm">Nasıl Kullanılır?</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-medium text-red-600 dark:text-red-400">Acil & Önemli:</span>
            <span className="text-[hsl(var(--muted-foreground))]"> Krizler, son teslim tarihleri</span>
          </div>
          <div>
            <span className="font-medium text-blue-600 dark:text-blue-400">Önemli:</span>
            <span className="text-[hsl(var(--muted-foreground))]"> Planlama, gelişim, ilişkiler</span>
          </div>
          <div>
            <span className="font-medium text-yellow-600 dark:text-yellow-400">Acil:</span>
            <span className="text-[hsl(var(--muted-foreground))]"> Kesintiler, bazı toplantılar</span>
          </div>
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-400">Ne Acil Ne Önemli:</span>
            <span className="text-[hsl(var(--muted-foreground))]"> Zaman kaybı, oyalanma</span>
          </div>
        </div>
      </div>
    </div>
  )
}
