'use client'

import { useState } from 'react'
import { Plus, Search, List, Calendar as CalendarIcon, BarChart3, FileText, CheckSquare, Archive, Clock, Filter, Save, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { HearingCalendar } from './hearing-calendar'
import { HearingTimeline } from './hearing-timeline'
import { HearingStatsModal } from './hearing-stats-modal'
import { HearingTemplatesModal } from './hearing-templates-modal'
import { SavedFiltersModal } from './saved-filters-modal'
import { AddHearingForm } from '@/components/forms/add-hearing-form'

const mockHearings = [
  {
    id: '1',
    title: 'Boşanma Davası',
    clientName: 'Ahmet Yılmaz',
    fileNumber: '2024/100',
    courtName: 'Ankara 5. Aile Mahkemesi',
    hearingDate: '2024-02-25T10:00:00',
    location: 'Salon 3',
    status: 'scheduled' as const,
    preparationProgress: 75,
  },
  {
    id: '2',
    title: 'İş Davası',
    clientName: 'Zeynep Kara',
    fileNumber: '2024/101',
    courtName: 'İstanbul 12. İş Mahkemesi',
    hearingDate: '2024-02-28T14:00:00',
    location: 'Salon 1',
    status: 'scheduled' as const,
    preparationProgress: 45,
  },
  {
    id: '3',
    title: 'Tazminat Davası',
    clientName: 'Mehmet Demir',
    fileNumber: '2024/102',
    courtName: 'Ankara 2. Asliye Hukuk Mahkemesi',
    hearingDate: '2024-03-05T11:00:00',
    location: 'Salon 2',
    status: 'scheduled' as const,
    preparationProgress: 30,
  },
]

export function HearingsView() {
  const [view, setView] = useState<'list' | 'calendar' | 'timeline' | 'trash'>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedHearings, setSelectedHearings] = useState<string[]>([])
  const [bulkMode, setBulkMode] = useState(false)
  const [deletedHearings, setDeletedHearings] = useState<any[]>([])
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  })
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [showTemplatesModal, setShowTemplatesModal] = useState(false)
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  const statusConfig = {
    scheduled: { label: 'Planlandı', class: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
    postponed: { label: 'Ertelendi', class: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20' },
    completed: { label: 'Tamamlandı', class: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' },
    cancelled: { label: 'İptal', class: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' },
  }

  const toggleHearingSelection = (hearingId: string) => {
    setSelectedHearings(prev =>
      prev.includes(hearingId)
        ? prev.filter(id => id !== hearingId)
        : [...prev, hearingId]
    )
  }

  const handleHearingDelete = (hearingId: string) => {
    const hearing = mockHearings.find(h => h.id === hearingId)
    if (hearing) {
      const deletedHearing = {
        ...hearing,
        deletedAt: new Date().toISOString(),
        permanentDeleteAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
      setDeletedHearings(prev => [...prev, deletedHearing])
      console.log('Moving to trash:', hearingId)
    }
  }

  const handleRestoreHearing = (hearingId: string) => {
    setDeletedHearings(prev => prev.filter(h => h.id !== hearingId))
    console.log('Restoring hearing:', hearingId)
  }

  const handlePermanentDelete = (hearingId: string) => {
    if (confirm('Bu duruşma kalıcı olarak silinecek. Emin misiniz?')) {
      setDeletedHearings(prev => prev.filter(h => h.id !== hearingId))
      console.log('Permanently deleting hearing:', hearingId)
    }
  }

  const bulkComplete = () => {
    console.log('Completing hearings:', selectedHearings)
    setSelectedHearings([])
    setBulkMode(false)
  }

  const bulkPostpone = () => {
    console.log('Postponing hearings:', selectedHearings)
    setSelectedHearings([])
    setBulkMode(false)
  }

  const bulkDelete = () => {
    if (confirm(`${selectedHearings.length} duruşmayı silmek istediğinizden emin misiniz?`)) {
      console.log('Deleting hearings:', selectedHearings)
      setSelectedHearings([])
      setBulkMode(false)
    }
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-24">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gradient">Duruşmalar</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowStatsModal(true)}
                className="w-9 h-9 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors"
                title="İstatistikler"
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowTemplatesModal(true)}
                className="w-9 h-9 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors"
                title="Şablonlar"
              >
                <FileText className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowFiltersModal(true)}
                className="w-9 h-9 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors"
                title="Kayıtlı Filtreler"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={() => setBulkMode(!bulkMode)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  bulkMode
                    ? 'bg-[hsl(var(--primary))] text-white'
                    : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))]'
                }`}
                title="Toplu İşlem"
              >
                <CheckSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-[hsl(var(--muted-foreground))]">Tüm duruşmalarınızı yönetin</p>
        </div>

        {/* Bulk Actions */}
        {bulkMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="elite-card p-4 mb-4 flex items-center justify-between"
          >
            <div className="text-sm">
              <span className="font-semibold">{selectedHearings.length}</span> duruşma seçildi
            </div>
            <div className="flex gap-2">
              <button
                onClick={bulkComplete}
                disabled={selectedHearings.length === 0}
                className="elite-btn-primary px-4 py-2 disabled:opacity-50 flex items-center text-sm"
              >
                <CheckSquare className="w-4 h-4 mr-2" />
                Tamamla
              </button>
              <button
                onClick={bulkPostpone}
                disabled={selectedHearings.length === 0}
                className="px-4 py-2 rounded-xl bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 transition-colors disabled:opacity-50 flex items-center text-sm"
              >
                <Clock className="w-4 h-4 mr-2" />
                Ertele
              </button>
              <button
                onClick={bulkDelete}
                disabled={selectedHearings.length === 0}
                className="px-4 py-2 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors disabled:opacity-50 flex items-center text-sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Sil
              </button>
            </div>
          </motion.div>
        )}

        {/* View Toggle */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 custom-scrollbar">
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              view === 'list'
                ? 'gradient-primary text-white shadow-lg'
                : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))]'
            }`}
          >
            <List className="w-4 h-4" />
            Liste
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              view === 'calendar'
                ? 'gradient-primary text-white shadow-lg'
                : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))]'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            Takvim
          </button>
          <button
            onClick={() => setView('timeline')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              view === 'timeline'
                ? 'gradient-primary text-white shadow-lg'
                : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))]'
            }`}
          >
            <Clock className="w-4 h-4" />
            Zaman Çizelgesi
          </button>
          <button
            onClick={() => setView('trash')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              view === 'trash'
                ? 'gradient-primary text-white shadow-lg'
                : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))]'
            }`}
          >
            <Archive className="w-4 h-4" />
            Çöp Kutusu
            {deletedHearings.length > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs">
                {deletedHearings.length}
              </span>
            )}
          </button>
        </div>

        {view === 'list' ? (
          <>
            {/* Search & Filter */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                <input
                  type="text"
                  placeholder="Duruşma, müvekkil veya mahkeme ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="elite-input pl-12"
                />
              </div>

              {/* Date Range Filter */}
              <div className="elite-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-4 h-4 text-[hsl(var(--primary))]" />
                  <span className="font-medium text-sm">Tarih Aralığı Filtrele</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[hsl(var(--muted-foreground))] mb-1">
                      Başlangıç
                    </label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                      className="elite-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[hsl(var(--muted-foreground))] mb-1">
                      Bitiş
                    </label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                      className="elite-input text-sm"
                    />
                  </div>
                </div>
                {(dateRange.start || dateRange.end) && (
                  <button
                    onClick={() => setDateRange({ start: '', end: '' })}
                    className="mt-2 text-xs text-[hsl(var(--primary))] hover:underline"
                  >
                    Filtreyi Temizle
                  </button>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="elite-card p-4">
                <div className="text-2xl font-bold text-[hsl(var(--primary))]">5</div>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">Yaklaşan</div>
              </div>
              <div className="elite-card p-4">
                <div className="text-2xl font-bold text-[hsl(var(--warning))]">2</div>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">Bu Hafta</div>
              </div>
              <div className="elite-card p-4">
                <div className="text-2xl font-bold text-[hsl(var(--success))]">15</div>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">Tamamlanan</div>
              </div>
              <div className="elite-card p-4">
                <div className="text-2xl font-bold text-[hsl(var(--danger))]">1</div>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">Ertelenen</div>
              </div>
            </div>

            {/* Hearings List */}
            <div className="space-y-3">
              {mockHearings.map((hearing, index) => {
                const date = new Date(hearing.hearingDate)
                const config = statusConfig[hearing.status]

                return (
                  <motion.div
                    key={hearing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    {bulkMode && (
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                        <input
                          type="checkbox"
                          checked={selectedHearings.includes(hearing.id)}
                          onChange={(e) => {
                            e.stopPropagation()
                            toggleHearingSelection(hearing.id)
                          }}
                          className="w-5 h-5 rounded accent-[hsl(var(--primary))]"
                        />
                      </div>
                    )}
                    <div className={`elite-card p-5 hover:shadow-lg transition-all cursor-pointer ${bulkMode ? 'ml-10' : ''}`}>
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{hearing.title}</h3>
                          <div className="space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4" />
                              <span>{date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                              <Clock className="w-4 h-4 ml-2" />
                              <span>{date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div>
                              <span className="font-medium">Mahkeme:</span> {hearing.courtName} - {hearing.location}
                            </div>
                            <div>
                              <span className="font-medium">Müvekkil:</span> {hearing.clientName} ({hearing.fileNumber})
                            </div>
                          </div>
                          
                          {/* Preparation Progress */}
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-[hsl(var(--muted-foreground))]">Hazırlık Durumu</span>
                              <span className="font-medium">{hearing.preparationProgress}%</span>
                            </div>
                            <div className="h-2 bg-[hsl(var(--secondary))] rounded-full overflow-hidden">
                              <div
                                className="h-full gradient-primary transition-all duration-300"
                                style={{ width: `${hearing.preparationProgress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${config.class}`}>
                            {config.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </>
        ) : view === 'calendar' ? (
          <HearingCalendar hearings={mockHearings} />
        ) : view === 'timeline' ? (
          <HearingTimeline hearings={mockHearings} />
        ) : (
          /* Çöp Kutusu */
          <div className="space-y-4">
            <div className="elite-card p-4 bg-orange-500/10 border-orange-500/20">
              <p className="text-sm text-orange-600 dark:text-orange-400">
                <strong>Not:</strong> Silinen duruşmalar 7 gün boyunca burada saklanır ve ardından otomatik olarak kalıcı silinir.
              </p>
            </div>

            {deletedHearings.length === 0 ? (
              <div className="elite-card p-8 text-center">
                <Archive className="w-12 h-12 mx-auto mb-3 text-[hsl(var(--muted-foreground))]" />
                <p className="text-[hsl(var(--muted-foreground))]">Çöp kutusu boş</p>
              </div>
            ) : (
              <div className="space-y-3">
                {deletedHearings.map((hearing, index) => {
                  const daysLeft = Math.ceil((new Date(hearing.permanentDeleteAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                  
                  return (
                    <motion.div
                      key={hearing.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="elite-card p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{hearing.title}</h3>
                          <p className="text-sm text-[hsl(var(--muted-foreground))]">
                            {hearing.clientName} • {hearing.courtName}
                          </p>
                          <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                            {daysLeft} gün sonra kalıcı silinecek
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRestoreHearing(hearing.id)}
                            className="px-4 py-2 rounded-xl bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/20 transition-colors text-sm font-medium"
                          >
                            Geri Al
                          </button>
                          <button
                            onClick={() => handlePermanentDelete(hearing.id)}
                            className="px-4 py-2 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors text-sm font-medium"
                          >
                            Kalıcı Sil
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Add Button */}
        {view !== 'trash' && (
          <button
            onClick={() => setShowAddForm(true)}
            className="fixed bottom-24 lg:bottom-24 right-4 md:right-8 w-14 h-14 md:w-16 md:h-16 gradient-primary rounded-full shadow-2xl shadow-purple-500/50 flex items-center justify-center text-white z-40 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            type="button"
          >
            <Plus className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        )}

        {/* Modals */}
        <HearingStatsModal isOpen={showStatsModal} onClose={() => setShowStatsModal(false)} />
        <HearingTemplatesModal isOpen={showTemplatesModal} onClose={() => setShowTemplatesModal(false)} />
        <SavedFiltersModal isOpen={showFiltersModal} onClose={() => setShowFiltersModal(false)} />
        <AddHearingForm isOpen={showAddForm} onClose={() => setShowAddForm(false)} />
      </div>
    </div>
  )
}
