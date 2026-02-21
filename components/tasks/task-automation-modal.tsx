'use client'

import { useState } from 'react'
import { X, Plus, Zap, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Automation {
  id: string
  name: string
  description: string
  isActive: boolean
  trigger: {
    type: string
    conditions?: any
  }
  action: {
    type: string
    config: any
  }
}

interface TaskAutomationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TaskAutomationModal({ isOpen, onClose }: TaskAutomationModalProps) {
  const [automations, setAutomations] = useState<Automation[]>([
    {
      id: '1',
      name: 'Duruşma Dilekçesi',
      description: 'Duruşma eklendiğinde otomatik dilekçe görevi oluştur',
      isActive: true,
      trigger: {
        type: 'hearing_created',
      },
      action: {
        type: 'create_task',
        config: {
          title: 'Duruşma dilekçesi hazırla',
          priority: 'high',
          daysBeforeHearing: 7,
        },
      },
    },
    {
      id: '2',
      name: 'Dosya Arşivleme',
      description: 'Dosya kapandığında tüm görevleri arşivle',
      isActive: true,
      trigger: {
        type: 'file_closed',
      },
      action: {
        type: 'archive_tasks',
        config: {
          archiveRelatedTasks: true,
        },
      },
    },
    {
      id: '3',
      name: 'Aylık Rapor',
      description: 'Her ayın 1\'inde aylık rapor görevi oluştur',
      isActive: false,
      trigger: {
        type: 'date_reached',
        conditions: {
          dayOfMonth: 1,
        },
      },
      action: {
        type: 'create_task',
        config: {
          title: 'Aylık rapor hazırla',
          priority: 'medium',
        },
      },
    },
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newAutomation, setNewAutomation] = useState({
    name: '',
    description: '',
    triggerType: 'task_created',
    actionType: 'create_task',
    taskTitle: '',
    priority: 'medium',
  })

  const toggleAutomation = (id: string) => {
    setAutomations(prev =>
      prev.map(a => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    )
  }

  const deleteAutomation = (id: string) => {
    if (confirm('Bu otomasyonu silmek istediğinizden emin misiniz?')) {
      setAutomations(prev => prev.filter(a => a.id !== id))
    }
  }

  const createAutomation = () => {
    const automation: Automation = {
      id: Date.now().toString(),
      name: newAutomation.name,
      description: newAutomation.description,
      isActive: true,
      trigger: {
        type: newAutomation.triggerType,
      },
      action: {
        type: newAutomation.actionType,
        config: {
          title: newAutomation.taskTitle,
          priority: newAutomation.priority,
        },
      },
    }
    setAutomations(prev => [...prev, automation])
    setShowCreateModal(false)
    setNewAutomation({
      name: '',
      description: '',
      triggerType: 'task_created',
      actionType: 'create_task',
      taskTitle: '',
      priority: 'medium',
    })
  }

  const triggerTypes = [
    { value: 'task_created', label: 'Görev Oluşturulduğunda' },
    { value: 'task_completed', label: 'Görev Tamamlandığında' },
    { value: 'task_overdue', label: 'Görev Geciktiğinde' },
    { value: 'hearing_created', label: 'Duruşma Eklendiğinde' },
    { value: 'file_created', label: 'Dosya Oluşturulduğunda' },
    { value: 'date_reached', label: 'Belirli Tarihte' },
  ]

  const actionTypes = [
    { value: 'create_task', label: 'Görev Oluştur' },
    { value: 'send_notification', label: 'Bildirim Gönder' },
    { value: 'update_task', label: 'Görev Güncelle' },
    { value: 'archive_tasks', label: 'Görevleri Arşivle' },
    { value: 'send_email', label: 'E-posta Gönder' },
  ]

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
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Zap className="w-6 h-6 text-[hsl(var(--primary))]" />
                    Görev Otomasyonları
                  </h2>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    Tekrarlayan işleri otomatikleştirin
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Create Button */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full elite-btn-primary mb-4 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Yeni Otomasyon Oluştur
              </button>

              {/* Automations List */}
              <div className="space-y-3">
                {automations.length === 0 ? (
                  <div className="text-center py-8 text-[hsl(var(--muted-foreground))]">
                    Henüz otomasyon yok
                  </div>
                ) : (
                  automations.map((automation, index) => (
                    <motion.div
                      key={automation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`elite-card p-4 ${
                        automation.isActive ? 'border-[hsl(var(--primary))]' : 'opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className={`w-4 h-4 ${automation.isActive ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'}`} />
                            <h3 className="font-semibold">{automation.name}</h3>
                            {automation.isActive && (
                              <span className="px-2 py-0.5 rounded-full bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] text-xs">
                                Aktif
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">
                            {automation.description}
                          </p>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                              Tetikleyici: {triggerTypes.find(t => t.value === automation.trigger.type)?.label}
                            </span>
                            <span className="px-2 py-1 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
                              Aksiyon: {actionTypes.find(a => a.value === automation.action.type)?.label}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleAutomation(automation.id)}
                            className="p-2 rounded-xl hover:bg-[hsl(var(--secondary))] transition-colors"
                          >
                            {automation.isActive ? (
                              <ToggleRight className="w-6 h-6 text-[hsl(var(--primary))]" />
                            ) : (
                              <ToggleLeft className="w-6 h-6 text-[hsl(var(--muted-foreground))]" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteAutomation(automation.id)}
                            className="p-2 rounded-xl hover:bg-red-500/10 text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          {/* Create Automation Modal */}
          {showCreateModal && (
            <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-lg max-h-[90vh] z-10"
              >
                <div className="elite-card p-6 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">Yeni Otomasyon Oluştur</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Otomasyon Adı *</label>
                    <input
                      type="text"
                      value={newAutomation.name}
                      onChange={(e) => setNewAutomation({ ...newAutomation, name: e.target.value })}
                      className="elite-input"
                      placeholder="Örn: Duruşma Dilekçesi"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Açıklama</label>
                    <input
                      type="text"
                      value={newAutomation.description}
                      onChange={(e) => setNewAutomation({ ...newAutomation, description: e.target.value })}
                      className="elite-input"
                      placeholder="Otomasyon açıklaması"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tetikleyici *</label>
                    <select
                      value={newAutomation.triggerType}
                      onChange={(e) => setNewAutomation({ ...newAutomation, triggerType: e.target.value })}
                      className="elite-input"
                    >
                      {triggerTypes.map((trigger) => (
                        <option key={trigger.value} value={trigger.value}>
                          {trigger.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Aksiyon *</label>
                    <select
                      value={newAutomation.actionType}
                      onChange={(e) => setNewAutomation({ ...newAutomation, actionType: e.target.value })}
                      className="elite-input"
                    >
                      {actionTypes.map((action) => (
                        <option key={action.value} value={action.value}>
                          {action.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {newAutomation.actionType === 'create_task' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Görev Başlığı *</label>
                        <input
                          type="text"
                          value={newAutomation.taskTitle}
                          onChange={(e) => setNewAutomation({ ...newAutomation, taskTitle: e.target.value })}
                          className="elite-input"
                          placeholder="Oluşturulacak görev başlığı"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Öncelik</label>
                        <select
                          value={newAutomation.priority}
                          onChange={(e) => setNewAutomation({ ...newAutomation, priority: e.target.value })}
                          className="elite-input"
                        >
                          <option value="low">Düşük</option>
                          <option value="medium">Orta</option>
                          <option value="high">Yüksek</option>
                          <option value="critical">Kritik</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 elite-btn-secondary"
                    >
                      İptal
                    </button>
                    <button
                      onClick={createAutomation}
                      disabled={!newAutomation.name || (newAutomation.actionType === 'create_task' && !newAutomation.taskTitle)}
                      className="flex-1 elite-btn-primary disabled:opacity-50"
                    >
                      Oluştur
                    </button>
                  </div>
                </div>
              </div>
              </motion.div>
            </div>
          )}
        </div>
      )}
    </AnimatePresence>
  )
}
