import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Phone,
  Mail,
  Building,
  Calendar,
  IndianRupee,
  MapPin,
  X,
  UserPlus,
} from 'lucide-react';

interface ClientLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  buildingType: string;
  budget: number;
  stage: '1. New Enquiries' | '2. Site Survey Done' | '3. BOQ Proposal Sent' | '4. Final Negotiation' | '5. Contract Signed';
  dateAdded: string;
}

export const CRMView: React.FC = () => {
  const [leads, setLeads] = useState<ClientLead[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadLocation, setLeadLocation] = useState('');
  const [leadBuildingType, setLeadBuildingType] = useState('Luxury Residential Villa');
  const [leadBudget, setLeadBudget] = useState<number>(0);
  const [leadStage, setLeadStage] = useState<ClientLead['stage']>('1. New Enquiries');

  const handleAddLead = () => {
    if (!leadName.trim()) return;

    const newLead: ClientLead = {
      id: 'LD-' + Date.now().toString().slice(-4),
      name: leadName.trim(),
      phone: leadPhone.trim() || '+91 98490 XXXXX',
      email: leadEmail.trim() || 'client@example.com',
      location: leadLocation.trim() || 'Andhra Pradesh',
      buildingType: leadBuildingType,
      budget: Number(leadBudget) || 0,
      stage: leadStage,
      dateAdded: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    setLeads([newLead, ...leads]);
    setLeadName('');
    setLeadPhone('');
    setLeadEmail('');
    setLeadLocation('');
    setLeadBudget(0);
    setLeadStage('1. New Enquiries');
    setShowAddModal(false);
  };

  const stages: ClientLead['stage'][] = [
    '1. New Enquiries',
    '2. Site Survey Done',
    '3. BOQ Proposal Sent',
    '4. Final Negotiation',
    '5. Contract Signed',
  ];

  const getStageStats = (stageName: ClientLead['stage']) => {
    const stageLeads = leads.filter((l) => l.stage === stageName);
    const totalVal = stageLeads.reduce((sum, l) => sum + (l.budget || 0), 0);
    return {
      count: stageLeads.length,
      valStr: totalVal > 0 ? `₹${(totalVal / 10000000).toFixed(2)} Cr` : '₹0.0 Cr',
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-2xl bg-[#0E1424] border border-cyan-400/40 text-cyan-400">
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

        {/* Add Client Lead Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Add Client Lead</span>
        </button>
      </div>

      {/* Pipeline Stages Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        {stages.map((stageName, i) => {
          const stats = getStageStats(stageName);
          return (
            <div key={i} className="p-4 rounded-3xl bg-[#0E1424] border border-white/5 text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase">{stageName}</div>
              <div className="text-lg font-bold text-white mt-1 font-mono-numbers">{stats.count} Leads</div>
              <div className="text-[11px] text-cyan-400 font-mono mt-0.5">{stats.valStr}</div>
            </div>
          );
        })}
      </div>

      {/* Leads Table / Empty State */}
      <div className="rounded-3xl border border-white/5 bg-[#0E1424] overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-[#090D16] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Prospective Construction Clients</h3>
          <span className="text-xs text-slate-400 font-mono">{leads.length} Leads in Pipeline</span>
        </div>

        {leads.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <UserCheck className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-slate-300">No Leads in Pipeline Yet</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Ready to log client enquiries, plot locations, and budget requirements. Click "+ Add Client Lead" to register an enquiry.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-[#070B14] text-slate-400 font-semibold">
                  <th className="p-4">Lead ID</th>
                  <th className="p-4">Client Name</th>
                  <th className="p-4">Contact Details</th>
                  <th className="p-4">Project Scope</th>
                  <th className="p-4 text-right font-mono">Est. Budget</th>
                  <th className="p-4 text-center">Pipeline Stage</th>
                  <th className="p-4 text-right font-mono">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {leads.map((l) => (
                  <tr key={l.id} className="hover:bg-white/[0.02] transition">
                    <td className="p-4 font-mono text-cyan-400 font-bold">{l.id}</td>
                    <td className="p-4 text-white font-bold">{l.name}</td>
                    <td className="p-4 text-slate-300">
                      <div>{l.phone}</div>
                      <div className="text-[10px] text-slate-500">{l.email}</div>
                    </td>
                    <td className="p-4 text-slate-300">
                      <div>{l.buildingType}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{l.location}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono text-cyan-300 font-bold">
                      ₹{(l.budget / 10000000).toFixed(2)} Cr
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                        {l.stage}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono text-slate-400">{l.dateAdded}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Client Lead Modal Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#090D16] border border-white/10 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Add New Client Lead</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Client Full Name *</label>
                <input
                  type="text"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="e.g. K. Srinivas Varma"
                  className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder="+91 98490 XXXXX"
                    className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="srinivas@example.com"
                    className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Project Location / City</label>
                  <input
                    type="text"
                    value={leadLocation}
                    onChange={(e) => setLeadLocation(e.target.value)}
                    placeholder="e.g. Kakinada, AP"
                    className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Building Scope</label>
                  <select
                    value={leadBuildingType}
                    onChange={(e) => setLeadBuildingType(e.target.value)}
                    className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="Luxury Residential Villa">Luxury Residential Villa</option>
                    <option value="Commercial Complex">Commercial Complex</option>
                    <option value="G+3 Apartment Building">G+3 Apartment Building</option>
                    <option value="Turnkey Warehouse">Turnkey Warehouse</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Estimated Budget (₹)</label>
                  <input
                    type="number"
                    value={leadBudget === 0 ? '' : leadBudget}
                    placeholder="0"
                    onChange={(e) => setLeadBudget(e.target.value === '' ? 0 : Number(e.target.value))}
                    className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Initial Pipeline Stage</label>
                  <select
                    value={leadStage}
                    onChange={(e) => setLeadStage(e.target.value as any)}
                    className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    {stages.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/5 text-xs">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLead}
                disabled={!leadName.trim()}
                className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 font-bold text-slate-950 transition cursor-pointer disabled:opacity-50"
              >
                Save Client Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
