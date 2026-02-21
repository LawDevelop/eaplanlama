'use client'

import { useState } from 'react'
import { X, TrendingUp, Clock, CheckCircle, AlertCircle, BarChart3, PieChart, Calendar, Download } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface TaskStatsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TaskStatsModal({ isOpen, onClose }: TaskStatsModalProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')

  const stats = {
    totalTasks: 45,
    completedTasks: 28,
    overdueTasks: 3,
    inProgressTasks: 14,
    avgCompletionTime: 2.5, // days
    completionRate: 62,
    thisWeekCompleted: 8,
    thisMonthCompleted: 28,
    totalTimeSpent: 1240, // minutes
    pomodorosCompleted: 32,
    productivityScore: 85,
  }

  const priorityStats = {
    critical: { total: 8, completed: 5 },
    high: { total: 15, completed: 10 },
    medium: { total: 18, completed: 11 },
    low: { total: 4, completed: 2 },
  }

  const weeklyData = [
    { day: 'Pzt', completed: 4, created: 6 },
    { day: 'Sal', completed: 5, created: 4 },
    { day: 'Çar', completed: 3, created: 5 },
    { day: 'Per', completed: 6, created: 3 },
    { day: 'Cum', completed: 4, created: 7 },
    { day: 'Cmt', completed: 2, created: 1 },
    { day: 'Paz', completed: 1, created: 2 },
  ]

  const exportReport = () => {
    // TODO: PDF/Excel export
    console.log('Exporting report...')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] z-10"
          >
            <div className="elite-card w-full h-full overflow-y-auto p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Görev İstatistikleri & Analitik</h2>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    Performansınızı detaylı inceleyin
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={exportReport}
                    className="px-4 py-2 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] flex items-center gap-2 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Rapor Al
                  </button>
                  <button
                    onClick={onClose}
                    className="w-9 h-9 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Time Range Selector */}
              <div className="flex gap-2 mb-6">
                {(['week', 'month', 'year'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      timeRange === range
                        ? 'gradient-primary text-white'
                        : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))]'
                    }`}
                  >
                    {range === 'week' ? 'Bu Hafta' : range === 'month' ? 'Bu Ay' : 'Bu Yıl'}
                  </button>
                ))}
              </div>

              {/* Main Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="elite-card p-4">
                  <div className="text-3xl font-bold text-[hsl(var(--primary))]">
                    {stats.totalTasks}
                  </div>
                  <div className="text-sm text-[hsl(var(--muted-foreground))]">Toplam Görev</div>
                </div>

                <div className="elite-card p-4">
                  <div className="text-3xl font-bold text-[hsl(var(--success))]">
                    {stats.completedTasks}
                  </div>
                  <div className="text-sm text-[hsl(var(--muted-foreground))]">Tamamlanan</div>
                </div>

                <div className="elite-card p-4">
                  <div className="text-3xl font-bold text-[hsl(var(--warning))]">
                    {stats.inProgressTasks}
                  </div>
                  <div className="text-sm text-[hsl(var(--muted-foreground))]">Devam Eden</div>
                </div>

                <div className="elite-card p-4">
                  <div className="text-3xl font-bold text-[hsl(var(--danger))]">
                    {stats.overdueTasks}
                  </div>
                  <div className="text-sm text-[hsl(var(--muted-foreground))]">Gecikmiş</div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Completion Rate */}
                <div className="elite-card p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-5 h-5 text-[hsl(var(--primary))]" />
                    <h3 className="font-semibold">Tamamlanma Oranı</h3>
                  </div>
                  <div className="relative h-4 bg-[hsl(var(--secondary))] rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.completionRate}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="absolute inset-y-0 left-0 gradient-primary"
                    />
                  </div>
                  <div className="text-right text-sm font-medium">
                    %{stats.completionRate}
                  </div>
                </div>

                {/* Productivity Score */}
                <div className="elite-card p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <BarChart3 className="w-5 h-5 text-[hsl(var(--success))]" />
                    <h3 className="font-semibold">Verimlilik Skoru</h3>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="hsl(var(--secondary))"
                          strokeWidth="12"
                        />
                        <motion.circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="hsl(var(--success))"
                          strokeWidth="12"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - stats.productivityScore / 100) }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold">{stats.productivityScore}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Activity */}
              <div className="elite-card p-5 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-5 h-5 text-[hsl(var(--primary))]" />
                  <h3 className="font-semibold">Haftalık Aktivite</h3>
                </div>
                <div className="flex items-end justify-between gap-2 h-40">
                  {weeklyData.map((day, index) => {
                    const maxValue = Math.max(...weeklyData.map(d => Math.max(d.completed, d.created)))
                    const completedHeight = (day.completed / maxValue) * 100
                    const createdHeight = (day.created / maxValue) * 100

                    return (
                      <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex gap-1 items-end h-32">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${completedHeight}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex-1 gradient-success rounded-t-lg"
                            title={`${day.completed} tamamlandı`}
                          />
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${createdHeight}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex-1 gradient-primary rounded-t-lg"
                            title={`${day.created} oluşturuldu`}
                          />
                        </div>
                        <span className="text-xs text-[hsl(var(--muted-foreground))]">{day.day}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded gradient-success" />
                    <span>Tamamlanan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded gradient-primary" />
                    <span>Oluşturulan</span>
                  </div>
                </div>
              </div>

              {/* Priority Breakdown */}
              <div className="elite-card p-5 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <PieChart className="w-5 h-5 text-[hsl(var(--primary))]" />
                  <h3 className="font-semibold">Öncelik Bazlı Dağılım</h3>
                </div>
                <div className="space-y-3">
                  {Object.entries(priorityStats).map(([priority, data]) => {
                    const percentage = (data.completed / data.total) * 100
                    const colors = {
                      critical: 'bg-red-500',
                      high: 'bg-orange-500',
                      medium: 'bg-yellow-500',
                      low: 'bg-blue-500',
                    }

                    return (
                      <div key={priority}>
                        <div className="flex items-center justify-between mb-1 text-sm">
                          <span className="capitalize">{priority === 'critical' ? 'Kritik' : priority === 'high' ? 'Yüksek' : priority === 'medium' ? 'Orta' : 'Düşük'}</span>
                          <span className="text-[hsl(var(--muted-foreground))]">
                            {data.completed}/{data.total}
                          </span>
                        </div>
                        <div className="relative h-2 bg-[hsl(var(--secondary))] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className={`absolute inset-y-0 left-0 ${colors[priority as keyof typeof colors]}`}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Time Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="elite-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-[hsl(var(--primary))]" />
                    <span className="text-sm text-[hsl(var(--muted-foreground))]">Toplam Süre</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {Math.floor(stats.totalTimeSpent / 60)}s {stats.totalTimeSpent % 60}dk
                  </div>
                </div>

                <div className="elite-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-[hsl(var(--success))]" />
                    <span className="text-sm text-[hsl(var(--muted-foreground))]">Pomodoro</span>
                  </div>
                  <div className="text-2xl font-bold text-[hsl(var(--success))]">
                    {stats.pomodorosCompleted}
                  </div>
                </div>

                <div className="elite-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-[hsl(var(--warning))]" />
                    <span className="text-sm text-[hsl(var(--muted-foreground))]">Ort. Süre</span>
                  </div>
                  <div className="text-2xl font-bold text-[hsl(var(--warning))]">
                    {stats.avgCompletionTime} gün
                  </div>
                </div>
              </div>

              {/* Alert */}
              {stats.overdueTasks > 0 && (
                <div className="elite-card p-5 bg-[hsl(var(--warning))]/10 border-[hsl(var(--warning))]/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[hsl(var(--warning))] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Dikkat!</h3>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        {stats.overdueTasks} göreviniz gecikmiş durumda. Lütfen öncelikli olarak bunları tamamlayın.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
