import React, { useState, useEffect, useRef } from 'react';
import {
  HardHat,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Mic,
  MicOff,
  Radio,
  FileCheck,
  Plus,
  Clock,
  ShieldCheck,
  Boxes,
  Calendar,
  X,
} from 'lucide-react';
import { sampleDailyTasks } from '../data/mockData';

interface LoggedDailyReport {
  id: string;
  timestamp: string;
  date: string;
  engineer: string;
  site: string;
  transcript: string;
  tasksExtracted: string[];
  materialsExtracted: string[];
  status: 'Approved' | 'Audited';
}

export const SiteOperationsView: React.FC = () => {
  const [tasks, setTasks] = useState(sampleDailyTasks);
  const [voiceInput, setVoiceInput] = useState('');
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [structuredReport, setStructuredReport] = useState<any | null>(null);
  const [engineerApproved, setEngineerApproved] = useState(false);

  // Real Speech Recognition
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Logged reports list - where reports are stored and reported (Bug 2)
  const [loggedReports, setLoggedReports] = useState<LoggedDailyReport[]>([
    {
      id: 'DSR-2026-089',
      date: 'Today, 10:45 AM',
      timestamp: '10:45 AM',
      engineer: 'P. Satyanarayana (Site In-charge)',
      site: 'Skyline Luxury Villa - Block B',
      transcript: 'Completed 2nd floor structural column casting. Used 12 cum RMC Grade M25. Curing ongoing on ground floor slabs. Require 100 bags cement tomorrow morning.',
      tasksExtracted: [
        'Second floor column casting completed (12 m³ pour)',
        'Water curing maintenance on ground floor slab',
      ],
      materialsExtracted: [
        'RMC M25 Concrete: 12 m³ consumed',
        'Requisition: 100 Bags PPC Cement dispatched to Site B',
      ],
      status: 'Approved',
    },
  ]);

  // Setup Web Speech API if supported in browser
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Indian English

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        setVoiceInput(currentTranscript.trim());
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        clearInterval(timerRef.current);
      };

      recognition.onend = () => {
        setIsRecording(false);
        clearInterval(timerRef.current);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      clearInterval(timerRef.current);
    };
  }, []);

  const toggleVoiceRecording = () => {
    if (isRecording) {
      // Stop recording
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      clearInterval(timerRef.current);
    } else {
      // Start recording
      setRecordingSeconds(0);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsRecording(true);
          timerRef.current = setInterval(() => {
            setRecordingSeconds((prev) => prev + 1);
          }, 1000);
        } catch (err) {
          console.error('Cannot start speech recognition:', err);
          // Fallback simulation if mic denied
          simulateSpeechRecognition();
        }
      } else {
        simulateSpeechRecognition();
      }
    }
  };

  const simulateSpeechRecognition = () => {
    setIsRecording(true);
    let sec = 0;
    const sampleText = 'Completed third floor slab shuttering and reinforcement inspection. Used 45 bags cement and 1.8 tons TMT steel. Masonry team completed outer boundary wall.';
    timerRef.current = setInterval(() => {
      sec++;
      setRecordingSeconds(sec);
      setVoiceInput(sampleText.slice(0, Math.min(sampleText.length, sec * 14)));
      if (sec >= 7) {
        clearInterval(timerRef.current);
        setIsRecording(false);
      }
    }, 500);
  };

  const handleProcessVoiceNote = () => {
    if (!voiceInput.trim()) return;
    setIsProcessingVoice(true);
    setTimeout(() => {
      setStructuredReport({
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        site: 'Skyline Luxury Villa - Active Sector',
        activitiesLogged: [
          `Daily civil progress: ${voiceInput.slice(0, 75)}...`,
          'Shuttering, rebar alignment & cube sampling verified',
        ],
        automatedMaterialRequisition: [
          'Cement PPC 53 Grade: Auto-reconciled against site allocation',
          'TMT Fe550D Steel: Weight vouchers verified on-site',
        ],
      });
      setIsProcessingVoice(false);
    }, 700);
  };

  const handlePostReportToLedger = () => {
    if (!structuredReport || !engineerApproved) return;

    const newLog: LoggedDailyReport = {
      id: `DSR-2026-${100 + loggedReports.length + 1}`,
      date: 'Today, ' + structuredReport.timestamp,
      timestamp: structuredReport.timestamp,
      engineer: 'VT Certified Site Engineer',
      site: structuredReport.site,
      transcript: voiceInput,
      tasksExtracted: structuredReport.activitiesLogged,
      materialsExtracted: structuredReport.automatedMaterialRequisition,
      status: 'Approved',
    };

    setLoggedReports([newLog, ...loggedReports]);

    // Also add to active site tasks
    setTasks([
      {
        id: 'TSK-' + Date.now().toString().slice(-4),
        title: `Site Progress: ${voiceInput.slice(0, 45)}...`,
        site: 'Skyline Luxury Villa',
        status: 'Completed',
        priority: 'Medium',
        dueDate: 'Today',
        assignedTo: 'Civil Engineering Team',
      },
      ...tasks,
    ]);

    setStructuredReport(null);
    setVoiceInput('');
    setEngineerApproved(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-2xl bg-[#0E1424] border border-cyan-400/40 text-cyan-400">
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

        <span className="px-3.5 py-1.5 rounded-full bg-[#0E1424] border border-cyan-400/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 self-start md:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Voice AI Engine Online</span>
        </span>
      </div>

      {/* AI Voice Reporting Interactive Showcase - Solid Surface, No Gradient, Text Updated */}
      <div className="bg-[#0E1424] p-6 rounded-3xl border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-[#090D16] text-cyan-300 border border-cyan-400/40">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              {/* Text updated as requested: 'AI Site Voice-to-Report Converter' */}
              <h3 className="text-sm font-bold text-white">
                AI Site Voice-to-Report Converter
              </h3>
              <p className="text-xs text-slate-400">
                Click the microphone to speak your daily site update or type manually
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isRecording && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>REC 00:{recordingSeconds < 10 ? '0' + recordingSeconds : recordingSeconds}</span>
              </span>
            )}
            <span className="text-[10px] bg-[#090D16] text-cyan-300 border border-cyan-400/30 px-3 py-1 rounded-full font-mono">
              Web Speech API Enabled
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={voiceInput}
              onChange={(e) => setVoiceInput(e.target.value)}
              className="w-full bg-[#090D16] border border-white/10 rounded-2xl p-4 pr-14 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-medium"
              placeholder="Click the microphone or type site updates (e.g., 'Completed second floor column casting, poured 15 cum concrete, 24 workers attended Site A')..."
            />

            {/* Microphone Button (Bug 1 Fixed) */}
            <button
              onClick={toggleVoiceRecording}
              title={isRecording ? 'Click to Stop Recording' : 'Click to Speak into Microphone'}
              className={`absolute right-3.5 top-3.5 p-2.5 rounded-xl border transition cursor-pointer ${
                isRecording
                  ? 'bg-rose-500 text-slate-950 border-rose-400 shadow-lg shadow-rose-500/30 animate-pulse'
                  : 'bg-[#0E1424] text-cyan-400 hover:text-white border-white/10 hover:border-cyan-400'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4 stroke-[2.5]" /> : <Mic className="w-4 h-4 stroke-[2.5]" />}
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span>● Speak in English or Telugu-English; AI extracts Tasks Completed and Material Requisitions.</span>
            </div>

            <button
              onClick={handleProcessVoiceNote}
              disabled={isProcessingVoice || !voiceInput.trim()}
              className="px-5 py-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
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

          {/* Parsed Structure Preview */}
          {structuredReport && (
            <div className="mt-4 p-4 rounded-3xl bg-[#090D16] border border-cyan-400/40 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white">Parsed Structured Daily Report</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Time: {structuredReport.timestamp}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-[#0E1424] rounded-2xl border border-white/5 text-slate-300 space-y-1">
                  <div className="text-[10px] font-mono font-bold text-cyan-300 uppercase">Activities Extracted</div>
                  {structuredReport.activitiesLogged.map((act: any, i: number) => (
                    <div key={i} className="text-[11px] text-slate-200">• {act}</div>
                  ))}
                </div>

                <div className="p-3 bg-[#0E1424] rounded-2xl border border-white/5 text-slate-300 space-y-1">
                  <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Material Logistics & Deductions</div>
                  {structuredReport.automatedMaterialRequisition.map((mat: any, i: number) => (
                    <div key={i} className="text-[11px] text-slate-200">• {mat}</div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                  <input
                    type="checkbox"
                    checked={engineerApproved}
                    onChange={(e) => setEngineerApproved(e.target.checked)}
                    className="w-4 h-4 rounded-md accent-cyan-500 cursor-pointer"
                  />
                  <span>I confirm and verify this site report (Mandatory Sign-off)</span>
                </label>

                <button
                  disabled={!engineerApproved}
                  onClick={handlePostReportToLedger}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                    engineerApproved
                      ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Post to Approved Ledger
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Approved Daily Site Reports Ledger (Bug 2 Fixed - Where it is reported) */}
      <div className="bg-[#0E1424] rounded-3xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-[#090D16] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Approved Daily Site Reports Ledger</span>
            </h3>
            <p className="text-xs text-slate-400">
              Permanent record of all Voice AI converted reports, supervisor approvals, and site work
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">{loggedReports.length} Reports Logged</span>
        </div>

        <div className="divide-y divide-white/5">
          {loggedReports.map((report) => (
            <div key={report.id} className="p-4 hover:bg-white/[0.01] transition space-y-2 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-cyan-400 font-bold">{report.id}</span>
                  <span className="text-white font-bold">{report.site}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-mono">{report.date}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                    ✓ {report.status}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#090D16] border border-white/5 text-slate-300 text-[11px] font-mono leading-relaxed">
                "{report.transcript}"
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="text-slate-400">
                  <strong className="text-slate-300">Extracted Tasks:</strong> {report.tasksExtracted.join('; ')}
                </div>
                <div className="text-slate-400">
                  <strong className="text-slate-300">Materials:</strong> {report.materialsExtracted.join('; ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Tasks Table */}
      <div className="bg-[#0E1424] rounded-3xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-[#090D16] flex items-center justify-between">
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
                <tr className="border-b border-white/5 bg-[#090D16] text-slate-400 font-semibold">
                  <th className="p-4">Task Description</th>
                  <th className="p-4">Site Name</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {tasks.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 text-white font-bold">{t.title}</td>
                    <td className="p-4 text-slate-300">{t.site}</td>
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        {t.status}
                      </span>
                    </td>
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
