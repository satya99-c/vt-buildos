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
      className={`fixed inset-0 z-[100] bg-[#050811] text-slate-100 flex flex-col justify-between overflow-hidden cursor-pointer select-none transition-all duration-700 ease-in-out ${
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
      <header className="relative z-10 w-full px-6 py-5 flex items-center justify-between border-b border-white/5 bg-[#090D16]/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#0E1424] border border-cyan-500/40 text-cyan-400">
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

      {/* Main Center Stage: Animated CAD Construction Simulation */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-6xl mx-auto w-full">
        {/* Animated Construction Graphic Showcase */}
        <div className="relative w-full max-w-4xl h-[340px] sm:h-[400px] flex items-center justify-center">
          {/* Architectural Laser Scan Line */}
          <div className="absolute inset-x-8 top-12 h-0.5 bg-cyan-400/80 shadow-[0_0_12px_#00E5FF] animate-laser-scan pointer-events-none z-20"></div>

          <svg
            viewBox="0 0 900 420"
            className="w-full h-full overflow-visible"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground Level Foundation Line */}
            <line x1="40" y1="380" x2="860" y2="380" stroke="#334155" strokeWidth="3" strokeDasharray="6 4" />
            <text x="50" y="405" fill="#64748B" fontSize="11" fontFamily="JetBrains Mono, monospace">
              GROUND DATUM EL ±0.000m (BEDROCK PILING DEPTH 22.5m)
            </text>

            {/* Sub-level Pilings */}
            {[100, 160, 220, 280, 340].map((x, idx) => (
              <g key={idx}>
                <line x1={x} y1="380" x2={x} y2="415" stroke="#1E293B" strokeWidth="4" />
                <line x1={x - 12} y1="415" x2={x + 12} y2="415" stroke="#1E293B" strokeWidth="3" />
              </g>
            ))}

            {/* High-Rise Building Skeletal Frame (Slabs & Columns) */}
            <g id="building-frame" className="text-cyan-400">
              {/* Vertical Concrete Columns */}
              <line x1="120" y1="120" x2="120" y2="380" stroke="#22D3EE" strokeWidth="2.5" strokeOpacity="0.8" />
              <line x1="200" y1="120" x2="200" y2="380" stroke="#22D3EE" strokeWidth="2.5" strokeOpacity="0.9" />
              <line x1="280" y1="120" x2="280" y2="380" stroke="#22D3EE" strokeWidth="2.5" strokeOpacity="0.9" />
              <line x1="360" y1="120" x2="360" y2="380" stroke="#22D3EE" strokeWidth="2.5" strokeOpacity="0.8" />

              {/* Central Core Concrete Elevator Shaft */}
              <rect x="220" y="90" width="40" height="290" fill="#0E1424" stroke="#00E5FF" strokeWidth="1.5" />
              <line x1="240" y1="90" x2="240" y2="380" stroke="#00E5FF" strokeWidth="1" strokeDasharray="3 3" />

              {/* 10 Floor Slabs with CAD Elevation Labels */}
              {[
                { y: 350, level: 'L01 SLAB' },
                { y: 320, level: 'L03 SLAB' },
                { y: 290, level: 'L05 SLAB' },
                { y: 260, level: 'L07 SLAB' },
                { y: 230, level: 'L09 SLAB' },
                { y: 200, level: 'L11 SLAB' },
                { y: 170, level: 'L13 SLAB' },
                { y: 140, level: 'L14 SLAB ACTIVE' },
              ].map((slab, i) => (
                <g key={i}>
                  <rect
                    x="110"
                    y={slab.y}
                    width="260"
                    height="8"
                    rx="3"
                    fill="#0F172A"
                    stroke="#22D3EE"
                    strokeWidth={i === 7 ? '2' : '1'}
                    strokeOpacity={i === 7 ? '1' : '0.7'}
                  />
                  {/* Rebar cross-ties */}
                  <line x1="110" y1={slab.y + 4} x2="370" y2={slab.y + 4} stroke="#00E5FF" strokeWidth="0.8" strokeDasharray="4 4" />
                </g>
              ))}

              {/* Floor Level Active Tag */}
              <g transform="translate(385, 134)">
                <rect width="130" height="24" rx="12" fill="#0E1424" stroke="#F59E0B" strokeWidth="1.2" />
                <circle cx="12" cy="12" r="3.5" fill="#F59E0B" className="animate-ping" />
                <circle cx="12" cy="12" r="3.5" fill="#F59E0B" />
                <text x="24" y="16" fill="#FBBF24" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
                  POURING SLAB 14
                </text>
              </g>

              {/* Safety Perimeter Scaffolding Grid */}
              <g stroke="#64748B" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.6">
                <line x1="95" y1="130" x2="95" y2="380" />
                <line x1="385" y1="130" x2="385" y2="380" />
                <line x1="95" y1="130" x2="385" y2="130" />
                <line x1="95" y1="210" x2="385" y2="210" />
                <line x1="95" y1="290" x2="385" y2="290" />
              </g>

              {/* Dimension Callout Lines */}
              <line x1="80" y1="120" x2="80" y2="380" stroke="#94A3B8" strokeWidth="1" />
              <line x1="75" y1="120" x2="85" y2="120" stroke="#94A3B8" strokeWidth="1" />
              <line x1="75" y1="380" x2="85" y2="380" stroke="#94A3B8" strokeWidth="1" />
              <text
                x="-260"
                y="72"
                transform="rotate(-90)"
                fill="#94A3B8"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
              >
                FACADE HEIGHT: 52.80m
              </text>
            </g>

            {/* Heavy Tower Crane (Animated Crane Rigging) */}
            <g id="tower-crane" transform="translate(480, 0)">
              {/* Crane Mast Lattice Tower */}
              <rect x="110" y="40" width="22" height="340" fill="#0E1424" stroke="#F59E0B" strokeWidth="1.5" />
              {/* Lattice cross bracings */}
              {[60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360].map((y, idx) => (
                <g key={idx}>
                  <line x1="110" y1={y} x2="132" y2={y + 30} stroke="#F59E0B" strokeWidth="1" strokeOpacity="0.8" />
                  <line x1="132" y1={y} x2="110" y2={y + 30} stroke="#F59E0B" strokeWidth="1" strokeOpacity="0.8" />
                </g>
              ))}

              {/* Tower Crane Top Beacon */}
              <circle cx="121" cy="20" r="4" fill="#EF4444" className="animate-beacon" />
              <line x1="121" y1="20" x2="121" y2="40" stroke="#F59E0B" strokeWidth="1.5" />

              {/* Operator Cabin */}
              <rect x="85" y="55" width="22" height="24" rx="4" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.2" />
              <rect x="87" y="58" width="12" height="12" rx="2" fill="#22D3EE" fillOpacity="0.7" />

              {/* Slewing Turntable */}
              <circle cx="121" cy="50" r="14" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.5" />

              {/* Counter-Jib (Left) with Concrete Counterweights */}
              <line x1="121" y1="46" x2="20" y2="46" stroke="#F59E0B" strokeWidth="3" />
              <line x1="121" y1="20" x2="20" y2="46" stroke="#94A3B8" strokeWidth="1" />
              <rect x="24" y="38" width="28" height="16" rx="2" fill="#334155" stroke="#F59E0B" strokeWidth="1.2" />
              <text x="27" y="50" fill="#F8FAFC" fontSize="7" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
                12.5T
              </text>

              {/* Main Working Jib (Right) extending over building */}
              <line x1="121" y1="46" x2="-260" y2="46" stroke="#F59E0B" strokeWidth="3" />
              <line x1="121" y1="20" x2="-240" y2="46" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="121" y1="20" x2="-140" y2="46" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />

              {/* Jib Lattice Webbing */}
              {[-240, -200, -160, -120, -80, -40, 0, 40, 80].map((x, idx) => (
                <line key={idx} x1={x} y1="46" x2={x + 20} y2="40" stroke="#F59E0B" strokeWidth="0.8" strokeOpacity="0.7" />
              ))}

              {/* Moving Trolley + Suspended Hoist Hook + Steel Girder */}
              <g className="animate-crane-trolley">
                {/* Trolley Box */}
                <rect x="-180" y="44" width="18" height="10" rx="2" fill="#22D3EE" stroke="#00E5FF" strokeWidth="1" />
                <circle cx="-176" cy="44" r="2.5" fill="#0F172A" />
                <circle cx="-166" cy="44" r="2.5" fill="#0F172A" />

                {/* Hoisting Cable (Vertical up & down) */}
                <g className="animate-hook-hoisting">
                  <line x1="-171" y1="54" x2="-171" y2="135" stroke="#E2E8F0" strokeWidth="1.2" />
                  <line x1="-173" y1="54" x2="-173" y2="135" stroke="#E2E8F0" strokeWidth="1.2" />

                  {/* Heavy Duty Hook Block */}
                  <rect x="-179" y="135" width="16" height="14" rx="3" fill="#F59E0B" stroke="#0F172A" strokeWidth="1" />
                  <path d="M -171 149 Q -171 160 -177 160 Q -183 160 -180 152" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Suspended Steel Girder I-Beam (Swaying gently) */}
                  <g transform="translate(-171, 164)" className="animate-beam-sway">
                    {/* Rigging Slings */}
                    <line x1="0" y1="-4" x2="-40" y2="14" stroke="#94A3B8" strokeWidth="1" />
                    <line x1="0" y1="-4" x2="40" y2="14" stroke="#94A3B8" strokeWidth="1" />

                    {/* Structural Steel I-Beam */}
                    <rect x="-55" y="14" width="110" height="12" rx="2" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" />
                    <line x1="-50" y1="20" x2="50" y2="20" stroke="#00E5FF" strokeWidth="1.5" />
                    <text x="-44" y="23" fill="#F0F9FF" fontSize="7" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
                      STEEL GIRDER · 4.8T
                    </text>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </div>

        {/* Construction Intelligence Mission Statement */}
        <div className="text-center max-w-2xl mt-2 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E1424] border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>VT BUILDOS AUTONOMOUS PLATFORM ENGINE</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Architecting The Future of Construction
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            From multi-million dollar structural BOQ estimation and procurement pipelines to real-time site engineering attendance, equipment logistics, and auditable finance ledgers.
          </p>
        </div>

        {/* Live Site Metrics Snapshot Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl mt-6">
          <div className="p-3.5 rounded-2xl bg-[#0E1424] border border-white/5 text-center">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Sites Operational</div>
            <div className="text-lg font-bold text-white font-mono-numbers mt-0.5">3 Active</div>
            <div className="text-[10px] text-cyan-400 font-mono">100% On Schedule</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0E1424] border border-white/5 text-center">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Daily Muster Roll</div>
            <div className="text-lg font-bold text-white font-mono-numbers mt-0.5">348 Workers</div>
            <div className="text-[10px] text-emerald-400 font-mono">Biometric Verified</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0E1424] border border-white/5 text-center">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Safety Compliance</div>
            <div className="text-lg font-bold text-white font-mono-numbers mt-0.5">348 Days</div>
            <div className="text-[10px] text-emerald-400 font-mono">Zero Incidents</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0E1424] border border-white/5 text-center">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Quality Audits</div>
            <div className="text-lg font-bold text-white font-mono-numbers mt-0.5">44 / 44 Pass</div>
            <div className="text-[10px] text-purple-300 font-mono">IS 456 Certified</div>
          </div>
        </div>
      </main>

      {/* Bottom Floating Interactive Callout: "CLICK ANYWHERE TO ENTER" */}
      <footer className="relative z-10 w-full px-6 py-6 border-t border-white/5 bg-[#090D16]/90 backdrop-blur-md flex flex-col items-center justify-center">
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
