import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Plus, HardHat, FileText, Check, X } from 'lucide-react';

interface InspectionRecord {
  id: string;
  project: string;
  item: string;
  engineer: string;
  status: string;
  date: string;
}

export const QualitySafetyView: React.FC = () => {
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form state for logging an inspection
  const [formProject, setFormProject] = useState('');
  const [formItem, setFormItem] = useState('');
  const [formEngineer, setFormEngineer] = useState('');
  const [formStatus, setFormStatus] = useState('Passed');

  const handleAddInspection = () => {
    if (!formProject.trim() || !formItem.trim()) return;
    const newRecord: InspectionRecord = {
      id: `INS-${400 + inspections.length + 1}`,
      project: formProject.trim(),
      item: formItem.trim(),
      engineer: formEngineer.trim() || 'Site Structural Engineer',
      status: formStatus,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setInspections([newRecord, ...inspections]);
    setFormProject('');
    setFormItem('');
    setFormEngineer('');
    setFormStatus('Passed');
    setShowModal(false);
  };

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
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Log Inspection / Defect</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#0E1424] border border-white/5">
          <div className="text-xs text-slate-400 font-medium">Safety Incident Free Days</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono-numbers">348 Days</div>
          <div className="text-[11px] text-slate-400 mt-1">Zero lost-time injuries</div>
        </div>
        <div className="p-5 rounded-3xl bg-[#0E1424] border border-white/5">
          <div className="text-xs text-slate-400 font-medium">Quality Compliance Rate</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1 font-mono-numbers">100%</div>
          <div className="text-[11px] text-emerald-400 mt-1">IS 456 / IS 875 audited</div>
        </div>
        <div className="p-5 rounded-3xl bg-[#0E1424] border border-white/5">
          <div className="text-xs text-slate-400 font-medium">Open Punch List Defects</div>
          <div className="text-2xl font-bold text-slate-200 mt-1 font-mono-numbers">0 Items</div>
          <div className="text-[11px] text-slate-400 mt-1">Zero critical blockers</div>
        </div>
        <div className="p-5 rounded-3xl bg-[#0E1424] border border-white/5">
          <div className="text-xs text-slate-400 font-medium">Concrete Cube Tests Passed</div>
          <div className="text-2xl font-bold text-slate-200 mt-1 font-mono-numbers">
            {inspections.length} / {inspections.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Awaiting batch testing</div>
        </div>
      </div>

      {/* Recent Engineering Quality Sign-offs Table */}
      <div className="rounded-3xl border border-white/5 bg-[#0E1424] overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-[#090D16] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Engineering Quality Sign-offs</h3>
            <p className="text-xs text-slate-400">Certified by Chartered Structural Engineers & Laboratory Test Certificates</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">{inspections.length} Sign-offs</span>
        </div>

        {inspections.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShieldAlert className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-slate-300">No Quality Sign-offs Recorded Yet</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Sample data has been cleared. Ready to record pre-pour rebar checks, concrete compressive cube tests, and chartered engineering approvals. Click "+ Log Inspection / Defect" to record.
            </p>
          </div>
        ) : (
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
                    <td className="p-4 text-right font-mono text-slate-400">{ins.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Inspection Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#090D16] border border-white/10 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-base font-bold text-white">Log Quality Sign-off / Inspection</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Construction Project / Site</label>
                <input
                  type="text"
                  value={formProject}
                  onChange={(e) => setFormProject(e.target.value)}
                  placeholder="e.g. Skyline Luxury Villa - Plot 14"
                  className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Work Package Inspected</label>
                <input
                  type="text"
                  value={formItem}
                  onChange={(e) => setFormItem(e.target.value)}
                  placeholder="e.g. Pre-Pour Rebar & Shuttering Inspection"
                  className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Lead Inspector / Testing Lab</label>
                <input
                  type="text"
                  value={formEngineer}
                  onChange={(e) => setFormEngineer(e.target.value)}
                  placeholder="e.g. Rajesh Varma (Chartered Engineer)"
                  className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Outcome / Test Result</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="Passed">Passed (100% Compliant)</option>
                  <option value="Passed (M25 Compressive Strength 22 N/mm²)">Passed (M25 Strength 22 N/mm²)</option>
                  <option value="Action Required">Action Required (Minor Remediation)</option>
                  <option value="Under Review">Under Review</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/5 text-xs">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddInspection}
                className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 font-bold text-slate-950 transition"
              >
                Save Sign-off
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
