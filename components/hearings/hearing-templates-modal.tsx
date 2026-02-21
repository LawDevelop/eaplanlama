'use client'

import { X, FileText, Plus, Trash2, Edit3 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface HearingTemplate {
  id: string
  name: string
  description: string
  defaultDuration: number
  preparationTasks: string[]
  requiredDocuments: string[]
  usageCount: number
}

interface HearingTemplatesModalProps {
  isOpen: boolean
  onClose: () => void
  onUseTemplate?: (template: HearingTemplate) => void
}

export function HearingTemplatesModal({ isOpen, onClose, onUseTemplate }: HearingTemplatesModalProps) {
  const [templates] = useState<HearingTemplate[]>([
    {
      id: '1',
      name: 'Boşanma Davası',
      description: 'Standart boşanma davası duruşma şablonu',
      defaultDuration: 60,
      preparationTasks: ['Dilekçe hazırla', 'Delilleri topla', 'Tanık listesi oluştur'],
      requiredDocuments: ['Evlilik cüzdanı', 'Nüfus kayıt örneği', 'İkametgah belgesi'],
      usageCount: 15,
    },
    {
      id: '2',
      name: 'İş Davası',
      description: 'İşçi-işveren uyuşmazlığı duruşma şablonu',
      defaultDuration: 90,
      preparationTasks: ['İş sözleşmesi incele', 'Bordro kayıtları topla', 'Tanık ifadeleri al'],
      requiredDocuments: ['İş sözleşmesi', 'Bordro kayıtları', 'İşten çıkış belgesi'],
      usageCount: 12,
    },
    {
      id: '3',
      name: 'Tazminat Davası',
      description: 'Maddi/manevi tazminat davası şablonu',
      defaultDuration: 75,
      preparationTasks: ['Zarar tespiti yap', 'Bilirkişi raporu hazırla', 'Fatura/belge topla'],
      requiredDocuments: ['Kaza tutanağı', 'Sağlık raporları', 'Faturalar'],
      usageCount: 8,
    },
  ])

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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] overflow-y-auto z-50 p-4"
          >
            <div className="elite-card p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Duruşma Şablonları</h2>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">Hızlı duruşma oluşturma şablonları</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Create New Template Button */}
              <button className="w-full elite-btn-primary mb-6 flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Yeni Şablon Oluştur
              </button>

              {/* Templates List */}
              <div className="space-y-4">
                {templates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="elite-card p-5 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{template.name}</h3>
                          <span className="px-2 py-1 rounded-lg bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] text-xs font-medium">
                            {template.usageCount} kez kullanıldı
                          </span>
                        </div>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">
                          {template.description}
                        </p>
                        <div className="text-sm text-[hsl(var(--muted-foreground))]">
                          <span className="font-medium">Süre:</span> {template.defaultDuration} dakika
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="w-9 h-9 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="w-9 h-9 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 flex items-center justify-center transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Preparation Tasks */}
                    <div className="mb-3">
                      <div className="text-sm font-medium mb-2">Hazırlık Görevleri:</div>
                      <div className="flex flex-wrap gap-2">
                        {template.preparationTasks.map((task, i) => (
                          <span key={i} className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-600 text-xs">
                            {task}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Required Documents */}
                    <div className="mb-4">
                      <div className="text-sm font-medium mb-2">Gerekli Belgeler:</div>
                      <div className="flex flex-wrap gap-2">
                        {template.requiredDocuments.map((doc, i) => (
                          <span key={i} className="px-3 py-1 rounded-lg bg-green-500/10 text-green-600 text-xs">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Use Template Button */}
                    <button
                      onClick={() => onUseTemplate?.(template)}
                      className="w-full elite-btn-primary"
                    >
                      Bu Şablonu Kullan
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
