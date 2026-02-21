'use client'

import { useState } from 'react'
import { X, Plus, Trash2, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface TaskTemplatesModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (template: any) => void
}

const mockTemplates = [
  {
    id: '1',
    name: 'Boşanma Davası Standart İşlemler',
    description: 'Boşanma davası için standart görev listesi',
    defaultPriority: 'high',
    checklistItems: [
      'Evlilik cüzdanı fotokopisi',
      'Nüfus kayıt örneği',
      'İkametgah belgesi',
      'Dilekçe hazırlama',
      'Mahkemeye başvuru',
    ],
  },
  {
    id: '2',
    name: 'İş Davası Hazırlık',
    description: 'İş davası için gerekli belgeler ve işlemler',
    defaultPriority: 'medium',
    checklistItems: [
      'İş sözleşmesi',
      'Maaş bordroları',
      'İşten çıkış belgesi',
      'Tanık listesi',
    ],
  },
]

export function TaskTemplatesModal({ isOpen, onClose, onSelectTemplate }: TaskTemplatesModalProps) {
  const [templates, setTemplates] = useState(mockTemplates)
  const [showNewTemplate, setShowNewTemplate] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    defaultPriority: 'medium',
    checklistItems: [''],
  })

  const addChecklistItem = () => {
    setNewTemplate({
      ...newTemplate,
      checklistItems: [...newTemplate.checklistItems, ''],
    })
  }

  const updateChecklistItem = (index: number, value: string) => {
    const items = [...newTemplate.checklistItems]
    items[index] = value
    setNewTemplate({ ...newTemplate, checklistItems: items })
  }

  const removeChecklistItem = (index: number) => {
    setNewTemplate({
      ...newTemplate,
      checklistItems: newTemplate.checklistItems.filter((_, i) => i !== index),
    })
  }

  const saveTemplate = () => {
    // TODO: Supabase'e kaydet
    setTemplates([...templates, { ...newTemplate, id: Date.now().toString() }])
    setShowNewTemplate(false)
    setNewTemplate({ name: '', description: '', defaultPriority: 'medium', checklistItems: [''] })
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
            className="relative w-full max-w-3xl max-h-[90vh] z-10"
          >
            <div className="elite-card w-full h-full overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Görev Şablonları</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowNewTemplate(!showNewTemplate)}
                    className="elite-btn-primary px-4 py-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Şablon
                  </button>
                  <button
                    onClick={onClose}
                    className="w-9 h-9 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {showNewTemplate && (
                <div className="elite-card p-4 mb-6 bg-[hsl(var(--secondary))]">
                  <h3 className="font-semibold mb-4">Yeni Şablon Oluştur</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Şablon Adı</label>
                      <input
                        type="text"
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                        className="elite-input"
                        placeholder="Örn: Boşanma Davası"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Açıklama</label>
                      <textarea
                        value={newTemplate.description}
                        onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                        className="elite-input min-h-[60px]"
                        placeholder="Şablon açıklaması..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Varsayılan Öncelik</label>
                      <select
                        value={newTemplate.defaultPriority}
                        onChange={(e) => setNewTemplate({ ...newTemplate, defaultPriority: e.target.value })}
                        className="elite-input"
                      >
                        <option value="low">Düşük</option>
                        <option value="medium">Orta</option>
                        <option value="high">Yüksek</option>
                        <option value="critical">Kritik</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Alt Görevler</label>
                      <div className="space-y-2">
                        {newTemplate.checklistItems.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => updateChecklistItem(index, e.target.value)}
                              className="elite-input flex-1"
                              placeholder="Alt görev..."
                            />
                            <button
                              onClick={() => removeChecklistItem(index)}
                              className="w-9 h-9 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={addChecklistItem}
                          className="elite-btn-secondary w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Alt Görev Ekle
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowNewTemplate(false)}
                        className="flex-1 elite-btn-secondary"
                      >
                        İptal
                      </button>
                      <button
                        onClick={saveTemplate}
                        className="flex-1 elite-btn-primary"
                      >
                        Kaydet
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    className="elite-card p-4 cursor-pointer"
                    onClick={() => {
                      onSelectTemplate(template)
                      onClose()
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-[hsl(var(--primary))]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{template.name}</h3>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">
                          {template.description}
                        </p>
                        <div className="text-xs text-[hsl(var(--muted-foreground))]">
                          {template.checklistItems.length} alt görev
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
