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
  size?: string
  description?: string
  status: 'active' | 'inactive' | 'prospect'
  created_at: string
  updated_at: string
  created_by?: string
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
  created_by?: string
  assigned_to?: string
  companies?: { id: string; name: string }
}

export interface Opportunity {
  id: string
  title: string
  description?: string
  company_id: string
  contact_id?: string
  amount?: number
  currency: string
  stage: 'sourcing' | 'initial_contact' | 'nda' | 'teaser' | 'ioi' | 'loi' | 'due_diligence' | 'spa_negotiation' | 'closing' | 'closed_won' | 'closed_lost' | 'on_hold'
  probability: number
  expected_close_date?: string
  actual_close_date?: string
  source?: string
  status: 'open' | 'closed' | 'lost'
  notes?: string
  created_at: string
  updated_at: string
  created_by?: string
  assigned_to?: string
  companies?: { id: string; name: string }
  contacts?: { id: string; first_name: string; last_name: string }
  
  // Campos específicos M&A
  deal_type?: 'acquisition' | 'divestiture' | 'merger' | 'joint_venture' | 'ipo' | 'private_equity' | 'debt_financing'
  transaction_size_min?: number
  transaction_size_max?: number
  industry_sector?: string
  ebitda?: number
  revenue?: number
  ebitda_multiple?: number
  revenue_multiple?: number
  geography?: string
  deal_rationale?: string
  key_risks?: string
  timeline_target_close?: string
  nda_signed?: boolean
  nda_signed_date?: string
  teaser_sent?: boolean
  teaser_sent_date?: string
  ioi_received?: boolean
  ioi_received_date?: string
  loi_signed?: boolean
  loi_signed_date?: string
  due_diligence_started?: boolean
  due_diligence_started_date?: string
  spa_signed?: boolean
  spa_signed_date?: string
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
  created_by?: string
  created_at: string
  updated_at: string
  companies?: { id: string; name: string }
  contacts?: { id: string; first_name: string; last_name: string }
  opportunities?: { id: string; title: string }
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
  created_by?: string
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
  created_by?: string
  created_at: string
  updated_at: string
}

// Nuevos tipos para las tablas M&A especializadas
export interface MADocument {
  id: string
  opportunity_id: string
  document_type: 'nda' | 'teaser' | 'cim' | 'financial_statements' | 'tax_returns' | 'legal_docs' | 'contracts' | 'ioi' | 'loi' | 'spa' | 'closing_docs'
  document_name: string
  file_path?: string
  uploaded_by?: string
  uploaded_at: string
  is_required: boolean
  is_received: boolean
  notes?: string
  created_at: string
  updated_at: string
}

export interface DueDiligenceItem {
  id: string
  opportunity_id: string
  category: 'financial' | 'legal' | 'commercial' | 'operational' | 'hr' | 'it' | 'environmental' | 'regulatory'
  item_name: string
  description?: string
  is_completed: boolean
  completed_by?: string
  completed_at?: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  notes?: string
  created_at: string
  updated_at: string
}

export interface Valuation {
  id: string
  opportunity_id: string
  valuation_method: 'dcf' | 'comparable_companies' | 'precedent_transactions' | 'asset_based' | 'other'
  enterprise_value?: number
  equity_value?: number
  ebitda_multiple?: number
  revenue_multiple?: number
  assumptions?: string
  notes?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface DealParty {
  id: string
  opportunity_id: string
  party_type: 'buyer' | 'seller' | 'advisor' | 'lender' | 'legal_counsel'
  company_id?: string
  contact_id?: string
  role_description?: string
  is_primary: boolean
  created_at: string
  updated_at: string
} 