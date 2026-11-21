import React, { useState } from 'react';
import { ExternalLink, CheckCircle2, ZoomIn, Layers } from 'lucide-react';

export const ReferenceGalleryView: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const references = [
    {
      id: 1,
      title: 'Compreo Business Systems — Project Cost Dashboard (WBS)',
      file: '/references/WhatsApp Image 2026-11-19 at 3.15.09 PM.jpeg',
      role: 'Executive Cost Control & WBS Variance Engine',
      description: 'Used for: Total Project Value, Budget Spent, Cost Variance, CPI, WBS Level budget vs actual table with variance percentages, Cost by Type donut chart, and S-Curve.',
    },
    {
      id: 2,
      title: 'Nexgile ConstructIQ — Multi-Project Portfolio Management',
      file: '/references/WhatsApp Image 2026-11-19 at 3.15.21 PM.jpeg',
      role: 'Portfolio Command Center & Project Grid',
      description: 'Used for: Grid/List views, Total Budget status cards, Project Manager badges, Team size, Days left countdown, and status pills.',
    },
    {
      id: 3,
      title: 'BQE Core — Financial Health & Comparative Analytics',
      file: '/references/WhatsApp Image 2026-11-19 at 3.15.36 PM.jpeg',
      role: 'Financial Accounting & Balance Sheet Comparative',
      description: 'Used for: Income & Expenses comparative breakdowns, Balance sheet assets vs liabilities comparative bars, and Aged Receivables/Payables tracking.',
    },
    {
      id: 4,
      title: 'Mobile Site Engineer Operations & Labour Muster',
      file: '/references/WhatsApp Image 2026-11-19 at 3.15.43 PM.jpeg',
      role: 'Native Site Engineer Mobile App Simulator',
      description: 'Used for: Interactive 3-screen mobile experience (Site Plan Tasks, Daily Progress Report, and Add Attendance with P/A/H toggle and live wage payout calculator).',
    },
    {
      id: 5,
      title: 'Project Dashboard — Customer Transparency Portal',
      file: '/references/WhatsApp Image 2026-11-19 at 3.15.49 PM.jpeg',
      role: 'Customer Portal & Milestone Escrow Tracking',
      description: 'Used for: Client view with Budget, Paid, Remaining, 68% progress bar, live site photo gallery, and 100% Escrow Protection badge.',
    },
    {
      id: 6,
      title: 'Intuit Enterprise Suite — Construction ERP Overview',
      file: '/references/WhatsApp Image 2026-11-19 at 3.16.12 PM.jpeg',
      role: 'Enterprise Operations & Quick Create Action Hub',
      description: 'Used for: Quick action pills (Accounting, Expenses, Sales, Customer Hub, Marketing, Payroll), Project Profit Margin %, and Operating Cash Flow meters.',
    },
    {
      id: 7,
      title: 'Mastt — Single Project Command Center & Milestones',
      file: '/references/WhatsApp Image 2026-11-19 at 3.16.20 PM.jpeg',
      role: 'Deep-Dive Project Inspection & Roadmap',
      description: 'Used for: Single project command center with 5-metric value banner (Budget, Committed, Variance, FFC/EAC, Total Paid), Milestone roadmap stages, and GIS coordinates.',
    },
    {
      id: 8,
      title: 'BuildAxis AI ERP — Predictive Site Analytics & Weather',
      file: '/references/WhatsApp Image 2026-11-19 at 3.16.26 PM.jpeg',
      role: 'AI Copilot, Live Weather, and Schedule Risk Alerts',
      description: 'Used for: Top morning greeting, Live weather conditions (29°C Partly Cloudy), AI Project Insights with success probability score, and critical issue alerts stream.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-[#141C2E] border border-cyan-400/40 text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">Reference Blueprints & Source Implementations</h1>
              <p className="text-xs text-slate-400">
                All 8 reference screenshots provided in your ZIP archive, unified into VT BuildOS's clean dark theme
              </p>
            </div>
          </div>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-[#102422] border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 self-start md:self-auto">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>8 of 8 References Mapped</span>
        </span>
      </div>

      {/* Grid of 8 References - Solid Surfaces, Rounded-3xl */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {references.map((ref) => (
          <div
            key={ref.id}
            onClick={() => setSelectedImage(ref.file)}
            className="bg-[#0E1424] rounded-3xl border border-slate-800 overflow-hidden cursor-pointer flex flex-col justify-between hover:border-cyan-400/40 transition group"
          >
            <div>
              <div className="h-44 w-full bg-slate-900 relative overflow-hidden">
                <img
                  src={ref.file}
                  alt={ref.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-xl bg-black/80 text-[10px] font-mono text-cyan-300 border border-cyan-400/40">
                  Ref #{ref.id}
                </span>
                <span className="absolute bottom-3 right-3 p-1.5 rounded-xl bg-black/70 text-slate-300 group-hover:text-cyan-400 transition">
                  <ZoomIn className="w-4 h-4" />
                </span>
              </div>

              <div className="p-4 space-y-2">
                <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  {ref.role}
                </div>
                <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition line-clamp-1">
                  {ref.title}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                  {ref.description}
                </p>
              </div>
            </div>

            <div className="p-3.5 border-t border-slate-800 bg-[#090D16] flex items-center justify-between text-[11px] text-slate-400">
              <span className="text-emerald-400 font-semibold">● Implemented</span>
              <span className="text-cyan-400 group-hover:underline flex items-center gap-1 font-medium">
                <span>View Full Size</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden border border-slate-700 shadow-2xl relative">
            <img src={selectedImage} alt="Reference Full View" className="w-full h-full object-contain" />
            <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-xs font-mono">
              Click anywhere to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
