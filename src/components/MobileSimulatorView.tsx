import React, { useState } from 'react';
import {
  Smartphone,
  Wifi,
  WifiOff,
  Battery,
  Signal,
  Plus,
  Users,
  HardHat,
} from 'lucide-react';

export const MobileSimulatorView: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<'tasks' | 'report' | 'attendance'>('attendance');
  const [isOnline, setIsOnline] = useState(true);

  // Clean empty state for workers in mobile
  const [workers, setWorkers] = useState<any[]>([]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-[#141C2E] border border-cyan-400/40 text-cyan-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">Site Engineer Mobile App (Interactive Simulator)</h1>
              <p className="text-xs text-slate-400">
                Faithful implementation of Reference 4 with offline-first synchronization for low-connectivity sites
              </p>
            </div>
          </div>
        </div>

        {/* Offline / Online Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-bold transition cursor-pointer ${
              isOnline
                ? 'bg-[#102422] text-emerald-300 border-emerald-500/40'
                : 'bg-[#2E1418] text-rose-300 border-rose-500/40'
            }`}
          >
            {isOnline ? <Wifi className="w-4 h-4 text-emerald-400" /> : <WifiOff className="w-4 h-4 text-rose-400" />}
            <span>{isOnline ? 'Online (Connected)' : 'Offline Mode (No Signal)'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Mobile Screen Switcher & Specs */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0E1424] p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Select Active Mobile Screen</h3>
            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <button
                onClick={() => setActiveScreen('tasks')}
                className={`p-3 rounded-2xl border font-bold text-left transition cursor-pointer ${
                  activeScreen === 'tasks'
                    ? 'bg-[#141C2E] border-cyan-400 text-cyan-300'
                    : 'bg-[#111726] border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-[10px] text-slate-500">Screen 1</div>
                <div>Site Plan & Tasks</div>
              </button>

              <button
                onClick={() => setActiveScreen('report')}
                className={`p-3 rounded-2xl border font-bold text-left transition cursor-pointer ${
                  activeScreen === 'report'
                    ? 'bg-[#141C2E] border-cyan-400 text-cyan-300'
                    : 'bg-[#111726] border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-[10px] text-slate-500">Screen 2</div>
                <div>Progress Report</div>
              </button>

              <button
                onClick={() => setActiveScreen('attendance')}
                className={`p-3 rounded-2xl border font-bold text-left transition cursor-pointer ${
                  activeScreen === 'attendance'
                    ? 'bg-[#141C2E] border-cyan-400 text-cyan-300'
                    : 'bg-[#111726] border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-[10px] text-slate-500">Screen 3</div>
                <div>Labour Attendance</div>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#090D16] border border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="font-bold text-white flex items-center gap-2">
                <HardHat className="w-4 h-4 text-cyan-400" />
                <span>Offline-First Architecture (Section 8)</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Site engineers store attendance logs, progress notes, and photo binaries in local SQLite / IndexedDB when working offline.
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] font-mono border-t border-slate-800">
                <span className="text-slate-400">Sync Status:</span>
                <span className="text-emerald-400 font-bold">Synchronized</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Phone Frame - Rounded-3xl */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-[360px] h-[680px] bg-black rounded-[48px] p-3 shadow-2xl border-4 border-slate-700 relative flex flex-col justify-between overflow-hidden">
            {/* Dynamic Island */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-between px-3">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></span>
              <span className="w-2 h-2 rounded-full bg-cyan-400/40"></span>
            </div>

            {/* Mobile Screen Inside */}
            <div className="w-full h-full bg-[#090D16] rounded-[38px] overflow-hidden flex flex-col justify-between relative border border-slate-800 text-white select-none">
              {/* Phone Status Bar */}
              <div className="h-10 px-6 pt-3 flex items-center justify-between text-[11px] font-semibold text-slate-300 shrink-0">
                <span>06:37</span>
                <div className="flex items-center gap-1.5">
                  <Signal className="w-3.5 h-3.5" />
                  {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-rose-400" />}
                  <Battery className="w-4 h-4" />
                </div>
              </div>

              {/* Dynamic Screen Content */}
              <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
                {activeScreen === 'tasks' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">Site Plan & Tasks</span>
                    </div>
                    <div className="py-12 text-center text-xs text-slate-500">
                      No site tasks yet. Click below to add.
                    </div>
                    <button className="w-full py-2.5 rounded-2xl bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm">
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>+ Add Task</span>
                    </button>
                  </div>
                )}

                {activeScreen === 'report' && (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-[#141C2E] border border-cyan-400/30">
                      <div className="text-[10px] text-cyan-300 font-bold uppercase">Daily Report</div>
                      <div className="text-sm font-extrabold text-white">Site Operations</div>
                      <div className="text-[10px] text-slate-400 font-mono">Ready to record</div>
                    </div>
                    <div className="py-8 text-center text-xs text-slate-500">
                      Awaiting daily progress entry.
                    </div>
                  </div>
                )}

                {activeScreen === 'attendance' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                      <span className="text-slate-400">Cancel</span>
                      <span className="font-bold text-white text-sm">Labour Attendance</span>
                      <span className="text-cyan-400 font-bold">Save</span>
                    </div>

                    <div className="py-12 text-center space-y-2 text-xs text-slate-500">
                      <Users className="w-8 h-8 text-slate-600 mx-auto" />
                      <div>No muster workers loaded.</div>
                      <div className="text-[10px]">Add workers in Workforce module to mark attendance.</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Phone Bar */}
              <div className="h-12 bg-[#0C111E] border-t border-slate-800 px-6 flex items-center justify-between text-slate-400 text-[10px]">
                <button onClick={() => setActiveScreen('tasks')} className={activeScreen === 'tasks' ? 'text-cyan-400 font-bold' : ''}>
                  Site Plan
                </button>
                <button onClick={() => setActiveScreen('report')} className={activeScreen === 'report' ? 'text-cyan-400 font-bold' : ''}>
                  Reports
                </button>
                <button onClick={() => setActiveScreen('attendance')} className={activeScreen === 'attendance' ? 'text-cyan-400 font-bold' : ''}>
                  Attendance
                </button>
              </div>

              {/* Home indicator line */}
              <div className="w-32 h-1 bg-slate-600 rounded-full mx-auto my-1"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
