import { useState, useCallback } from 'react'
import { supabase, type Company, type Contact, type Opportunity, type Task } from '@/lib/supabase'

export function useSupabase() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)

  // Companies
  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        // Error fetching companies
        return []
      }

      setCompanies(data || [])
      return data || []
    } catch (error) {
      // Error in fetchCompanies
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const createCompany = useCallback(async (company: Omit<Company, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([company])
        .select()
        .single()

      if (error) {
        // Error creating company
        return null
      }

      setCompanies(prev => [data, ...prev])
      return data
    } catch (error) {
      // Error in createCompany
      return null
    }
  }, [])

  // Contacts
  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('contacts')
        .select(`
          *,
          companies (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        // Error fetching contacts
        return []
      }

      setContacts(data || [])
      return data || []
    } catch (error) {
      // Error in fetchContacts
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const createContact = useCallback(async (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([contact])
        .select(`
          *,
          companies (
            id,
            name
          )
        `)
        .single()

      if (error) {
        // Error creating contact
        return null
      }

      setContacts(prev => [data, ...prev])
      return data
    } catch (error) {
      // Error in createContact
      return null
    }
  }, [])

  // Opportunities
  const fetchOpportunities = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('opportunities')
        .select(`
          *,
          companies (
            id,
            name
          ),
          contacts (
            id,
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        // Error fetching opportunities
        return []
      }

      setOpportunities(data || [])
      return data || []
    } catch (error) {
      // Error in fetchOpportunities
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const createOpportunity = useCallback(async (opportunity: Omit<Opportunity, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .insert([opportunity])
        .select(`
          *,
          companies (
            id,
            name
          ),
          contacts (
            id,
            first_name,
            last_name
          )
        `)
        .single()

      if (error) {
        // Error creating opportunity
        return null
      }

      setOpportunities(prev => [data, ...prev])
      return data
    } catch (error) {
      // Error in createOpportunity
      return null
    }
  }, [])

  // Tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          companies (
            id,
            name
          ),
          contacts (
            id,
            first_name,
            last_name
          ),
          opportunities (
            id,
            title
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        // Error fetching tasks
        return []
      }

      setTasks(data || [])
      return data || []
    } catch (error) {
      // Error in fetchTasks
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const createTask = useCallback(async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select(`
          *,
          companies (
            id,
            name
          ),
          contacts (
            id,
            first_name,
            last_name
          ),
          opportunities (
            id,
            title
          )
        `)
        .single()

      if (error) {
        // Error creating task
        return null
      }

      setTasks(prev => [data, ...prev])
      return data
    } catch (error) {
      // Error in createTask
      return null
    }
  }, [])

  const updateTaskStatus = useCallback(async (taskId: string, status: Task['status']) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId)
        .select(`
          *,
          companies (
            id,
            name
          ),
          contacts (
            id,
            first_name,
            last_name
          ),
          opportunities (
            id,
            title
          )
        `)
        .single()

      if (error) {
        // Error updating task status
        return null
      }

      setTasks(prev => prev.map(task => task.id === taskId ? data : task))
      return data
    } catch (error) {
      // Error in updateTaskStatus
      return null
    }
  }, [])

  return {
    // Data
    companies,
    contacts,
    opportunities,
    tasks,
    loading,
    
    // Companies
    fetchCompanies,
    createCompany,
    
    // Contacts
    fetchContacts,
    createContact,
    
    // Opportunities
    fetchOpportunities,
    createOpportunity,
    
    // Tasks
    fetchTasks,
    createTask,
    updateTaskStatus,
  }
} 