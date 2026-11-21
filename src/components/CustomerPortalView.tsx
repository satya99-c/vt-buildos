import React, { useState } from 'react';
import {
  Building,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Camera,
  Download,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Project } from '../types';
import { demoProjects } from '../data/mockData';

interface CustomerPortalViewProps {
  project?: Project;
  onSelectProject?: (project: Project) => void;
}

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({ project: propProject }) => {
  // If no project is passed, fall back to the first demo project for full preview capability
  const activeProject = propProject || demoProjects[0];

  const paidAmount = activeProject.spent || 198400000;
  const remainingAmount = activeProject.contractAmount - paidAmount;
  const progressPercent = activeProject.progress || 68;

  const [activeTab, setActiveTab] = useState<'milestones' | 'photos' | 'financials'>('milestones');

  const customerMilestones = [
    { name: 'Foundation & Basement Retaining Raft', status: 'Completed', date: 'Jul 2025', approvedBy: 'Client Sign-off Verified' },
    { name: 'RCC Superstructure (1st - 10th Floor)', status: 'Completed', date: 'Jun 2026', approvedBy: 'Client Sign-off Verified' },
    { name: '11th - 14th Floor Slab Casting', status: 'In Progress (75%)', date: 'Dec 2026', approvedBy: 'Under Inspection' },
    { name: 'Internal AAC Masonry & Electrical Piping', status: 'In Progress (40%)', date: 'Jan 2027', approvedBy: 'Pending Slab Completion' },
    { name: 'Italian Marble Flooring & External Glazing', status: 'Upcoming', date: 'Apr 2027', approvedBy: 'Scheduled' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider">
            Customer Transparency Portal
          </span>
          <h1 className="text-2xl font-extrabold text-white">Project Dashboard — Client View</h1>
          <p className="text-xs text-slate-400">
            Real-time site progress, high-resolution photographs, milestone approvals & escrow protection
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-2xl bg-[#141C2E] border border-cyan-400/30 text-cyan-300 text-xs font-semibold">
            Client: <strong className="text-white">{activeProject.client}</strong>
          </span>
        </div>
      </div>

      {/* Main Project Card */}
      <div className="bg-[#0E1424] p-6 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{activeProject.name}</h2>
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#141C2E] text-cyan-300 border border-cyan-400/40">
                {activeProject.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{activeProject.siteAddress}</p>
          </div>

          <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6">
            <div className="text-xs text-slate-400 font-medium">Estimated Handover</div>
            <div className="text-sm font-bold text-white font-mono">{activeProject.completionDate}</div>
          </div>
        </div>

        {/* 3 Core Financial Figures */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#111726] p-4 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Contract Value</div>
            <div className="text-2xl font-extrabold text-white mt-1 font-mono-numbers">
              ₹{(activeProject.contractAmount / 10000000).toFixed(2)} Cr
            </div>
          </div>

          <div className="bg-[#111726] p-4 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Total Paid to Date</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono-numbers">
              ₹{(paidAmount / 10000000).toFixed(2)} Cr
            </div>
          </div>

          <div className="bg-[#111726] p-4 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Remaining Milestone Balance</div>
            <div className="text-2xl font-extrabold text-cyan-300 mt-1 font-mono-numbers">
              ₹{(remainingAmount / 10000000).toFixed(2)} Cr
            </div>
          </div>
        </div>

        {/* Overall Completion Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-semibold">Physical Construction Progress</span>
            <span className="text-cyan-400 font-mono font-bold">{progressPercent}% Completed</span>
          </div>
          <div className="w-full h-3 bg-[#090D16] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('milestones')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'milestones'
                ? 'bg-cyan-400 text-slate-950'
                : 'bg-[#111726] text-slate-400 hover:text-white'
            }`}
          >
            Milestone Sign-offs
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'photos'
                ? 'bg-cyan-400 text-slate-950'
                : 'bg-[#111726] text-slate-400 hover:text-white'
            }`}
          >
            Live Site Photographs
          </button>
          <button
            onClick={() => setActiveTab('financials')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'financials'
                ? 'bg-cyan-400 text-slate-950'
                : 'bg-[#111726] text-slate-400 hover:text-white'
            }`}
          >
            Escrow Account Statement
          </button>
        </div>

        {/* Tab contents */}
        {activeTab === 'milestones' && (
          <div className="space-y-3 pt-2">
            {customerMilestones.map((m, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-[#111726] border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      m.status === 'Completed' ? 'text-emerald-400' : 'text-cyan-400'
                    }`}
                  />
                  <div>
                    <div className="font-bold text-white">{m.name}</div>
                    <div className="text-[10px] text-slate-400">{m.approvedBy}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-cyan-300 font-bold">{m.status}</span>
                  <div className="text-[10px] text-slate-500">{m.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="rounded-2xl overflow-hidden border border-slate-800 relative group">
              <img
                src="https://images.unsplash.com/photo-1541888946425-d0fbb18015f6?auto=format&fit=crop&w=800&q=80"
                alt="14th floor slab"
                className="w-full h-44 object-cover"
              />
              <div className="p-2.5 bg-[#090D16] text-xs">
                <div className="font-bold text-white">14th Floor Rebar Shuttering Ready</div>
                <div className="text-[10px] text-slate-400">Captured: Today 10:30 AM • Site Cam #3</div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-800 relative group">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                alt="Front elevation"
                className="w-full h-44 object-cover"
              />
              <div className="p-2.5 bg-[#090D16] text-xs">
                <div className="font-bold text-white">Front Elevation Structure Overview</div>
                <div className="text-[10px] text-slate-400">Captured: Yesterday 04:15 PM • Drone Survey</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'financials' && (
          <div className="p-4 rounded-2xl bg-[#111726] border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>RERA Registered Escrow Bank:</span>
              <span className="font-mono text-white font-bold">ICICI Bank Ltd - Jubilee Hills</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Escrow Account Number:</span>
              <span className="font-mono text-cyan-300">0021-9981-XXXX</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Dual Authorization:</span>
              <span className="text-emerald-400 font-semibold">Architect Certificate Verified</span>
            </div>
          </div>
        )}
      </div>

      {/* Escrow Guarantee Box */}
      <div className="p-5 rounded-3xl bg-[#0E1526] border border-emerald-500/30 flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-[#142622] text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="text-xs">
          <div className="font-bold text-white flex items-center gap-1.5">
            <span>Escrow Protection Framework Verified</span>
            <span className="px-2 py-0.5 rounded-full bg-[#142622] text-emerald-300 font-mono text-[9px] border border-emerald-500/30">
              ACTIVE
            </span>
          </div>
          <div className="text-slate-400 mt-0.5 leading-relaxed">
            Funds are released to contractors strictly after dual verification of quality standards and stage completion certificates.
          </div>
        </div>
      </div>
    </div>
  );
};
