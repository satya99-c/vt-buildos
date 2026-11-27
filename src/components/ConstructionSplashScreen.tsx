import React, { useState, useEffect, useCallback } from 'react';
import { HardHat, Compass, Activity, ArrowRight, Radio, Layers } from 'lucide-react';
import { ConstructionTimeLapse3D } from './ConstructionTimeLapse3D';

interface ConstructionSplashScreenProps {
  onEnter: () => void;
}

export const ConstructionSplashScreen: React.FC<ConstructionSplashScreenProps> = ({ onEnter }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [metricCure, setMetricCure] = useState(98.4);
  const [timeString, setTimeString] = useState('');
  const [stageInfo, setStageInfo] = useState({
    phase: 'BLUEPRINT CAD TRACE',
    floor: 0,
    progressPct: 0,
  });

  // Keep live digital clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Subtle telemetry pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setMetricCure((prev) => {
        const delta = (Math.random() - 0.5) * 0.2;
        return Number(Math.min(99.9, Math.max(97.0, prev + delta)).toFixed(1));
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleStageChange = useCallback(
    (info: { phase: string; floor: number; progressPct: number }) => {
      setStageInfo(info);
    },
    []
  );

  const handleClickToEnter = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 550);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        handleClickToEnter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExiting]);

  return (
    <div
      onClick={handleClickToEnter}
      className={`splash-cinematic fixed inset-0 z-[100] bg-[#000000] text-slate-100 flex flex-col justify-between overflow-hidden cursor-pointer select-none transition-all duration-700 ease-in-out ${
        isExiting ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Full-Viewport 3D 5-Story Building Construction Time-Lapse */}
      <div className="absolute inset-0 z-0">
        <ConstructionTimeLapse3D onStageChange={handleStageChange} />
        {/* Subtle top & bottom vignette so HUD text remains razor-sharp */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.08) 22%, rgba(0,0,0,0.08) 65%, rgba(0,0,0,0.88) 100%)',
          }}
        />
      </div>

      {/* Top Engineering Header Bar */}
      <header className="relative z-10 w-full px-6 py-3.5 flex items-center justify-between border-b border-white/10 bg-[#050811]/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-[#0A0F1C] border border-cyan-500/40 text-cyan-400">
            <HardHat className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-wider text-white">VT BUILDOS</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 font-bold">
                5-Story Twin Live
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Autonomous Construction Management & Enterprise ERP
            </div>
          </div>
        </div>

        {/* Live Site Telemetry Indicators */}
        <div className="hidden md:flex items-center gap-6 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-slate-400">PHASE:</span>
            <span className="text-emerald-400 font-bold">{stageInfo.phase}</span>
          </div>

          <div className="h-4 w-px bg-white/10"></div>

          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">STRUCTURE:</span>
            <span className="text-cyan-300 font-semibold">G+4 (5 STORIES)</span>
          </div>

          <div className="h-4 w-px bg-white/10"></div>

          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">COORDINATES:</span>
            <span className="text-cyan-300 font-semibold">17.3850° N, 78.4867° E</span>
          </div>

          <div className="h-4 w-px bg-white/10"></div>

          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">CURE:</span>
            <span className="text-amber-400 font-bold">{metricCure}%</span>
          </div>

          <div className="h-4 w-px bg-white/10"></div>

          <div className="text-slate-300 font-mono font-bold bg-[#0E1424]/80 px-3 py-1 rounded-full border border-white/10">
            {timeString || 'LIVE'}
          </div>
        </div>
      </header>

      {/* Middle Spacer with Subtle Live Floor Progress Pill */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-end px-4 pb-3 max-w-6xl mx-auto w-full pointer-events-none">
        {/* Live 5-Story Assembly Progress Bar */}
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#090D16]/80 backdrop-blur-md border border-cyan-400/30 mb-3 shadow-lg">
          <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
          <span className="text-[11px] font-mono text-cyan-300 font-semibold tracking-wide">
            {stageInfo.phase}
          </span>
          <div className="w-20 h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${stageInfo.progressPct}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-slate-300 font-bold">
            {stageInfo.progressPct}%
          </span>
        </div>

        {/* Construction Intelligence Mission Statement */}
        <div className="text-center max-w-2xl space-y-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
            Architecting The Future of Construction
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed drop-shadow">
            From structural blueprint CAD and 5-story RCC execution to procurement pipelines, site engineering attendance, and auditable finance ledgers.
          </p>
        </div>

        {/* Live Site Metrics Snapshot Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl mt-4">
          <div className="p-2.5 rounded-2xl bg-[#090D16]/80 backdrop-blur-md border border-white/10 text-center">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Sites Operational</div>
            <div className="text-base font-bold text-white font-mono-numbers mt-0.5">3 Active</div>
            <div className="text-[10px] text-cyan-400 font-mono">100% On Schedule</div>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#090D16]/80 backdrop-blur-md border border-white/10 text-center">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Daily Muster Roll</div>
            <div className="text-base font-bold text-white font-mono-numbers mt-0.5">348 Workers</div>
            <div className="text-[10px] text-emerald-400 font-mono">Biometric Verified</div>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#090D16]/80 backdrop-blur-md border border-white/10 text-center">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Safety Compliance</div>
            <div className="text-base font-bold text-white font-mono-numbers mt-0.5">348 Days</div>
            <div className="text-[10px] text-emerald-400 font-mono">Zero Incidents</div>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#090D16]/80 backdrop-blur-md border border-white/10 text-center">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Quality Audits</div>
            <div className="text-base font-bold text-white font-mono-numbers mt-0.5">44 / 44 Pass</div>
            <div className="text-[10px] text-purple-300 font-mono">IS 456 Certified</div>
          </div>
        </div>
      </main>

      {/* Bottom Floating Interactive Callout: "CLICK ANYWHERE TO ENTER" */}
      <footer className="relative z-10 w-full px-6 py-3.5 border-t border-white/10 bg-[#050811]/80 backdrop-blur-md flex flex-col items-center justify-center">
        <div className="relative group">
          <div className="absolute -inset-1 rounded-full bg-cyan-400/20 blur-sm group-hover:bg-cyan-400/40 transition"></div>

          <div className="relative px-7 py-3 rounded-full bg-[#0A0F1C] border border-cyan-400/50 hover:border-cyan-300 text-white font-bold flex items-center gap-3 shadow-xl transition-transform transform group-hover:scale-[1.02]">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-xs sm:text-sm tracking-widest font-mono text-cyan-300 uppercase">
              Click anywhere on the screen to enter VT BuildOS
            </span>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div className="mt-1.5 text-[11px] text-slate-400 font-mono text-center">
          Tap anywhere or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10 text-[10px]">ENTER</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10 text-[10px]">SPACE</kbd> to access the main management dashboard
        </div>
      </footer>
    </div>
  );
};
