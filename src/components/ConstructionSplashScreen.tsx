import React, { useState, useEffect } from 'react';
import { HardHat, Compass, Activity, ArrowRight, ShieldCheck, Layers, Radio } from 'lucide-react';

interface ConstructionSplashScreenProps {
  onEnter: () => void;
}

export const ConstructionSplashScreen: React.FC<ConstructionSplashScreenProps> = ({ onEnter }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(14);
  const [activeFloor, setActiveFloor] = useState(14);
  const [metricCure, setMetricCure] = useState(98.4);
  const [timeString, setTimeString] = useState('');

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
      className={`splash-cinematic fixed inset-0 z-[100] bg-[#050811] text-slate-100 flex flex-col justify-between overflow-hidden cursor-pointer select-none transition-all duration-700 ease-in-out ${
        isExiting ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background CAD Grid Canvas */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="cadGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#22D3EE" strokeWidth="0.5" strokeOpacity="0.4" />
            <circle cx="0" cy="0" r="1.5" fill="#22D3EE" fillOpacity="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cadGrid)" />
      </svg>

      {/* Top Engineering Header Bar */}
      <header className="relative z-10 w-full px-6 py-3.5 flex items-center justify-between border-b border-white/5 bg-[#090D16]/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-[#0E1424] border border-cyan-500/40 text-cyan-400">
            <HardHat className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-wider text-white">VT BUILDOS</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 font-bold">
                Site Operations Live
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
            <span className="text-slate-400">TOWER CRANE 01:</span>
            <span className="text-emerald-400 font-bold">HOISTING ACTIVE</span>
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
            <span className="text-slate-400">CONCRETE CURE:</span>
            <span className="text-amber-400 font-bold">{metricCure}%</span>
          </div>

          <div className="h-4 w-px bg-white/10"></div>

          <div className="text-slate-300 font-mono font-bold bg-[#0E1424] px-3 py-1 rounded-full border border-white/5">
            {timeString || 'LIVE'}
          </div>
        </div>
      </header>

      {/* Main Center Stage: Photorealistic Construction Site + Live HUD Telemetry */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-3 max-w-6xl mx-auto w-full min-h-0">
        {/* Realistic Architectural Construction Site Showcase */}
        <div className="relative w-full max-w-4xl h-[240px] sm:h-[300px] lg:h-[330px] flex items-center justify-center rounded-3xl overflow-hidden">
          {/* Photorealistic Night Construction Site Render */}
          <img
            src="/site-hero.jpg"
            alt="VT BuildOS High-Rise Construction Site Live Operations"
            className="w-full h-full object-cover object-center select-none pointer-events-none"
            style={{
              maskImage: 'radial-gradient(ellipse 88% 85% at 50% 50%, black 60%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 88% 85% at 50% 50%, black 60%, transparent 100%)',
            }}
          />

          {/* Subtle Atmospheric Edge Blending into #050811 */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 52%, rgba(5, 8, 17, 0.72) 82%, #050811 100%)',
            }}
          />

          {/* Architectural Laser Scan Line */}
          <div className="absolute inset-x-12 top-6 h-px bg-cyan-400/60 shadow-[0_0_10px_#00E5FF] animate-laser-scan pointer-events-none z-20"></div>

          {/* Live HUD Pin 1: Pouring Slab 14 (Positioned cleanly on upper concrete deck) */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#090D16]/85 backdrop-blur-md border border-amber-400/50 shadow-lg absolute top-[24%] left-[12%] md:left-[16%] z-20">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span className="text-[10px] font-mono font-bold text-amber-300 tracking-wide">
              POURING SLAB 14 · EL +52.80m
            </span>
          </div>

          {/* Live HUD Pin 2: Crane Mast Aviation Beacon Pulse */}
          <div className="hidden sm:flex items-center justify-center absolute top-[11%] right-[39.5%] z-20 pointer-events-none">
            <span className="w-3 h-3 rounded-full bg-rose-500/60 animate-ping"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 absolute"></span>
          </div>

          {/* Live HUD Pin 3: Steel Girder Hoist Load Telemetry */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#090D16]/85 backdrop-blur-md border border-cyan-400/50 shadow-lg absolute bottom-[22%] right-[12%] md:right-[14%] z-20">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span className="text-[10px] font-mono font-bold text-cyan-300 tracking-wide">
              STEEL GIRDER · 4.8T HOIST
            </span>
          </div>

          {/* Bottom-Left Ground Datum Tag */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#090D16]/80 backdrop-blur-sm border border-white/10 absolute bottom-3 left-6 z-20">
            <span className="text-[9px] font-mono text-slate-400">
              DATUM EL ±0.000m · PILING 22.5m
            </span>
          </div>
        </div>

        {/* Construction Intelligence Mission Statement */}
        <div className="text-center max-w-2xl mt-2 space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E1424] border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>VT BUILDOS AUTONOMOUS PLATFORM ENGINE</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Architecting The Future of Construction
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            From multi-million dollar structural BOQ estimation and procurement pipelines to real-time site engineering attendance, equipment logistics, and auditable finance ledgers.
          </p>
        </div>

        {/* Live Site Metrics Snapshot Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl mt-4">
          <div className="p-3 rounded-2xl bg-[#0E1424] border border-white/5 text-center">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Sites Operational</div>
            <div className="text-base sm:text-lg font-bold text-white font-mono-numbers mt-0.5">3 Active</div>
            <div className="text-[10px] text-cyan-400 font-mono">100% On Schedule</div>
          </div>

          <div className="p-3 rounded-2xl bg-[#0E1424] border border-white/5 text-center">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Daily Muster Roll</div>
            <div className="text-base sm:text-lg font-bold text-white font-mono-numbers mt-0.5">348 Workers</div>
            <div className="text-[10px] text-emerald-400 font-mono">Biometric Verified</div>
          </div>

          <div className="p-3 rounded-2xl bg-[#0E1424] border border-white/5 text-center">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Safety Compliance</div>
            <div className="text-base sm:text-lg font-bold text-white font-mono-numbers mt-0.5">348 Days</div>
            <div className="text-[10px] text-emerald-400 font-mono">Zero Incidents</div>
          </div>

          <div className="p-3 rounded-2xl bg-[#0E1424] border border-white/5 text-center">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Quality Audits</div>
            <div className="text-base sm:text-lg font-bold text-white font-mono-numbers mt-0.5">44 / 44 Pass</div>
            <div className="text-[10px] text-purple-300 font-mono">IS 456 Certified</div>
          </div>
        </div>
      </main>

      {/* Bottom Floating Interactive Callout: "CLICK ANYWHERE TO ENTER" */}
      <footer className="relative z-10 w-full px-6 py-4 border-t border-white/5 bg-[#090D16]/90 backdrop-blur-md flex flex-col items-center justify-center">
        <div className="relative group">
          {/* Subtle Outer Ping Ring */}
          <div className="absolute -inset-1 rounded-full bg-cyan-400/20 blur-sm group-hover:bg-cyan-400/40 transition"></div>

          {/* Core Interactive Pill Trigger */}
          <div className="relative px-8 py-3.5 rounded-full bg-[#0E1424] border border-cyan-400/50 hover:border-cyan-300 text-white font-bold flex items-center gap-3 shadow-xl transition-transform transform group-hover:scale-[1.02]">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-xs sm:text-sm tracking-widest font-mono text-cyan-300 uppercase">
              Click anywhere on the screen to enter VT BuildOS
            </span>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div className="mt-2 text-[11px] text-slate-500 font-mono text-center">
          Tap anywhere or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10 text-[10px]">ENTER</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10 text-[10px]">SPACE</kbd> to access the main management dashboard
        </div>
      </footer>
    </div>
  );
};
