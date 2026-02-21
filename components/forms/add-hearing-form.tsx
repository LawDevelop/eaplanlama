'use client'

import { useState, useEffect } from 'react'
import { X, Edit2, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
}

export function AddHearingForm({ isOpen, onClose, editHearing }: AddHearingFormProps) {
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
    } else {
      setFormData({
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
    }
  }, [editHearing])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Handle form submission (create or update)
    console.log('Hearing data:', formData)
    if (onClose) onClose()
  }

  const FormContent = () => (
    <CardContent className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">
          {editHearing ? 'Duruşma Düzenle' : 'Yeni Duruşma Ekle'}
        </h2>
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="hearingTitle">Dava Başlığı *</Label>
          <Input 
            id="hearingTitle" 
            placeholder="Dava başlığı girin" 
            required 
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-2"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="hearingClient">Müvekkil Adı *</Label>
            <Input 
              id="hearingClient" 
              placeholder="Müvekkil adı" 
              required 
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="hearingFileNumber">Dosya/Esas No *</Label>
            <Input 
              id="hearingFileNumber" 
              placeholder="Dosya numarası" 
              required 
              value={formData.fileNumber}
              onChange={(e) => setFormData({ ...formData, fileNumber: e.target.value })}
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="courtName">Mahkeme *</Label>
          <Input 
            id="courtName" 
            placeholder="Mahkeme adı (örn: Ankara 5. Aile Mahkemesi)" 
            required 
            value={formData.courtName}
            onChange={(e) => setFormData({ ...formData, courtName: e.target.value })}
            className="mt-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="hearingDate">Duruşma Tarihi *</Label>
            <Input 
              id="hearingDate" 
              type="date" 
              required 
              value={formData.hearingDate}
              onChange={(e) => setFormData({ ...formData, hearingDate: e.target.value })}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="hearingTime">Duruşma Saati *</Label>
            <Input 
              id="hearingTime" 
              type="time" 
              required 
              value={formData.hearingTime}
              onChange={(e) => setFormData({ ...formData, hearingTime: e.target.value })}
              className="mt-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="hearingLocation">Salon</Label>
            <Input 
              id="hearingLocation" 
              placeholder="Salon no (opsiyonel)" 
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="hearingType">Duruşma Türü</Label>
            <select
              id="hearingType"
              value={formData.hearingType}
              onChange={(e) => setFormData({ ...formData, hearingType: e.target.value })}
              className="flex h-10 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm mt-2"
            >
              <option value="first">İlk Duruşma</option>
              <option value="continuation">Ara Duruşma</option>
              <option value="expert">Bilirkişi</option>
              <option value="witness">Tanık Dinleme</option>
              <option value="final">Karar Duruşması</option>
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="hearingNotes">Notlar</Label>
          <textarea
            id="hearingNotes"
            placeholder="Duruşma ile ilgili notlar (opsiyonel)"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="flex min-h-[80px] w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-2"
          />
        </div>

        {isModal ? (
          <div className="flex gap-3 pt-4">
            <Button type="button" onClick={onClose} variant="outline" className="flex-1">
              İptal
            </Button>
            <Button type="submit" className="flex-1">
              {editHearing ? 'Güncelle' : 'Duruşma Ekle'}
            </Button>
          </div>
        ) : (
          <Button type="submit" className="w-full">
            Duruşma Ekle
          </Button>
        )}
      </form>
    </CardContent>
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
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100%-2rem)] sm:w-[480px] max-h-[calc(100vh-2rem)] sm:max-h-[90vh] z-50"
            >
              <Card className="h-full overflow-y-auto custom-scrollbar">
                <FormContent />
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    )
  }

  return <Card><FormContent /></Card>
}

export function FloatingAddHearingButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-36 sm:bottom-6 right-4 sm:right-6 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-110 transition-all z-40 flex items-center justify-center"
    >
      <Plus className="w-6 h-6" />
    </button>
  )
}
