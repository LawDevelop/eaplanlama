'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Plus,
  ArrowRight,
  Sparkles,
  Users,
  FileText,
  Scale,
  MoreVertical,
  DollarSign
} from 'lucide-react'
import { useTasks, useHearings, useFinancial } from '@/hooks/use-supabase-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function DashboardView() {
  const { tasks, loading: tasksLoading } = useTasks()
  const { hearings, loading: hearingsLoading } = useHearings()
  const { financials, loading: financeLoading } = useFinancial()
  
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

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Günaydın'
    if (hour < 18) return 'İyi Günler'
    return 'İyi Akşamlar'
  }

  const formatDate = () => {
    return new Date().toLocaleDateString('tr-TR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-6">
      <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
        {/* Hero Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8 text-white shadow-2xl"
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-grid-white/10" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-6 h-6" />
                  </motion.div>
                  <p className="text-white/80 text-sm font-medium">{getGreeting()}! 👋</p>
                </div>
                <h1 className="text-3xl font-bold mb-2">Hoş Geldiniz</h1>
                <p className="text-white/80">{formatDate()}</p>
              </div>
              
              <div className="hidden sm:block">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Scale className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Urgent Alert */}
        {(urgentTasks.length > 0 || todayStats.hearingsCount > 0) && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="elite-card p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-700 dark:text-red-300">Acil İşleriniz Var!</h3>
                <p className="text-sm text-red-600 dark:text-red-400">
                  {urgentTasks.length > 0 && `${urgentTasks.length} kritik görev `}
                  {todayStats.hearingsCount > 0 && `${todayStats.hearingsCount} bugünkü duruşma`}
                </p>
              </div>
              <Link href="/tasks">
                <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100">
                  Görüntüle
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Quick Stats Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Today's Tasks */}
          <motion.div variants={item}>
            <Card interactive className="group">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-[hsl(var(--foreground))]">{todayStats.tasksCount}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Bugünün Görevleri</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Hearings */}
          <motion.div variants={item}>
            <Card interactive className="group">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-[hsl(var(--foreground))]">{todayStats.hearingsCount}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Duruşmalar</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Completed */}
          <motion.div variants={item}>
            <Card interactive className="group">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-[hsl(var(--foreground))]">{todayStats.completedTasks}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Tamamlanan</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Balance */}
          <motion.div variants={item}>
            <Card interactive className="group">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                  </div>
                </div>
                <p className="text-xl font-bold text-[hsl(var(--foreground))]">
                  {monthlySummary.balance.toLocaleString('tr-TR')} ₺
                </p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Aylık Bakiye</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Hearings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="border-b border-[hsl(var(--border))]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle>Yaklaşan Duruşmalar</CardTitle>
                  </div>
                  <Link href="/hearings">
                    <Button variant="ghost" size="sm" className="gap-1">
                      Tümü <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {hearingsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="skeleton h-20 rounded-xl" />
                    ))}
                  </div>
                ) : upcomingHearings.length === 0 ? (
                  <div className="py-8 text-center">
                    <Scale className="w-12 h-12 mx-auto mb-3 text-[hsl(var(--muted-foreground))]/30" />
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">Yaklaşan duruşma yok</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingHearings.map((hearing, index) => (
                      <motion.div
                        key={hearing.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="p-4 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--accent))] transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-[hsl(var(--foreground))]">{hearing.title}</p>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">{hearing.client_name}</p>
                          </div>
                          <Badge variant="info" size="sm">
                            {new Date(hearing.hearing_date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(hearing.hearing_date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Urgent Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader className="border-b border-[hsl(var(--border))]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <CardTitle>Kritik Görevler</CardTitle>
                  </div>
                  <Link href="/tasks">
                    <Button variant="ghost" size="sm" className="gap-1">
                      Tümü <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {tasksLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="skeleton h-20 rounded-xl" />
                    ))}
                  </div>
                ) : urgentTasks.length === 0 ? (
                  <div className="py-8 text-center">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-[hsl(var(--muted-foreground))]/30" />
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">Kritik görev yok</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {urgentTasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-red-700 dark:text-red-300">{task.title}</p>
                            <p className="text-sm text-red-600 dark:text-red-400">{task.client_name}</p>
                          </div>
                          <Badge variant="danger" size="sm" dot>
                            Acil
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                          <Clock className="w-3.5 h-3.5" />
                          {task.due_date && new Date(task.due_date).toLocaleDateString('tr-TR')}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader className="border-b border-[hsl(var(--border))]">
              <CardTitle>Hızlı İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Link href="/tasks">
                  <Button variant="outline" className="w-full h-auto flex-col gap-2 py-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium">Yeni Görev</span>
                  </Button>
                </Link>
                <Link href="/hearings">
                  <Button variant="outline" className="w-full h-auto flex-col gap-2 py-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Scale className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm font-medium">Yeni Duruşma</span>
                  </Button>
                </Link>
                <Link href="/clients">
                  <Button variant="outline" className="w-full h-auto flex-col gap-2 py-4">
                    <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm font-medium">Yeni Müvekkil</span>
                  </Button>
                </Link>
                <Link href="/finance">
                  <Button variant="outline" className="w-full h-auto flex-col gap-2 py-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="text-sm font-medium">Gelir/Gider</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
