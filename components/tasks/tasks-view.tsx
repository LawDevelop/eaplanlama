'use client'

import { useState } from 'react'
import { Plus, Search, CheckSquare, Calendar as CalendarIcon, Grid3x3, Sparkles, Clock, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SwipeableTask } from './swipeable-task'
import { AddTaskModal } from '@/components/modals/add-task-modal'
import { TaskCalendar } from './task-calendar'
import { TaskDetailModal } from './task-detail-modal'
import { EisenhowerMatrix } from './eisenhower-matrix'
import { useTasks, type Task } from '@/hooks/use-supabase-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function TasksView() {
  const { tasks, loading, error, createTask, updateTask, deleteTask, completeTask, refetch } = useTasks()
  const [view, setView] = useState<'list' | 'calendar' | 'matrix'>('list')
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'overdue'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [bulkMode, setBulkMode] = useState(false)

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

  // Stats
  const todayCount = tasks.filter(t => {
    if (!t.due_date) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return new Date(t.due_date).toDateString() === today.toDateString() && t.status !== 'completed'
  }).length

  const overdueCount = tasks.filter(t => {
    if (!t.due_date) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return new Date(t.due_date) < today && t.status !== 'completed'
  }).length

  const completedCount = tasks.filter(t => t.status === 'completed').length

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden gradient-primary mb-6"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Sparkles className="w-8 h-8" />
                Görev Yönetimi
              </h1>
              <p className="text-white/80">
                {completedCount} tamamlanan • {tasks.length - completedCount} aktif görev
              </p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              size="lg"
              className="bg-white text-primary hover:bg-white/90 shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Yeni Görev
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 pb-24 lg:pb-6 max-w-7xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-4 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{tasks.length}</div>
                <div className="text-sm text-muted-foreground">Toplam</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-4 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{todayCount}</div>
                <div className="text-sm text-muted-foreground">Bugün</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{overdueCount}</div>
                <div className="text-sm text-muted-foreground">Gecikmiş</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-4 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{completedCount}</div>
                <div className="text-sm text-muted-foreground">Tamamlanan</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Görev ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-background"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'today', 'week', 'overdue'] as const).map((f) => (
                <Button
                  key={f}
                  onClick={() => setFilter(f)}
                  variant={filter === f ? 'default' : 'outline'}
                  size="sm"
                  className={filter === f ? 'bg-primary' : ''}
                >
                  {f === 'all' ? 'Tümü' : f === 'today' ? 'Bugün' : f === 'week' ? 'Bu Hafta' : 'Gecikmiş'}
                </Button>
              ))}
            </div>
          </div>
          
          {/* View Toggle */}
          <div className="flex gap-2 mt-4 border-t border-border pt-4">
            <Button
              onClick={() => setView('list')}
              variant={view === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="flex-1"
            >
              <CheckSquare className="w-4 h-4 mr-2" />
              Liste
            </Button>
            <Button
              onClick={() => setView('calendar')}
              variant={view === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              className="flex-1"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Takvim
            </Button>
            <Button
              onClick={() => setView('matrix')}
              variant={view === 'matrix' ? 'default' : 'ghost'}
              size="sm"
              className="flex-1"
            >
              <Grid3x3 className="w-4 h-4 mr-2" />
              Eisenhower
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {view === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {loading ? (
                <div className="grid gap-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-4">
                      <div className="h-20 bg-muted/50 rounded-lg animate-pulse" />
                    </Card>
                  ))}
                </div>
              ) : filteredTasks.length === 0 ? (
                <Card className="p-12 text-center">
                  <CheckSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Görev bulunmamaktadır</p>
                  <Button onClick={() => setShowAddModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    İlk Görevi Oluştur
                  </Button>
                </Card>
              ) : (
                filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <SwipeableTask
                      task={task}
                      onComplete={() => handleTaskComplete(task.id)}
                      onDelete={() => handleTaskDelete(task.id)}
                      onClick={() => handleTaskClick(task)}
                      selected={selectedTasks.includes(task.id)}
                      onToggleSelect={() => toggleTaskSelection(task.id)}
                      bulkMode={bulkMode}
                    />
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {view === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TaskCalendar
                tasks={tasks}
                onTaskClick={(task) => {
                  setSelectedTask(task)
                  setShowDetailModal(true)
                }}
              />
            </motion.div>
          )}

          {view === 'matrix' && (
            <motion.div
              key="matrix"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EisenhowerMatrix
                tasks={tasks}
                onTaskClick={(task) => {
                  setSelectedTask(task)
                  setShowDetailModal(true)
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddTaskModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddTask}
          />
        )}
      </AnimatePresence>

      {/* Task Detail Modal */}
      <AnimatePresence>
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
      </AnimatePresence>
    </div>
  )
}
