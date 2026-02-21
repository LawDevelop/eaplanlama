'use client'

import { useState } from 'react'
import { X, Plus, Star, Trash2, Edit2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SavedFilter {
  id: string
  name: string
  description?: string
  filterConfig: {
    priority?: string[]
    status?: string[]
    dateRange?: { start: string; end: string }
    tags?: string[]
    clientName?: string
  }
  isFavorite: boolean
}

interface SavedFiltersModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilter: (filter: SavedFilter) => void
}

export function SavedFiltersModal({ isOpen, onClose, onApplyFilter }: SavedFiltersModalProps) {
  const [filters, setFilters] = useState<SavedFilter[]>([
    {
      id: '1',
      name: 'Acil Dosyalarım',
      description: 'Kritik ve yüksek öncelikli görevler',
      filterConfig: {
        priority: ['critical', 'high'],
      },
      isFavorite: true,
    },
    {
      id: '2',
      name: 'Bu Hafta Bitenler',
      description: 'Bu hafta teslim edilecek görevler',
      filterConfig: {
        dateRange: {
          start: new Date().toISOString().split('T')[0],
          end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
      },
      isFavorite: false,
    },
    {
      id: '3',
      name: 'Tamamlananlar',
      description: 'Son 30 günde tamamlanan görevler',
      filterConfig: {
        status: ['completed'],
        dateRange: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          end: new Date().toISOString().split('T')[0],
        },
      },
      isFavorite: false,
    },
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newFilter, setNewFilter] = useState({
    name: '',
    description: '',
    priority: [] as string[],
    status: [] as string[],
  })

  const toggleFavorite = (filterId: string) => {
    setFilters(prev =>
      prev.map(f => (f.id === filterId ? { ...f, isFavorite: !f.isFavorite } : f))
    )
  }

  const deleteFilter = (filterId: string) => {
    if (confirm('Bu filtreyi silmek istediğinizden emin misiniz?')) {
      setFilters(prev => prev.filter(f => f.id !== filterId))
    }
  }

  const createFilter = () => {
    const filter: SavedFilter = {
      id: Date.now().toString(),
      name: newFilter.name,
      description: newFilter.description,
      filterConfig: {
        priority: newFilter.priority,
        status: newFilter.status,
      },
      isFavorite: false,
    }
    setFilters(prev => [...prev, filter])
    setShowCreateModal(false)
    setNewFilter({ name: '', description: '', priority: [], status: [] })
  }

  const togglePriority = (priority: string) => {
    setNewFilter(prev => ({
      ...prev,
      priority: prev.priority.includes(priority)
        ? prev.priority.filter(p => p !== priority)
        : [...prev.priority, priority],
    }))
  }

  const toggleStatus = (status: string) => {
    setNewFilter(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status],
    }))
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
            className="relative w-full max-w-2xl max-h-[90vh] z-10"
          >
            <div className="elite-card w-full h-full overflow-y-auto p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Kayıtlı Filtreler</h2>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    Sık kullandığınız filtreleri kaydedin
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Create Button */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full elite-btn-primary mb-4 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Yeni Filtre Oluştur
              </button>

              {/* Filters List */}
              <div className="space-y-3">
                {filters.length === 0 ? (
                  <div className="text-center py-8 text-[hsl(var(--muted-foreground))]">
                    Henüz kayıtlı filtre yok
                  </div>
                ) : (
                  filters.map((filter, index) => (
                    <motion.div
                      key={filter.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="elite-card p-4 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => {
                        onApplyFilter(filter)
                        onClose()
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(filter.id)
                          }}
                          className="mt-1"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              filter.isFavorite
                                ? 'fill-yellow-500 text-yellow-500'
                                : 'text-[hsl(var(--muted-foreground))]'
                            }`}
                          />
                        </button>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{filter.name}</h3>
                          {filter.description && (
                            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">
                              {filter.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {filter.filterConfig.priority && filter.filterConfig.priority.length > 0 && (
                              <span className="px-2 py-1 rounded-lg bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] text-xs">
                                Öncelik: {filter.filterConfig.priority.join(', ')}
                              </span>
                            )}
                            {filter.filterConfig.status && filter.filterConfig.status.length > 0 && (
                              <span className="px-2 py-1 rounded-lg bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] text-xs">
                                Durum: {filter.filterConfig.status.join(', ')}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteFilter(filter.id)
                          }}
                          className="p-2 rounded-xl hover:bg-red-500/10 text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          {/* Create Filter Modal */}
          {showCreateModal && (
            <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-lg max-h-[90vh] z-10"
              >
                <div className="elite-card p-6 overflow-y-auto max-h-[90vh]">
                <h3 className="text-xl font-bold mb-4">Yeni Filtre Oluştur</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Filtre Adı *</label>
                    <input
                      type="text"
                      value={newFilter.name}
                      onChange={(e) => setNewFilter({ ...newFilter, name: e.target.value })}
                      className="elite-input"
                      placeholder="Örn: Acil Dosyalarım"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Açıklama</label>
                    <input
                      type="text"
                      value={newFilter.description}
                      onChange={(e) => setNewFilter({ ...newFilter, description: e.target.value })}
                      className="elite-input"
                      placeholder="Filtre açıklaması"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Öncelik</label>
                    <div className="flex flex-wrap gap-2">
                      {['critical', 'high', 'medium', 'low'].map((priority) => (
                        <button
                          key={priority}
                          onClick={() => togglePriority(priority)}
                          className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                            newFilter.priority.includes(priority)
                              ? 'gradient-primary text-white'
                              : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))]'
                          }`}
                        >
                          {priority === 'critical' ? 'Kritik' : priority === 'high' ? 'Yüksek' : priority === 'medium' ? 'Orta' : 'Düşük'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Durum</label>
                    <div className="flex flex-wrap gap-2">
                      {['todo', 'in_progress', 'completed'].map((status) => (
                        <button
                          key={status}
                          onClick={() => toggleStatus(status)}
                          className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                            newFilter.status.includes(status)
                              ? 'gradient-primary text-white'
                              : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))]'
                          }`}
                        >
                          {status === 'todo' ? 'Yapılacak' : status === 'in_progress' ? 'Devam Ediyor' : 'Tamamlandı'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 elite-btn-secondary"
                    >
                      İptal
                    </button>
                    <button
                      onClick={createFilter}
                      disabled={!newFilter.name}
                      className="flex-1 elite-btn-primary disabled:opacity-50"
                    >
                      Oluştur
                    </button>
                  </div>
                </div>
              </div>
              </motion.div>
            </div>
          )}
        </div>
      )}
    </AnimatePresence>
  )
}
