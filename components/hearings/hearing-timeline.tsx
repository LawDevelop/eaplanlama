'use client'

import { Clock, MapPin, User, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

interface Hearing {
  id: string
  title: string
  clientName: string
  fileNumber: string
  courtName: string
  hearingDate: string
  location: string
  status: 'scheduled' | 'postponed' | 'completed' | 'cancelled'
}

interface HearingTimelineProps {
  hearings: Hearing[]
  onHearingClick?: (hearing: Hearing) => void
}

export function HearingTimeline({ hearings, onHearingClick }: HearingTimelineProps) {
  // Group hearings by date
  const groupedHearings = hearings.reduce((acc, hearing) => {
    const date = new Date(hearing.hearingDate).toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(hearing)
    return acc
  }, {} as Record<string, Hearing[]>)

  const sortedDates = Object.keys(groupedHearings).sort((a, b) => {
    const dateA = new Date(groupedHearings[a][0].hearingDate)
    const dateB = new Date(groupedHearings[b][0].hearingDate)
    return dateA.getTime() - dateB.getTime()
  })

  const statusConfig = {
    scheduled: { label: 'Planlandı', color: 'bg-blue-500' },
    postponed: { label: 'Ertelendi', color: 'bg-yellow-500' },
    completed: { label: 'Tamamlandı', color: 'bg-green-500' },
    cancelled: { label: 'İptal', color: 'bg-red-500' },
  }

  return (
    <div className="space-y-8">
      {sortedDates.map((date, dateIndex) => {
        const dayHearings = groupedHearings[date]
        const isToday = date === new Date().toLocaleDateString('tr-TR', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        })

        return (
          <motion.div
            key={date}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: dateIndex * 0.1 }}
            className="relative"
          >
            {/* Date Header */}
            <div className={`flex items-center gap-3 mb-4 ${isToday ? 'text-[hsl(var(--primary))]' : ''}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                isToday ? 'gradient-primary text-white shadow-lg' : 'bg-[hsl(var(--secondary))]'
              }`}>
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{date}</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  {dayHearings.length} duruşma
                </p>
              </div>
            </div>

            {/* Timeline Line */}
            {dateIndex < sortedDates.length - 1 && (
              <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-[hsl(var(--card-border))]" />
            )}

            {/* Hearings for this date */}
            <div className="ml-16 space-y-3">
              {dayHearings
                .sort((a, b) => new Date(a.hearingDate).getTime() - new Date(b.hearingDate).getTime())
                .map((hearing, index) => {
                  const time = new Date(hearing.hearingDate).toLocaleTimeString('tr-TR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })
                  const config = statusConfig[hearing.status]

                  return (
                    <motion.div
                      key={hearing.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => onHearingClick?.(hearing)}
                      className="elite-card p-5 hover:shadow-lg transition-all cursor-pointer relative"
                    >
                      {/* Time Badge */}
                      <div className="absolute -left-16 top-5 w-12 text-center">
                        <div className="text-sm font-bold">{time}</div>
                      </div>

                      {/* Status Indicator */}
                      <div className={`absolute -left-[4.5rem] top-6 w-3 h-3 rounded-full ${config.color} border-4 border-[hsl(var(--background))]`} />

                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-2">{hearing.title}</h4>
                          
                          <div className="space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>{hearing.clientName}</span>
                              <span className="text-xs">({hearing.fileNumber})</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{hearing.courtName} - {hearing.location}</span>
                            </div>
                          </div>
                        </div>

                        <div className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                          hearing.status === 'scheduled' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                          hearing.status === 'postponed' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' :
                          hearing.status === 'completed' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                          'bg-red-500/10 text-red-600 border-red-500/20'
                        }`}>
                          {config.label}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
            </div>
          </motion.div>
        )
      })}

      {sortedDates.length === 0 && (
        <div className="elite-card p-12 text-center">
          <Clock className="w-16 h-16 mx-auto mb-4 text-[hsl(var(--muted-foreground))]" />
          <p className="text-[hsl(var(--muted-foreground))]">Henüz duruşma yok</p>
        </div>
      )}
    </div>
  )
}
