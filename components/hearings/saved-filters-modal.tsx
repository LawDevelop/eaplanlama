'use client'

import { X, Save, Plus, Trash2, Filter } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface SavedFilter {
  id: string
  name: string
  description: string
  criteria: {
    status?: string[]
    courtName?: string
    dateRange?: { start: string; end: string }
    clientName?: string
  }
  usageCount: number
}

interface SavedFiltersModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilter?: (filter: SavedFilter) => void
}

export function SavedFiltersModal({ isOpen, onClose, onApplyFilter }: SavedFiltersModalProps) {
  const [filters] = useState<SavedFilter[]>([
    {
      id: '1',
      name: 'Bu Haftanın Duruşmaları',
      description: 'Önümüzdeki 7 gün içindeki tüm planlanmış duruşmalar',
      criteria: {
        status: ['scheduled'],
        dateRange: { start: '2024-02-21', end: '2024-02-28' },
      },
      usageCount: 45,
    },
    {
      id: '2',
      name: 'Aile Mahkemesi Duruşmaları',
      description: 'Tüm aile mahkemelerindeki duruşmalar',
      criteria: {
        courtName: 'Aile Mahkemesi',
        status: ['scheduled', 'postponed'],
      },
      usageCount: 23,
    },
    {
      id: '3',
      name: 'Ertelenen Duruşmalar',
      description: 'Ertelenmiş ve yeniden planlanması gereken duruşmalar',
      criteria: {
        status: ['postponed'],
      },
      usageCount: 12,
    },
    {
      id: '4',
      name: 'Bu Ayki Tamamlananlar',
      description: 'Bu ay içinde tamamlanan tüm duruşmalar',
      criteria: {
        status: ['completed'],
        dateRange: { start: '2024-02-01', end: '2024-02-29' },
      },
      usageCount: 8,
    },
  ])

  const getCriteriaText = (criteria: SavedFilter['criteria']) => {
    const parts = []
    if (criteria.status) {
      const statusLabels = {
        scheduled: 'Planlanmış',
        postponed: 'Ertelenmiş',
        completed: 'Tamamlanmış',
        cancelled: 'İptal',
      }
      parts.push(criteria.status.map(s => statusLabels[s as keyof typeof statusLabels]).join(', '))
    }
    if (criteria.courtName) {
      parts.push(`Mahkeme: ${criteria.courtName}`)
    }
    if (criteria.dateRange) {
      parts.push(`Tarih: ${criteria.dateRange.start} - ${criteria.dateRange.end}`)
    }
    if (criteria.clientName) {
      parts.push(`Müvekkil: ${criteria.clientName}`)
    }
    return parts.join(' • ')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] overflow-y-auto z-50 p-4"
          >
            <div className="elite-card p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center">
                    <Save className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Kayıtlı Filtreler</h2>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">Sık kullanılan filtreleriniz</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Create New Filter Button */}
              <button className="w-full elite-btn-primary mb-6 flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Yeni Filtre Kaydet
              </button>

              {/* Filters List */}
              <div className="space-y-3">
                {filters.map((filter, index) => (
                  <motion.div
                    key={filter.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="elite-card p-5 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Filter className="w-5 h-5 text-[hsl(var(--primary))]" />
                          <h3 className="text-lg font-semibold">{filter.name}</h3>
                          <span className="px-2 py-1 rounded-lg bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] text-xs font-medium">
                            {filter.usageCount} kez kullanıldı
                          </span>
                        </div>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">
                          {filter.description}
                        </p>
                        <div className="text-xs text-[hsl(var(--muted-foreground))] bg-[hsl(var(--secondary))] px-3 py-2 rounded-lg">
                          {getCriteriaText(filter.criteria)}
                        </div>
                      </div>
                      <button className="w-9 h-9 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 flex items-center justify-center transition-colors ml-3">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Apply Filter Button */}
                    <button
                      onClick={() => onApplyFilter?.(filter)}
                      className="w-full elite-btn-primary"
                    >
                      Filtreyi Uygula
                    </button>
                  </motion.div>
                ))}
              </div>

              {filters.length === 0 && (
                <div className="text-center py-12">
                  <Save className="w-16 h-16 mx-auto mb-4 text-[hsl(var(--muted-foreground))]" />
                  <p className="text-[hsl(var(--muted-foreground))]">Henüz kayıtlı filtre yok</p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2">
                    Sık kullandığınız filtreleri kaydedin ve hızlıca erişin
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
