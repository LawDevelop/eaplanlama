'use client'

import { X, TrendingUp, Calendar, Clock, CheckCircle, XCircle, AlertCircle, BarChart3 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface HearingStatsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function HearingStatsModal({ isOpen, onClose }: HearingStatsModalProps) {
  const stats = {
    total: 45,
    scheduled: 12,
    completed: 28,
    postponed: 3,
    cancelled: 2,
    thisMonth: 8,
    thisWeek: 3,
    avgPreparationTime: 5.2,
    successRate: 92,
    topCourts: [
      { name: 'Ankara 5. Aile Mahkemesi', count: 12 },
      { name: 'İstanbul 12. İş Mahkemesi', count: 8 },
      { name: 'Ankara 2. Asliye Hukuk', count: 6 },
    ],
    monthlyTrend: [
      { month: 'Oca', count: 8 },
      { month: 'Şub', count: 12 },
      { month: 'Mar', count: 10 },
      { month: 'Nis', count: 15 },
    ],
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
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
            exit={{ opacity: 0, scale: 0.95, y: 50 }}
            className="relative w-full max-w-4xl max-h-[calc(100vh-2rem)] sm:max-h-[85vh] z-10"
          >
            <div className="elite-card w-full h-full overflow-hidden flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[85vh]">
              {/* Fixed Header */}
              <div className="p-4 sm:p-6 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl gradient-primary flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold">Duruşma İstatistikleri</h2>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">Detaylı analiz ve raporlar</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
                {/* Overview Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                  <div className="elite-card p-3 sm:p-4 bg-blue-500/10 border-blue-500/20">
                    <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mb-2" />
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.scheduled}</div>
                    <div className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))]">Planlanmış</div>
                  </div>

                  <div className="elite-card p-3 sm:p-4 bg-green-500/10 border-green-500/20">
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mb-2" />
                    <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.completed}</div>
                    <div className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))]">Tamamlanan</div>
                  </div>

                  <div className="elite-card p-3 sm:p-4 bg-yellow-500/10 border-yellow-500/20">
                    <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 mb-2" />
                    <div className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.postponed}</div>
                    <div className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))]">Ertelenen</div>
                  </div>

                  <div className="elite-card p-3 sm:p-4 bg-red-500/10 border-red-500/20">
                    <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 mb-2" />
                    <div className="text-xl sm:text-2xl font-bold text-red-600">{stats.cancelled}</div>
                    <div className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))]">İptal</div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6">
                  <div className="elite-card p-4 sm:p-5">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[hsl(var(--primary))]" />
                      Performans Metrikleri
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-[hsl(var(--muted-foreground))]">Başarı Oranı</span>
                          <span className="font-bold text-green-600">{stats.successRate}%</span>
                        </div>
                        <div className="h-2 bg-[hsl(var(--secondary))] rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: `${stats.successRate}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-[hsl(var(--muted-foreground))]">Ort. Hazırlık Süresi</span>
                          <span className="font-bold">{stats.avgPreparationTime} gün</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-[hsl(var(--muted-foreground))]">Bu Ay</span>
                          <span className="font-bold text-blue-600">{stats.thisMonth} duruşma</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-[hsl(var(--muted-foreground))]">Bu Hafta</span>
                          <span className="font-bold text-purple-600">{stats.thisWeek} duruşma</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="elite-card p-4 sm:p-5">
                    <h3 className="font-semibold mb-4">En Çok Duruşma Yapılan Mahkemeler</h3>
                    <div className="space-y-3">
                      {stats.topCourts.map((court, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center text-sm font-bold text-[hsl(var(--primary))]">
                              {index + 1}
                            </div>
                            <span className="text-sm truncate">{court.name}</span>
                          </div>
                          <span className="font-bold text-[hsl(var(--primary))]">{court.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Monthly Trend */}
                <div className="elite-card p-4 sm:p-5">
                  <h3 className="font-semibold mb-4">Aylık Trend</h3>
                  <div className="flex items-end justify-between gap-2 h-36 sm:h-48">
                    {stats.monthlyTrend.map((item, index) => {
                      const maxCount = Math.max(...stats.monthlyTrend.map(m => m.count))
                      const height = (item.count / maxCount) * 100
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                          <div className="text-sm font-bold text-[hsl(var(--primary))]">{item.count}</div>
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ delay: index * 0.1 }}
                            className="w-full gradient-primary rounded-t-xl min-h-[20px]"
                          />
                          <div className="text-xs text-[hsl(var(--muted-foreground))]">{item.month}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Drag Handle for Mobile */}
              <div className="flex justify-center py-2 border-t border-gray-100 flex-shrink-0 sm:hidden">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
