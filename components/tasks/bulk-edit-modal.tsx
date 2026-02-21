'use client'

import { useState } from 'react'
import { X, Edit2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BulkEditModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCount: number
  onApply: (changes: any) => void
}

export function BulkEditModal({ isOpen, onClose, selectedCount, onApply }: BulkEditModalProps) {
  const [changes, setChanges] = useState({
    priority: '',
    status: '',
    dueDate: '',
    addTags: [] as string[],
    removeTags: [] as string[],
  })

  const [newTag, setNewTag] = useState('')

  const handleApply = () => {
    const filteredChanges = Object.fromEntries(
      Object.entries(changes).filter(([_, value]) => 
        Array.isArray(value) ? value.length > 0 : value !== ''
      )
    )
    onApply(filteredChanges)
    onClose()
  }

  const addTag = () => {
    if (newTag && !changes.addTags.includes(newTag)) {
      setChanges({ ...changes, addTags: [...changes.addTags, newTag] })
      setNewTag('')
    }
  }

  const removeAddedTag = (tag: string) => {
    setChanges({ ...changes, addTags: changes.addTags.filter(t => t !== tag) })
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
            className="relative w-full max-w-lg max-h-[90vh] z-10"
          >
            <div className="elite-card w-full h-full overflow-y-auto p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Edit2 className="w-6 h-6 text-[hsl(var(--primary))]" />
                    Toplu Düzenleme
                  </h2>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {selectedCount} görev seçildi
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Öncelik Değiştir
                  </label>
                  <select
                    value={changes.priority}
                    onChange={(e) => setChanges({ ...changes, priority: e.target.value })}
                    className="elite-input"
                  >
                    <option value="">Değiştirme</option>
                    <option value="low">Düşük</option>
                    <option value="medium">Orta</option>
                    <option value="high">Yüksek</option>
                    <option value="critical">Kritik</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Durum Değiştir
                  </label>
                  <select
                    value={changes.status}
                    onChange={(e) => setChanges({ ...changes, status: e.target.value })}
                    className="elite-input"
                  >
                    <option value="">Değiştirme</option>
                    <option value="todo">Yapılacak</option>
                    <option value="in_progress">Devam Ediyor</option>
                    <option value="completed">Tamamlandı</option>
                    <option value="archived">Arşivlendi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Son Tarih Değiştir
                  </label>
                  <input
                    type="date"
                    value={changes.dueDate}
                    onChange={(e) => setChanges({ ...changes, dueDate: e.target.value })}
                    className="elite-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Etiket Ekle
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      className="elite-input flex-1"
                      placeholder="Etiket adı"
                    />
                    <button
                      onClick={addTag}
                      className="px-4 py-2 rounded-xl bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary-hover))] transition-colors"
                    >
                      Ekle
                    </button>
                  </div>
                  {changes.addTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {changes.addTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-lg bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] text-sm flex items-center gap-2"
                        >
                          #{tag}
                          <button
                            onClick={() => removeAddedTag(tag)}
                            className="hover:text-red-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    <strong>Not:</strong> Sadece değiştirmek istediğiniz alanları doldurun. 
                    Boş bırakılan alanlar değiştirilmeyecektir.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={onClose}
                    className="flex-1 elite-btn-secondary"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleApply}
                    className="flex-1 elite-btn-primary"
                  >
                    Uygula
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
