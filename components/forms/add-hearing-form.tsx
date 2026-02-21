'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Calendar as CalendarIcon, User, FileText, Scale, MapPin, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Hearing {
  id?: string
  title: string
  clientName: string
  fileNumber: string
  courtName: string
  hearingDate: string
  hearingTime: string
  location?: string
  hearingType: string
  notes?: string
}

interface AddHearingFormProps {
  isOpen?: boolean
  onClose?: () => void
  editHearing?: Hearing | null
  initialData?: any
  onSubmit?: (data: Hearing) => Promise<void> | void
  onCancel?: () => void
}

export function AddHearingForm({ isOpen, onClose, editHearing, initialData, onSubmit, onCancel }: AddHearingFormProps) {
  const isModal = isOpen !== undefined
  const [formData, setFormData] = useState<Hearing>({
    title: '',
    clientName: '',
    fileNumber: '',
    courtName: '',
    hearingDate: '',
    hearingTime: '',
    location: '',
    hearingType: 'first',
    notes: '',
  })

  useEffect(() => {
    if (editHearing) {
      setFormData(editHearing)
    } else if (initialData) {
      setFormData({
        title: initialData.title || '',
        clientName: initialData.clientName || '',
        fileNumber: initialData.fileNumber || '',
        courtName: initialData.courtName || '',
        hearingDate: initialData.hearingDate || '',
        hearingTime: initialData.hearingTime || '',
        location: initialData.location || '',
        hearingType: initialData.hearingType || 'first',
        notes: initialData.notes || '',
      })
    }
  }, [editHearing, initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      await onSubmit(formData)
    } else {
      console.log('Hearing data:', formData)
      if (onClose) onClose()
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else if (onClose) {
      onClose()
    }
  }

  const FormContent = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
            {editHearing ? 'Duruşma Düzenle' : 'Yeni Duruşma'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Duruşma bilgilerini girin
          </p>
        </div>
        {isModal && onClose && (
          <Button onClick={onClose} variant="ghost" size="icon" className="shrink-0">
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Dava Başlığı <span className="text-red-500">*</span>
          </label>
          <Input 
            placeholder="Dava başlığı girin" 
            required 
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="h-12"
          />
        </div>

        {/* Client & File Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Müvekkil Adı <span className="text-red-500">*</span>
            </label>
            <Input 
              placeholder="Müvekkil adı" 
              required 
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Dosya/Esas No <span className="text-red-500">*</span>
            </label>
            <Input 
              placeholder="2024/123" 
              required 
              value={formData.fileNumber}
              onChange={(e) => setFormData({ ...formData, fileNumber: e.target.value })}
            />
          </div>
        </div>

        {/* Court Name */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <Scale className="w-4 h-4 inline mr-1" />
            Mahkeme <span className="text-red-500">*</span>
          </label>
          <Input 
            placeholder="Mahkeme adı (örn: Ankara 5. Aile Mahkemesi)" 
            required 
            value={formData.courtName}
            onChange={(e) => setFormData({ ...formData, courtName: e.target.value })}
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              <CalendarIcon className="w-4 h-4 inline mr-1" />
              Duruşma Tarihi <span className="text-red-500">*</span>
            </label>
            <Input 
              type="date" 
              required 
              value={formData.hearingDate}
              onChange={(e) => setFormData({ ...formData, hearingDate: e.target.value })}
              className="h-12"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Duruşma Saati <span className="text-red-500">*</span>
            </label>
            <Input 
              type="time" 
              required 
              value={formData.hearingTime}
              onChange={(e) => setFormData({ ...formData, hearingTime: e.target.value })}
              className="h-12"
            />
          </div>
        </div>

        {/* Location & Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Salon
            </label>
            <Input 
              placeholder="Salon no (opsiyonel)" 
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Duruşma Türü
            </label>
            <select
              value={formData.hearingType}
              onChange={(e) => setFormData({ ...formData, hearingType: e.target.value })}
              className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="first">İlk Duruşma</option>
              <option value="continuation">Ara Duruşma</option>
              <option value="expert">Bilirkişi</option>
              <option value="witness">Tanık Dinleme</option>
              <option value="final">Karar Duruşması</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-2">Notlar</label>
          <textarea
            placeholder="Duruşma ile ilgili notlar (opsiyonel)"
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="flex min-h-[100px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button 
            type="button" 
            onClick={handleCancel} 
            variant="outline" 
            className="flex-1"
          >
            İptal
          </Button>
          <Button 
            type="submit" 
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            {editHearing || initialData ? 'Güncelle' : 'Duruşma Ekle'}
          </Button>
        </div>
      </form>
    </div>
  )

  if (isModal) {
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
              >
                <Card>
                  <FormContent />
                </Card>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    )
  }

  return <Card><FormContent /></Card>
}

export function FloatingAddHearingButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-24 lg:bottom-6 right-4 lg:right-6 w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 z-40 flex items-center justify-center"
    >
      <Plus className="w-6 h-6" />
    </motion.button>
  )
}
