import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

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
  file_number?: string
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

// Client types
export interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  notes?: string
  created_at: string
  updated_at: string
}

// ============================================
// HOOK FOR TASKS
// ============================================
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setTasks([])
        return
      }

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .is('deleted', null)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (err: any) {
      console.error('Error fetching tasks:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function createTask(task: Partial<Task>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        ...task,
        user_id: user.id,
        status: task.status || 'todo',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single()

    if (error) throw error
    setTasks(prev => [data, ...prev])
    return data
  }

  async function updateTask(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setTasks(prev => prev.map(t => t.id === id ? data : t))
    return data
  }

  async function deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .update({ deleted: true, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  async function completeTask(id: string) {
    return updateTask(id, {
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
  }

  return { tasks, loading, error, createTask, updateTask, deleteTask, completeTask, refetch: fetchTasks }
}

// ============================================
// HOOK FOR HEARINGS
// ============================================
export function useHearings() {
  const [hearings, setHearings] = useState<Hearing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchHearings()
  }, [])

  async function fetchHearings() {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setHearings([])
        return
      }

      const { data, error } = await supabase
        .from('hearings')
        .select('*')
        .eq('user_id', user.id)
        .is('deleted', null)
        .order('hearing_date', { ascending: true })

      if (error) throw error
      setHearings(data || [])
    } catch (err: any) {
      console.error('Error fetching hearings:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function createHearing(hearing: Partial<Hearing>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('hearings')
      .insert([{
        ...hearing,
        user_id: user.id,
        status: hearing.status || 'scheduled',
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
    const { data, error } = await supabase
      .from('hearings')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setHearings(prev => prev.map(h => h.id === id ? data : h))
    return data
  }

  async function deleteHearing(id: string) {
    const { error } = await supabase
      .from('hearings')
      .update({ deleted: true, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
    setHearings(prev => prev.filter(h => h.id !== id))
  }

  async function completeHearing(id: string) {
    return updateHearing(id, {
      status: 'completed',
    })
  }

  return { hearings, loading, error, createHearing, updateHearing, deleteHearing, completeHearing, refetch: fetchHearings }
}

// ============================================
// HOOK FOR FINANCIAL
// ============================================
export function useFinancial() {
  const [financials, setFinancials] = useState<Financial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFinancials()
  }, [])

  async function fetchFinancials() {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setFinancials([])
        return
      }

      const { data, error } = await supabase
        .from('financials')
        .select('*')
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false })

      if (error) throw error
      setFinancials(data || [])
    } catch (err: any) {
      console.error('Error fetching financials:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function createFinancial(financial: Partial<Financial>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('financials')
      .insert([{
        ...financial,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single()

    if (error) throw error
    setFinancials(prev => [data, ...prev])
    return data
  }

  async function updateFinancial(id: string, updates: Partial<Financial>) {
    const { data, error } = await supabase
      .from('financials')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setFinancials(prev => prev.map(f => f.id === id ? data : f))
    return data
  }

  async function deleteFinancial(id: string) {
    const { error } = await supabase
      .from('financials')
      .delete()
      .eq('id', id)

    if (error) throw error
    setFinancials(prev => prev.filter(f => f.id !== id))
  }

  return { 
    financials, 
    loading, 
    error, 
    createFinancial, 
    updateFinancial, 
    deleteFinancial, 
    refetch: fetchFinancials 
  }
}

// ============================================
// HOOK FOR CLIENTS
// ============================================
export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchClients()
  }, [])

  async function fetchClients() {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setClients([])
        return
      }

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true })

      if (error) throw error
      setClients(data || [])
    } catch (err: any) {
      console.error('Error fetching clients:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function createClient(client: Partial<Client>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('clients')
      .insert([{
        ...client,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single()

    if (error) throw error
    setClients(prev => [data, ...prev])
    return data
  }

  async function updateClient(id: string, updates: Partial<Client>) {
    const { data, error } = await supabase
      .from('clients')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setClients(prev => prev.map(c => c.id === id ? data : c))
    return data
  }

  async function deleteClient(id: string) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)

    if (error) throw error
    setClients(prev => prev.filter(c => c.id !== id))
  }

  return { 
    clients, 
    loading, 
    error, 
    createClient, 
    updateClient, 
    deleteClient, 
    refetch: fetchClients 
  }
}
