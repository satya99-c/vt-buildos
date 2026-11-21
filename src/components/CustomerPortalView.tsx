import React from 'react';
import {
  Building,
  ShieldCheck,
} from 'lucide-react';
import { Project } from '../types';

interface CustomerPortalViewProps {
  project?: Project;
}

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({ project }) => {
  if (!project) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
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
        </div>

        <div className="bg-[#0E1424] p-12 rounded-3xl border border-slate-800 text-center space-y-4">
          <Building className="w-12 h-12 text-slate-600 mx-auto" />
          <h2 className="text-lg font-bold text-white">No Client Project Linked Yet</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Once you provide your first project details and client information, this customer portal will automatically activate with live milestone completion tracking, high-definition site progress photos, and escrow security assurance.
          </p>
        </div>

        {/* Solid Surface, No Gradient, Rounded-3xl */}
        <div className="p-5 rounded-3xl bg-[#0E1526] border border-emerald-500/30 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#142622] text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>Escrow Protection Framework Configured</span>
              <span className="px-2 py-0.5 rounded-full bg-[#142622] text-emerald-300 font-mono text-[9px] border border-emerald-500/30">
                READY
              </span>
            </div>
            <div className="text-slate-400 mt-0.5 leading-relaxed">
              Turnkey milestones will disburse funds to contractors only upon dual verification between the site engineer and client approval.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const paidAmount = project.spent;
  const remainingAmount = project.contractAmount - paidAmount;

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
            Client: <strong className="text-white">{project.client}</strong>
          </span>
        </div>
      </div>

      {/* Main Project Card - Solid Surface, No Gradient, Rounded-3xl */}
      <div className="bg-[#0E1424] p-6 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{project.name}</h2>
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#141C2E] text-cyan-300 border border-cyan-400/40">
                {project.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{project.siteAddress}</p>
          </div>

          <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6">
            <div className="text-xs text-slate-400 font-medium">Estimated Handover</div>
            <div className="text-sm font-bold text-white font-mono">{project.completionDate}</div>
          </div>
        </div>

        {/* 3 Core Financial Figures */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#111726] p-4 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Contract Value</div>
            <div className="text-2xl font-extrabold text-white mt-1 font-mono-numbers">
              ₹{(project.contractAmount / 100000).toFixed(2)} Lakhs
            </div>
          </div>

          <div className="bg-[#111726] p-4 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Total Paid to Date</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono-numbers">
              ₹{(paidAmount / 100000).toFixed(2)} Lakhs
            </div>
          </div>

          <div className="bg-[#111726] p-4 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Remaining Milestone Balance</div>
            <div className="text-2xl font-extrabold text-cyan-300 mt-1 font-mono-numbers">
              ₹{(remainingAmount / 100000).toFixed(2)} Lakhs
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
