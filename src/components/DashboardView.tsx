import React, { useState } from 'react';
import {
  Sparkles,
  ChevronRight,
  FolderPlus,
  ArrowUpRight,
  ArrowDownRight,
  HardHat,
  Building,
  TrendingUp,
  DollarSign,
  Layers,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Zap,
  Plus,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { Project } from '../types';

interface DashboardViewProps {
  projects: Project[];
  onNavigateToProjects: () => void;
  onNavigateToWorkforce: () => void;
  onNavigateToInventory: () => void;
  onNavigateToBoq: () => void;
  onNavigateToFinance?: () => void;
  onNavigateToScheduling?: () => void;
  onLoadDemoData?: () => void;
  onResetData?: () => void;
  onAddProject?: (project: Project) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  onNavigateToProjects,
  onNavigateToWorkforce,
  onNavigateToInventory,
  onNavigateToBoq,
  onNavigateToFinance,
  onNavigateToScheduling,
  onLoadDemoData,
  onResetData,
  onAddProject,
}) => {
  // Interactive state
  const [timeframe, setTimeframe] = useState<'today' | '7d' | 'month' | 'fy' | 'all'>('all');
  const [activeChartMetric, setActiveChartMetric] = useState<'progress' | 'spend' | 'manhours'>('progress');
  const [hoveredMilestone, setHoveredMilestone] = useState<number | null>(null);
  const [expandedWbsLevel, setExpandedWbsLevel] = useState<number | null>(null);
  const [selectedCostCategory, setSelectedCostCategory] = useState<string | null>(null);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);

  // Quick Add Project form fields
  const [newProjName, setNewProjName] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newContractVal, setNewContractVal] = useState(0);
  const [newBudgetVal, setNewBudgetVal] = useState(0);
  const [newFloors, setNewFloors] = useState(0);

  // Dynamic calculations based on projects
  const totalValue = projects.reduce((acc, p) => acc + p.contractAmount, 0);
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);
  const avgProgress =
    projects.length > 0
      ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)
      : 0;
  const avgCpi =
    projects.length > 0
      ? (projects.reduce((acc, p) => acc + p.cpi, 0) / projects.length).toFixed(2)
      : '1.00';
  const costVariance = totalBudget - totalSpent;

  // Timeframe multiplier for dynamic simulation
  const timeframeMultiplier =
    timeframe === 'today' ? 0.05 : timeframe === '7d' ? 0.2 : timeframe === 'month' ? 0.45 : 1.0;

  const displaySpent = totalSpent * timeframeMultiplier;
  const displayVariance = costVariance * timeframeMultiplier;

  // Milestone data for S-Curve
  const sCurveMilestones = [
    { month: 'M1', planned: 8, actual: 9, name: 'Site Clearing & Pile Foundations', cpi: 1.05, date: 'May 2025' },
    { month: 'M3', planned: 22, actual: 24, name: 'Basement R.C.C. & Retaining Walls', cpi: 1.02, date: 'Jul 2025' },
    { month: 'M6', planned: 46, actual: 48, name: 'Superstructure Slabs (L1 to L7)', cpi: 1.04, date: 'Oct 2025' },
    { month: 'M9', planned: 68, actual: 66, name: 'Superstructure Slabs (L8 to L14) + Masonry', cpi: 1.01, date: 'Jan 2026' },
    { month: 'M12 (Now)', planned: 84, actual: 82, name: 'MEP Conduiting, Plastering & Joinery', cpi: 1.04, date: 'Nov 2026' },
    { month: 'M15', planned: 95, actual: null, name: 'High-End Architectural Finishes', cpi: 1.0, date: 'Feb 2027' },
    { month: 'M18', planned: 100, actual: null, name: 'Testing, Commissioning & Handover', cpi: 1.0, date: 'May 2027' },
  ];

  // WBS breakdown tiers
  const wbsTiers = [
    {
      level: 1,
      title: 'Substructure & Foundation',
      budgetCr: (totalBudget * 0.15) / 10000000 || 4.65,
      spentCr: (totalSpent * 0.16) / 10000000 || 4.45,
      progress: 98,
      status: 'Near Completion',
      subtasks: ['Soil testing & excavation (100%)', 'PCC & Footing casting (100%)', 'Plinth beam waterproofing (95%)'],
    },
    {
      level: 2,
      title: 'RCC Superstructure & Columns',
      budgetCr: (totalBudget * 0.45) / 10000000 || 13.95,
      spentCr: (totalSpent * 0.46) / 10000000 || 12.8,
      progress: 74,
      status: 'Active WIP',
      subtasks: ['Columns L1-L10 (100%)', 'Slab casting up to 12th floor (78%)', 'Staircase & lift shafts (70%)'],
    },
    {
      level: 3,
      title: 'AAC Blockwork & Plastering',
      budgetCr: (totalBudget * 0.18) / 10000000 || 5.58,
      spentCr: (totalSpent * 0.16) / 10000000 || 3.1,
      progress: 52,
      status: 'Active WIP',
      subtasks: ['Internal partition walls (65%)', 'External sand-face plaster (45%)', 'Door frame fixing (40%)'],
    },
    {
      level: 4,
      title: 'MEP & Firefighting Systems',
      budgetCr: (totalBudget * 0.14) / 10000000 || 4.34,
      spentCr: (totalSpent * 0.13) / 10000000 || 1.95,
      progress: 38,
      status: 'Active WIP',
      subtasks: ['Concealed electrical conduit (55%)', 'Plumbing down-take stacks (42%)', 'Fire sprinkler piping (25%)'],
    },
    {
      level: 5,
      title: 'Finishes & Project Handover',
      budgetCr: (totalBudget * 0.08) / 10000000 || 2.48,
      spentCr: (totalSpent * 0.05) / 10000000 || 0.65,
      progress: 14,
      status: 'Scheduled',
      subtasks: ['Vitrified tile flooring (20%)', 'Exterior weather-proof paint (10%)', 'Fixture fittings & sanitization (5%)'],
    },
  ];

  // CapEx Cost Categories
  const costCategories = [
    { id: 'steel-cement', label: 'TMT Steel & Cement', pct: 40, color: 'bg-cyan-500', amountLakhs: (displaySpent * 0.4) / 100000 || 1240 },
    { id: 'labour', label: 'Skilled & Unskilled Labour', pct: 28, color: 'bg-amber-500', amountLakhs: (displaySpent * 0.28) / 100000 || 868 },
    { id: 'machinery', label: 'Plant, Machinery & RMC', pct: 16, color: 'bg-emerald-500', amountLakhs: (displaySpent * 0.16) / 100000 || 496 },
    { id: 'mep', label: 'MEP & Subcontracts', pct: 11, color: 'bg-indigo-500', amountLakhs: (displaySpent * 0.11) / 100000 || 341 },
    { id: 'qa', label: 'Site Safety, HSE & Testing', pct: 5, color: 'bg-rose-500', amountLakhs: (displaySpent * 0.05) / 100000 || 155 },
  ];

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) {
      alert('Please enter a project name');
      return;
    }
    const createdProject: Project = {
      id: 'proj-' + Date.now(),
      code: 'VT-PRJ-' + (projects.length + 101),
      name: newProjName,
      client: newClientName || 'VT Client',
      location: newLocation || 'Hyderabad',
      siteAddress: newLocation ? `${newLocation}, Hyderabad` : 'Site Location, Hyderabad',
      plotDimensions: '100 x 60 ft',
      buildingType: 'Residential & Commercial',
      floors: Number(newFloors) || 5,
      contractAmount: Number(newContractVal) || 15000000,
      budget: Number(newBudgetVal) || 13500000,
      spent: 0,
      progress: 5,
      status: 'Construction',
      startDate: new Date().toISOString().split('T')[0],
      completionDate: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      projectManager: 'Er. VT Lead Engineer',
      teamSize: 18,
      cpi: 1.0,
      spi: 1.0,
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18015f6?auto=format&fit=crop&w=800&q=80',
    };

    if (onAddProject) {
      onAddProject(createdProject);
    }
    setShowQuickAddModal(false);
    setNewProjName('');
    setNewClientName('');
    setNewLocation('');
    setNewContractVal(0);
    setNewBudgetVal(0);
    setNewFloors(0);
  };

  return (
    <div className="space-y-6">
      {/* Interactive Controls & Live Simulation Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#090D16] border border-cyan-500/20 shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-bold text-white">Live Interactive Workspace</span>
          <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/40">
            {projects.length > 0 ? `${projects.length} Active Sites Connected` : 'Clean Operational Slate'}
          </span>
        </div>

        {/* Timeframe & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe selector */}
          <div className="flex items-center bg-[#12192B] rounded-xl p-1 border border-slate-800 text-xs font-medium">
            {(['today', '7d', 'month', 'fy', 'all'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-2.5 py-1 rounded-lg transition capitalize cursor-pointer ${
                  timeframe === t
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'today' ? 'Today' : t === '7d' ? '7 Days' : t === 'month' ? 'This Month' : t === 'fy' ? 'FY26-27' : 'All Time'}
              </button>
            ))}
          </div>

          {/* Interactive Demo Loader / Reset Buttons */}
          {projects.length === 0 ? (
            <button
              onClick={onLoadDemoData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 text-xs font-extrabold shadow-lg transition cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>⚡ Load Interactive Demo Data</span>
            </button>
          ) : (
            <button
              onClick={onResetData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141C2E] hover:bg-[#1a253e] text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition cursor-pointer"
              title="Clear sample data back to 0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Clean Slate</span>
            </button>
          )}

          <button
            onClick={() => setShowQuickAddModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+ Quick Project</span>
          </button>
        </div>
      </div>

      {/* Top Welcome Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-3xl bg-[#0E1424] p-6 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#141C2E] border border-cyan-400/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                VT BuildOS • Operations Platform
              </span>
              <span className="text-xs text-slate-400 font-medium">Executive Multi-Site Cockpit</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Welcome, <span className="text-cyan-400">VT Developers</span>!
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
              {projects.length > 0
                ? 'Portfolio monitoring active across all site wings. Dynamic earned value tracking (CPI/SPI), material consumption, and labour wages updating in real-time.'
                : 'Clean operational state active. Click "⚡ Load Interactive Demo Data" above to simulate a live multi-story portfolio, or click "+ Quick Project" to add your actual site.'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/70">
            <div
              onClick={onNavigateToProjects}
              className="bg-[#12192B] hover:bg-[#162035] p-3.5 rounded-2xl border border-slate-800 transition cursor-pointer group"
            >
              <div className="text-[11px] text-slate-400 font-medium group-hover:text-cyan-300">Ongoing Activities</div>
              <div className="text-lg font-bold text-white font-mono-numbers">
                {projects.length > 0 ? `${projects.length * 4} Tasks` : '0 Tasks'}
              </div>
              <div className="text-[10px] text-slate-500">
                {projects.length > 0 ? 'WBS Level 1-4 active' : 'Awaiting site logs'}
              </div>
            </div>

            <div
              onClick={onNavigateToWorkforce}
              className="bg-[#12192B] hover:bg-[#162035] p-3.5 rounded-2xl border border-slate-800 transition cursor-pointer group"
            >
              <div className="text-[11px] text-slate-400 font-medium group-hover:text-cyan-300">Labour Attendance</div>
              <div className="text-lg font-bold text-white font-mono-numbers">
                {projects.length > 0 ? '106 Active' : '0 Active'}
              </div>
              <div className="text-[10px] text-emerald-400">
                {projects.length > 0 ? '94.2% Attendance' : 'Muster roll ready'}
              </div>
            </div>

            <div
              onClick={onNavigateToInventory}
              className="bg-[#12192B] hover:bg-[#162035] p-3.5 rounded-2xl border border-slate-800 transition cursor-pointer group"
            >
              <div className="text-[11px] text-slate-400 font-medium group-hover:text-cyan-300">Stock Requisitions</div>
              <div className="text-lg font-bold text-white font-mono-numbers">
                {projects.length > 0 ? '3 In Transit' : '0 Items'}
              </div>
              <div className="text-[10px] text-amber-400">
                {projects.length > 0 ? 'Cement & Rebar orders' : 'Clean PO queue'}
              </div>
            </div>

            <div className="bg-[#12192B] p-3.5 rounded-2xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Safety Compliance</div>
              <div className="text-lg font-bold text-cyan-400 font-mono-numbers">100%</div>
              <div className="text-[10px] text-emerald-400 font-medium">HSE Sign-offs Clean</div>
            </div>
          </div>
        </div>

        {/* AI Site Copilot Card */}
        <div className="rounded-3xl bg-[#111726] p-6 border border-cyan-400/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-2xl bg-[#172138] border border-cyan-400/40 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                </div>
                <span className="text-xs font-bold text-cyan-300 tracking-wide uppercase">AI Site Assistant</span>
              </div>
              <span className="text-[10px] bg-[#172138] text-cyan-300 border border-cyan-400/30 px-2.5 py-0.5 rounded-full font-mono">
                ONLINE
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <div className="text-2xl font-extrabold text-white font-mono-numbers">
                {projects.length > 0 ? 'Portfolio Healthy' : 'Ready'}
              </div>
              <div className="text-xs text-slate-400 font-semibold">
                {projects.length > 0 ? 'CPI 1.02 • Zero Delays' : 'Awaiting Input'}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#090D16] border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>
                {projects.length > 0
                  ? 'Concrete pouring for VT Grandeur 14th floor slab scheduled for tomorrow 06:30 AM. Weather conditions favorable (clear skies, 28°C).'
                  : 'Start by loading sample data or entering your first construction site. AI voice reporting, BOQ estimation, and labour wages are fully operational.'}
              </p>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <button
              onClick={onNavigateToBoq}
              className="w-full py-2.5 px-4 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <span>+ Calculate BOQ & Quotation</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>

      {/* 6 Clickable Interactive KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div
          onClick={onNavigateToProjects}
          className="bg-[#0E1424] hover:bg-[#131c33] p-4 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-cyan-300">
            <span>Portfolio Value</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
          </div>
          <div className="text-xl font-bold text-white mt-1.5 font-mono-numbers">
            ₹{(totalValue / 10000000).toFixed(2)} Cr
          </div>
          <div className="text-[11px] text-cyan-400 mt-1">
            {projects.length > 0 ? `${projects.length} sites committed` : 'Click to add project'}
          </div>
        </div>

        <div
          onClick={onNavigateToFinance}
          className="bg-[#0E1424] hover:bg-[#131c33] p-4 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-cyan-300">
            <span>Budget Spent</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
          </div>
          <div className="text-xl font-bold text-slate-200 mt-1.5 font-mono-numbers">
            ₹{(displaySpent / 10000000).toFixed(2)} Cr
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {totalBudget > 0 ? `${Math.round((displaySpent / totalBudget) * 100)}% utilized` : '0% utilized'}
          </div>
        </div>

        <div className="bg-[#0E1424] p-4 rounded-2xl border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400">Cost Variance</div>
          <div className="text-xl font-bold text-emerald-400 mt-1.5 font-mono-numbers">
            +₹{(displayVariance / 10000000).toFixed(2)} Cr
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">Under budget buffer</div>
        </div>

        <div
          onClick={onNavigateToScheduling}
          className="bg-[#0E1424] hover:bg-[#131c33] p-4 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-cyan-300">
            <span>Avg Progress</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
          </div>
          <div className="text-xl font-bold text-white mt-1.5 font-mono-numbers">{avgProgress}%</div>
          <div className="text-[11px] text-slate-400 mt-1">Milestone tracked</div>
        </div>

        <div className="bg-[#0E1424] p-4 rounded-2xl border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400">CPI Efficiency</div>
          <div className="text-xl font-bold text-cyan-300 mt-1.5 font-mono-numbers">{avgCpi}</div>
          <div className="text-[11px] text-emerald-400 mt-1">Earned value healthy</div>
        </div>

        <div
          onClick={onNavigateToProjects}
          className="bg-[#0E1424] hover:bg-[#131c33] p-4 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-cyan-300">
            <span>Active Sites</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
          </div>
          <div className="text-xl font-bold text-amber-400 mt-1.5 font-mono-numbers">
            {projects.length} Sites
          </div>
          <div className="text-[11px] text-amber-300/80 mt-1">Explore all projects</div>
        </div>
      </div>

      {/* Row 2: Interactive Milestone S-Curve Progress Chart */}
      <div className="bg-[#0E1424] p-6 rounded-3xl border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Interactive S-Curve: Planned vs Actual Cumulative Progress</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Hover over milestone nodes to inspect earned value, schedule performance (SPI), and milestone details
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[11px] text-cyan-300 font-mono">
              <span className="w-3 h-0.5 bg-cyan-400 border-t border-dashed"></span> Planned S-Curve
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono ml-2">
              <span className="w-3 h-1 bg-emerald-400 rounded-full"></span> Actual Site Progress
            </span>
          </div>
        </div>

        {/* SVG Interactive S-Curve Graph */}
        <div className="relative bg-[#090D16] p-4 rounded-2xl border border-slate-800/80 overflow-hidden">
          <svg className="w-full h-56" viewBox="0 0 700 200" preserveAspectRatio="none">
            {/* Horizontal Grid lines */}
            <line x1="40" y1="20" x2="680" y2="20" stroke="#1f293d" strokeDasharray="3 3" />
            <text x="15" y="24" fill="#64748b" fontSize="10" fontFamily="monospace">100%</text>

            <line x1="40" y1="65" x2="680" y2="65" stroke="#1f293d" strokeDasharray="3 3" />
            <text x="15" y="69" fill="#64748b" fontSize="10" fontFamily="monospace">75%</text>

            <line x1="40" y1="110" x2="680" y2="110" stroke="#1f293d" strokeDasharray="3 3" />
            <text x="15" y="114" fill="#64748b" fontSize="10" fontFamily="monospace">50%</text>

            <line x1="40" y1="155" x2="680" y2="155" stroke="#1f293d" strokeDasharray="3 3" />
            <text x="15" y="159" fill="#64748b" fontSize="10" fontFamily="monospace">25%</text>

            {/* Baseline bottom */}
            <line x1="40" y1="190" x2="680" y2="190" stroke="#334155" />

            {/* Planned S-Curve Line (Dashed Cyan) */}
            <path
              d="M 60 180 Q 200 150 360 80 T 660 20"
              fill="none"
              stroke="#22D3EE"
              strokeWidth="2.5"
              strokeDasharray="4 4"
              opacity="0.7"
            />

            {/* Actual S-Curve Path (Solid Emerald up to M12) */}
            <path
              d="M 60 180 Q 180 155 350 78 T 480 45"
              fill="none"
              stroke="#10B981"
              strokeWidth="3.5"
            />

            {/* Milestone Interactive Points */}
            {sCurveMilestones.map((m, idx) => {
              const cx = 60 + idx * 100;
              const plannedY = 190 - (m.planned / 100) * 170;
              const actualY = m.actual !== null ? 190 - (m.actual / 100) * 170 : null;
              const isHovered = hoveredMilestone === idx;

              return (
                <g key={idx} onMouseEnter={() => setHoveredMilestone(idx)} onMouseLeave={() => setHoveredMilestone(null)} className="cursor-pointer">
                  {/* Vertical guide line */}
                  <line x1={cx} y1="20" x2={cx} y2="190" stroke="#1e293b" strokeWidth={isHovered ? '2' : '1'} />
                  <text x={cx - 10} y="198" fill={isHovered ? '#22D3EE' : '#64748b'} fontSize="10" fontWeight={isHovered ? 'bold' : 'normal'} fontFamily="monospace">
                    {m.month}
                  </text>

                  {/* Planned marker */}
                  <circle cx={cx} cy={plannedY} r="3" fill="#22D3EE" opacity="0.6" />

                  {/* Actual marker */}
                  {actualY !== null && (
                    <circle
                      cx={cx}
                      cy={actualY}
                      r={isHovered ? '7' : '5'}
                      fill="#10B981"
                      stroke="#050811"
                      strokeWidth="2"
                      className="transition-all"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Floating Milestone Tooltip Card */}
          {hoveredMilestone !== null && (
            <div className="absolute top-4 right-4 bg-[#0E1424] border border-cyan-400/50 p-3 rounded-2xl shadow-xl text-xs space-y-1.5 backdrop-blur-md z-10 max-w-xs animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between text-cyan-300 font-bold">
                <span>{sCurveMilestones[hoveredMilestone].month} • {sCurveMilestones[hoveredMilestone].date}</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800">
                  CPI {sCurveMilestones[hoveredMilestone].cpi}
                </span>
              </div>
              <div className="font-semibold text-white">{sCurveMilestones[hoveredMilestone].name}</div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-400">Planned: </span>
                  <span className="text-cyan-400 font-mono font-bold">{sCurveMilestones[hoveredMilestone].planned}%</span>
                </div>
                <div>
                  <span className="text-slate-400">Actual: </span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {sCurveMilestones[hoveredMilestone].actual !== null
                      ? `${sCurveMilestones[hoveredMilestone].actual}%`
                      : 'Upcoming'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Row 3: Interactive WBS Breakdown & Capital Expenditure Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* WBS Breakdown Level 1 - 5 */}
        <div className="lg:col-span-7 bg-[#0E1424] p-5 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Cost & Execution by WBS Level</h3>
                <p className="text-xs text-slate-400">Click any level to expand sub-milestones and variance metrics</p>
              </div>
              <span className="text-xs bg-[#12192B] text-cyan-400 px-3 py-1 rounded-xl border border-slate-700 font-mono">
                5 Levels Configured
              </span>
            </div>

            <div className="space-y-3">
              {wbsTiers.map((tier) => {
                const isExpanded = expandedWbsLevel === tier.level;
                return (
                  <div
                    key={tier.level}
                    onClick={() => setExpandedWbsLevel(isExpanded ? null : tier.level)}
                    className="p-3.5 rounded-2xl bg-[#111726] hover:bg-[#141d30] border border-slate-800 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-mono text-[10px] font-bold">
                          L{tier.level}
                        </span>
                        <span className="text-xs font-bold text-white">{tier.title}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-emerald-400">{tier.progress}%</span>
                        <span className="text-[10px] text-slate-400 ml-2">₹{tier.spentCr.toFixed(2)} / ₹{tier.budgetCr.toFixed(2)} Cr</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-[#090D16] rounded-full overflow-hidden mt-2.5">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${tier.progress}%` }}
                      ></div>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-800 space-y-1.5 text-xs animate-in fade-in">
                        <div className="text-[11px] text-slate-400 font-semibold mb-1">Sub-Milestone Deliverables:</div>
                        {tier.subtasks.map((st, i) => (
                          <div key={i} className="flex items-center gap-2 text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>{st}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>Dynamic Work Breakdown Structure</span>
            <span className="text-cyan-400 font-semibold cursor-pointer hover:underline" onClick={onNavigateToProjects}>
              Explore Full WBS Project Ledger →
            </span>
          </div>
        </div>

        {/* CapEx Cost Distribution */}
        <div className="lg:col-span-5 bg-[#0E1424] p-5 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Cost Distribution by Category</h3>
                <p className="text-xs text-slate-400">Click a category to highlight expenditure allocations</p>
              </div>
              <span className="text-xs text-slate-400 font-mono">FY 2026-27</span>
            </div>

            {/* Segmented bar */}
            <div className="w-full h-4 rounded-xl overflow-hidden flex bg-[#090D16] mb-5 border border-slate-800">
              {costCategories.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCostCategory(selectedCostCategory === c.id ? null : c.id)}
                  className={`h-full ${c.color} transition-all cursor-pointer ${
                    selectedCostCategory && selectedCostCategory !== c.id ? 'opacity-30' : 'opacity-100'
                  }`}
                  style={{ width: `${c.pct}%` }}
                  title={`${c.label}: ${c.pct}%`}
                ></div>
              ))}
            </div>

            {/* Category breakdown list */}
            <div className="space-y-2.5">
              {costCategories.map((c) => {
                const isSelected = selectedCostCategory === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCostCategory(isSelected ? null : c.id)}
                    className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-[#151f36] border-cyan-400 shadow-md'
                        : 'bg-[#111726] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${c.color}`}></span>
                      <span className="font-semibold text-slate-200">{c.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 font-mono">₹{c.amountLakhs.toFixed(0)} L</span>
                      <span className="font-bold text-white font-mono bg-[#090D16] px-2 py-0.5 rounded-md border border-slate-800">
                        {c.pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={onNavigateToFinance}
            className="w-full mt-4 py-2.5 px-4 rounded-2xl bg-[#12192B] hover:bg-[#18233d] border border-slate-700 text-xs font-bold text-cyan-300 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <span>Open Double-Entry Finance Ledger</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Row 4: Quick Action Dock */}
      <div className="p-4 rounded-3xl bg-[#0E1424] border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#141C2E] border border-cyan-400/40 text-cyan-400">
            <HardHat className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Instant Site Operations Dispatch</h4>
            <p className="text-[11px] text-slate-400">Jump directly into specialized construction modules</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowQuickAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition cursor-pointer"
          >
            + New Site Project
          </button>
          <button
            onClick={onNavigateToBoq}
            className="px-3.5 py-2 rounded-xl bg-[#12192B] hover:bg-[#18233d] border border-slate-700 text-white text-xs font-medium transition cursor-pointer"
          >
            Estimator & Quotation
          </button>
          <button
            onClick={onNavigateToWorkforce}
            className="px-3.5 py-2 rounded-xl bg-[#12192B] hover:bg-[#18233d] border border-slate-700 text-white text-xs font-medium transition cursor-pointer"
          >
            Muster Roll
          </button>
          <button
            onClick={onNavigateToInventory}
            className="px-3.5 py-2 rounded-xl bg-[#12192B] hover:bg-[#18233d] border border-slate-700 text-white text-xs font-medium transition cursor-pointer"
          >
            Material Stock
          </button>
        </div>
      </div>

      {/* Quick Add Project In-Page Modal */}
      {showQuickAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0E1424] border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Quick Add Construction Project</h3>
              </div>
              <button
                onClick={() => setShowQuickAddModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuickAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  placeholder="e.g. VT Royale Villas"
                  className="w-full bg-[#12192B] border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Client Name</label>
                  <input
                    type="text"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="e.g. K. S. Raju"
                    className="w-full bg-[#12192B] border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Gachibowli, Hyderabad"
                    className="w-full bg-[#12192B] border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Contract (₹)</label>
                  <input
                    type="number"
                    value={newContractVal === 0 ? '' : newContractVal}
                    placeholder="0"
                    onChange={(e) => setNewContractVal(e.target.value === '' ? 0 : Number(e.target.value))}
                    className="w-full bg-[#12192B] border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Budget (₹)</label>
                  <input
                    type="number"
                    value={newBudgetVal === 0 ? '' : newBudgetVal}
                    placeholder="0"
                    onChange={(e) => setNewBudgetVal(e.target.value === '' ? 0 : Number(e.target.value))}
                    className="w-full bg-[#12192B] border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Floors</label>
                  <input
                    type="number"
                    value={newFloors === 0 ? '' : newFloors}
                    placeholder="0"
                    onChange={(e) => setNewFloors(e.target.value === '' ? 0 : Number(e.target.value))}
                    className="w-full bg-[#12192B] border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowQuickAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold transition shadow-md"
                >
                  Save & Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
