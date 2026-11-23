import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  X,
  Sparkles,
} from 'lucide-react';

interface MilestoneItem {
  id: string;
  project: string;
  task: string;
  wbsLevel: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'Completed' | 'In Progress' | 'Delayed' | 'Upcoming';
  criticalPath: boolean;
  assignedEngineer: string;
}

const defaultMilestones: MilestoneItem[] = [
  {
    id: 'MS-101',
    project: 'VT Grandeur Luxury Towers',
    task: 'Piling & Deep Excavation (Basement -2)',
    wbsLevel: 'L1 Substructure',
    startDate: '2025-05-01',
    endDate: '2025-07-15',
    progress: 100,
    status: 'Completed',
    criticalPath: true,
    assignedEngineer: 'Er. K. V. Sharma',
  },
  {
    id: 'MS-102',
    project: 'VT Grandeur Luxury Towers',
    task: 'RCC Raft Foundation & Waterproofing',
    wbsLevel: 'L1 Substructure',
    startDate: '2025-07-20',
    endDate: '2025-09-30',
    progress: 100,
    status: 'Completed',
    criticalPath: true,
    assignedEngineer: 'Er. K. V. Sharma',
  },
  {
    id: 'MS-103',
    project: 'VT Grandeur Luxury Towers',
    task: 'RCC Superstructure Slab Casting (Floors 1 - 10)',
    wbsLevel: 'L2 Superstructure',
    startDate: '2025-10-10',
    endDate: '2026-06-30',
    progress: 100,
    status: 'Completed',
    criticalPath: true,
    assignedEngineer: 'Er. K. V. Sharma',
  },
  {
    id: 'MS-104',
    project: 'VT Grandeur Luxury Towers',
    task: 'Superstructure Slab Casting (Floors 11 - 14)',
    wbsLevel: 'L2 Superstructure',
    startDate: '2026-07-01',
    endDate: '2026-12-15',
    progress: 75,
    status: 'In Progress',
    criticalPath: true,
    assignedEngineer: 'Er. Ramesh Babu',
  },
  {
    id: 'MS-105',
    project: 'VT Grandeur Luxury Towers',
    task: 'AAC Blockwork & Internal Plastering (Floors 1 - 8)',
    wbsLevel: 'L3 Masonry',
    startDate: '2026-09-01',
    endDate: '2027-01-30',
    progress: 45,
    status: 'In Progress',
    criticalPath: false,
    assignedEngineer: 'Er. Mohammed Irfan',
  },
  {
    id: 'MS-106',
    project: 'VT Lakefront Smart Villas',
    task: 'Villa Row A (Units 1-8) Plinth Beam & Grade Slab',
    wbsLevel: 'L1 Substructure',
    startDate: '2026-08-01',
    endDate: '2026-10-15',
    progress: 100,
    status: 'Completed',
    criticalPath: true,
    assignedEngineer: 'Er. Ramesh Babu',
  },
  {
    id: 'MS-107',
    project: 'VT Lakefront Smart Villas',
    task: 'Villa Row A Superstructure & Roof Slab',
    wbsLevel: 'L2 Superstructure',
    startDate: '2026-10-20',
    endDate: '2027-01-10',
    progress: 60,
    status: 'In Progress',
    criticalPath: true,
    assignedEngineer: 'Er. Ramesh Babu',
  },
  {
    id: 'MS-108',
    project: 'VT Horizon Commercial Hub',
    task: 'B2 Basement Retaining Wall Post-Tensioning',
    wbsLevel: 'L1 Substructure',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    progress: 30,
    status: 'Delayed',
    criticalPath: true,
    assignedEngineer: 'Er. Mohammed Irfan',
  },
];

export const SchedulingView: React.FC = () => {
  const [milestones, setMilestones] = useState<MilestoneItem[]>(defaultMilestones);
  const [selectedProject, setSelectedProject] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for new milestone
  const [newProject, setNewProject] = useState('VT Grandeur Luxury Towers');
  const [newTask, setNewTask] = useState('');
  const [newWbs, setNewWbs] = useState('L2 Superstructure');
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEndDate, setNewEndDate] = useState(new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [newEngineer, setNewEngineer] = useState('Er. Site Lead');

  const filtered = milestones.filter((m) => {
    if (selectedProject !== 'All' && m.project !== selectedProject) return false;
    if (selectedStatus !== 'All' && m.status !== selectedStatus) return false;
    return true;
  });

  const handleUpdateProgress = (id: string, delta: number) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextVal = Math.min(100, Math.max(0, m.progress + delta));
          const nextStatus =
            nextVal === 100 ? 'Completed' : nextVal === 0 ? 'Upcoming' : m.status === 'Delayed' ? 'Delayed' : 'In Progress';
          return { ...m, progress: nextVal, status: nextStatus };
        }
        return m;
      })
    );
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const created: MilestoneItem = {
      id: 'MS-' + (milestones.length + 101),
      project: newProject,
      task: newTask,
      wbsLevel: newWbs,
      startDate: newStartDate,
      endDate: newEndDate,
      progress: 0,
      status: 'Upcoming',
      criticalPath: true,
      assignedEngineer: newEngineer,
    };

    setMilestones([created, ...milestones]);
    setShowAddModal(false);
    setNewTask('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-[#141C2E] border border-cyan-400/40 text-cyan-400">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">Project Scheduling & Milestone CPM Timeline</h1>
              <p className="text-xs text-slate-400">
                Critical Path Method (CPM) milestone tracking, dependency Gantt schedule, and progress updates
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="px-3.5 py-1.5 rounded-full bg-[#141C2E] border border-cyan-400/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Schedule Engine Active</span>
          </span>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Milestone</span>
          </button>
        </div>
      </div>

      {/* Interactive Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#0E1424] border border-slate-800">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Project:
          </span>
          {['All', 'VT Grandeur Luxury Towers', 'VT Lakefront Smart Villas', 'VT Horizon Commercial Hub'].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedProject(p)}
              className={`px-3 py-1 rounded-xl transition cursor-pointer ${
                selectedProject === p
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-[#12192B] text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {p === 'All' ? 'All Projects' : p.split(' ')[1]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {['All', 'In Progress', 'Completed', 'Delayed'].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStatus(s)}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                selectedStatus === s
                  ? 'bg-white text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Milestone List Card */}
      <div className="bg-[#0E1424] p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Critical Path Milestones ({filtered.length})</h3>
          <span className="text-xs text-slate-400 font-mono">Live Timeline Gantt</span>
        </div>

        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-[#111726] border border-slate-800 hover:border-slate-700 transition space-y-3 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono text-[10px] font-bold">
                      {item.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#18233d] text-slate-300 font-mono text-[10px]">
                      {item.wbsLevel}
                    </span>
                    {item.criticalPath && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-950/60 text-rose-400 border border-rose-800 text-[9px] font-bold">
                        CRITICAL PATH
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">{item.task}</h4>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {item.project} • Lead: <strong className="text-slate-300">{item.assignedEngineer}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      item.status === 'Completed'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : item.status === 'In Progress'
                        ? 'bg-cyan-950 text-cyan-400 border-cyan-800'
                        : item.status === 'Delayed'
                        ? 'bg-rose-950 text-rose-400 border-rose-800'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {item.status}
                  </span>

                  <div className="flex items-center gap-1 bg-[#090D16] p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => handleUpdateProgress(item.id, -10)}
                      className="px-2 py-0.5 rounded-lg bg-[#141C2E] hover:bg-slate-700 text-slate-300 font-mono font-bold"
                      title="Decrease progress by 10%"
                    >
                      -10%
                    </button>
                    <span className="px-2 font-mono font-bold text-white">{item.progress}%</span>
                    <button
                      onClick={() => handleUpdateProgress(item.id, +10)}
                      className="px-2 py-0.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 font-mono font-bold"
                      title="Advance progress by 10%"
                    >
                      +10%
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-[#090D16] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    item.status === 'Completed'
                      ? 'bg-emerald-400'
                      : item.status === 'Delayed'
                      ? 'bg-rose-400'
                      : 'bg-cyan-400'
                  }`}
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Start: <strong className="text-slate-300 font-mono">{item.startDate}</strong></span>
                <span>Deadline: <strong className="text-slate-300 font-mono">{item.endDate}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Milestone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0E1424] border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Add Project Milestone</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMilestone} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Target Project *</label>
                <select
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  className="w-full bg-[#12192B] border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="VT Grandeur Luxury Towers">VT Grandeur Luxury Towers</option>
                  <option value="VT Lakefront Smart Villas">VT Lakefront Smart Villas</option>
                  <option value="VT Horizon Commercial Hub">VT Horizon Commercial Hub</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Milestone / Task Name *</label>
                <input
                  type="text"
                  required
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="e.g. 14th Floor Slab Casting & Curing"
                  className="w-full bg-[#12192B] border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">WBS Level</label>
                  <select
                    value={newWbs}
                    onChange={(e) => setNewWbs(e.target.value)}
                    className="w-full bg-[#12192B] border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="L1 Substructure">L1 Substructure</option>
                    <option value="L2 Superstructure">L2 Superstructure</option>
                    <option value="L3 Masonry">L3 Masonry</option>
                    <option value="L4 MEP Services">L4 MEP Services</option>
                    <option value="L5 Finishes">L5 Finishes</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Assigned Engineer</label>
                  <input
                    type="text"
                    value={newEngineer}
                    onChange={(e) => setNewEngineer(e.target.value)}
                    placeholder="Er. Name"
                    className="w-full bg-[#12192B] border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full bg-[#12192B] border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Target End Date</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full bg-[#12192B] border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold transition shadow-md"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
