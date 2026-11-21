import React, { useState } from 'react';
import {
  Users2,
  Plus,
  X,
} from 'lucide-react';
import { WorkerAttendance } from '../types';
import { initialWorkers } from '../data/mockData';

export const WorkforceView: React.FC = () => {
  const [workers, setWorkers] = useState<WorkerAttendance[]>(initialWorkers);
  const [selectedSite, setSelectedSite] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceDate, setAttendanceDate] = useState('2026-11-20');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWorkerName, setNewWorkerName] = useState('');
  const [newWorkerRole, setNewWorkerRole] = useState('Mason');
  const [newWorkerWage, setNewWorkerWage] = useState(800);
  const [newWorkerSite, setNewWorkerSite] = useState('Site 1');

  const handleToggleStatus = (workerId: string, newStatus: 'P' | 'A' | 'H') => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          let toPay = 0;
          if (newStatus === 'P') toPay = w.dailyWage;
          else if (newStatus === 'H') toPay = Math.round(w.dailyWage / 2);
          else toPay = 0;

          return {
            ...w,
            status: newStatus,
            toPayToday: toPay,
          };
        }
        return w;
      })
    );
  };

  const handleAddWorker = () => {
    if (!newWorkerName.trim()) return;
    const newW: WorkerAttendance = {
      id: 'w-' + Date.now(),
      name: newWorkerName,
      role: newWorkerRole,
      category: 'Skilled',
      dailyWage: Number(newWorkerWage),
      assignedSite: newWorkerSite,
      status: 'P',
      toPayToday: Number(newWorkerWage),
      mobile: '+91 98480 00000',
    };
    setWorkers((prev) => [...prev, newW]);
    setNewWorkerName('');
    setShowAddModal(false);
  };

  const filteredWorkers = workers.filter((w) => {
    const matchesSite = selectedSite === 'All' || w.assignedSite === selectedSite;
    const matchesSearch =
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSite && matchesSearch;
  });

  const presentCount = workers.filter((w) => w.status === 'P').length;
  const halfdayCount = workers.filter((w) => w.status === 'H').length;
  const absentCount = workers.filter((w) => w.status === 'A').length;
  const totalWagesToPayToday = workers.reduce((sum, w) => sum + w.toPayToday, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-[#141C2E] border border-cyan-400/40 text-cyan-400">
              <Users2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">Workforce & Site Labour Attendance</h1>
              <p className="text-xs text-slate-400">
                Daily site allocation, muster roll, P/A/H attendance status, and automated daily wage settlement
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <input
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            className="bg-[#111726] border border-slate-750 text-xs text-slate-200 rounded-2xl px-3.5 py-2 font-mono focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Worker</span>
          </button>
        </div>
      </div>

      {/* Summary Stats - Solid Panels, No Gradients, Smooth Rounded-2xl */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0E1424] p-4 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Present Workers (P)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono-numbers">{presentCount} Crew</div>
          <div className="text-[11px] text-slate-400">Full day wages computed</div>
        </div>

        <div className="bg-[#0E1424] p-4 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Half-Day Workers (H)</div>
          <div className="text-2xl font-bold text-amber-400 mt-1 font-mono-numbers">{halfdayCount} Crew</div>
          <div className="text-[11px] text-slate-400">50% wage pro-rated</div>
        </div>

        <div className="bg-[#0E1424] p-4 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Absent Workers (A)</div>
          <div className="text-2xl font-bold text-rose-400 mt-1 font-mono-numbers">{absentCount} Crew</div>
          <div className="text-[11px] text-slate-400">Zero payout applied</div>
        </div>

        {/* Solid Panel, No Gradient */}
        <div className="bg-[#11182B] p-4 rounded-2xl border border-cyan-400/30">
          <div className="text-xs text-cyan-300 font-bold uppercase tracking-wider">Total Wage Payout Today</div>
          <div className="text-2xl font-extrabold text-white mt-1 font-mono-numbers">
            ₹{totalWagesToPayToday.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-emerald-400 font-medium mt-0.5">
            Auto-linked to Direct Site Labor Expense A/c
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-[#0E1424] rounded-3xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800/80 bg-[#111726] flex items-center justify-between">
          <div className="text-xs text-slate-300">
            Showing <strong className="text-white">{filteredWorkers.length}</strong> registered site workers on muster
          </div>
        </div>

        {filteredWorkers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users2 className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-slate-300">Muster Roll is Currently Empty</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Ready to receive your workforce details. Click "+ Add Worker" above or use the Data Import Center to import existing spreadsheets.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-[#090D16] text-slate-400 font-semibold">
                  <th className="p-3.5">Worker Name</th>
                  <th className="p-3.5">Trade / Skill Category</th>
                  <th className="p-3.5">Assigned Construction Site</th>
                  <th className="p-3.5 text-right font-mono">Daily Wage Rate</th>
                  <th className="p-3.5 text-center">Attendance Status</th>
                  <th className="p-3.5 text-right font-mono">To Pay Today</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredWorkers.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-800/20 transition">
                    <td className="p-3.5 font-bold text-white">{w.name}</td>
                    <td className="p-3.5 text-slate-300">{w.role}</td>
                    <td className="p-3.5 text-cyan-300">{w.assignedSite}</td>
                    <td className="p-3.5 text-right font-mono text-slate-300">₹{w.dailyWage}</td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {(['P', 'A', 'H'] as const).map((btn) => (
                          <button
                            key={btn}
                            onClick={() => handleToggleStatus(w.id, btn)}
                            className={`w-7 h-7 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                              w.status === btn
                                ? btn === 'P'
                                  ? 'bg-emerald-500 text-slate-950 font-extrabold'
                                  : btn === 'A'
                                  ? 'bg-rose-500 text-white font-extrabold'
                                  : 'bg-amber-400 text-slate-950 font-extrabold'
                                : 'bg-[#141C2E] text-slate-400'
                            }`}
                          >
                            {btn}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5 text-right font-mono text-emerald-400 font-bold">
                      ₹{w.toPayToday}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Worker Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0E1424] border border-cyan-400/40 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add Worker to Muster</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Worker Name</label>
                <input
                  type="text"
                  value={newWorkerName}
                  onChange={(e) => setNewWorkerName(e.target.value)}
                  placeholder="e.g. Ramesh Varma"
                  className="w-full bg-[#111726] border border-slate-700/80 rounded-2xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Trade / Role</label>
                <input
                  type="text"
                  value={newWorkerRole}
                  onChange={(e) => setNewWorkerRole(e.target.value)}
                  placeholder="e.g. Mason, Bar Bender, Electrician"
                  className="w-full bg-[#111726] border border-slate-700/80 rounded-2xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Daily Wage (₹)</label>
                <input
                  type="number"
                  value={newWorkerWage}
                  onChange={(e) => setNewWorkerWage(Number(e.target.value))}
                  className="w-full bg-[#111726] border border-slate-700/80 rounded-2xl p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Assigned Site</label>
                <input
                  type="text"
                  value={newWorkerSite}
                  onChange={(e) => setNewWorkerSite(e.target.value)}
                  placeholder="e.g. Beach Road Villa Site"
                  className="w-full bg-[#111726] border border-slate-700/80 rounded-2xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800 text-xs">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-2xl bg-slate-800 text-slate-300">
                Cancel
              </button>
              <button onClick={handleAddWorker} className="px-5 py-2 rounded-2xl bg-cyan-400 font-bold text-slate-950">
                Save Worker
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
