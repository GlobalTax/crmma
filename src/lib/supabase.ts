import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para las tablas del CRM
export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: 'admin' | 'manager' | 'user'
  department?: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface Company {
  id: string
  name: string
  industry?: string
  website?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postal_code?: string
  annual_revenue?: number
  employee_count?: number
  description?: string
  status: 'active' | 'inactive' | 'prospect'
  created_at: string
  updated_at: string
  created_by: string
  assigned_to?: string
}

export interface Contact {
  id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  mobile?: string
  job_title?: string
  department?: string
  company_id: string
  is_primary_contact: boolean
  status: 'active' | 'inactive' | 'lead'
  notes?: string
  created_at: string
  updated_at: string
  created_by: string
  assigned_to?: string
  companies?: { name: string }
}

export interface Opportunity {
  id: string
  title: string
  description?: string
  company_id: string
  contact_id?: string
  amount?: number
  currency: string
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
  probability: number
  expected_close_date?: string
  actual_close_date?: string
  source?: string
  status: 'open' | 'closed' | 'lost'
  notes?: string
  created_at: string
  updated_at: string
  created_by: string
  assigned_to?: string
  companies?: { name: string }
  contacts?: { first_name: string; last_name: string }
}

export interface Task {
  id: string
  title: string
  description?: string
  type: 'task' | 'call' | 'email' | 'meeting' | 'follow_up'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  due_date?: string
  completed_at?: string
  company_id?: string
  contact_id?: string
  opportunity_id?: string
  assigned_to?: string
  created_by: string
  created_at: string
  updated_at: string
  companies?: { name: string }
  contacts?: { first_name: string; last_name: string }
  opportunities?: { title: string }
}

export interface Deal {
  id: string
  title: string
  description?: string
  company_id: string
  contact_id?: string
  value?: number
  currency: string
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
  probability: number
  expected_close_date?: string
  actual_close_date?: string
  source?: string
  status: 'active' | 'closed' | 'lost'
  notes?: string
  created_at: string
  updated_at: string
  created_by: string
  assigned_to?: string
}

export interface Activity {
  id: string
  type: 'call' | 'email' | 'meeting' | 'note' | 'task' | 'follow_up'
  subject: string
  description?: string
  company_id?: string
  contact_id?: string
  opportunity_id?: string
  deal_id?: string
  task_id?: string
  duration_minutes?: number
  activity_date: string
  created_by: string
  created_at: string
  updated_at: string
} 