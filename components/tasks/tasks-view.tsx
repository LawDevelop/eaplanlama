'use client'

import { useState } from 'react'
import { Plus, Filter, Search, List, Calendar as CalendarIcon, BarChart3, FileText, CheckSquare, Trash2, Archive, Grid3x3, Zap, Save, Edit3 } from 'lucide-react'
import { motion } from 'framer-motion'
import { SwipeableTask } from './swipeable-task'
import { AddTaskModal } from '@/components/modals/add-task-modal'
import { TaskCalendar } from './task-calendar'
import { TaskDetailModal } from './task-detail-modal'
import { TaskStatsModal } from './task-stats-modal'
import { TaskTemplatesModal } from './task-templates-modal'
import { EisenhowerMatrix } from './eisenhower-matrix'
import { SavedFiltersModal } from './saved-filters-modal'
import { TaskAutomationModal } from './task-automation-modal'
import { BulkEditModal } from './bulk-edit-modal'

const mockTasks = [
  {
    id: '1',
    title: 'Dilekçe hazırla',
    clientName: 'Mehmet Demir',
    fileNumber: '2024/123',
    priority: 'high' as const,
    dueDate: '2024-02-22',
    completed: false,
    tags: ['acil', 'mahkeme'],
    timeSpentMinutes: 45,
  },
  {
    id: '2',
    title: 'Belge toplama',
    clientName: 'Ayşe Kaya',
    fileNumber: '2024/124',
    priority: 'medium' as const,
    dueDate: '2024-02-23',
    completed: false,
    tags: ['belge'],
    timeSpentMinutes: 30,
  },
  {
    id: '3',
    title: 'Mahkeme dosyası inceleme',
    clientName: 'Ali Yılmaz',
    fileNumber: '2024/125',
    priority: 'critical' as const,
    dueDate: '2024-02-21',
    completed: false,
    tags: ['acil', 'inceleme'],
    timeSpentMinutes: 120,
  },
  {
    id: '4',
    title: 'Müvekkil görüşmesi',
    clientName: 'Fatma Öz',
    fileNumber: '2024/126',
    priority: 'low' as const,
    dueDate: '2024-02-25',
    completed: false,
    tags: ['görüşme'],
    timeSpentMinutes: 60,
  },
]

export function TasksView() {
  const [view, setView] = useState<'list' | 'calendar' | 'trash' | 'matrix'>('list')
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'overdue'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [showTemplatesModal, setShowTemplatesModal] = useState(false)
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [showAutomationModal, setShowAutomationModal] = useState(false)
  const [showBulkEditModal, setShowBulkEditModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [bulkMode, setBulkMode] = useState(false)
  const [deletedTasks, setDeletedTasks] = useState<any[]>([]) // Çöp kutusu
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  })

  const handleTaskClick = (task: any) => {
    if (bulkMode) {
      toggleTaskSelection(task.id)
    } else {
      setSelectedTask(task)
      setShowDetailModal(true)
    }
  }

  const handleTaskComplete = (taskId: string) => {
    // TODO: Supabase'de görevi tamamla
    console.log('Completing task:', taskId)
  }

  const handleTaskDelete = (taskId: string) => {
    // Görevi çöp kutusuna taşı
    const task = mockTasks.find(t => t.id === taskId)
    if (task) {
      const deletedTask = {
        ...task,
        deletedAt: new Date().toISOString(),
        permanentDeleteAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 gün sonra
      }
      setDeletedTasks(prev => [...prev, deletedTask])
      // TODO: Supabase'de görevi soft delete yap
      console.log('Moving to trash:', taskId)
    }
  }

  const handleRestoreTask = (taskId: string) => {
    // Görevi çöp kutusundan geri al
    setDeletedTasks(prev => prev.filter(t => t.id !== taskId))
    // TODO: Supabase'de görevi restore et
    console.log('Restoring task:', taskId)
  }

  const handlePermanentDelete = (taskId: string) => {
    if (confirm('Bu görev kalıcı olarak silinecek. Emin misiniz?')) {
      setDeletedTasks(prev => prev.filter(t => t.id !== taskId))
      // TODO: Supabase'den kalıcı olarak sil
      console.log('Permanently deleting task:', taskId)
    }
  }

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  const bulkComplete = () => {
    // TODO: Supabase'de toplu tamamla
    console.log('Completing tasks:', selectedTasks)
    setSelectedTasks([])
    setBulkMode(false)
  }

  const bulkDelete = () => {
    if (confirm(`${selectedTasks.length} görevi silmek istediğinizden emin misiniz?`)) {
      // TODO: Supabase'den toplu sil
      console.log('Deleting tasks:', selectedTasks)
      setSelectedTasks([])
      setBulkMode(false)
    }
  }

  const handleTemplateSelect = (template: any) => {
    // TODO: Şablondan görev oluştur
    console.log('Creating task from template:', template)
  }

  const handleApplyFilter = (filter: any) => {
    // TODO: Filtreyi uygula
    console.log('Applying filter:', filter)
  }

  const handleBulkEdit = (changes: any) => {
    // TODO: Toplu düzenleme yap
    console.log('Bulk editing:', selectedTasks, changes)
    setSelectedTasks([])
    setBulkMode(false)
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-24">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gradient">Görevler</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowStatsModal(true)
                }}
                className="w-9 h-9 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors cursor-pointer"
                title="İstatistikler"
                type="button"
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowTemplatesModal(true)
                }}
                className="w-9 h-9 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors cursor-pointer"
                title="Şablonlar"
                type="button"
              >
                <FileText className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowFiltersModal(true)
                }}
                className="w-9 h-9 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors cursor-pointer"
                title="Kayıtlı Filtreler"
                type="button"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowAutomationModal(true)
                }}
                className="w-9 h-9 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors cursor-pointer"
                title="Otomasyonlar"
                type="button"
              >
                <Zap className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setBulkMode(!bulkMode)
                }}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                  bulkMode
                    ? 'bg-[hsl(var(--primary))] text-white'
                    : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))]'
                }`}
                title="Toplu İşlem"
                type="button"
              >
                <CheckSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-[hsl(var(--muted-foreground))]">Tüm görevlerinizi yönetin</p>
        </div>

        {/* Bulk Actions */}
        {bulkMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="elite-card p-4 mb-4 flex items-center justify-between"
          >
            <div className="text-sm">
              <span className="font-semibold">{selectedTasks.length}</span> görev seçildi
            </div>
            <div className="flex gap-2">
              <button
                onClick={bulkComplete}
                disabled={selectedTasks.length === 0}
                className="elite-btn-primary px-4 py-2 disabled:opacity-50"
              >
                <CheckSquare className="w-4 h-4 mr-2" />
                Tamamla
              </button>
              <button
                onClick={() => setShowBulkEditModal(true)}
                disabled={selectedTasks.length === 0}
                className="px-4 py-2 rounded-xl bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors disabled:opacity-50 flex items-center"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Düzenle
              </button>
              <button
                onClick={bulkDelete}
                disabled={selectedTasks.length === 0}
                className="px-4 py-2 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors disabled:opacity-50 flex items-center"
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
            onClick={() => setView('matrix')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              view === 'matrix'
                ? 'gradient-primary text-white shadow-lg'
                : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))]'
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
            Matris
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
            {deletedTasks.length > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs">
                {deletedTasks.length}
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
                  placeholder="Görev, müvekkil veya dosya no ara..."
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

              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {[
                  { value: 'all', label: 'Tümü' },
                  { value: 'today', label: 'Bugün' },
                  { value: 'week', label: 'Bu Hafta' },
                  { value: 'overdue', label: 'Gecikmiş' },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setFilter(item.value as any)}
                    className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                      filter === item.value
                        ? 'gradient-primary text-white shadow-lg'
                        : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="elite-card p-4">
                <div className="text-2xl font-bold text-[hsl(var(--primary))]">12</div>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">Aktif Görev</div>
              </div>
              <div className="elite-card p-4">
                <div className="text-2xl font-bold text-[hsl(var(--success))]">8</div>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">Tamamlanan</div>
              </div>
              <div className="elite-card p-4">
                <div className="text-2xl font-bold text-[hsl(var(--warning))]">3</div>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">Bugün</div>
              </div>
              <div className="elite-card p-4">
                <div className="text-2xl font-bold text-[hsl(var(--danger))]">2</div>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">Gecikmiş</div>
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-3">
              {mockTasks.length === 0 ? (
                <div className="elite-card p-8 text-center">
                  <p className="text-[hsl(var(--muted-foreground))]">Henüz görev bulunmuyor</p>
                </div>
              ) : (
                mockTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    {bulkMode && (
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                        <input
                          type="checkbox"
                          checked={selectedTasks.includes(task.id)}
                          onChange={(e) => {
                            e.stopPropagation()
                            toggleTaskSelection(task.id)
                          }}
                          className="w-5 h-5 rounded accent-[hsl(var(--primary))]"
                        />
                      </div>
                    )}
                    <div className={bulkMode ? 'ml-10' : ''}>
                      <SwipeableTask 
                        task={task}
                        onClick={() => handleTaskClick(task)}
                        onComplete={handleTaskComplete}
                        onDelete={handleTaskDelete}
                      />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </>
        ) : view === 'calendar' ? (
          <TaskCalendar 
            tasks={mockTasks} 
            onTaskClick={(task) => {
              setSelectedTask(task)
              setShowDetailModal(true)
            }}
          />
        ) : view === 'matrix' ? (
          <EisenhowerMatrix
            tasks={mockTasks}
            onTaskClick={(task) => {
              setSelectedTask(task)
              setShowDetailModal(true)
            }}
          />
        ) : (
          /* Çöp Kutusu */
          <div className="space-y-4">
            <div className="elite-card p-4 bg-orange-500/10 border-orange-500/20">
              <p className="text-sm text-orange-600 dark:text-orange-400">
                <strong>Not:</strong> Silinen görevler 7 gün boyunca burada saklanır ve ardından otomatik olarak kalıcı silinir.
              </p>
            </div>

            {deletedTasks.length === 0 ? (
              <div className="elite-card p-8 text-center">
                <Archive className="w-12 h-12 mx-auto mb-3 text-[hsl(var(--muted-foreground))]" />
                <p className="text-[hsl(var(--muted-foreground))]">Çöp kutusu boş</p>
              </div>
            ) : (
              <div className="space-y-3">
                {deletedTasks.map((task, index) => {
                  const daysLeft = Math.ceil((new Date(task.permanentDeleteAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                  
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="elite-card p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{task.title}</h3>
                          {task.clientName && (
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">
                              {task.clientName} {task.fileNumber && `• ${task.fileNumber}`}
                            </p>
                          )}
                          <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                            {daysLeft} gün sonra kalıcı silinecek
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRestoreTask(task.id)}
                            className="px-4 py-2 rounded-xl bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/20 transition-colors text-sm font-medium"
                          >
                            Geri Al
                          </button>
                          <button
                            onClick={() => handlePermanentDelete(task.id)}
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

        {/* Add Button - Only show in list, calendar and matrix views */}
        {view !== 'trash' && (
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setShowAddModal(true)
            }}
            className="fixed bottom-24 lg:bottom-24 right-4 md:right-8 w-14 h-14 md:w-16 md:h-16 gradient-primary rounded-full shadow-2xl shadow-purple-500/50 flex items-center justify-center text-white z-40 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            type="button"
          >
            <Plus className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        )}

        {/* Modals */}
        <AddTaskModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
        {selectedTask && (
          <TaskDetailModal
            isOpen={showDetailModal}
            onClose={() => {
              setShowDetailModal(false)
              setSelectedTask(null)
            }}
            task={selectedTask}
          />
        )}
        <TaskStatsModal isOpen={showStatsModal} onClose={() => setShowStatsModal(false)} />
        <TaskTemplatesModal
          isOpen={showTemplatesModal}
          onClose={() => setShowTemplatesModal(false)}
          onSelectTemplate={handleTemplateSelect}
        />
        <SavedFiltersModal
          isOpen={showFiltersModal}
          onClose={() => setShowFiltersModal(false)}
          onApplyFilter={handleApplyFilter}
        />
        <TaskAutomationModal
          isOpen={showAutomationModal}
          onClose={() => setShowAutomationModal(false)}
        />
        <BulkEditModal
          isOpen={showBulkEditModal}
          onClose={() => setShowBulkEditModal(false)}
          selectedCount={selectedTasks.length}
          onApply={handleBulkEdit}
        />
      </div>
    </div>
  )
}
