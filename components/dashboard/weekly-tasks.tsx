'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { SwipeableTask } from '@/components/tasks/swipeable-task'
import { useTasks } from '@/hooks/use-supabase-data'

export function WeeklyTasks() {
  const { tasks, loading } = useTasks()
  
  // Bu haftanın görevleri
  const weekTasks = tasks.filter(task => {
    if (!task.due_date) return false
    const dueDate = new Date(task.due_date)
    const today = new Date()
    const weekFromNow = new Date()
    weekFromNow.setDate(today.getDate() + 7)
    return dueDate >= today && dueDate <= weekFromNow && task.status !== 'completed'
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Bu Hafta Yapılacaklar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Yükleniyor...
            </div>
          ) : weekTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Bu hafta için görev yok
            </div>
          ) : (
            weekTasks.map((task) => (
              <SwipeableTask key={task.id} task={task} />
            ))
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
