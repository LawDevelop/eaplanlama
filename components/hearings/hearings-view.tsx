'use client'

import { useState } from 'react'
import { Plus, Search, Calendar as CalendarIcon, GitBranch, Scale, Clock, MapPin, User, CheckCircle, Edit3, Trash2, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { HearingCalendar } from './hearing-calendar'
import { HearingTimeline } from './hearing-timeline'
import { AddHearingForm } from '@/components/forms/add-hearing-form'
import { useHearings, type Hearing } from '@/hooks/use-supabase-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const statusConfig = {
  scheduled: { label: 'Planlandı', variant: 'default' as const },
  completed: { label: 'Tamamlandı', variant: 'success' as const },
  postponed: { label: 'Ertelendi', variant: 'warning' as const },
  cancelled: { label: 'İptal', variant: 'danger' as const },
}

export function HearingsView() {
  const { hearings, loading, createHearing, updateHearing, deleteHearing, completeHearing } = useHearings()
  const [view, setView] = useState<'list' | 'calendar' | 'timeline'>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingHearing, setEditingHearing] = useState<Hearing | null>(null)

  const filteredHearings = hearings.filter(h => 
    h.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.client_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Stats
  const upcomingCount = hearings.filter(h => h.status === 'scheduled').length
  const completedCount = hearings.filter(h => h.status === 'completed').length
  const todayCount = hearings.filter(h => {
    if (!h.hearing_date) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return new Date(h.hearing_date).toDateString() === today.toDateString() && h.status === 'scheduled'
  }).length

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 mb-6"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Scale className="w-8 h-8" />
                Duruşma Yönetimi
              </h1>
              <p className="text-white/80">
                {upcomingCount} planlanan • {completedCount} tamamlanan duruşma
              </p>
            </div>
            <Button
              onClick={() => setShowAddForm(true)}
              size="lg"
              className="bg-white text-amber-600 hover:bg-white/90 shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Yeni Duruşma
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 pb-24 lg:pb-6 max-w-7xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-4 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Scale className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{hearings.length}</div>
                <div className="text-sm text-muted-foreground">Toplam</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-4 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{upcomingCount}</div>
                <div className="text-sm text-muted-foreground">Planlanan</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{todayCount}</div>
                <div className="text-sm text-muted-foreground">Bugün</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-4 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{completedCount}</div>
                <div className="text-sm text-muted-foreground">Tamamlanan</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search & View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Duruşma ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-background"
              />
            </div>
            <div className="flex gap-2">
              {(['list', 'calendar', 'timeline'] as const).map((v) => (
                <Button
                  key={v}
                  onClick={() => setView(v)}
                  variant={view === v ? 'default' : 'outline'}
                  size="sm"
                  className={view === v ? 'bg-amber-500 hover:bg-amber-600' : ''}
                >
                  {v === 'list' ? 'Liste' : v === 'calendar' ? 'Takvim' : 'Zaman Çizelgesi'}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {view === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {loading ? (
                <div className="grid gap-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-4">
                      <div className="h-24 bg-muted/50 rounded-lg animate-pulse" />
                    </Card>
                  ))}
                </div>
              ) : filteredHearings.length === 0 ? (
                <Card className="p-12 text-center">
                  <Scale className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Duruşma bulunmamaktadır</p>
                  <Button onClick={() => setShowAddForm(true)} variant="gradient">
                    <Plus className="w-4 h-4 mr-2" />
                    İlk Duruşmayı Oluştur
                  </Button>
                </Card>
              ) : (
                filteredHearings.map((hearing, index) => {
                  const config = statusConfig[hearing.status] || statusConfig.scheduled
                  const date = new Date(hearing.hearing_date)
                  const formattedDate = date.toLocaleDateString('tr-TR', { 
                    day: '2-digit', month: 'long', year: 'numeric' 
                  })
                  const time = hearing.time ? new Date(hearing.time).toLocaleTimeString('tr-TR', { 
                    hour: '2-digit', minute: '2-digit' 
                  }) : ''

                  return (
                    <motion.div
                      key={hearing.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="p-5 hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-semibold text-lg">{hearing.title}</h3>
                                  <Badge variant={config.variant}>{config.label}</Badge>
                                </div>
                                <div className="space-y-2">
                                  {hearing.client_name && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <User className="w-4 h-4" />
                                      {hearing.client_name}
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Scale className="w-4 h-4" />
                                    {hearing.court_name || 'Belirtilmemiş'}
                                  </div>
                                  {hearing.location && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <MapPin className="w-4 h-4" />
                                      {hearing.location}
                                    </div>
                                  )}
                                  <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <CalendarIcon className="w-4 h-4" />
                                      {formattedDate}
                                    </div>
                                    {time && (
                                      <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="w-4 h-4" />
                                        {time}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {hearing.status !== 'completed' && (
                              <>
                                <Button
                                  onClick={() => completeHearing(hearing.id)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => setEditingHearing(hearing)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              onClick={() => deleteHearing(hearing.id)}
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })
              )}
            </motion.div>
          )}

          {view === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HearingCalendar hearings={hearings} />
            </motion.div>
          )}

          {view === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HearingTimeline hearings={hearings} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Hearing Modal */}
      <AddHearingForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={async (data) => {
          await createHearing({
            title: data.title,
            client_name: data.clientName,
            court_name: data.courtName,
            hearing_date: data.hearingDate,
            location: data.location,
            time: data.hearingTime,
            file_number: data.fileNumber,
          })
          setShowAddForm(false)
        }}
        onCancel={() => setShowAddForm(false)}
      />

      {/* Edit Hearing Modal */}
      <AddHearingForm
        isOpen={!!editingHearing}
        onClose={() => setEditingHearing(null)}
        initialData={editingHearing ? {
          title: editingHearing.title,
          clientName: editingHearing.client_name,
          courtName: editingHearing.court_name,
          hearingDate: editingHearing.hearing_date,
          location: editingHearing.location,
          hearingTime: editingHearing.time,
          fileNumber: editingHearing.file_number,
        } : undefined}
        onSubmit={async (data) => {
          if (editingHearing) {
            await updateHearing(editingHearing.id, {
              title: data.title,
              client_name: data.clientName,
              court_name: data.courtName,
              hearing_date: data.hearingDate,
              location: data.location,
              time: data.hearingTime,
              file_number: data.fileNumber,
            })
            setEditingHearing(null)
          }
        }}
        onCancel={() => setEditingHearing(null)}
      />
    </div>
  )
}
