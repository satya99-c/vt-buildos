import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Plus,
  HardHat,
  FileText,
  Check,
  X,
  ClipboardCheck,
  ShieldCheck,
} from 'lucide-react';

interface InspectionRecord {
  id: string;
  project: string;
  item: string;
  engineer: string;
  status: string;
  date: string;
  checklistPassedCount?: number;
  totalChecklistCount?: number;
}

export const QualitySafetyView: React.FC = () => {
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [formProject, setFormProject] = useState('');
  const [formEngineer, setFormEngineer] = useState('');
  const [activeChecklistCategory, setActiveChecklistCategory] = useState<'rebar' | 'concrete' | 'safety'>('rebar');

  // Inspection checklist items with checkboxes
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, category: 'rebar', label: 'Concrete clear cover verified (40mm columns, 25mm slabs)', checked: true },
    { id: 2, category: 'rebar', label: 'Rebar diameter, spacing & lap lengths match structural drawing', checked: true },
    { id: 3, category: 'rebar', label: 'Formwork shuttering plumb, oiled, and rigid props braced', checked: true },
    { id: 4, category: 'rebar', label: 'Formwork clean of debris, dust & loose binding wire', checked: true },
    { id: 5, category: 'concrete', label: 'Slump test checked for batch workability (100–120mm)', checked: true },
    { id: 6, category: 'concrete', label: '6 test concrete cubes sampled for 7-day & 28-day compression test', checked: true },
    { id: 7, category: 'concrete', label: 'Needle vibrators operational and deployed uniformly', checked: true },
    { id: 8, category: 'safety', label: '100% on-site workforce wearing ISI hardhats & safety boots', checked: true },
    { id: 9, category: 'safety', label: 'Perimeter safety nets and edge guard rails secured on slab', checked: true },
    { id: 10, category: 'safety', label: 'First-aid station & emergency fire extinguishers verified', checked: true },
  ]);

  const toggleChecklist = (id: number) => {
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleSaveInspection = () => {
    const checkedCount = checklistItems.filter((i) => i.checked).length;
    const totalCount = checklistItems.length;
    const isAllPassed = checkedCount === totalCount;

    const newRecord: InspectionRecord = {
      id: `INS-${400 + inspections.length + 1}`,
      project: formProject.trim() || 'Skyline Luxury Villa',
      item:
        activeChecklistCategory === 'rebar'
          ? 'Pre-Pour Structural Rebar & Formwork Sign-off'
          : activeChecklistCategory === 'concrete'
          ? 'Concrete Batch Pour & Cube Compressive Test'
          : 'Site Safety, PPE & HSE Compliance Audit',
      engineer: formEngineer.trim() || 'Rajesh Varma (Chartered Engineer)',
      status: isAllPassed ? 'Passed (100% Compliant)' : `Passed (${checkedCount}/${totalCount} Verified)`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      checklistPassedCount: checkedCount,
      totalChecklistCount: totalCount,
    };

    setInspections([newRecord, ...inspections]);
    setFormProject('');
    setFormEngineer('');
    setShowModal(false);
  };

  const currentCategoryItems = checklistItems.filter((item) => item.category === activeChecklistCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-2xl bg-[#0E1424] border border-cyan-400/40 text-cyan-400">
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

        {/* Modal open button (Issue 1 Fixed) */}
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
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
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

      {/* Engineering Inspection Checklist Modal (Issue 1 Fixed) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#090D16] border border-white/10 rounded-3xl w-full max-w-xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Engineering Quality Inspection Checklist</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Construction Project / Site</label>
                  <input
                    type="text"
                    value={formProject}
                    onChange={(e) => setFormProject(e.target.value)}
                    placeholder="e.g. Skyline Luxury Villa - Plot 14"
                    className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Lead Inspector / Testing Lab</label>
                  <input
                    type="text"
                    value={formEngineer}
                    onChange={(e) => setFormEngineer(e.target.value)}
                    placeholder="e.g. Rajesh Varma (Chartered Engineer)"
                    className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Checklist Category Tabs */}
              <div>
                <label className="text-slate-400 block mb-1.5 font-medium">Select Inspection Package Checklist</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveChecklistCategory('rebar')}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                      activeChecklistCategory === 'rebar'
                        ? 'bg-[#0E1424] border-cyan-400/50 text-cyan-300 font-bold'
                        : 'bg-[#070B14] border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    1. Rebar & Shuttering
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveChecklistCategory('concrete')}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                      activeChecklistCategory === 'concrete'
                        ? 'bg-[#0E1424] border-cyan-400/50 text-cyan-300 font-bold'
                        : 'bg-[#070B14] border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    2. Concrete & Cubes
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveChecklistCategory('safety')}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                      activeChecklistCategory === 'safety'
                        ? 'bg-[#0E1424] border-cyan-400/50 text-cyan-300 font-bold'
                        : 'bg-[#070B14] border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    3. Safety & HSE
                  </button>
                </div>
              </div>

              {/* Interactive Checkbox Items */}
              <div className="p-3 bg-[#0E1424] rounded-2xl border border-white/5 space-y-2">
                <div className="text-[11px] font-bold text-slate-300 mb-1">
                  Mandatory Verification Points ({currentCategoryItems.filter((i) => i.checked).length}/{currentCategoryItems.length} checked):
                </div>

                {currentCategoryItems.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-white/[0.02] cursor-pointer text-[11px] text-slate-200 transition"
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleChecklist(item.id)}
                      className="mt-0.5 w-4 h-4 rounded-md accent-cyan-500 cursor-pointer"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/5 text-xs">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveInspection}
                className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 font-bold text-slate-950 transition cursor-pointer flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verify & Sign-off Inspection</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
