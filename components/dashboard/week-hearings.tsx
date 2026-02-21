'use client'

import { useState } from 'react'
import { ChevronRight, CheckCircle, Clock, MapPin, Video } from 'lucide-react'
import { motion } from 'framer-motion'

interface Hearing {
  id: string
  title: string
  clientName: string
  fileNumber: string
  courtName: string
  hearingDate: string
  location: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'postponed'
}

interface WeekHearingsProps {
  view: 'today' | 'week'
  onToggleView: () => void
}

export function WeekHearings({ view, onToggleView }: WeekHearingsProps) {
  const [hearings, setHearings] = useState<Hearing[]>([
    {
      id: '1',
      title: 'Boşanma Davası',
      clientName: 'Ahmet Yılmaz',
      fileNumber: '2024/100',
      courtName: 'Ankara 5. Aile Mahkemesi',
      hearingDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 gün sonra
      location: 'Salon 3',
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'İş Davası',
      clientName: 'Zeynep Kara',
      fileNumber: '2024/101',
      courtName: 'İstanbul 12. İş Mahkemesi',
      hearingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 gün sonra
      location: 'Salon 1',
      status: 'scheduled'
    },
    {
      id: '3',
      title: 'Tazminat Davası',
      clientName: 'Mehmet Demir',
      fileNumber: '2024/102',
      courtName: 'Ankara 2. Asliye Hukuk',
      hearingDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 gün sonra
      location: 'Salon 2',
      status: 'scheduled'
    }
  ])

  const getWeekHearings = () => {
    const now = new Date()
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    return hearings.filter(h => {
      const hearingDate = new Date(h.hearingDate)
      return hearingDate >= now && hearingDate <= weekFromNow
    })
  }

  const getTodayHearings = () => {
    const today = new Date().toDateString()
    return hearings.filter(h => new Date(h.hearingDate).toDateString() === today)
  }

  const displayHearings = view === 'week' ? getWeekHearings() : getTodayHearings()
  const displayCount = displayHearings.length

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Bugün'
    if (diffDays === 1) return 'Yarın'
    if (diffDays === -1) return 'Dün'
    if (diffDays < -1) return `${Math.abs(diffDays)} gün önce`
    
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
    return days[date.getDay()]
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  }

  const toggleComplete = (id: string) => {
    setHearings(hearings.map(h => 
      h.id === id ? { ...h, status: h.status === 'completed' ? 'scheduled' : 'completed' as any } : h
    ))
  }

  const deleteHearing = (id: string) => {
    setHearings(hearings.filter(h => h.id !== id))
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">Duruşmalar</h3>
            <p className="text-sm text-gray-500">
              {view === 'week' ? 'Bu hafta' : 'Bugün'} {displayCount} duruşma
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleView}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              view === 'today'
                ? 'bg-blue-50 text-blue-600'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            Bugün
          </button>
          <button
            onClick={onToggleView}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              view === 'week'
                ? 'bg-blue-50 text-blue-600'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            Bu Hafta
          </button>
        </div>
      </div>

      {/* Hearings List */}
      {displayHearings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
          <Clock className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Planlanmış duruşma yok</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayHearings.map((hearing, index) => (
            <motion.div
              key={hearing.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-2xl border p-4 transition-all ${
                hearing.status === 'completed' 
                  ? 'border-green-200 opacity-60' 
                  : 'border-gray-100 hover:border-blue-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Date & Time */}
                <div className="flex-shrink-0 text-center">
                  <div className={`text-2xl font-bold ${
                    hearing.status === 'completed' ? 'text-green-500' : 'text-blue-600'
                  }`}>
                    {formatTime(hearing.hearingDate)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatRelativeDate(hearing.hearingDate)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-gray-900 ${
                    hearing.status === 'completed' ? 'line-through' : ''
                  }`}>
                    {hearing.title}
                  </h4>
                  <div className="text-sm text-gray-500 mt-1">
                    {hearing.clientName} • {hearing.fileNumber}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{hearing.courtName}</span>
                    <span>•</span>
                    <span>{hearing.location}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleComplete(hearing.id)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      hearing.status === 'completed'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-600'
                    }`}
                    title="Tamamlandı"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteHearing(hearing.id)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all"
                    title="Sil"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* View All Link */}
      <button className="w-full py-3 text-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
        Tüm Duruşmaları Gör →
      </button>
    </div>
  )
}
