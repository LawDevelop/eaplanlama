'use client'

import { useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { Check, Trash2, Clock, User, CheckCircle, Edit3 } from 'lucide-react'
import { motion, useMotionValue, useTransform } from 'framer-motion'

interface Task {
  id: string
  title: string
  clientName?: string
  fileNumber?: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  dueDate?: string
  completed: boolean
  tags?: string[]
}

interface SwipeableTaskProps {
  task: Task
  onComplete?: (id: string) => void
  onDelete?: (id: string) => void
  onClick?: () => void
}

const priorityConfig = {
  low: { 
    label: 'Düşük', 
    class: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' 
  },
  medium: { 
    label: 'Orta', 
    class: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20' 
  },
  high: { 
    label: 'Yüksek', 
    class: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' 
  },
  critical: { 
    label: 'Kritik', 
    class: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' 
  },
}

export function SwipeableTask({ task, onComplete, onDelete, onClick }: SwipeableTaskProps) {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)
  const x = useMotionValue(0)
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5])

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      const deltaX = eventData.deltaX
      x.set(deltaX)
      
      if (deltaX > 50) {
        setSwipeDirection('right')
      } else if (deltaX < -50) {
        setSwipeDirection('left')
      } else {
        setSwipeDirection(null)
      }
    },
    onSwiped: (eventData) => {
      const deltaX = eventData.deltaX
      
      if (deltaX > 120) {
        // Sağa kaydır - Tamamla
        onComplete?.(task.id)
      } else if (deltaX < -120) {
        // Sola kaydır - Sil
        onDelete?.(task.id)
      }
      
      x.set(0)
      setSwipeDirection(null)
    },
    trackMouse: true,
    trackTouch: true,
  })

  const config = priorityConfig[task.priority]

  const handleClick = (e: React.MouseEvent) => {
    // Swipe sırasında tıklamayı engelle
    const currentX = x.get()
    if (Math.abs(currentX) < 10) {
      onClick?.()
    }
  }

  return (
    <div className="relative overflow-hidden rounded-3xl">
      {/* Background actions */}
      <div className="absolute inset-0 flex items-center justify-between px-8">
        <div className="flex items-center gap-2 text-[hsl(var(--success))]">
          <Check className="w-6 h-6" />
          <span className="font-semibold">Tamamla</span>
        </div>
        <div className="flex items-center gap-2 text-[hsl(var(--danger))]">
          <span className="font-semibold">Sil</span>
          <Trash2 className="w-6 h-6" />
        </div>
      </div>

      {/* Task card */}
      <motion.div
        {...handlers}
        style={{ x, opacity }}
        onClick={handleClick}
        className={`relative elite-card p-5 cursor-pointer transition-all touch-none ${
          swipeDirection === 'right' ? 'border-[hsl(var(--success))]' : ''
        } ${
          swipeDirection === 'left' ? 'border-[hsl(var(--danger))]' : ''
        }`}
      >
        <div className="flex items-start gap-4">
          <div className="flex-1 space-y-3">
            <h3 className="font-semibold text-lg">{task.title}</h3>
            
            {task.clientName && (
              <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                <User className="w-4 h-4" />
                <span>{task.clientName}</span>
                {task.fileNumber && <span>• {task.fileNumber}</span>}
              </div>
            )}
            
            {task.dueDate && (
              <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                <Clock className="w-4 h-4" />
                <span>{new Date(task.dueDate).toLocaleDateString('tr-TR', { 
                  day: '2-digit', 
                  month: 'long' 
                })}</span>
              </div>
            )}

            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded-lg bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${config.class}`}>
              {config.label}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onComplete?.(task.id)
                }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  task.completed
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-600'
                }`}
                title="Tamamla"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete?.(task.id)
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all"
                title="Sil"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
