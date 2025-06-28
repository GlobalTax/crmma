-- Especialización M&A: Modificar opportunities para ser deals M&A específicos

-- Primero, agregar nuevas columnas específicas de M&A a opportunities
ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS deal_type TEXT CHECK (deal_type IN ('acquisition', 'divestiture', 'merger', 'joint_venture', 'ipo', 'private_equity', 'debt_financing'));

ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS transaction_size_min NUMERIC;

ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS transaction_size_max NUMERIC;

ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS industry_sector TEXT;

ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS ebitda NUMERIC;

ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS revenue NUMERIC;

ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS ebitda_multiple NUMERIC;

ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS revenue_multiple NUMERIC;

ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS geography TEXT;

ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS deal_rationale TEXT;

ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS key_risks TEXT;

ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS timeline_target_close DATE;

ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS nda_signed BOOLEAN DEFAULT FALSE;

ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS nda_signed_date DATE;

ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS teaser_sent BOOLEAN DEFAULT FALSE;

ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS teaser_sent_date DATE;

ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS ioi_received BOOLEAN DEFAULT FALSE;

ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS ioi_received_date DATE;

ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS loi_signed BOOLEAN DEFAULT FALSE;

ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS loi_signed_date DATE;

ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS due_diligence_started BOOLEAN DEFAULT FALSE;

ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS due_diligence_started_date DATE;

ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS spa_signed BOOLEAN DEFAULT FALSE;

ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS spa_signed_date DATE;

-- Actualizar los valores permitidos para stage con pipeline M&A específico
ALTER TABLE opportunities 
DROP CONSTRAINT IF EXISTS opportunities_stage_check;

ALTER TABLE opportunities 
ADD CONSTRAINT opportunities_stage_check 
CHECK (stage IN (
  'sourcing',           -- Identificación de oportunidades
  'initial_contact',    -- Primer contacto establecido
  'nda',               -- Negociación y firma de NDA
  'teaser',            -- Envío de teaser/resumen ejecutivo
  'ioi',               -- Indication of Interest recibida
  'loi',               -- Letter of Intent firmada
  'due_diligence',     -- Proceso de due diligence
  'spa_negotiation',   -- Negociación del SPA (Stock Purchase Agreement)
  'closing',           -- Proceso de cierre
  'closed_won',        -- Deal cerrado exitosamente
  'closed_lost',       -- Deal perdido/cancelado
  'on_hold'            -- Deal pausado temporalmente
));

-- Crear tabla para tracking de documentos M&A
CREATE TABLE IF NOT EXISTS ma_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN (
    'nda', 'teaser', 'cim', 'financial_statements', 'tax_returns', 
    'legal_docs', 'contracts', 'ioi', 'loi', 'spa', 'closing_docs'
  )),
  document_name TEXT NOT NULL,
  file_path TEXT,
  uploaded_by UUID REFERENCES profiles(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_required BOOLEAN DEFAULT FALSE,
  is_received BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para due diligence checklist
CREATE TABLE IF NOT EXISTS due_diligence_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN (
    'financial', 'legal', 'commercial', 'operational', 'hr', 'it', 'environmental', 'regulatory'
  )),
  item_name TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_by UUID REFERENCES profiles(id),
  completed_at TIMESTAMP WITH TIME ZONE,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para valuations/valoraciones
CREATE TABLE IF NOT EXISTS valuations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  valuation_method TEXT NOT NULL CHECK (valuation_method IN (
    'dcf', 'comparable_companies', 'precedent_transactions', 'asset_based', 'other'
  )),
  enterprise_value NUMERIC,
  equity_value NUMERIC,
  ebitda_multiple NUMERIC,
  revenue_multiple NUMERIC,
  assumptions TEXT,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para parties (buyers, sellers, advisors)
CREATE TABLE IF NOT EXISTS deal_parties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  party_type TEXT NOT NULL CHECK (party_type IN ('buyer', 'seller', 'advisor', 'lender', 'legal_counsel')),
  company_id UUID REFERENCES companies(id),
  contact_id UUID REFERENCES contacts(id),
  role_description TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejor performance (solo crear si no existen)
CREATE INDEX IF NOT EXISTS idx_opportunities_deal_type ON opportunities(deal_type);
CREATE INDEX IF NOT EXISTS idx_opportunities_industry_sector ON opportunities(industry_sector);
CREATE INDEX IF NOT EXISTS idx_ma_documents_opportunity_id ON ma_documents(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_ma_documents_type ON ma_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_due_diligence_opportunity_id ON due_diligence_items(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_due_diligence_category ON due_diligence_items(category);
CREATE INDEX IF NOT EXISTS idx_valuations_opportunity_id ON valuations(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_deal_parties_opportunity_id ON deal_parties(opportunity_id);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_ma_documents_updated_at ON ma_documents;
CREATE TRIGGER update_ma_documents_updated_at BEFORE UPDATE ON ma_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_due_diligence_items_updated_at ON due_diligence_items;
CREATE TRIGGER update_due_diligence_items_updated_at BEFORE UPDATE ON due_diligence_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_valuations_updated_at ON valuations;
CREATE TRIGGER update_valuations_updated_at BEFORE UPDATE ON valuations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_deal_parties_updated_at ON deal_parties;
CREATE TRIGGER update_deal_parties_updated_at BEFORE UPDATE ON deal_parties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies para las nuevas tablas
ALTER TABLE ma_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE due_diligence_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_parties ENABLE ROW LEVEL SECURITY;

-- Policies para ma_documents
DROP POLICY IF EXISTS "Users can view all M&A documents" ON ma_documents;
CREATE POLICY "Users can view all M&A documents" ON ma_documents FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert M&A documents" ON ma_documents;
CREATE POLICY "Users can insert M&A documents" ON ma_documents FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

DROP POLICY IF EXISTS "Users can update own M&A documents" ON ma_documents;
CREATE POLICY "Users can update own M&A documents" ON ma_documents FOR UPDATE USING (auth.uid() = uploaded_by);

DROP POLICY IF EXISTS "Users can delete own M&A documents" ON ma_documents;
CREATE POLICY "Users can delete own M&A documents" ON ma_documents FOR DELETE USING (auth.uid() = uploaded_by);

-- Policies para due_diligence_items
DROP POLICY IF EXISTS "Users can view all due diligence items" ON due_diligence_items;
CREATE POLICY "Users can view all due diligence items" ON due_diligence_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert due diligence items" ON due_diligence_items;
CREATE POLICY "Users can insert due diligence items" ON due_diligence_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update due diligence items" ON due_diligence_items;
CREATE POLICY "Users can update due diligence items" ON due_diligence_items FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Users can delete due diligence items" ON due_diligence_items;
CREATE POLICY "Users can delete due diligence items" ON due_diligence_items FOR DELETE USING (true);

-- Policies para valuations
DROP POLICY IF EXISTS "Users can view all valuations" ON valuations;
CREATE POLICY "Users can view all valuations" ON valuations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert valuations" ON valuations;
CREATE POLICY "Users can insert valuations" ON valuations FOR INSERT WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can update own valuations" ON valuations;
CREATE POLICY "Users can update own valuations" ON valuations FOR UPDATE USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can delete own valuations" ON valuations;
CREATE POLICY "Users can delete own valuations" ON valuations FOR DELETE USING (auth.uid() = created_by);

-- Policies para deal_parties
DROP POLICY IF EXISTS "Users can view all deal parties" ON deal_parties;
CREATE POLICY "Users can view all deal parties" ON deal_parties FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert deal parties" ON deal_parties;
CREATE POLICY "Users can insert deal parties" ON deal_parties FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update deal parties" ON deal_parties;
CREATE POLICY "Users can update deal parties" ON deal_parties FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Users can delete deal parties" ON deal_parties;
CREATE POLICY "Users can delete deal parties" ON deal_parties FOR DELETE USING (true); 