'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AddTaskModalProps {
  isOpen?: boolean
  onClose: () => void
  onAdd?: (taskData: any) => Promise<void> | void
}

export function AddTaskModal({ isOpen = true, onClose, onAdd }: AddTaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    fileNumber: '',
    courtName: '',
    priority: 'medium',
    dueDate: '',
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (onAdd) {
      await onAdd(formData)
    } else {
      console.log('Task data:', formData)
    }
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal - Bottom Sheet on Mobile, Right-Bottom on Desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100%-2rem)] sm:w-[420px] max-h-[calc(100vh-2rem)] sm:max-h-[85vh] z-50"
          >
            <div className="elite-card w-full h-full sm:h-auto overflow-y-auto p-4 sm:p-6 custom-scrollbar">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">Yeni Görev</h2>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Görev Başlığı *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="elite-input"
                    placeholder="Örn: Dilekçe hazırla"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Müvekkil Adı</label>
                    <input
                      type="text"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="elite-input"
                      placeholder="Müvekkil adı"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Dosya No</label>
                    <input
                      type="text"
                      value={formData.fileNumber}
                      onChange={(e) => setFormData({ ...formData, fileNumber: e.target.value })}
                      className="elite-input"
                      placeholder="2024/123"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Mahkeme Adı</label>
                  <input
                    type="text"
                    value={formData.courtName}
                    onChange={(e) => setFormData({ ...formData, courtName: e.target.value })}
                    className="elite-input"
                    placeholder="Mahkeme adı"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Öncelik</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="elite-input"
                    >
                      <option value="low">Düşük</option>
                      <option value="medium">Orta</option>
                      <option value="high">Yüksek</option>
                      <option value="critical">Kritik</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Son Tarih</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="elite-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Açıklama</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="elite-input min-h-[100px]"
                    placeholder="Görev detayları..."
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 elite-btn-secondary"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 elite-btn-primary"
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function FloatingAddTaskButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-110 transition-all z-40 flex items-center justify-center"
    >
      <Plus className="w-6 h-6" />
    </button>
  )
}
