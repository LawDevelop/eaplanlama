'use client'

import { useState, useEffect } from 'react'
import { Plus, Filter, Search, List, Calendar as CalendarIcon, BarChart3, FileText, CheckSquare, Trash2, Archive, Grid3x3, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { SwipeableTask } from './swipeable-task'
import { AddTaskModal } from '@/components/modals/add-task-modal'
import { TaskCalendar } from './task-calendar'
import { TaskDetailModal } from './task-detail-modal'
import { EisenhowerMatrix } from './eisenhower-matrix'
import { useTasks, type Task } from '@/hooks/use-supabase-data'

export function TasksView() {
  const { tasks, loading, error, createTask, updateTask, deleteTask, completeTask, refetch } = useTasks()
  const [view, setView] = useState<'list' | 'calendar' | 'trash' | 'matrix'>('list')
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'overdue'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [bulkMode, setBulkMode] = useState(false)
  const [deletedTasks, setDeletedTasks] = useState<Task[]>([])

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.client_name?.toLowerCase().includes(searchQuery.toLowerCase()))
    
    if (!matchesSearch) return false
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const taskDate = task.due_date ? new Date(task.due_date) : null
    
    if (filter === 'today' && taskDate) {
      return taskDate.toDateString() === today.toDateString() && task.status !== 'completed'
    }
    if (filter === 'week' && taskDate) {
      const weekEnd = new Date(today)
      weekEnd.setDate(weekEnd.getDate() + 7)
      return taskDate >= today && taskDate <= weekEnd && task.status !== 'completed'
    }
    if (filter === 'overdue' && taskDate) {
      return taskDate < today && task.status !== 'completed'
    }
    
    return filter === 'all' || task.status !== 'completed'
  })

  const handleTaskClick = (task: Task) => {
    if (bulkMode) {
      toggleTaskSelection(task.id)
    } else {
      setSelectedTask(task)
      setShowDetailModal(true)
    }
  }

  const handleTaskComplete = async (taskId: string) => {
    await completeTask(taskId)
  }

  const handleTaskDelete = async (taskId: string) => {
    await deleteTask(taskId)
  }

  const handleAddTask = async (taskData: any) => {
    await createTask({
      title: taskData.title,
      description: taskData.description,
      client_name: taskData.clientName,
      file_number: taskData.fileNumber,
      court_name: taskData.courtName,
      priority: taskData.priority,
      due_date: taskData.dueDate,
      tags: taskData.tags,
    })
    setShowAddModal(false)
  }

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  const bulkComplete = async () => {
    for (const taskId of selectedTasks) {
      await completeTask(taskId)
    }
    setSelectedTasks([])
    setBulkMode(false)
  }

  const bulkDelete = async () => {
    if (confirm(`${selectedTasks.length} görevi silmek istediğinizden emin misiniz?`)) {
      for (const taskId of selectedTasks) {
        await deleteTask(taskId)
      }
      setSelectedTasks([])
      setBulkMode(false)
    }
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-6">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gradient">Görevler</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="elite-btn-primary px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Yeni Görev</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--muted-foreground))]" />
            <input
              type="text"
              placeholder="Görev ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="elite-input pl-12"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['all', 'today', 'week', 'overdue'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filter === f
                  ? 'gradient-primary text-white shadow-lg'
                  : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))]'
              }`}
            >
              {f === 'all' ? 'Tümü' : f === 'today' ? 'Bugün' : f === 'week' ? 'Bu Hafta' : 'Gecikmiş'}
            </button>
          ))}
        </div>

        {/* Bulk Actions */}
        {bulkMode && (
          <div className="glass-card p-4 mb-6 flex items-center justify-between">
            <span className="font-medium">{selectedTasks.length} görev seçildi</span>
            <div className="flex gap-2">
              <button onClick={bulkComplete} className="px-4 py-2 bg-green-500 text-white rounded-lg">
                Tamamla
              </button>
              <button onClick={bulkDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg">
                Sil
              </button>
              <button onClick={() => setBulkMode(false)} className="px-4 py-2 bg-gray-500 text-white rounded-lg">
                İptal
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        {view === 'list' && (
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-12 text-[hsl(var(--muted-foreground))]">
                Yükleniyor...
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="elite-card p-12 text-center">
                <CheckSquare className="w-16 h-16 mx-auto text-[hsl(var(--muted-foreground))] mb-4" />
                <p className="text-[hsl(var(--muted-foreground))]">Görev bulunmamaktadır</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 elite-btn-primary px-6 py-2"
                >
                  İlk Görevi Oluştur
                </button>
              </div>
            ) : (
              filteredTasks.map((task, index) => (
                <SwipeableTask
                  key={task.id}
                  task={task}
                  onComplete={() => handleTaskComplete(task.id)}
                  onDelete={() => handleTaskDelete(task.id)}
                  onClick={() => handleTaskClick(task)}
                  selected={selectedTasks.includes(task.id)}
                  onToggleSelect={() => toggleTaskSelection(task.id)}
                  bulkMode={bulkMode}
                />
              ))
            )}
          </div>
        )}

        {view === 'calendar' && (
          <TaskCalendar
            tasks={tasks}
            onTaskClick={(task) => {
              setSelectedTask(task)
              setShowDetailModal(true)
            }}
          />
        )}

        {view === 'matrix' && (
          <EisenhowerMatrix
            tasks={tasks}
            onTaskClick={(task) => {
              setSelectedTask(task)
              setShowDetailModal(true)
            }}
          />
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <AddTaskModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddTask}
        />
      )}

      {/* Task Detail Modal */}
      {showDetailModal && selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setShowDetailModal(false)}
          onSave={async (updates) => {
            await updateTask(selectedTask.id, updates)
            setShowDetailModal(false)
          }}
        />
      )}
    </div>
  )
}
