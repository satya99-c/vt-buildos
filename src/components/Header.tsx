import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Database,
  Sparkles,
  Plus,
  CloudSun,
  HardHat,
  FolderKanban,
  Users2,
  Boxes,
  ReceiptIndianRupee,
  Calculator,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  X,
} from 'lucide-react';
import { Organization, UserProfile, Project } from '../types';
import { getSupabaseCredentials } from '../lib/supabase';

interface HeaderProps {
  currentOrg: Organization;
  user: UserProfile;
  projects?: Project[];
  onOpenQuickCreate: () => void;
  onOpenAiAssistant: () => void;
  onOpenSupabaseModal: () => void;
  onReplaySplash?: () => void;
  onNavigateTab?: (tabId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentOrg,
  user,
  projects = [],
  onOpenQuickCreate,
  onOpenAiAssistant,
  onOpenSupabaseModal,
  onReplaySplash,
  onNavigateTab,
}) => {
  const { url, key } = getSupabaseCredentials();
  const isConnected = Boolean(url && key);

  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ctrl+K / Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search categories
  const searchableModules = [
    { id: 'projects', label: 'Projects & Portfolio', category: 'Module', icon: FolderKanban, desc: 'WBS, building types & site progress' },
    { id: 'workforce', label: 'Workforce & Wages', category: 'Module', icon: Users2, desc: 'Muster roll, site attendance & wages' },
    { id: 'inventory', label: 'Inventory & Materials', category: 'Module', icon: Boxes, desc: 'Cement, steel, stock balances & issues' },
    { id: 'boq', label: 'BOQ & Cost Estimator', category: 'Module', icon: Calculator, desc: 'IS 456 quantities & client quotations' },
    { id: 'finance', label: 'Finance & Audited Ledger', category: 'Module', icon: ReceiptIndianRupee, desc: 'Double-entry journal & cash flows' },
    { id: 'siteops', label: 'Daily Site Operations & Voice AI', category: 'Module', icon: HardHat, desc: 'Voice-to-Report & daily activities' },
    { id: 'quality', label: 'Quality Assurance & HSE', category: 'Module', icon: ShieldAlert, desc: 'Inspections, cube strength & defects' },
    { id: 'whatsapp-sync', label: 'WhatsApp Autonomous Sync', category: 'Integration', icon: MessageSquare, desc: 'Bidirectional phone updates & AI query bot' },
  ];

  const searchableMaterials = [
    { id: 'inventory', label: 'UltraTech PPC Cement', category: 'Material', icon: Boxes, desc: '120 bags remaining on site' },
    { id: 'inventory', label: 'Tata Tiscon Fe 550D Steel', category: 'Material', icon: Boxes, desc: '14.5 MT current stock' },
    { id: 'inventory', label: 'Zone-II River Sand', category: 'Material', icon: Boxes, desc: '22 Brass available' },
  ];

  const filteredProjects = projects
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.location.toLowerCase().includes(searchQuery.toLowerCase()))
    .map((p) => ({
      id: 'projects',
      label: p.name,
      category: 'Project',
      icon: FolderKanban,
      desc: `${p.location} · Budget ₹${(p.budget / 10000000).toFixed(2)} Cr · ${p.status}`,
    }));

  const filteredModules = searchableModules.filter(
    (m) => m.label.toLowerCase().includes(searchQuery.toLowerCase()) || m.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMaterials = searchableMaterials.filter(
    (m) => m.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allResults = [...filteredProjects, ...filteredModules, ...filteredMaterials];

  const handleSelectResult = (tabId: string) => {
    setIsOpen(false);
    setSearchQuery('');
    if (onNavigateTab) {
      onNavigateTab(tabId);
    }
  };

  return (
    <header className="h-16 border-b border-white/5 bg-[#090D16] px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search Bar with Live Dropdown */}
      <div ref={containerRef} className="relative flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            placeholder="Search projects, site activities, materials, workers... (Ctrl+K)"
            className="w-full bg-[#0E1424] border border-white/10 rounded-2xl pl-10 pr-12 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-all"
          />
          {searchQuery ? (
            <button
              onClick={() => {
                setSearchQuery('');
                searchInputRef.current?.focus();
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-[#070B14] text-slate-400 border border-white/10 px-2 py-0.5 rounded-lg font-mono">
              ⌘K
            </kbd>
          )}
        </div>

        {/* Live Search Results Dropdown */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-[#090D16] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50 p-2 space-y-1 text-xs">
            <div className="px-3 py-1.5 text-[10px] uppercase font-mono font-bold text-slate-400 border-b border-white/5 flex items-center justify-between">
              <span>{searchQuery ? `Search Results for "${searchQuery}"` : 'Quick Navigation & Shortcuts'}</span>
              <span>{allResults.length} matches</span>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-1 p-1">
              {allResults.length === 0 ? (
                <div className="p-6 text-center text-slate-400">
                  No matches found for "{searchQuery}". Try searching for "Skyline", "Cement", "BOQ", or "Wages".
                </div>
              ) : (
                allResults.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectResult(item.id)}
                      className="w-full p-2.5 rounded-2xl hover:bg-[#0E1424] flex items-center justify-between text-left transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#070B14] border border-white/5 text-cyan-400 group-hover:border-cyan-500/40 transition">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {item.label}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {item.desc}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                          {item.category}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition" />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Tools & Status */}
      <div className="flex items-center gap-3">
        {/* Replay Construction Intro Screen Button */}
        {onReplaySplash && (
          <button
            onClick={onReplaySplash}
            title="Replay Construction Intro Scene"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#0E1424] border border-white/10 text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition cursor-pointer"
          >
            <HardHat className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden xl:inline text-[11px] font-mono">Site Intro</span>
          </button>
        )}

        {/* Weather & Site Live Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#0E1424] border border-white/10 text-xs text-slate-300">
          <CloudSun className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-white">29°C</span>
          <span className="text-slate-400">Kakinada</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1"></span>
          <span className="text-[11px] text-emerald-400 font-medium">Sites Active</span>
        </div>

        {/* Supabase Connection Button / Badge */}
        <button
          onClick={onOpenSupabaseModal}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border text-xs font-semibold transition cursor-pointer ${
            isConnected
              ? 'bg-[#102422] border-emerald-500/40 text-emerald-300 hover:bg-[#14302d]'
              : 'bg-[#261E14] border-amber-500/40 text-amber-300 hover:bg-[#332819]'
          }`}
        >
          <Database className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
          <span>{isConnected ? 'Database Live' : 'Connect DB'}</span>
        </button>

        {/* AI Copilot Button */}
        <button
          onClick={onOpenAiAssistant}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#0E1424] border border-cyan-400/30 text-cyan-300 text-xs font-semibold hover:border-cyan-400 hover:bg-[#141C30] transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>BuildOS AI</span>
        </button>

        {/* Quick Action Button */}
        <button
          onClick={onOpenQuickCreate}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-sm transition cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="hidden sm:inline">Quick Action</span>
        </button>
      </div>
    </header>
  );
};
