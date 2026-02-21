'use client'

import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface AddHearingFormProps {
  isOpen?: boolean
  onClose?: () => void
}

export function AddHearingForm({ isOpen, onClose }: AddHearingFormProps) {
  const isModal = isOpen !== undefined

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Handle form submission
    if (onClose) onClose()
  }

  const FormContent = () => (
    <CardContent className={isModal ? 'p-6' : 'p-6'}>
      {!isModal && (
        <h2 className="text-2xl font-bold mb-6">Yeni Duruşma Ekle</h2>
      )}
      
      {isModal && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Yeni Duruşma Ekle</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="hearingTitle">Dava Başlığı</Label>
          <Input id="hearingTitle" placeholder="Dava başlığı girin" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hearingClient">Müvekkil Adı</Label>
          <Input id="hearingClient" placeholder="Müvekkil adı" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hearingFileNumber">Dosya/Esas No</Label>
          <Input id="hearingFileNumber" placeholder="Dosya numarası" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="courtName">Mahkeme</Label>
          <Input id="courtName" placeholder="Mahkeme adı (örn: Ankara 5. Aile Mahkemesi)" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hearingDate">Duruşma Tarihi</Label>
            <Input id="hearingDate" type="date" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hearingTime">Duruşma Saati</Label>
            <Input id="hearingTime" type="time" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hearingLocation">Salon</Label>
          <Input id="hearingLocation" placeholder="Salon no (opsiyonel)" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hearingType">Duruşma Türü</Label>
          <select
            id="hearingType"
            className="flex h-10 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="first">İlk Duruşma</option>
            <option value="continuation">Ara Duruşma</option>
            <option value="expert">Bilirkişi</option>
            <option value="witness">Tanık Dinleme</option>
            <option value="final">Karar Duruşması</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hearingNotes">Notlar</Label>
          <textarea
            id="hearingNotes"
            placeholder="Duruşma ile ilgili notlar (opsiyonel)"
            className="flex min-h-[80px] w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {isModal ? (
          <div className="flex gap-3 pt-4">
            <Button type="button" onClick={onClose} variant="outline" className="flex-1">
              İptal
            </Button>
            <Button type="submit" className="flex-1">
              Duruşma Ekle
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
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50"
            >
              <Card>
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
