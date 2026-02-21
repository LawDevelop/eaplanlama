'use client'

import { useState } from 'react'
import { GlobalSearch } from '@/components/search/global-search'
import { WeekHearings } from './week-hearings'
import { WeekTasks } from './week-tasks'
import { FinancialSummary } from './financial-summary'
import { QuickStats } from './quick-stats'
import { AddHearingForm } from '@/components/forms/add-hearing-form'
import { AddTaskModal } from '@/components/modals/add-task-modal'
import { motion } from 'framer-motion'
import { Scale, Users, FileText, TrendingUp, Calendar, CheckCircle2, Upload, UserPlus } from 'lucide-react'

export function DashboardView() {
  const [hearingsView, setHearingsView] = useState<'today' | 'week'>('week')
  const [tasksView, setTasksView] = useState<'today' | 'week'>('week')
  const [showAddHearing, setShowAddHearing] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)

  // Get greeting based on time
  const hour = new Date().getHours()
  let greeting = 'İyi Geceler'
  if (hour >= 6 && hour < 12) greeting = 'Günaydın'
  else if (hour >= 12 && hour < 18) greeting = 'İyi Günler'
  else if (hour >= 18 && hour < 22) greeting = 'İyi Akşamlar'

  const toggleHearingsView = () => {
    setHearingsView(prev => prev === 'today' ? 'week' : 'today')
  }

  const toggleTasksView = () => {
    setTasksView(prev => prev === 'today' ? 'week' : 'today')
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1">
                {greeting}, Avukat Bey 👋
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-gradient">
                Dashboard
              </h1>
              <p className="text-[hsl(var(--muted-foreground))]">
                {new Date().toLocaleDateString('tr-TR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            {/* Quick Stats for Desktop */}
            <div className="hidden lg:grid grid-cols-3 gap-4">
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl text-white shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">5</p>
                    <p className="text-xs text-blue-100">Aktif Duruşma</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl text-white shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">24</p>
                    <p className="text-xs text-green-100">Müvekkil</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl text-white shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">₺150K</p>
                    <p className="text-xs text-purple-100">Aylık Gelir</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <GlobalSearch />
        </motion.div>

        {/* Mobile Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 lg:hidden"
        >
          <QuickStats />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hearings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="elite-card p-6"
            >
              <WeekHearings view={hearingsView} onToggleView={toggleHearingsView} />
            </motion.div>
            
            {/* Tasks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="elite-card p-6"
            >
              <WeekTasks view={tasksView} onToggleView={toggleTasksView} />
            </motion.div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Financial Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <FinancialSummary />
            </motion.div>

            {/* Quick Actions Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="elite-card p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                Hızlı İşlemler
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setShowAddHearing(true)}
                  className="p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all group"
                >
                  <Calendar className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-gray-700">Duruşma Ekle</p>
                </button>
                <button 
                  onClick={() => setShowAddTask(true)}
                  className="p-4 rounded-2xl bg-green-50 hover:bg-green-100 border border-green-200 transition-all group"
                >
                  <CheckCircle2 className="w-6 h-6 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-gray-700">Görev Ekle</p>
                </button>
                <button className="p-4 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all group">
                  <Upload className="w-6 h-6 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-gray-700">Belge Yükle</p>
                </button>
                <button className="p-4 rounded-2xl bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-all group">
                  <UserPlus className="w-6 h-6 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-gray-700">Müvekkil Ekle</p>
                </button>
              </div>
            </motion.div>

            {/* Upcoming Events Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="elite-card p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Yaklaşan Etkinlikler</h3>
              <div className="space-y-4">
                {[
                  { time: '14:00', title: 'Müşteri Görüşmesi', client: 'Ahmet Yılmaz', type: 'meeting' },
                  { time: '16:30', title: 'Duruşma Hazırlığı', client: 'Ayşe Kaya', type: 'hearing' },
                ].map((event, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-semibold ${
                      event.type === 'meeting' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                    }`}>
                      {event.time}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{event.title}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">{event.client}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddHearingForm isOpen={showAddHearing} onClose={() => setShowAddHearing(false)} />
      <AddTaskModal isOpen={showAddTask} onClose={() => setShowAddTask(false)} />
    </div>
  )
}
