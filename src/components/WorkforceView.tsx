import React, { useState } from 'react';
import {
  Users2,
  Plus,
  X,
  Calendar,
  Filter,
  DollarSign,
  UserPlus,
} from 'lucide-react';
import { WorkerAttendance } from '../types';
import { initialWorkers } from '../data/mockData';

export const WorkforceView: React.FC = () => {
  const [workers, setWorkers] = useState<WorkerAttendance[]>(initialWorkers);
  const [selectedSite, setSelectedSite] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Date Range Selector (Issue Fixed)
  const [dateRangePreset, setDateRangePreset] = useState<'today' | 'week' | 'month' | 'custom'>('month');
  const [startDate, setStartDate] = useState('2026-11-01');
  const [endDate, setEndDate] = useState('2026-11-21');

  // New worker modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWorkerName, setNewWorkerName] = useState('');
  const [newWorkerRole, setNewWorkerRole] = useState('Mason');
  const [newWorkerWage, setNewWorkerWage] = useState<number>(0); // default 0 with manual typing
  const [newWorkerSite, setNewWorkerSite] = useState('Site 1');

  const handleApplyPreset = (preset: 'today' | 'week' | 'month') => {
    setDateRangePreset(preset);
    const today = '2026-11-21';
    if (preset === 'today') {
      setStartDate(today);
      setEndDate(today);
    } else if (preset === 'week') {
      setStartDate('2026-11-15');
      setEndDate(today);
    } else if (preset === 'month') {
      setStartDate('2026-11-01');
      setEndDate(today);
    }
  };

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
    const wageVal = Number(newWorkerWage) || 0;
    const newW: WorkerAttendance = {
      id: 'w-' + Date.now(),
      name: newWorkerName.trim(),
      role: newWorkerRole,
      category: 'Skilled',
      dailyWage: wageVal,
      assignedSite: newWorkerSite,
      status: 'P',
      toPayToday: wageVal,
      mobile: '+91 98480 00000',
    };
    setWorkers((prev) => [...prev, newW]);
    setNewWorkerName('');
    setNewWorkerWage(0);
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

  // Calculate days difference in range for cumulative wage payout
  const startD = new Date(startDate);
  const endD = new Date(endDate);
  const diffDays = Math.max(1, Math.round((endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  const totalWagesToPayToday = workers.reduce((sum, w) => sum + w.toPayToday, 0);
  const totalEstimatedRangePayout = totalWagesToPayToday * diffDays;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-2xl bg-[#0E1424] border border-cyan-400/40 text-cyan-400">
              <Users2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">Workforce & Site Labour Attendance</h1>
              <p className="text-xs text-slate-400">
                Daily site allocation, muster roll, P/A/H attendance status, and automated wage settlement
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition cursor-pointer self-start md:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Add Worker</span>
        </button>
      </div>

      {/* Date Range Selector Toolbar (Issue Fixed) */}
      <div className="p-4 rounded-3xl bg-[#0E1424] border border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Attendance Date Range:</span>
          </span>

          <div className="flex items-center gap-2 bg-[#090D16] p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => handleApplyPreset('today')}
              className={`px-3 py-1 rounded-xl font-semibold transition cursor-pointer ${
                dateRangePreset === 'today' ? 'bg-cyan-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => handleApplyPreset('week')}
              className={`px-3 py-1 rounded-xl font-semibold transition cursor-pointer ${
                dateRangePreset === 'week' ? 'bg-cyan-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => handleApplyPreset('month')}
              className={`px-3 py-1 rounded-xl font-semibold transition cursor-pointer ${
                dateRangePreset === 'month' ? 'bg-cyan-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Current Month
            </button>
          </div>
        </div>

        {/* Custom Start & End Date Inputs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#090D16] border border-white/10 rounded-2xl px-3 py-1.5">
            <span className="text-slate-500 text-[10px] uppercase font-mono">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setDateRangePreset('custom');
              }}
              className="bg-transparent text-slate-200 font-mono focus:outline-none cursor-pointer"
            />
          </div>

          <span className="text-slate-500 font-bold">→</span>

          <div className="flex items-center gap-1.5 bg-[#090D16] border border-white/10 rounded-2xl px-3 py-1.5">
            <span className="text-slate-500 text-[10px] uppercase font-mono">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setDateRangePreset('custom');
              }}
              className="bg-transparent text-slate-200 font-mono focus:outline-none cursor-pointer"
            />
          </div>

          <span className="text-[11px] font-mono text-cyan-300 bg-[#090D16] px-2.5 py-1.5 rounded-xl border border-cyan-400/30">
            {diffDays} {diffDays === 1 ? 'Day' : 'Days'}
          </span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0E1424] p-5 rounded-3xl border border-white/5">
          <div className="text-xs text-slate-400 font-medium">Present Workers (P)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono-numbers">{presentCount} Crew</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Full day muster credited</div>
        </div>

        <div className="bg-[#0E1424] p-5 rounded-3xl border border-white/5">
          <div className="text-xs text-slate-400 font-medium">Half-Day Workers (H)</div>
          <div className="text-2xl font-bold text-amber-400 mt-1 font-mono-numbers">{halfdayCount} Crew</div>
          <div className="text-[11px] text-slate-400 mt-0.5">50% wage pro-rated</div>
        </div>

        <div className="bg-[#0E1424] p-5 rounded-3xl border border-white/5">
          <div className="text-xs text-slate-400 font-medium">Absent Workers (A)</div>
          <div className="text-2xl font-bold text-rose-400 mt-1 font-mono-numbers">{absentCount} Crew</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Zero payout applied</div>
        </div>

        <div className="bg-[#0E1424] p-5 rounded-3xl border border-cyan-400/30">
          <div className="text-xs text-cyan-300 font-bold uppercase tracking-wider">
            {diffDays === 1 ? 'Total Wage Payout Today' : `Payout in ${diffDays}-Day Range`}
          </div>
          <div className="text-2xl font-extrabold text-white mt-1 font-mono-numbers">
            ₹{(diffDays === 1 ? totalWagesToPayToday : totalEstimatedRangePayout).toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-emerald-400 font-medium mt-0.5">
            Auto-linked to Site Labor Ledger
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-[#0E1424] rounded-3xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-[#090D16] flex items-center justify-between">
          <div className="text-xs text-slate-300">
            Showing <strong className="text-white">{filteredWorkers.length}</strong> registered site workers on muster
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {startDate} to {endDate}
          </span>
        </div>

        {filteredWorkers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users2 className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-slate-300">Muster Roll is Currently Empty</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Ready to receive your workforce details. Click "+ Add Worker" above to add labour muster records.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-[#070B14] text-slate-400 font-semibold">
                  <th className="p-4">Worker Name</th>
                  <th className="p-4">Trade & Role</th>
                  <th className="p-4">Assigned Site</th>
                  <th className="p-4 text-right font-mono">Daily Wage (₹)</th>
                  <th className="p-4 text-center">Muster Status</th>
                  <th className="p-4 text-right font-mono text-cyan-300">Net Payable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {filteredWorkers.map((w) => (
                  <tr key={w.id} className="hover:bg-white/[0.02] transition">
                    <td className="p-4 font-bold text-white">
                      <div>{w.name}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{w.mobile}</div>
                    </td>
                    <td className="p-4 text-slate-300">{w.role}</td>
                    <td className="p-4 text-slate-300">{w.assignedSite}</td>
                    <td className="p-4 text-right font-mono text-slate-300">₹{w.dailyWage}</td>
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-[#090D16] border border-white/10">
                        <button
                          onClick={() => handleToggleStatus(w.id, 'P')}
                          className={`w-7 h-7 rounded-xl font-bold font-mono transition cursor-pointer ${
                            w.status === 'P'
                              ? 'bg-emerald-500 text-slate-950 font-black'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          P
                        </button>
                        <button
                          onClick={() => handleToggleStatus(w.id, 'H')}
                          className={`w-7 h-7 rounded-xl font-bold font-mono transition cursor-pointer ${
                            w.status === 'H'
                              ? 'bg-amber-400 text-slate-950 font-black'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          H
                        </button>
                        <button
                          onClick={() => handleToggleStatus(w.id, 'A')}
                          className={`w-7 h-7 rounded-xl font-bold font-mono transition cursor-pointer ${
                            w.status === 'A'
                              ? 'bg-rose-500 text-white font-black'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          A
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-white">
                      ₹{w.toPayToday.toLocaleString()}
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#090D16] border border-white/10 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Add Worker to Muster</h3>
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
                <label className="text-slate-400 block mb-1">Worker Name *</label>
                <input
                  type="text"
                  value={newWorkerName}
                  onChange={(e) => setNewWorkerName(e.target.value)}
                  placeholder="e.g. M. Rajesh"
                  className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Role / Trade</label>
                  <select
                    value={newWorkerRole}
                    onChange={(e) => setNewWorkerRole(e.target.value)}
                    className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="Mason">Mason</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Bar Bender">Bar Bender</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Painter">Painter</option>
                    <option value="General Labour">General Labour</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Daily Wage (₹)</label>
                  <input
                    type="number"
                    value={newWorkerWage === 0 ? '' : newWorkerWage}
                    placeholder="0"
                    onChange={(e) => setNewWorkerWage(e.target.value === '' ? 0 : Number(e.target.value))}
                    className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Assigned Site</label>
                <input
                  type="text"
                  value={newWorkerSite}
                  onChange={(e) => setNewWorkerSite(e.target.value)}
                  placeholder="e.g. Skyline Luxury Villa - Site A"
                  className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
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
                onClick={handleAddWorker}
                disabled={!newWorkerName.trim()}
                className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 font-bold text-slate-950 transition cursor-pointer disabled:opacity-50"
              >
                Save Worker
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
