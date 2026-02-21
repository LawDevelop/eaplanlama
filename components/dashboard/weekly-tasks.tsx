'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Circle } from 'lucide-react'
import { motion } from 'framer-motion'
import { SwipeableTask } from '@/components/tasks/swipeable-task'

export function WeeklyTasks() {
  // TODO: Fetch from Supabase
  const tasks = [
    {
      id: '1',
      title: 'Dilekçe hazırla',
      clientName: 'Mehmet Demir',
      fileNumber: '2024/123',
      priority: 'high' as const,
      dueDate: '2024-02-22',
      completed: false,
    },
    {
      id: '2',
      title: 'Belge toplama',
      clientName: 'Ayşe Kaya',
      fileNumber: '2024/124',
      priority: 'medium' as const,
      dueDate: '2024-02-23',
      completed: false,
    },
  ]

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
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Bu hafta için görev yok
            </div>
          ) : (
            tasks.map((task) => (
              <SwipeableTask key={task.id} task={task} />
            ))
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
