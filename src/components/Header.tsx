import React from 'react';
import { Search, Database, Sparkles, Plus, CloudSun, HardHat } from 'lucide-react';
import { Organization, UserProfile } from '../types';
import { getSupabaseCredentials } from '../lib/supabase';

interface HeaderProps {
  currentOrg: Organization;
  user: UserProfile;
  onOpenQuickCreate: () => void;
  onOpenAiAssistant: () => void;
  onOpenSupabaseModal: () => void;
  onReplaySplash?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentOrg,
  user,
  onOpenQuickCreate,
  onOpenAiAssistant,
  onOpenSupabaseModal,
  onReplaySplash,
}) => {
  const { url, key } = getSupabaseCredentials();
  const isConnected = Boolean(url && key);

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#090D16] px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search Bar - Smooth Rounded-2xl */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search projects, site activities, materials, workers... (Ctrl+K)"
            className="w-full bg-[#111726] border border-slate-700/60 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
          />
          <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-[#1A2338] text-slate-400 border border-slate-700 px-2 py-0.5 rounded-lg">⌘K</kbd>
        </div>
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
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#111726] border border-slate-800 text-xs text-slate-300">
          <CloudSun className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-white">29°C</span>
          <span className="text-slate-400">Kakinada</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1"></span>
          <span className="text-[11px] text-emerald-400 font-medium">Sites Active</span>
        </div>

        {/* Supabase Connection Button / Badge - Solid Rounded-2xl */}
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

        {/* AI Copilot Button - Solid Surface, No Gradient */}
        <button
          onClick={onOpenAiAssistant}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#131A2B] border border-cyan-400/30 text-cyan-300 text-xs font-semibold hover:border-cyan-400 hover:bg-[#192238] transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>BuildOS AI</span>
        </button>

        {/* Quick Action Button - Solid Cyan, High Contrast, Rounded-2xl */}
        <button
          onClick={onOpenQuickCreate}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Quick Create</span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full border border-cyan-400/40 object-cover"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#090D16] absolute -bottom-0.5 -right-0.5"></span>
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-200">{user.name}</div>
            <div className="text-[10px] text-cyan-400 font-medium">{user.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
