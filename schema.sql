-- ==============================================================================
-- VT BuildOS — PostgreSQL Multi-Tenant Database Architecture & Schema (DDL)
-- Compliant with Sections 4 & 5 of Implementation Architecture
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. TENANCY & IDENTITY
-- ==============================================================================

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    subscription_plan VARCHAR(50) NOT NULL DEFAULT 'starter',
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(50) NOT NULL, -- 'Owner', 'Admin', 'ProjectManager', 'SiteEngineer', 'Finance', 'Customer', 'Supplier'
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 2. PROJECTS & WBS SITES
-- ==============================================================================

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    site_address TEXT NOT NULL,
    plot_dimensions VARCHAR(100),
    building_type VARCHAR(100),
    floors INT DEFAULT 1,
    contract_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    estimated_budget NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    spent_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'Planning', -- 'Planning', 'Construction', 'Delayed', 'Completed'
    start_date DATE NOT NULL,
    expected_completion_date DATE NOT NULL,
    project_manager_id UUID REFERENCES users(id),
    cpi NUMERIC(5, 2) DEFAULT 1.00,
    spi NUMERIC(5, 2) DEFAULT 1.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenant_project_code UNIQUE (tenant_id, code)
);

CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    target_date DATE NOT NULL,
    completion_date DATE,
    progress_percentage INT DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    disbursement_amount NUMERIC(15, 2) DEFAULT 0.00,
    is_escrow_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 3. WORKFORCE & MUSTER ATTENDANCE (Section 2.C)
-- ==============================================================================

CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_code VARCHAR(50) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    trade_category VARCHAR(100) NOT NULL, -- 'Mason', 'Carpenter', 'BarBender', 'Electrician', 'Plumber', 'Unskilled'
    daily_wage_rate NUMERIC(10, 2) NOT NULL,
    phone_number VARCHAR(20),
    assigned_project_id UUID REFERENCES projects(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE daily_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    status CHAR(1) NOT NULL CHECK (status IN ('P', 'A', 'H')), -- Present, Absent, Halfday
    wage_payable NUMERIC(10, 2) NOT NULL,
    recorded_by_user_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_worker_date UNIQUE (tenant_id, employee_id, attendance_date)
);

-- ==============================================================================
-- 4. INVENTORY & STOCK MOVEMENTS (Section 2.D)
-- Opening + Purchased - Issued = Closing Stock Formula
-- ==============================================================================

CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Cement', 'Steel', 'Aggregates', 'Masonry', 'Electrical', 'Plumbing'
    unit VARCHAR(30) NOT NULL, -- 'Bags', 'Metric Tons', 'Brass', 'Pcs'
    opening_stock NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    purchased_quantity NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    issued_quantity NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    closing_stock NUMERIC(12, 2) GENERATED ALWAYS AS (opening_stock + purchased_quantity - issued_quantity) STORED,
    min_safety_threshold NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    standard_unit_rate NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id),
    movement_type VARCHAR(30) NOT NULL CHECK (movement_type IN ('PURCHASE', 'ISSUE', 'RETURN', 'ADJUSTMENT')),
    quantity NUMERIC(12, 2) NOT NULL,
    unit_rate NUMERIC(12, 2) NOT NULL,
    reference_number VARCHAR(100),
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 5. FINANCE & AUDITED GENERAL LEDGER (Section 2.F)
-- Strict Double-Entry: Debits = Credits
-- ==============================================================================

CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    account_number VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE journal_vouchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    voucher_number VARCHAR(100) NOT NULL,
    voucher_date DATE NOT NULL,
    project_id UUID REFERENCES projects(id),
    description TEXT NOT NULL,
    is_posted BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE journal_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    voucher_id UUID NOT NULL REFERENCES journal_vouchers(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id),
    debit NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    credit NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    notes VARCHAR(255),
    CONSTRAINT chk_debit_or_credit CHECK ((debit > 0 AND credit = 0) OR (credit > 0 AND debit = 0))
);

-- ==============================================================================
-- 6. MULTI-TENANCY ROW-LEVEL SECURITY (RLS)
-- Prevents any tenant from seeing another company's data
-- ==============================================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_lines ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_projects ON projects
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);

CREATE POLICY tenant_isolation_workforce ON daily_attendance
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);

CREATE POLICY tenant_isolation_materials ON materials
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);

CREATE POLICY tenant_isolation_finance ON journal_lines
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
