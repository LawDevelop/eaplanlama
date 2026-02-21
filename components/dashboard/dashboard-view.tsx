'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import { useTasks, useHearings, useFinancials } from '@/hooks/use-supabase-data'

export function DashboardView() {
  const { tasks, loading: tasksLoading } = useTasks()
  const { hearings, loading: hearingsLoading } = useHearings()
  const { getMonthlySummary, loading: financeLoading } = useFinancials()
  
  const [todayStats, setTodayStats] = useState({
    tasksCount: 0,
    hearingsCount: 0,
    completedTasks: 0,
  })

  useEffect(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayTasks = tasks.filter(t => {
      const dueDate = t.due_date ? new Date(t.due_date) : null
      return dueDate && dueDate.toDateString() === today.toDateString()
    })
    
    const todayHearings = hearings.filter(h => {
      const hearingDate = new Date(h.hearing_date)
      return hearingDate.toDateString() === today.toDateString()
    })
    
    const completedToday = tasks.filter(t => {
      const completedDate = t.completed_at ? new Date(t.completed_at) : null
      return completedDate && completedDate.toDateString() === today.toDateString()
    })

    setTodayStats({
      tasksCount: todayTasks.length,
      hearingsCount: todayHearings.length,
      completedTasks: completedToday.length,
    })
  }, [tasks, hearings])

  const monthlySummary = getMonthlySummary()
  const upcomingHearings = hearings.slice(0, 3)
  const urgentTasks = tasks.filter(t => t.priority === 'critical' && t.status !== 'completed').slice(0, 3)

  return (
    <div className="min-h-screen pb-24 lg:pb-6">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 p-6 mb-8 text-white">
          <div className="absolute inset-0 bg-grid-white/10" />
          <h1 className="text-3xl font-bold mb-2 relative">Hoş Geldiniz! 👋</h1>
          <p className="text-white/90 relative">
            {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Urgent Alert */}
        {(urgentTasks.length > 0 || todayStats.hearingsCount > 0) && (
          <div className="elite-card p-4 mb-6 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h3 className="font-semibold text-red-700 dark:text-red-300">Acil İşleriniz Var!</h3>
            </div>
            <div className="text-sm text-red-600 dark:text-red-400">
              {urgentTasks.length > 0 && `${urgentTasks.length} kritik görev `}
              {todayStats.hearingsCount > 0 && `${todayStats.hearingsCount} bugünkü duruşma`}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="elite-card p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-100">Bugünün Görevleri</span>
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold">{todayStats.tasksCount}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="elite-card p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-100">Duruşmalar</span>
              <Calendar className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold">{todayStats.hearingsCount}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="elite-card p-4 bg-gradient-to-br from-green-500 to-green-600 text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-100">Tamamlanan</span>
              <CheckCircle className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold">{todayStats.completedTasks}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="elite-card p-4 bg-gradient-to-br from-amber-500 to-amber-600 text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-100">Aylık Bakiye</span>
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold">{monthlySummary.balance.toLocaleString('tr-TR')} ₺</p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Hearings */}
          <div className="elite-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              Yaklaşan Duruşmalar
            </h3>
            {hearingsLoading ? (
              <p className="text-[hsl(var(--muted-foreground))]">Yükleniyor...</p>
            ) : upcomingHearings.length === 0 ? (
              <p className="text-[hsl(var(--muted-foreground))]">Yaklaşan duruşma yok</p>
            ) : (
              <div className="space-y-3">
                {upcomingHearings.map((hearing) => (
                  <div key={hearing.id} className="p-3 rounded-xl bg-[hsl(var(--secondary))]">
                    <p className="font-medium">{hearing.title}</p>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      {new Date(hearing.hearing_date).toLocaleDateString('tr-TR', { 
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Urgent Tasks */}
          <div className="elite-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Kritik Görevler
            </h3>
            {tasksLoading ? (
              <p className="text-[hsl(var(--muted-foreground))]">Yükleniyor...</p>
            ) : urgentTasks.length === 0 ? (
              <p className="text-[hsl(var(--muted-foreground))]">Kritik görev yok</p>
            ) : (
              <div className="space-y-3">
                {urgentTasks.map((task) => (
                  <div key={task.id} className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="font-medium text-red-700 dark:text-red-300">{task.title}</p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {task.due_date && new Date(task.due_date).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
