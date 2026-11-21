import React, { useState } from 'react';
import {
  HardHat,
  Sparkles,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { sampleDailyTasks } from '../data/mockData';

export const SiteOperationsView: React.FC = () => {
  const [tasks, setTasks] = useState(sampleDailyTasks);
  const [voiceInput, setVoiceInput] = useState('');
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [structuredReport, setStructuredReport] = useState<any | null>(null);
  const [engineerApproved, setEngineerApproved] = useState(false);

  const handleProcessVoiceNote = () => {
    if (!voiceInput.trim()) return;
    setIsProcessingVoice(true);
    setTimeout(() => {
      setStructuredReport({
        timestamp: 'Just now',
        activitiesLogged: [
          { work: voiceInput.slice(0, 50) + '...', status: 'Logged', autoDeductInventory: true },
        ],
        automatedMaterialRequisition: [
          { material: 'Materials specified in voice note', quantity: 'As recorded', urgent: true },
        ],
      });
      setIsProcessingVoice(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-[#141C2E] border border-cyan-400/40 text-cyan-400">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">Daily Site Operations & Voice AI Reporting</h1>
              <p className="text-xs text-slate-400">
                Site execution tracking, task checklists, and AI voice-to-structured-report parser
              </p>
            </div>
          </div>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-[#141C2E] border border-cyan-400/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 self-start md:self-auto">
          <span>Ready for Daily Site Logging</span>
        </span>
      </div>

      {/* AI Voice Reporting Interactive Showcase (Section 11) - Solid Surface, No Gradient, Rounded-3xl */}
      <div className="bg-[#0E1424] p-6 rounded-3xl border border-cyan-400/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-[#141C2E] text-cyan-300 border border-cyan-400/40">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                AI Site Voice-to-Report Converter (Section 11 Feature)
              </h3>
              <p className="text-xs text-slate-400">
                Type or speak an engineer note (e.g. "Completed first floor brickwork and used 400 bricks...")
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-[#141C2E] text-cyan-300 border border-cyan-400/30 px-3 py-1 rounded-full font-mono">
            AI Engine Standby
          </span>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={voiceInput}
              onChange={(e) => setVoiceInput(e.target.value)}
              className="w-full bg-[#111726] border border-slate-700/80 rounded-2xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-medium"
              placeholder="Record or type site engineer updates (e.g., 'Completed second floor column casting, used 15 cum concrete, need cement tomorrow')..."
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span>● AI automatically extracts Tasks Completed and Material Requisitions.</span>
            </div>

            <button
              onClick={handleProcessVoiceNote}
              disabled={isProcessingVoice || !voiceInput.trim()}
              className="px-5 py-2.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition cursor-pointer disabled:opacity-50 shadow-sm"
            >
              {isProcessingVoice ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Parsing Voice Note...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Convert into Structured Report</span>
                </>
              )}
            </button>
          </div>

          {structuredReport && (
            <div className="mt-4 p-4 rounded-2xl bg-[#090D16] border border-cyan-400/40 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white">Parsed Structured Daily Report</span>
                </div>
              </div>

              <div className="p-3 bg-[#111726] rounded-2xl border border-slate-800 text-slate-300">
                {structuredReport.activitiesLogged.map((act: any, i: number) => (
                  <div key={i} className="text-[11px]">• {act.work}</div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                  <input
                    type="checkbox"
                    checked={engineerApproved}
                    onChange={(e) => setEngineerApproved(e.target.checked)}
                    className="w-4 h-4 rounded-md accent-cyan-500"
                  />
                  <span>I confirm and verify this report (Mandatory Sign-off)</span>
                </label>

                <button
                  disabled={!engineerApproved}
                  onClick={() => {
                    alert('Daily report approved and logged!');
                    setStructuredReport(null);
                    setVoiceInput('');
                    setEngineerApproved(false);
                  }}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${
                    engineerApproved ? 'bg-emerald-500 text-slate-950 cursor-pointer' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  Post to Approved Ledger
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Daily Tasks Table */}
      <div className="bg-[#0E1424] rounded-3xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-[#111726] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Active Site Tasks</h3>
          <span className="text-xs text-slate-400 font-mono">{tasks.length} Tasks</span>
        </div>

        {tasks.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <HardHat className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-slate-300">No Site Tasks Scheduled Yet</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Ready to log site tasks, milestones, and daily progress.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-[#090D16] text-slate-400 font-semibold">
                  <th className="p-3.5">Task Description</th>
                  <th className="p-3.5">Site Name</th>
                  <th className="p-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {tasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/20">
                    <td className="p-3.5 text-white font-bold">{t.title}</td>
                    <td className="p-3.5 text-slate-300">{t.site}</td>
                    <td className="p-3.5 text-center">{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
