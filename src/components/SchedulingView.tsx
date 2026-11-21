import React from 'react';
import { CalendarDays } from 'lucide-react';

export const SchedulingView: React.FC = () => {
  const scheduleData: any[] = [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-[#141C2E] border border-cyan-400/40 text-cyan-400">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">Project Scheduling & Milestone Timeline</h1>
              <p className="text-xs text-slate-400">
                Critical path method (CPM) scheduling, dependency tracking, and weather-adjusted delay predictions
              </p>
            </div>
          </div>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-[#141C2E] border border-cyan-400/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 self-start md:self-auto">
          <span>AI Delay Predictor Active</span>
        </span>
      </div>

      {/* Critical Path Milestone Tracker */}
      <div className="bg-[#0E1424] p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Critical Path Milestone Tracker</h3>
          <span className="text-xs text-slate-400 font-mono">Baseline Schedule</span>
        </div>

        {scheduleData.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <CalendarDays className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-slate-300">No Milestones Scheduled Yet</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Once you add projects and target dates, the critical path Gantt bars will render here dynamically.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {scheduleData.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-[#111726] border border-slate-800 space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="text-[10px] text-cyan-400 font-mono font-bold mr-2">{item.project}</span>
                    <span className="font-bold text-white">{item.task}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
