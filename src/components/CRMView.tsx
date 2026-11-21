import React, { useState } from 'react';
import { UserCheck, Plus, Phone, Mail, Building, Calendar, IndianRupee } from 'lucide-react';

export const CRMView: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">CRM & Customer Client Pipeline</h1>
              <p className="text-xs text-slate-400">
                Track client leads, enquiries, architectural consultations, and turnkey construction proposals
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => alert('New Client Enquiry form ready!')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Add Client Lead</span>
        </button>
      </div>

      {/* Pipeline Stages Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        {[
          { stage: '1. New Enquiries', count: 0, value: '₹0.0 Cr' },
          { stage: '2. Site Survey Done', count: 0, value: '₹0.0 Cr' },
          { stage: '3. BOQ Proposal Sent', count: 0, value: '₹0.0 Cr' },
          { stage: '4. Final Negotiation', count: 0, value: '₹0.0 Cr' },
          { stage: '5. Contract Signed', count: 0, value: '₹0.0 Cr' },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-3xl bg-[#0E1424] border border-white/5 text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase">{s.stage}</div>
            <div className="text-lg font-bold text-white mt-1 font-mono-numbers">{s.count} Leads</div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Leads Table / Empty State */}
      <div className="rounded-3xl border border-white/5 bg-[#0E1424] overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-[#090D16] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Prospective Construction Clients</h3>
          <span className="text-xs text-slate-400 font-mono">0 Leads in Pipeline</span>
        </div>

        <div className="p-12 text-center space-y-3">
          <UserCheck className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="text-sm font-semibold text-slate-300">No Leads in Pipeline Yet</div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Ready to log client enquiries, plot locations, and budget requirements.
          </p>
        </div>
      </div>
    </div>
  );
};
