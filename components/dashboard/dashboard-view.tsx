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
import { Scale, Users, FileText, TrendingUp, Calendar, CheckCircle2, Upload, UserPlus, Clock, AlertCircle } from 'lucide-react'

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

  const urgentCount = 3
  const todayCount = 5
  const upcomingCount = 12

  return (
    <div className="min-h-screen pb-24 lg:pb-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-[hsl(var(--primary))] uppercase tracking-wide">
              {greeting}, Avukat Bey 👋
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] text-sm">
              {new Date().toLocaleDateString('tr-TR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </motion.div>

        {/* Priority Alert Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="glass-card p-4 flex items-center gap-4 border-l-4 border-l-orange-500">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Acil Durum!</p>
              <p className="text-sm text-gray-600">Bu hafta {urgentCount} acil duruşma ve {todayCount} bekleyen göreviniz var</p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl transition-all">
              Görüntüle
            </button>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <GlobalSearch />
        </motion.div>

        {/* Stats Overview - Modern Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <div className="gradient-border glass-card p-4 hover:scale-105 transition-transform">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{upcomingCount}</p>
                <p className="text-xs text-gray-500 font-medium">Yaklaşan</p>
              </div>
            </div>
          </div>
          <div className="gradient-border glass-card p-4 hover:scale-105 transition-transform">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{todayCount}</p>
                <p className="text-xs text-gray-500 font-medium">Bugün</p>
              </div>
            </div>
          </div>
          <div className="gradient-border glass-card p-4 hover:scale-105 transition-transform">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">8</p>
                <p className="text-xs text-gray-500 font-medium">Tamamlanan</p>
              </div>
            </div>
          </div>
          <div className="gradient-border glass-card p-4 hover:scale-105 transition-transform hidden lg:flex">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">24</p>
                <p className="text-xs text-gray-500 font-medium">Müvekkil</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hearings Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <WeekHearings view={hearingsView} onToggleView={toggleHearingsView} />
            </motion.div>
            
            {/* Tasks Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-6"
            >
              <WeekTasks view={tasksView} onToggleView={toggleTasksView} />
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Financial Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <FinancialSummary />
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                Hızlı İşlemler
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setShowAddHearing(true)}
                  className="group p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 transition-all"
                >
                  <Calendar className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-semibold text-gray-700">Duruşma Ekle</p>
                </button>
                <button 
                  onClick={() => setShowAddTask(true)}
                  className="group p-4 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border border-green-200 transition-all"
                >
                  <CheckCircle2 className="w-6 h-6 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-semibold text-gray-700">Görev Ekle</p>
                </button>
                <button className="group p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200 transition-all">
                  <Upload className="w-6 h-6 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-semibold text-gray-700">Belge Yükle</p>
                </button>
                <button className="group p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border border-orange-200 transition-all">
                  <UserPlus className="w-6 h-6 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-semibold text-gray-700">Müvekkil Ekle</p>
                </button>
              </div>
            </motion.div>

            {/* Today's Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                <Clock className="w-5 h-5 text-blue-600" />
                Bugünün Akışı
              </h3>
              <div className="space-y-3">
                {[
                  { time: '09:00', title: 'Ofis', type: 'work', icon: '💼' },
                  { time: '11:00', title: 'Müşteri Görüşmesi', client: 'Ahmet Yılmaz', type: 'meeting', icon: '👤' },
                  { time: '14:00', title: 'Duruşma - Aile Mahkemesi', type: 'hearing', icon: '⚖️' },
                  { time: '16:30', title: 'Duruşma Hazırlığı', type: 'prep', icon: '📋' },
                ].map((event, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-purple-50 border border-gray-100 hover:border-blue-200 transition-all cursor-pointer group">
                    <div className="text-2xl group-hover:scale-110 transition-transform">{event.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-800">{event.title}</p>
                      <p className="text-xs text-gray-500">{event.time}</p>
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
