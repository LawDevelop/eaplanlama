'use client'

import { useState } from 'react'
import { X, Plus, Clock, Tag, Paperclip, History, Share2, Play, Pause, Trash2, Check, Timer } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PomodoroTimer } from './pomodoro-timer'
import type { Task } from '@/hooks/use-supabase-data'

interface TaskDetailModalProps {
  isOpen: boolean
  onClose: () => void
  task: Task
}

export function TaskDetailModal({ isOpen, onClose, task }: TaskDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'checklist' | 'notes' | 'attachments' | 'history' | 'pomodoro'>('details')
  const [checklist, setChecklist] = useState([
    { id: '1', title: 'Belgeleri topla', completed: false },
    { id: '2', title: 'Dilekçe taslağı hazırla', completed: true },
  ])
  const [newChecklistItem, setNewChecklistItem] = useState('')
  const [notes, setNotes] = useState([
    { id: '1', content: 'Müvekkil ile görüşme notları...', createdAt: '2024-02-20' },
  ])
  const [newNote, setNewNote] = useState('')
  const [isTracking, setIsTracking] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setChecklist([...checklist, { id: Date.now().toString(), title: newChecklistItem, completed: false }])
      setNewChecklistItem('')
    }
  }

  const toggleChecklistItem = (id: string) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, { id: Date.now().toString(), content: newNote, createdAt: new Date().toISOString() }])
      setNewNote('')
    }
  }

  const toggleTimeTracking = () => {
    setIsTracking(!isTracking)
    // TODO: Supabase'e kaydet
  }

  const shareTask = () => {
    const shareUrl = `${window.location.origin}/tasks/shared/${task.id}`
    navigator.clipboard.writeText(shareUrl)
    alert('Link kopyalandı!')
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
            className="relative w-full max-w-4xl max-h-[90vh] z-10"
          >
            <div className="elite-card w-full h-full overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-[hsl(var(--card-border))]">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{task.title}</h2>
                  {task.client_name && (
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      {task.client_name} {task.file_number && `• ${task.file_number}`}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={shareTask}
                    className="w-9 h-9 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onClose}
                    className="w-9 h-9 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Time Tracker */}
              <div className="px-6 py-4 bg-[hsl(var(--secondary))] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[hsl(var(--primary))]" />
                  <div>
                    <div className="text-sm text-[hsl(var(--muted-foreground))]">Harcanan Zaman</div>
                    <div className="text-lg font-bold">
                      {Math.floor(timeSpent / 60)}s {timeSpent % 60}dk
                    </div>
                  </div>
                </div>
                <button
                  onClick={toggleTimeTracking}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    isTracking
                      ? 'bg-red-500 text-white'
                      : 'gradient-primary text-white'
                  }`}
                >
                  {isTracking ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Durdur
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Başlat
                    </>
                  )}
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 px-6 pt-4 border-b border-[hsl(var(--card-border))] overflow-x-auto">
                {[
                  { id: 'details', label: 'Detaylar' },
                  { id: 'checklist', label: 'Alt Görevler' },
                  { id: 'notes', label: 'Notlar' },
                  { id: 'attachments', label: 'Ekler' },
                  { id: 'pomodoro', label: 'Pomodoro' },
                  { id: 'history', label: 'Geçmiş' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-[hsl(var(--primary))] border-b-2 border-[hsl(var(--primary))]'
                        : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'details' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Açıklama</label>
                      <textarea
                        defaultValue={task.description}
                        className="elite-input min-h-[100px]"
                        placeholder="Görev açıklaması..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Etiketler</label>
                      <div className="flex flex-wrap gap-2">
                        {task.tags?.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-xl bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                        <button className="px-3 py-1 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] text-sm">
                          + Etiket Ekle
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'checklist' && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newChecklistItem}
                        onChange={(e) => setNewChecklistItem(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addChecklistItem()}
                        placeholder="Yeni alt görev..."
                        className="elite-input flex-1"
                      />
                      <button
                        onClick={addChecklistItem}
                        className="elite-btn-primary px-4"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      {checklist.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] transition-colors"
                        >
                          <button
                            onClick={() => toggleChecklistItem(item.id)}
                            className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-colors ${
                              item.completed
                                ? 'bg-[hsl(var(--primary))] border-[hsl(var(--primary))]'
                                : 'border-[hsl(var(--muted-foreground))]'
                            }`}
                          >
                            {item.completed && <Check className="w-3 h-3 text-white" />}
                          </button>
                          <span className={item.completed ? 'line-through text-[hsl(var(--muted-foreground))]' : ''}>
                            {item.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-4">
                    <div>
                      <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Yeni not ekle..."
                        className="elite-input min-h-[100px]"
                      />
                      <button
                        onClick={addNote}
                        className="elite-btn-primary mt-2"
                      >
                        Not Ekle
                      </button>
                    </div>

                    <div className="space-y-3">
                      {notes.map((note) => (
                        <div key={note.id} className="elite-card p-4">
                          <p className="text-sm mb-2">{note.content}</p>
                          <p className="text-xs text-[hsl(var(--muted-foreground))]">
                            {new Date(note.createdAt).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'attachments' && (
                  <div className="space-y-4">
                    <button className="elite-btn-primary w-full">
                      <Paperclip className="w-4 h-4 mr-2" />
                      Dosya Yükle
                    </button>
                    <p className="text-center text-sm text-[hsl(var(--muted-foreground))]">
                      Henüz ek dosya yok
                    </p>
                  </div>
                )}

                {activeTab === 'pomodoro' && (
                  <PomodoroTimer
                    taskId={task.id}
                    onSessionComplete={(duration) => {
                      setTimeSpent((prev: number) => prev + duration)
                      console.log('Pomodoro completed:', duration)
                    }}
                  />
                )}

                {activeTab === 'history' && (
                  <div className="space-y-3">
                    <div className="elite-card p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] mt-2" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Görev oluşturuldu</p>
                          <p className="text-xs text-[hsl(var(--muted-foreground))]">
                            20 Şubat 2024, 10:30
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
