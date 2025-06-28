import { useState, useEffect } from 'react'
import { supabase, type Profile, type Company, type Contact, type Opportunity, type Task } from '@/lib/supabase'

// Hook para obtener el perfil del usuario actual
export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProfile()
  }, [])

  async function getProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      // Error loading profile
    } finally {
      setLoading(false)
    }
  }

  return { profile, loading, refetch: getProfile }
}

// Hook para manejar empresas
export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCompanies()
  }, [])

  async function fetchCompanies() {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCompanies(data || [])
    } catch (error) {
      // Error loading companies
    } finally {
      setLoading(false)
    }
  }

  async function createCompany(company: Omit<Company, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([company])
        .select()
        .single()

      if (error) throw error
      setCompanies(prev => [data, ...prev])
      return data
    } catch (error) {
      // Error creating company
      throw error
    }
  }

  async function updateCompany(id: string, updates: Partial<Company>) {
    try {
      const { data, error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setCompanies(prev => prev.map(company => company.id === id ? data : company))
      return data
    } catch (error) {
      // Error updating company
      throw error
    }
  }

  async function deleteCompany(id: string) {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id)

      if (error) throw error
      setCompanies(prev => prev.filter(company => company.id !== id))
    } catch (error) {
      // Error deleting company
      throw error
    }
  }

  return {
    companies,
    loading,
    createCompany,
    updateCompany,
    deleteCompany,
    refetch: fetchCompanies
  }
}

// Hook para manejar contactos
export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContacts()
  }, [])

  async function fetchContacts() {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select(`
          *,
          companies(name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setContacts(data || [])
    } catch (error) {
      // Error loading contacts
    } finally {
      setLoading(false)
    }
  }

  async function createContact(contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([contact])
        .select(`
          *,
          companies(name)
        `)
        .single()

      if (error) throw error
      setContacts(prev => [data, ...prev])
      return data
    } catch (error) {
      // Error creating contact
      throw error
    }
  }

  async function updateContact(id: string, updates: Partial<Contact>) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          companies(name)
        `)
        .single()

      if (error) throw error
      setContacts(prev => prev.map(contact => contact.id === id ? data : contact))
      return data
    } catch (error) {
      // Error updating contact
      throw error
    }
  }

  async function deleteContact(id: string) {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id)

      if (error) throw error
      setContacts(prev => prev.filter(contact => contact.id !== id))
    } catch (error) {
      // Error deleting contact
      throw error
    }
  }

  return {
    contacts,
    loading,
    createContact,
    updateContact,
    deleteContact,
    refetch: fetchContacts
  }
}

// Hook para manejar oportunidades
export function useOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOpportunities()
  }, [])

  async function fetchOpportunities() {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select(`
          *,
          companies(name),
          contacts(first_name, last_name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOpportunities(data || [])
    } catch (error) {
      // Error loading opportunities
    } finally {
      setLoading(false)
    }
  }

  async function createOpportunity(opportunity: Omit<Opportunity, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .insert([opportunity])
        .select(`
          *,
          companies(name),
          contacts(first_name, last_name)
        `)
        .single()

      if (error) throw error
      setOpportunities(prev => [data, ...prev])
      return data
    } catch (error) {
      // Error creating opportunity
      throw error
    }
  }

  async function updateOpportunity(id: string, updates: Partial<Opportunity>) {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          companies(name),
          contacts(first_name, last_name)
        `)
        .single()

      if (error) throw error
      setOpportunities(prev => prev.map(opportunity => opportunity.id === id ? data : opportunity))
      return data
    } catch (error) {
      // Error updating opportunity
      throw error
    }
  }

  async function deleteOpportunity(id: string) {
    try {
      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', id)

      if (error) throw error
      setOpportunities(prev => prev.filter(opportunity => opportunity.id !== id))
    } catch (error) {
      // Error deleting opportunity
      throw error
    }
  }

  return {
    opportunities,
    loading,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    refetch: fetchOpportunities
  }
}

// Hook para manejar tareas
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          companies(name),
          contacts(first_name, last_name),
          opportunities(title)
        `)
        .order('due_date', { ascending: true })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      // Error loading tasks
    } finally {
      setLoading(false)
    }
  }

  async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select(`
          *,
          companies(name),
          contacts(first_name, last_name),
          opportunities(title)
        `)
        .single()

      if (error) throw error
      setTasks(prev => [data, ...prev])
      return data
    } catch (error) {
      // Error creating task
      throw error
    }
  }

  async function updateTask(id: string, updates: Partial<Task>) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          companies(name),
          contacts(first_name, last_name),
          opportunities(title)
        `)
        .single()

      if (error) throw error
      setTasks(prev => prev.map(task => task.id === id ? data : task))
      return data
    } catch (error) {
      // Error updating task
      throw error
    }
  }

  async function deleteTask(id: string) {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) throw error
      setTasks(prev => prev.filter(task => task.id !== id))
    } catch (error) {
      // Error deleting task
      throw error
    }
  }

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks
  }
} 