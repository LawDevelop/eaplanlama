'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AddFinanceModalProps {
  isOpen: boolean
  onClose: () => void
  defaultType?: 'income' | 'expense'
}

export function AddFinanceModal({ isOpen, onClose, defaultType = 'income' }: AddFinanceModalProps) {
  const [type, setType] = useState<'income' | 'expense'>(defaultType)
  const [formData, setFormData] = useState({
    amount: '',
    clientName: '',
    fileNumber: '',
    totalAgreed: '',
    category: 'rent',
    description: '',
    transactionDate: new Date().toISOString().split('T')[0],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Supabase'e kaydet
    console.log('Finance data:', { type, ...formData })
    onClose()
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
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-50"
          >
            <div className="elite-card h-full md:h-auto max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Yeni Kayıt</h2>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Type Toggle */}
              <div className="flex gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`flex-1 py-2 rounded-xl font-medium transition-all ${
                    type === 'income'
                      ? 'gradient-primary text-white'
                      : 'bg-[hsl(var(--secondary))]'
                  }`}
                >
                  Gelir
                </button>
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`flex-1 py-2 rounded-xl font-medium transition-all ${
                    type === 'expense'
                      ? 'gradient-primary text-white'
                      : 'bg-[hsl(var(--secondary))]'
                  }`}
                >
                  Gider
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tutar (₺) *</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="elite-input"
                    placeholder="0.00"
                  />
                </div>

                {type === 'income' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Müvekkil Adı *</label>
                      <input
                        type="text"
                        required
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

                    <div>
                      <label className="block text-sm font-medium mb-2">Toplam Anlaşılan (Opsiyonel)</label>
                      <input
                        type="number"
                        value={formData.totalAgreed}
                        onChange={(e) => setFormData({ ...formData, totalAgreed: e.target.value })}
                        className="elite-input"
                        placeholder="Toplam tutar"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Kategori *</label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="elite-input"
                      >
                        <option value="rent">Kira</option>
                        <option value="tax">Vergi</option>
                        <option value="transport">Ulaşım</option>
                        <option value="stationery">Kırtasiye</option>
                        <option value="fees">Harçlar</option>
                        <option value="other">Diğer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Açıklama</label>
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="elite-input"
                        placeholder="Gider açıklaması"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Tarih *</label>
                  <input
                    type="date"
                    required
                    value={formData.transactionDate}
                    onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                    className="elite-input"
                  />
                </div>

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
