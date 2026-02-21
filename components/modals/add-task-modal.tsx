'use client'

import { useState } from 'react'
import { X, Plus, Calendar as CalendarIcon, User, FileText, Scale, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

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
    tags: [] as string[],
  })
  const [tagInput, setTagInput] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (onAdd) {
      await onAdd(formData)
    } else {
      console.log('Task data:', formData)
    }
    onClose()
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] })
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })
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

          {/* Centered Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <Card className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      Yeni Görev
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Yeni görev oluşturun
                    </p>
                  </div>
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Görev Başlığı <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Örn: Dilekçe hazırla"
                      className="h-12"
                    />
                  </div>

                  {/* Client & File Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Müvekkil Adı
                      </label>
                      <Input
                        type="text"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        placeholder="Müvekkil adı"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <FileText className="w-4 h-4 inline mr-1" />
                        Dosya No
                      </label>
                      <Input
                        type="text"
                        value={formData.fileNumber}
                        onChange={(e) => setFormData({ ...formData, fileNumber: e.target.value })}
                        placeholder="2024/123"
                      />
                    </div>
                  </div>

                  {/* Court Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Scale className="w-4 h-4 inline mr-1" />
                      Mahkeme Adı
                    </label>
                    <Input
                      type="text"
                      value={formData.courtName}
                      onChange={(e) => setFormData({ ...formData, courtName: e.target.value })}
                      placeholder="Mahkeme adı"
                    />
                  </div>

                  {/* Priority & Due Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <AlertCircle className="w-4 h-4 inline mr-1" />
                        Öncelik
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="low">Düşük</option>
                        <option value="medium">Orta</option>
                        <option value="high">Yüksek</option>
                        <option value="critical">Kritik</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <CalendarIcon className="w-4 h-4 inline mr-1" />
                        Son Tarih
                      </label>
                      <Input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="h-12"
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Plus className="w-4 h-4 inline mr-1" />
                      Etiketler
                    </label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        placeholder="Etiket yazın ve Enter'a basın"
                        className="flex-1"
                      />
                      <Button type="button" onClick={addTag} variant="outline" size="icon">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <Badge key={tag} variant="neutral" className="cursor-pointer" onClick={() => removeTag(tag)}>
                            {tag}
                            <X className="w-3 h-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Açıklama</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="flex min-h-[100px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                      placeholder="Görev detayları..."
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      type="button"
                      onClick={onClose}
                      variant="outline"
                      className="flex-1"
                    >
                      İptal
                    </Button>
                    <Button
                      type="submit"
                      variant="gradient"
                      className="flex-1"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Kaydet
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export function FloatingAddTaskButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-24 lg:bottom-6 right-4 lg:right-6 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 z-40 flex items-center justify-center"
    >
      <Plus className="w-6 h-6" />
    </motion.button>
  )
}
