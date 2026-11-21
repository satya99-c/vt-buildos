import React from 'react';
import {
  Sparkles,
  ChevronRight,
  FolderPlus,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Project } from '../types';

interface DashboardViewProps {
  projects: Project[];
  onNavigateToProjects: () => void;
  onNavigateToWorkforce: () => void;
  onNavigateToInventory: () => void;
  onNavigateToBoq: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  onNavigateToProjects,
  onNavigateToWorkforce,
  onNavigateToInventory,
  onNavigateToBoq,
}) => {
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

  return (
    <div className="space-y-6">
      {/* Top Welcome Card - Solid Dark Surface, No Gradients, Smooth Rounded-3xl */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-3xl bg-[#0E1424] p-6 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#141C2E] border border-cyan-400/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                VT BuildOS • Operations Platform
              </span>
              <span className="text-xs text-slate-400 font-medium">Ready for Live Data Input</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Welcome, <span className="text-cyan-400">VT Developers</span>!
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
              Clean operational state active. Ready to ingest your actual construction sites, workforce muster, material stock, and financial transactions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/70">
            <div className="bg-[#12192B] p-3.5 rounded-2xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Ongoing Activities</div>
              <div className="text-lg font-bold text-white font-mono-numbers">0 Tasks</div>
              <div className="text-[10px] text-slate-500">Awaiting site logs</div>
            </div>
            <div className="bg-[#12192B] p-3.5 rounded-2xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Labour Attendance</div>
              <div className="text-lg font-bold text-slate-300 font-mono-numbers">0 Active</div>
              <div className="text-[10px] text-slate-500">Muster roll cleared</div>
            </div>
            <div className="bg-[#12192B] p-3.5 rounded-2xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Pending Approvals</div>
              <div className="text-lg font-bold text-white font-mono-numbers">0 Items</div>
              <div className="text-[10px] text-slate-500">Clean queue</div>
            </div>
            <div className="bg-[#12192B] p-3.5 rounded-2xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Safety Compliance</div>
              <div className="text-lg font-bold text-cyan-400 font-mono-numbers">100%</div>
              <div className="text-[10px] text-emerald-400 font-medium">System Ready</div>
            </div>
          </div>
        </div>

        {/* AI Copilot Status Card - Solid Surface, No Gradient, Rounded-3xl */}
        <div className="rounded-3xl bg-[#111726] p-6 border border-cyan-400/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-2xl bg-[#172138] border border-cyan-400/40 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                </div>
                <span className="text-xs font-bold text-cyan-300 tracking-wide uppercase">AI Onboarding</span>
              </div>
              <span className="text-[10px] bg-[#172138] text-cyan-300 border border-cyan-400/30 px-2.5 py-0.5 rounded-full font-mono">
                STANDBY
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <div className="text-3xl font-extrabold text-white font-mono-numbers">Ready</div>
              <div className="text-xs text-slate-400 font-semibold">Awaiting Your Data Input</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#090D16] border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>
                Provide your project list, employees, materials, or financial spreadsheets. You can paste details here in chat or use the built-in <strong>Data Import Center</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToProjects}
            className="w-full mt-4 py-2.5 px-4 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <span>+ Add Your First Project</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* 6 Core KPI Metric Cards - Solid Panels with Smooth Rounded-2xl */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-[#0E1424] p-4 rounded-2xl border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400">Total Portfolio Value</div>
          <div className="text-xl font-bold text-white mt-1.5 font-mono-numbers">
            ₹{(totalValue / 10000000).toFixed(2)} Cr
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Awaiting project entry</div>
        </div>

        <div className="bg-[#0E1424] p-4 rounded-2xl border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400">Budget Spent</div>
          <div className="text-xl font-bold text-slate-300 mt-1.5 font-mono-numbers">
            ₹{(totalSpent / 10000000).toFixed(2)} Cr
          </div>
          <div className="text-[11px] text-slate-500 mt-1">0% utilized</div>
        </div>

        <div className="bg-[#0E1424] p-4 rounded-2xl border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400">Cost Variance</div>
          <div className="text-xl font-bold text-emerald-400 mt-1.5 font-mono-numbers">
            ₹{(costVariance / 10000000).toFixed(2)} Cr
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Baseline balanced</div>
        </div>

        <div className="bg-[#0E1424] p-4 rounded-2xl border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400">Schedule Progress</div>
          <div className="text-xl font-bold text-white mt-1.5 font-mono-numbers">{avgProgress}%</div>
          <div className="text-[11px] text-slate-500 mt-1">Ready to track</div>
        </div>

        <div className="bg-[#0E1424] p-4 rounded-2xl border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400">Average CPI Index</div>
          <div className="text-xl font-bold text-cyan-300 mt-1.5 font-mono-numbers">{avgCpi}</div>
          <div className="text-[11px] text-slate-500 mt-1">Baseline 1.00</div>
        </div>

        <div className="bg-[#0E1424] p-4 rounded-2xl border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400">Active Sites</div>
          <div className="text-xl font-bold text-amber-400 mt-1.5 font-mono-numbers">
            {projects.length} Sites
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Ready for site setup</div>
        </div>
      </div>

      {/* Row 2: WBS Level Table & Cost by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-[#0E1424] p-5 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Cost by WBS Level (₹ Cr)</h3>
                <p className="text-xs text-slate-400">Work Breakdown Structure budget allocation vs actual site expenses</p>
              </div>
              <span className="text-xs bg-[#12192B] text-cyan-400 px-3 py-1 rounded-xl border border-slate-700 font-mono">
                5 Levels Configured
              </span>
            </div>

            <div className="py-12 text-center space-y-2">
              <FolderPlus className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-sm font-semibold text-slate-300">No WBS Expenses Logged Yet</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Once projects and expense vouchers are posted, Level 1 (Foundation) through Level 5 (Finishes) will dynamically calculate variance.
              </p>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>Ready for VT Developers site data</span>
            <span className="text-cyan-400 font-semibold">Ledger Active</span>
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#0E1424] p-5 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Cost Distribution by Type</h3>
                <p className="text-xs text-slate-400">Capital expenditure breakdown across Material, Labor, Equipment</p>
              </div>
              <span className="text-xs text-slate-400 font-mono">FY 2026-27</span>
            </div>

            <div className="py-12 text-center space-y-2">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-700 mx-auto flex items-center justify-center text-slate-500 font-mono text-xs">
                ₹0.00
              </div>
              <div className="text-xs text-slate-400">Awaiting site expenditure postings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: S-Curve Progress & Top Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 bg-[#0E1424] p-5 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">S-Curve: Cumulative Planned vs Actual Progress</h3>
              <p className="text-xs text-slate-400">Earned value analysis across project timelines</p>
            </div>
          </div>

          <div className="h-44 w-full flex items-center justify-center border border-dashed border-slate-800 rounded-2xl text-xs text-slate-500">
            Timeline S-Curve will render dynamically as progress milestones are tracked.
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#0E1424] p-5 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">Project Budget Utilization</h3>
            </div>

            <div className="py-8 text-center space-y-2">
              <p className="text-xs text-slate-400">No projects added yet.</p>
              <button
                onClick={onNavigateToProjects}
                className="px-4 py-2 rounded-2xl bg-cyan-400 text-slate-950 text-xs font-bold hover:bg-cyan-300 transition cursor-pointer"
              >
                + Add Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
