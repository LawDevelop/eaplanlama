import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found, using mock data')
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Task types
export interface Task {
  id: string
  title: string
  description?: string
  client_name?: string
  file_number?: string
  court_name?: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'todo' | 'in_progress' | 'completed' | 'archived'
  tags?: string[]
  due_date?: string
  completed_at?: string
  deleted?: boolean
  created_at: string
  updated_at: string
}

// Hearing types
export interface Hearing {
  id: string
  title: string
  client_name?: string
  court_name?: string
  hearing_date: string
  time?: string
  location?: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'postponed'
  deleted?: boolean
  created_at: string
  updated_at: string
}

// Financial types
export interface Financial {
  id: string
  type: 'income' | 'expense'
  category: string
  amount: number
  description?: string
  client_name?: string
  file_number?: string
  transaction_date: string
  invoice_issued?: boolean
  created_at: string
  updated_at: string
}

// Hook for Tasks
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('deleted', false)
        .order('due_date', { ascending: true })

      if (error) throw error
      setTasks(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function createTask(task: Partial<Task>) {
    if (!supabase) return null

    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        ...task,
        status: 'todo',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single()

    if (error) throw error
    setTasks(prev => [...prev, data])
    return data
  }

  async function updateTask(id: string, updates: Partial<Task>) {
    if (!supabase) return null

    const { data, error } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setTasks(prev => prev.map(t => t.id === id ? data : t))
    return data
  }

  async function deleteTask(id: string) {
    if (!supabase) return

    await supabase
      .from('tasks')
      .update({ deleted: true, deleted_at: new Date().toISOString() })
      .eq('id', id)

    setTasks(prev => prev.filter(t => t.id !== id))
  }

  async function completeTask(id: string) {
    return updateTask(id, { 
      status: 'completed',
      completed_at: new Date().toISOString()
    })
  }

  return { tasks, loading, error, createTask, updateTask, deleteTask, completeTask, refetch: fetchTasks }
}

// Hook for Hearings
export function useHearings() {
  const [hearings, setHearings] = useState<Hearing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchHearings()
  }, [])

  async function fetchHearings() {
    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('hearings')
        .select('*')
        .eq('deleted', false)
        .gte('hearing_date', new Date().toISOString())
        .order('hearing_date', { ascending: true })

      if (error) throw error
      setHearings(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function createHearing(hearing: Partial<Hearing>) {
    if (!supabase) return null

    const { data, error } = await supabase
      .from('hearings')
      .insert([{
        ...hearing,
        status: 'scheduled',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single()

    if (error) throw error
    setHearings(prev => [...prev, data])
    return data
  }

  async function updateHearing(id: string, updates: Partial<Hearing>) {
    if (!supabase) return null

    const { data, error } = await supabase
      .from('hearings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setHearings(prev => prev.map(h => h.id === id ? data : h))
    return data
  }

  async function deleteHearing(id: string) {
    if (!supabase) return

    await supabase
      .from('hearings')
      .update({ deleted: true, deleted_at: new Date().toISOString() })
      .eq('id', id)

    setHearings(prev => prev.filter(h => h.id !== id))
  }

  async function completeHearing(id: string) {
    return updateHearing(id, { status: 'completed' })
  }

  return { hearings, loading, error, createHearing, updateHearing, deleteHearing, completeHearing, refetch: fetchHearings }
}

// Hook for Financials
export function useFinancials() {
  const [financials, setFinancials] = useState<Financial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFinancials()
  }, [])

  async function fetchFinancials() {
    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('financials')
        .select('*')
        .order('transaction_date', { ascending: false })

      if (error) throw error
      setFinancials(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function createFinancial(financial: Partial<Financial>) {
    if (!supabase) return null

    const { data, error } = await supabase
      .from('financials')
      .insert([{
        ...financial,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single()

    if (error) throw error
    setFinancials(prev => [...prev, data])
    return data
  }

  async function updateFinancial(id: string, updates: Partial<Financial>) {
    if (!supabase) return null

    const { data, error } = await supabase
      .from('financials')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setFinancials(prev => prev.map(f => f.id === id ? data : f))
    return data
  }

  async function deleteFinancial(id: string) {
    if (!supabase) return

    await supabase
      .from('financials')
      .delete()
      .eq('id', id)

    setFinancials(prev => prev.filter(f => f.id !== id))
  }

  // Get monthly summary
  function getMonthlySummary() {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const monthlyData = financials.filter(f => {
      const date = new Date(f.transaction_date)
      return date >= monthStart && date <= monthEnd
    })

    const income = monthlyData
      .filter(f => f.type === 'income')
      .reduce((sum, f) => sum + (f.amount || 0), 0)

    const expense = monthlyData
      .filter(f => f.type === 'expense')
      .reduce((sum, f) => sum + (f.amount || 0), 0)

    return {
      income,
      expense,
      balance: income - expense,
      count: monthlyData.length
    }
  }

  return { financials, loading, error, createFinancial, updateFinancial, deleteFinancial, getMonthlySummary, refetch: fetchFinancials }
}
