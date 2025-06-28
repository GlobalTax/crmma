-- Insertar datos de ejemplo para el CRM
-- Nota: Los perfiles se crearán automáticamente cuando los usuarios se registren

-- Insertar empresas de ejemplo (sin created_by por ahora)
INSERT INTO companies (name, industry, website, phone, email, address, city, state, country, postal_code, annual_revenue, employee_count, description, status)
VALUES 
    ('TechCorp Solutions', 'Tecnología', 'https://techcorp.com', '+1234567890', 'info@techcorp.com', '123 Tech Street', 'San Francisco', 'CA', 'USA', '94105', 5000000, 150, 'Empresa de software empresarial', 'active'),
    ('Global Manufacturing Inc', 'Manufactura', 'https://globalmfg.com', '+1234567891', 'contact@globalmfg.com', '456 Industrial Ave', 'Chicago', 'IL', 'USA', '60601', 25000000, 500, 'Fabricante de componentes industriales', 'active'),
    ('Green Energy Co', 'Energía', 'https://greenenergy.com', '+1234567892', 'hello@greenenergy.com', '789 Renewable Blvd', 'Austin', 'TX', 'USA', '73301', 15000000, 200, 'Proveedor de soluciones de energía renovable', 'prospect'),
    ('Digital Marketing Pro', 'Marketing', 'https://digitalmarketingpro.com', '+1234567893', 'info@digitalmarketingpro.com', '321 Creative Lane', 'New York', 'NY', 'USA', '10001', 3000000, 75, 'Agencia de marketing digital', 'active'),
    ('Healthcare Innovations', 'Salud', 'https://healthcareinnovations.com', '+1234567894', 'contact@healthcareinnovations.com', '654 Medical Center Dr', 'Boston', 'MA', 'USA', '02101', 8000000, 120, 'Desarrollador de tecnología médica', 'active');

-- Obtener los IDs de las empresas insertadas
DO $$
DECLARE
    techcorp_id UUID;
    globalmfg_id UUID;
    greenenergy_id UUID;
    digitalmarketing_id UUID;
    healthcare_id UUID;
BEGIN
    SELECT id INTO techcorp_id FROM companies WHERE name = 'TechCorp Solutions';
    SELECT id INTO globalmfg_id FROM companies WHERE name = 'Global Manufacturing Inc';
    SELECT id INTO greenenergy_id FROM companies WHERE name = 'Green Energy Co';
    SELECT id INTO digitalmarketing_id FROM companies WHERE name = 'Digital Marketing Pro';
    SELECT id INTO healthcare_id FROM companies WHERE name = 'Healthcare Innovations';

    -- Insertar contactos de ejemplo
    INSERT INTO contacts (first_name, last_name, email, phone, mobile, job_title, department, company_id, is_primary_contact, status, notes)
    VALUES 
        ('Juan', 'Pérez', 'juan.perez@techcorp.com', '+1234567890', '+1234567890', 'CEO', 'Ejecutivo', techcorp_id, true, 'active', 'Contacto principal de la empresa'),
        ('María', 'García', 'maria.garcia@techcorp.com', '+1234567891', '+1234567891', 'CTO', 'Tecnología', techcorp_id, false, 'active', 'Responsable de tecnología'),
        ('Carlos', 'López', 'carlos.lopez@globalmfg.com', '+1234567892', '+1234567892', 'Director de Operaciones', 'Operaciones', globalmfg_id, true, 'active', 'Contacto principal para operaciones'),
        ('Ana', 'Martínez', 'ana.martinez@greenenergy.com', '+1234567893', '+1234567893', 'Directora de Ventas', 'Ventas', greenenergy_id, true, 'lead', 'Prospecto caliente'),
        ('Roberto', 'Hernández', 'roberto.hernandez@digitalmarketingpro.com', '+1234567894', '+1234567894', 'CEO', 'Ejecutivo', digitalmarketing_id, true, 'active', 'Fundador de la empresa'),
        ('Laura', 'Rodríguez', 'laura.rodriguez@healthcareinnovations.com', '+1234567895', '+1234567895', 'Directora de Investigación', 'I+D', healthcare_id, true, 'active', 'Líder en innovación médica');

    -- Obtener algunos IDs de contactos
    DECLARE
        juan_id UUID;
        carlos_id UUID;
        ana_id UUID;
        roberto_id UUID;
    BEGIN
        SELECT id INTO juan_id FROM contacts WHERE email = 'juan.perez@techcorp.com';
        SELECT id INTO carlos_id FROM contacts WHERE email = 'carlos.lopez@globalmfg.com';
        SELECT id INTO ana_id FROM contacts WHERE email = 'ana.martinez@greenenergy.com';
        SELECT id INTO roberto_id FROM contacts WHERE email = 'roberto.hernandez@digitalmarketingpro.com';

        -- Insertar oportunidades de ejemplo
        INSERT INTO opportunities (title, description, company_id, contact_id, amount, currency, stage, probability, expected_close_date, source, status, notes)
        VALUES 
            ('Implementación de CRM Enterprise', 'Sistema CRM completo para 500 usuarios', techcorp_id, juan_id, 250000, 'USD', 'negotiation', 85, '2024-02-15', 'Website', 'open', 'Oportunidad muy prometedora'),
            ('Sistema de Gestión de Inventario', 'Software para control de inventario en tiempo real', globalmfg_id, carlos_id, 180000, 'USD', 'proposal', 70, '2024-03-01', 'Referral', 'open', 'Necesita aprobación del comité'),
            ('Solución de Energía Solar', 'Instalación de paneles solares para oficinas', greenenergy_id, ana_id, 500000, 'USD', 'qualification', 60, '2024-04-01', 'Cold Call', 'open', 'Prospecto interesado en energías renovables'),
            ('Campaña de Marketing Digital', 'Campaña completa de marketing digital por 6 meses', digitalmarketing_id, roberto_id, 75000, 'USD', 'closed_won', 100, '2024-01-15', 'Website', 'closed', 'Contrato firmado'),
            ('Software de Gestión Hospitalaria', 'Sistema integral para hospital de 200 camas', healthcare_id, NULL, 1200000, 'USD', 'prospecting', 30, '2024-06-01', 'Trade Show', 'open', 'Oportunidad a largo plazo');

        -- Obtener algunos IDs de oportunidades
        DECLARE
            crm_opp_id UUID;
            inventory_opp_id UUID;
            solar_opp_id UUID;
        BEGIN
            SELECT id INTO crm_opp_id FROM opportunities WHERE title = 'Implementación de CRM Enterprise';
            SELECT id INTO inventory_opp_id FROM opportunities WHERE title = 'Sistema de Gestión de Inventario';
            SELECT id INTO solar_opp_id FROM opportunities WHERE title = 'Solución de Energía Solar';

            -- Insertar tareas de ejemplo
            INSERT INTO tasks (title, description, type, priority, status, due_date, company_id, contact_id, opportunity_id)
            VALUES 
                ('Llamada de seguimiento con Juan Pérez', 'Discutir detalles finales del contrato CRM', 'call', 'high', 'pending', NOW() + INTERVAL '1 day', techcorp_id, juan_id, crm_opp_id),
                ('Preparar propuesta técnica', 'Documento técnico para sistema de inventario', 'task', 'medium', 'in_progress', NOW() + INTERVAL '3 days', globalmfg_id, carlos_id, inventory_opp_id),
                ('Reunión de demostración', 'Mostrar funcionalidades del software', 'meeting', 'high', 'pending', NOW() + INTERVAL '2 days', greenenergy_id, ana_id, solar_opp_id),
                ('Enviar cotización', 'Enviar cotización formal por email', 'email', 'medium', 'pending', NOW() + INTERVAL '1 day', techcorp_id, juan_id, crm_opp_id),
                ('Investigación de competencia', 'Analizar competidores en el mercado', 'task', 'low', 'pending', NOW() + INTERVAL '5 days', healthcare_id, NULL, NULL),
                ('Seguimiento post-venta', 'Verificar satisfacción del cliente', 'call', 'medium', 'pending', NOW() + INTERVAL '7 days', digitalmarketing_id, roberto_id, NULL);

            -- Insertar actividades de ejemplo
            INSERT INTO activities (type, subject, description, company_id, contact_id, opportunity_id, duration_minutes)
            VALUES 
                ('call', 'Llamada inicial con TechCorp', 'Primera conversación sobre necesidades de CRM', techcorp_id, juan_id, crm_opp_id, 30),
                ('meeting', 'Reunión de descubrimiento', 'Análisis detallado de requerimientos', globalmfg_id, carlos_id, inventory_opp_id, 60),
                ('email', 'Envío de información', 'Envío de catálogo de productos', greenenergy_id, ana_id, solar_opp_id, NULL),
                ('note', 'Notas de la reunión', 'Cliente muy interesado en la solución', techcorp_id, juan_id, crm_opp_id, NULL),
                ('follow_up', 'Seguimiento de propuesta', 'Recordatorio de propuesta enviada', digitalmarketing_id, roberto_id, NULL, NULL);

        END;
    END;
END $$; 