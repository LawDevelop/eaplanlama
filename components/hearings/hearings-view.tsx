'use client'

import { useState } from 'react'
import { Plus, Search, List, Calendar as CalendarIcon, BarChart3, CheckCircle, Edit3, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { HearingCalendar } from './hearing-calendar'
import { HearingTimeline } from './hearing-timeline'
import { AddHearingForm } from '@/components/forms/add-hearing-form'
import { useHearings, type Hearing } from '@/hooks/use-supabase-data'

const statusConfig = {
  scheduled: { label: 'Planlandı', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  completed: { label: 'Tamamlandı', class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  postponed: { label: 'Ertelendi', class: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
  cancelled: { label: 'İptal', class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
}

export function HearingsView() {
  const { hearings, loading, createHearing, updateHearing, deleteHearing, completeHearing } = useHearings()
  const [view, setView] = useState<'list' | 'calendar' | 'timeline'>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingHearing, setEditingHearing] = useState<Hearing | null>(null)
  const [saved, setSaved] = useState(false)

  const filteredHearings = hearings.filter(h => 
    h.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.client_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSave = async () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-6">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gradient">Duruşmalar</h1>
            <button
              onClick={() => setShowAddForm(true)}
              className="elite-btn-primary px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Yeni Duruşma</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--muted-foreground))]" />
            <input
              type="text"
              placeholder="Duruşma ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="elite-input pl-12"
            />
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mb-6">
          {(['list', 'calendar', 'timeline'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                view === v
                  ? 'gradient-primary text-white shadow-lg'
                  : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))]'
              }`}
            >
              {v === 'list' ? 'Liste' : v === 'calendar' ? 'Takvim' : 'Zaman Çizelgesi'}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12 text-[hsl(var(--muted-foreground))]">
            Yükleniyor...
          </div>
        ) : view === 'list' ? (
          <div className="space-y-3">
            {filteredHearings.length === 0 ? (
              <div className="elite-card p-12 text-center">
                <p className="text-[hsl(var(--muted-foreground))]">Duruşma bulunmamaktadır</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-4 elite-btn-primary px-6 py-2"
                >
                  İlk Duruşmayı Oluştur
                </button>
              </div>
            ) : (
              filteredHearings.map((hearing) => {
                const config = statusConfig[hearing.status] || statusConfig.scheduled
                const date = new Date(hearing.hearing_date)
                const formattedDate = date.toLocaleDateString('tr-TR', { 
                  day: '2-digit', month: 'short', year: 'numeric' 
                })
                const formattedTime = date.toLocaleTimeString('tr-TR', { 
                  hour: '2-digit', minute: '2-digit' 
                })

                return (
                  <motion.div
                    key={hearing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="elite-card p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{hearing.title}</h3>
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${config.class}`}>
                            {config.label}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-[hsl(var(--muted-foreground))]">
                          <p>👤 {hearing.client_name || 'Belirtilmemiş'}</p>
                          <p>📍 {hearing.court_name || 'Belirtilmemiş'} - {hearing.location || 'Salon belirtilmemiş'}</p>
                          <p>📅 {formattedDate} - {formattedTime}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {hearing.status !== 'completed' && (
                          <>
                            <button
                              onClick={() => completeHearing(hearing.id)}
                              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                              title="Tamamla"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingHearing(hearing)}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                              title="Düzenle"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteHearing(hearing.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        ) : view === 'calendar' ? (
          <HearingCalendar hearings={hearings} />
        ) : (
          <HearingTimeline hearings={hearings} />
        )}
      </div>

      {/* Add Hearing Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="elite-card p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Yeni Duruşma Ekle</h2>
            <AddHearingForm
              onSubmit={async (data) => {
                await createHearing({
                  title: data.title,
                  client_name: data.clientName,
                  court_name: data.courtName,
                  hearing_date: data.hearingDate,
                  location: data.location,
                  time: data.time,
                })
                setShowAddForm(false)
              }}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Hearing Modal */}
      {editingHearing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="elite-card p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Duruşma Düzenle</h2>
            <AddHearingForm
              initialData={{
                title: editingHearing.title,
                clientName: editingHearing.client_name,
                courtName: editingHearing.court_name,
                hearingDate: editingHearing.hearing_date,
                location: editingHearing.location,
                time: editingHearing.time,
              }}
              onSubmit={async (data) => {
                await updateHearing(editingHearing.id, {
                  title: data.title,
                  client_name: data.clientName,
                  court_name: data.courtName,
                  hearing_date: data.hearingDate,
                  location: data.location,
                  time: data.time,
                })
                setEditingHearing(null)
              }}
              onCancel={() => setEditingHearing(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
