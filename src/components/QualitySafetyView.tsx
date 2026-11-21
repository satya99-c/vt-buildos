import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Plus, HardHat, FileText, Check } from 'lucide-react';

export const QualitySafetyView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inspections' | 'defects' | 'safety'>('inspections');

  const inspections = [
    { id: 'INS-401', project: 'Skyline Luxury Villa', item: 'Pre-Pour Rebar & Shuttering Inspection', engineer: 'Rajesh Varma', status: 'Passed', date: '18 Nov 2026' },
    { id: 'INS-402', project: 'Royal Palm Residency', item: 'M25 Cube Compressive Strength 7-Day Test', engineer: 'P. Satyanarayana', status: 'Passed (21.4 N/mm²)', date: '17 Nov 2026' },
    { id: 'INS-403', project: 'Godavari Commercial Hub', item: 'Electrical Earthing Resistance Test', engineer: 'K. Durga Rao', status: 'Action Required (2.8 Ω > 2.0 Ω)', date: '16 Nov 2026' },
    { id: 'INS-404', project: 'Greenfield Eco Villas', item: 'Sub-grade Soil Compaction 98% Proctor Test', engineer: 'N. Chandrasekhar', status: 'Passed', date: '15 Nov 2026' },
  ];

  const defects = [
    { id: 'DEF-109', project: 'Skyline Luxury Villa', title: 'Honeycomb in column C4 lower joint', severity: 'Medium', assignedTo: 'Apex ReadyMix', status: 'Remediated with epoxy grout' },
    { id: 'DEF-110', project: 'Godavari Commercial Hub', title: 'Minor hairline shrinkage crack on 4th floor screed', severity: 'Low', assignedTo: 'Sri Lakshmi Masonry', status: 'Under observation' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">Quality Assurance & Site Safety (HSE)</h1>
              <p className="text-xs text-slate-400">
                Structural inspections, cube strength tests, punch list defect tracking & safety compliance
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => alert('New Quality Inspection Checklist opened!')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Log Inspection / Defect</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#0E1424] border border-white/5">
          <div className="text-xs text-slate-400 font-medium">Safety Incident Free Days</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono-numbers">348 Days</div>
          <div className="text-[11px] text-slate-400 mt-1">Zero lost-time injuries</div>
        </div>
        <div className="p-5 rounded-3xl bg-[#0E1424] border border-white/5">
          <div className="text-xs text-slate-400 font-medium">Quality Compliance Rate</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1 font-mono-numbers">98.2%</div>
          <div className="text-[11px] text-emerald-400 mt-1">IS 456 / IS 875 audited</div>
        </div>
        <div className="p-5 rounded-3xl bg-[#0E1424] border border-white/5">
          <div className="text-xs text-slate-400 font-medium">Open Punch List Defects</div>
          <div className="text-2xl font-bold text-amber-400 mt-1 font-mono-numbers">2 Items</div>
          <div className="text-[11px] text-slate-400 mt-1">Zero critical blockers</div>
        </div>
        <div className="p-5 rounded-3xl bg-[#0E1424] border border-white/5">
          <div className="text-xs text-slate-400 font-medium">Concrete Cube Tests Passed</div>
          <div className="text-2xl font-bold text-purple-300 mt-1 font-mono-numbers">44 / 44</div>
          <div className="text-[11px] text-emerald-400 mt-1">100% 28-day target reached</div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/5 bg-[#0E1424] overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-[#090D16] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Recent Engineering Quality Sign-offs</h3>
          <span className="text-xs text-slate-400 font-mono">Certified by Chartered Structural Engineers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-[#090D16] text-slate-400 font-semibold">
                <th className="p-4">Inspection ID</th>
                <th className="p-4">Construction Site</th>
                <th className="p-4">Work Package Inspected</th>
                <th className="p-4">Lead Inspector</th>
                <th className="p-4 text-center">Outcome</th>
                <th className="p-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {inspections.map((ins) => (
                <tr key={ins.id} className="hover:bg-white/[0.02] transition">
                  <td className="p-4 font-mono text-cyan-400 font-bold">{ins.id}</td>
                  <td className="p-4 text-white font-bold">{ins.project}</td>
                  <td className="p-4 text-slate-300">{ins.item}</td>
                  <td className="p-4 text-slate-400">{ins.engineer}</td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        ins.status.startsWith('Passed')
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {ins.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-mono text-slate-400">{ins.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
