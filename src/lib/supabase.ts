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

-- Opportunities policies
CREATE POLICY "Users can view all opportunities" ON opportunities FOR SELECT USING (true);
CREATE POLICY "Users can insert opportunities" ON opportunities FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update assigned opportunities" ON opportunities FOR UPDATE USING (auth.uid() = assigned_to OR auth.uid() = created_by);
CREATE POLICY "Users can delete own opportunities" ON opportunities FOR DELETE USING (auth.uid() = created_by);

-- Tasks policies
CREATE POLICY "Users can view all tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Users can insert tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update assigned tasks" ON tasks FOR UPDATE USING (auth.uid() = assigned_to OR auth.uid() = created_by);
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (auth.uid() = created_by);

-- Activities policies
CREATE POLICY "Users can view all activities" ON activities FOR SELECT USING (true);
CREATE POLICY "Users can insert activities" ON activities FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own activities" ON activities FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own activities" ON activities FOR DELETE USING (auth.uid() = created_by);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name, avatar_url)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insertar empresas de ejemplo
INSERT INTO companies (name, industry, website, phone, email, address, city, state, country, postal_code, annual_revenue, employee_count, description, status)
VALUES 
    ('TechCorp Solutions', 'Tecnología', 'https://techcorp.com', '+1234567890', 'info@techcorp.com', '123 Tech Street', 'San Francisco', 'CA', 'USA', '94105', 5000000, 150, 'Empresa de software empresarial', 'active'),
    ('Global Manufacturing Inc', 'Manufactura', 'https://globalmfg.com', '+1234567891', 'contact@globalmfg.com', '456 Industrial Ave', 'Chicago', 'IL', 'USA', '60601', 25000000, 500, 'Fabricante de componentes industriales', 'active'),
    ('Green Energy Co', 'Energía', 'https://greenenergy.com', '+1234567892', 'hello@greenenergy.com', '789 Renewable Blvd', 'Austin', 'TX', 'USA', '73301', 15000000, 200, 'Proveedor de soluciones de energía renovable', 'prospect');

-- Insertar contactos de ejemplo
INSERT INTO contacts (first_name, last_name, email, phone, mobile, job_title, department, company_id, is_primary_contact, status, notes)
SELECT 
    'Juan', 'Pérez', 'juan.perez@techcorp.com', '+1234567890', '+1234567890', 'CEO', 'Ejecutivo', companies.id, true, 'active', 'Contacto principal de la empresa'
FROM companies WHERE name = 'TechCorp Solutions'
UNION ALL
SELECT 
    'Carlos', 'López', 'carlos.lopez@globalmfg.com', '+1234567892', '+1234567892', 'Director de Operaciones', 'Operaciones', companies.id, true, 'active', 'Contacto principal para operaciones'
FROM companies WHERE name = 'Global Manufacturing Inc'
UNION ALL
SELECT 
    'Ana', 'Martínez', 'ana.martinez@greenenergy.com', '+1234567893', '+1234567893', 'Directora de Ventas', 'Ventas', companies.id, true, 'lead', 'Prospecto caliente'
FROM companies WHERE name = 'Green Energy Co';

-- Insertar oportunidades de ejemplo (con fechas corregidas)
INSERT INTO opportunities (title, description, company_id, contact_id, amount, currency, stage, probability, expected_close_date, source, status, notes)
SELECT 
    'Implementación de CRM Enterprise', 
    'Sistema CRM completo para 500 usuarios', 
    c.id, 
    co.id, 
    250000, 
    'USD', 
    'negotiation', 
    85, 
    DATE '2024-03-15', 
    'Website', 
    'open', 
    'Oportunidad muy prometedora'
FROM companies c 
JOIN contacts co ON co.company_id = c.id 
WHERE c.name = 'TechCorp Solutions' AND co.first_name = 'Juan'
UNION ALL
SELECT 
    'Sistema de Gestión de Inventario', 
    'Software para control de inventario en tiempo real', 
    c.id, 
    co.id, 
    180000, 
    'USD', 
    'proposal', 
    70, 
    DATE '2024-04-01', 
    'Referral', 
    'open', 
    'Necesita aprobación del comité'
FROM companies c 
JOIN contacts co ON co.company_id = c.id 
WHERE c.name = 'Global Manufacturing Inc' AND co.first_name = 'Carlos'
UNION ALL
SELECT 
    'Solución de Energía Solar', 
    'Instalación de paneles solares para oficinas', 
    c.id, 
    co.id, 
    500000, 
    'USD', 
    'qualification', 
    60, 
    DATE '2024-05-01', 
    'Cold Call', 
    'open', 
    'Prospecto interesado en energías renovables'
FROM companies c 
JOIN contacts co ON co.company_id = c.id 
WHERE c.name = 'Green Energy Co' AND co.first_name = 'Ana'; 