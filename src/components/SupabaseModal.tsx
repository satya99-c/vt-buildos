import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Table,
} from 'lucide-react';
import {
  getSupabaseCredentials,
  saveSupabaseCredentials,
  clearSupabaseCredentials,
  testSupabaseConnection,
} from '../lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectionChange: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  onConnectionChange,
}) => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ success: boolean; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const creds = getSupabaseCredentials();
      setUrl(creds.url);
      setKey(creds.key);
      setStatusMessage(null);
    }
  }, [isOpen]);

  const handleTestAndSave = async () => {
    if (!url.trim() || !key.trim()) {
      setStatusMessage({ success: false, text: 'Please enter both Project URL and Anon Key.' });
      return;
    }

    setTesting(true);
    setStatusMessage(null);

    const result = await testSupabaseConnection(url.trim(), key.trim());
    setTesting(false);

    if (result.success) {
      saveSupabaseCredentials(url.trim(), key.trim());
      setStatusMessage({ success: true, text: result.message });
      onConnectionChange();
    } else {
      setStatusMessage({ success: false, text: result.message });
    }
  };

  const handleDisconnect = () => {
    clearSupabaseCredentials();
    setUrl('');
    setKey('');
    setStatusMessage({ success: true, text: 'Supabase credentials cleared.' });
    onConnectionChange();
  };

  const handleCopySchema = () => {
    const schemaSql = `-- VT BuildOS Supabase Schema
-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Organizations
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    plan VARCHAR(50) DEFAULT 'Internal Operations',
    active_projects_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Projects
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
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Workers & Attendance
CREATE TABLE IF NOT EXISTS public.workers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    role VARCHAR(100) NOT NULL,
    category VARCHAR(50) DEFAULT 'Skilled',
    daily_wage NUMERIC(10, 2) NOT NULL DEFAULT 500.00,
    assigned_site VARCHAR(255),
    status VARCHAR(5) DEFAULT 'P',
    to_pay_today NUMERIC(10, 2) DEFAULT 0.00,
    mobile VARCHAR(30),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Materials
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
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enable Access
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write organizations" ON public.organizations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write workers" ON public.workers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write materials" ON public.materials FOR ALL USING (true) WITH CHECK (true);
`;
    navigator.clipboard.writeText(schemaSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#070D1E] border border-cyan-500/40 rounded-2xl w-full max-w-2xl p-6 space-y-5 shadow-2xl relative">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Supabase Live Database Integration</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                  PostgreSQL
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Connect your real Supabase cloud project so all added projects, workers, and materials persist live
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: SQL Schema Instructions */}
        <div className="bg-[#091124] p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Table className="w-4 h-4" />
              <span>Step 1: Run SQL Schema in your Supabase Project</span>
            </span>
            <button
              onClick={handleCopySchema}
              className="flex items-center gap-1 text-[11px] bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 px-2.5 py-1 rounded border border-cyan-500/40 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
            </button>
          </div>
          <p className="text-slate-400">
            Open your <strong>Supabase Dashboard $\rightarrow$ SQL Editor</strong>, paste this schema, and click <strong>Run</strong>. A complete script is also saved locally as <code className="text-cyan-300">supabase_schema.sql</code>.
          </p>
        </div>

        {/* Step 2: Credentials Inputs */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="text-slate-300 block mb-1 font-semibold">
              Step 2: Supabase Project URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full bg-[#0A1124] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Found in: Supabase Dashboard $\rightarrow$ Project Settings $\rightarrow$ API $\rightarrow$ Project URL
            </span>
          </div>

          <div>
            <label className="text-slate-300 block mb-1 font-semibold">
              Supabase Project API Key (anon / public)
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full bg-[#0A1124] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Found in: Supabase Dashboard $\rightarrow$ Project Settings $\rightarrow$ API $\rightarrow$ Project API keys (anon public)
            </span>
          </div>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              statusMessage.success
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {statusMessage.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
          <button
            onClick={handleDisconnect}
            className="text-slate-400 hover:text-rose-400 transition cursor-pointer"
          >
            Clear / Disconnect
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleTestAndSave}
              disabled={testing}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition cursor-pointer disabled:opacity-50"
            >
              {testing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Connecting & Verifying...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save & Connect Database</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
