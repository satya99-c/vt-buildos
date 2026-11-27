import React from 'react';
import {
  Building2,
  LayoutDashboard,
  FolderKanban,
  Users2,
  Boxes,
  ShoppingCart,
  ReceiptIndianRupee,
  Calculator,
  HardHat,
  ShieldAlert,
  CalendarDays,
  UserCheck,
  Smartphone,
  FileSpreadsheet,
  ChevronDown,
  Building,
  Image as ImageIcon,
  MessageSquare,
  Sun,
  Moon,
} from 'lucide-react';
import { Organization, TenantId, UserRole } from '../types';

interface SidebarProps {
  currentOrg: Organization;
  organizations: Organization[];
  onSelectOrg: (id: TenantId) => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentOrg,
  organizations,
  onSelectOrg,
  currentRole,
  onSelectRole,
  activeTab,
  onSelectTab,
  theme = 'dark',
  onToggleTheme,
}) => {
  const roles: UserRole[] = [
    'Owner',
    'Administrator',
    'Finance Manager',
    'Project Manager',
    'Site Engineer',
    'Supervisor',
    'Storekeeper',
    'Customer',
  ];

  const navSections = [
    {
      title: 'CORE PLATFORM',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, badge: 'WBS' },
        { id: 'projects', label: 'Projects & Portfolio', icon: FolderKanban, count: currentOrg.activeProjectsCount },
        { id: 'workforce', label: 'Workforce & Wages', icon: Users2, badge: 'Muster' },
        { id: 'inventory', label: 'Inventory & Materials', icon: Boxes, badge: 'Ledger' },
        { id: 'procurement', label: 'Procurement & Orders', icon: ShoppingCart, badge: 'RFQ' },
        { id: 'finance', label: 'Finance & Audited Ledger', icon: ReceiptIndianRupee, badge: '₹ GAAP' },
      ],
    },
    {
      title: 'OPERATIONS & ENGINEERING',
      items: [
        { id: 'boq', label: 'BOQ & Cost Estimator', icon: Calculator, badge: 'IS 456' },
        { id: 'siteops', label: 'Site Operations & AI Voice', icon: HardHat, badge: 'AI Voice' },
        { id: 'quality', label: 'Quality & Safety', icon: ShieldAlert, badge: 'HSE' },
        { id: 'scheduling', label: 'Scheduling & Timeline', icon: CalendarDays },
        { id: 'crm', label: 'CRM & Client Pipeline', icon: UserCheck, count: 0 },
      ],
    },
    {
      title: 'PORTALS & UTILITIES',
      items: [
        { id: 'whatsapp-sync', label: 'WhatsApp Autonomous Sync', icon: MessageSquare, badge: 'Live Bot' },
        { id: 'customer-portal', label: 'Customer Portal', icon: Building, badge: 'Escrow' },
        { id: 'mobile-app', label: 'Site Engineer Mobile App', icon: Smartphone, badge: 'Offline' },
        { id: 'import-center', label: 'Data Import Center', icon: FileSpreadsheet, badge: 'CSV / Excel' },
        { id: 'references', label: 'Reference Blueprints', icon: ImageIcon, badge: '8 Designs' },
      ],
    },
  ];

  return (
    <aside className="w-68 bg-[#070B14] border-r border-slate-800/80 flex flex-col h-screen select-none shrink-0 z-40">
      {/* Brand & Platform Header - Solid Surface, No Gradient, Rounded Elements */}
      <div className="p-4 border-b border-slate-800/80 bg-[#0C111E]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#141C2E] border border-cyan-400/40 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">VT BuildOS</span>
              <span className="text-[9px] px-2 py-0.5 bg-[#141C2E] text-cyan-300 font-bold rounded-lg border border-cyan-400/30">ERP</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Construction Management OS</p>
          </div>
        </div>

        {/* Tenant Selector */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/60">
          <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
            Active Tenant / Company
          </label>
          <div className="relative">
            <select
              value={currentOrg.id}
              onChange={(e) => onSelectOrg(e.target.value as TenantId)}
              className="w-full bg-[#111726] border border-cyan-400/30 text-xs text-slate-200 rounded-xl px-3 py-1.5 pr-7 focus:outline-none focus:border-cyan-400 cursor-pointer appearance-none font-medium"
            >
              {organizations.map((org) => (
                <option key={org.id} value={org.id} className="bg-[#090D16] text-slate-200">
                  {org.name} ({org.plan})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-cyan-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Role Switcher */}
        <div className="mt-2.5">
          <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
            Simulate Role (RBAC)
          </label>
          <div className="relative">
            <select
              value={currentRole}
              onChange={(e) => onSelectRole(e.target.value as UserRole)}
              className="w-full bg-[#111726] border border-slate-700/60 text-xs text-slate-300 rounded-xl px-3 py-1.5 pr-7 focus:outline-none focus:border-cyan-400 cursor-pointer appearance-none font-medium"
            >
              {roles.map((r) => (
                <option key={r} value={r} className="bg-[#090D16] text-slate-200">
                  Role: {r}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Navigation Links - Smooth Rounded-2xl Buttons */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {navSections.map((section) => (
          <div key={section.title}>
            <div className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
              {section.title}
            </div>
            <div className="space-y-1 mt-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#141C2E] text-cyan-300 border border-cyan-400/40 font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#111726]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-xl font-mono font-medium ${
                          isActive
                            ? 'bg-cyan-400 text-slate-950 font-bold'
                            : 'bg-[#141C2E] text-slate-400 border border-slate-700/60'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.count !== undefined && (
                      <span className="text-[10px] bg-[#141C2E] text-cyan-400 font-mono px-2 py-0.5 rounded-xl border border-slate-700/60">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Theme Switcher in Sidebar */}
      {onToggleTheme && (
        <div className="px-3 py-2 border-t border-slate-800/80 bg-[#090D16]">
          <button
            onClick={onToggleTheme}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#0E1424] border border-white/5 hover:border-cyan-400/30 text-xs text-slate-300 hover:text-white transition cursor-pointer"
          >
            <span className="flex items-center gap-2">
              {theme === 'light' ? (
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-cyan-400" />
              )}
              <span className="text-[11px] font-medium">{theme === 'light' ? 'Light Theme' : 'Dark Theme'}</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-[#141C2E] text-cyan-400 border border-white/5">
              {theme === 'light' ? 'Switch Dark' : 'Switch Light'}
            </span>
          </button>
        </div>
      )}

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800/80 bg-[#0C111E] text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-mono text-slate-300 font-medium">PostgreSQL RLS Active</span>
        </div>
        <span className="font-mono text-cyan-400 text-[10px]">v1.0.4-prod</span>
      </div>
    </aside>
  );
};
