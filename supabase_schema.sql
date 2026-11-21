-- ==============================================================================
-- VT BuildOS — Supabase Database Migration Script
-- Run this in your Supabase Project -> SQL Editor -> Run
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Organizations Table
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    plan VARCHAR(50) DEFAULT 'Internal Operations',
    active_projects_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Default Organization
INSERT INTO public.organizations (code, name, plan)
VALUES ('VT-HQ', 'VT Developers', 'Internal Operations')
ON CONFLICT (code) DO NOTHING;

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    client VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    site_address TEXT,
    plot_dimensions VARCHAR(100),
    building_type VARCHAR(100),
    floors INT DEFAULT 1,
    contract_amount NUMERIC(15, 2) DEFAULT 0.00,
    budget NUMERIC(15, 2) DEFAULT 0.00,
    spent NUMERIC(15, 2) DEFAULT 0.00,
    progress INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Construction',
    start_date DATE,
    completion_date DATE,
    project_manager VARCHAR(150),
    team_size INT DEFAULT 0,
    cpi NUMERIC(5, 2) DEFAULT 1.00,
    spi NUMERIC(5, 2) DEFAULT 1.00,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Workforce & Workers Table
CREATE TABLE IF NOT EXISTS public.workers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    role VARCHAR(100) NOT NULL,
    category VARCHAR(50) DEFAULT 'Skilled',
    daily_wage NUMERIC(10, 2) NOT NULL DEFAULT 500.00,
    assigned_site VARCHAR(255),
    status VARCHAR(5) DEFAULT 'P', -- 'P', 'A', 'H'
    to_pay_today NUMERIC(10, 2) DEFAULT 0.00,
    mobile VARCHAR(30),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Daily Attendance Muster Table
CREATE TABLE IF NOT EXISTS public.daily_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
    site_name VARCHAR(255) NOT NULL,
    status VARCHAR(5) NOT NULL CHECK (status IN ('P', 'A', 'H')),
    wage_calculated NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_worker_site_date UNIQUE (worker_id, attendance_date)
);

-- 6. Inventory & Materials Table
CREATE TABLE IF NOT EXISTS public.materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    opening_stock NUMERIC(12, 2) DEFAULT 0.00,
    purchased NUMERIC(12, 2) DEFAULT 0.00,
    issued NUMERIC(12, 2) DEFAULT 0.00,
    closing_stock NUMERIC(12, 2) GENERATED ALWAYS AS (opening_stock + purchased - issued) STORED,
    min_safety_level NUMERIC(12, 2) DEFAULT 0.00,
    unit_rate NUMERIC(12, 2) DEFAULT 0.00,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Stock Movements Audit Ledger Table
CREATE TABLE IF NOT EXISTS public.stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID REFERENCES public.materials(id) ON DELETE CASCADE,
    movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('Purchase', 'Issue', 'Return', 'Adjustment')),
    quantity NUMERIC(12, 2) NOT NULL,
    destination_site VARCHAR(255),
    reference_no VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Procurement & Purchase Orders Table
CREATE TABLE IF NOT EXISTS public.purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_number VARCHAR(50) UNIQUE NOT NULL,
    supplier VARCHAR(255) NOT NULL,
    item VARCHAR(255) NOT NULL,
    quantity NUMERIC(12, 2) DEFAULT 1.00,
    unit VARCHAR(30),
    amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    order_date DATE DEFAULT CURRENT_DATE,
    delivery_date DATE,
    status VARCHAR(50) DEFAULT 'Requested',
    payment_due DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Finance & Audited General Ledger Table
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_date DATE DEFAULT CURRENT_DATE,
    reference VARCHAR(100) NOT NULL,
    account VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    debit NUMERIC(15, 2) DEFAULT 0.00,
    credit NUMERIC(15, 2) DEFAULT 0.00,
    project VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CRM Leads Table
CREATE TABLE IF NOT EXISTS public.crm_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(150),
    requirement TEXT,
    location VARCHAR(255),
    stage VARCHAR(100) DEFAULT 'Initial Inquiry',
    estimated_value NUMERIC(15, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Disable Row Level Security or Allow Anon Read/Write for Initial Configuration
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;

-- Anonymous Access Policies (for seamless web app connection)
CREATE POLICY "Allow public read/write organizations" ON public.organizations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write workers" ON public.workers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write daily_attendance" ON public.daily_attendance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write materials" ON public.materials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write stock_movements" ON public.stock_movements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write purchase_orders" ON public.purchase_orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write journal_entries" ON public.journal_entries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write crm_leads" ON public.crm_leads FOR ALL USING (true) WITH CHECK (true);
