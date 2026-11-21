import React from 'react';
import {
  X,
  Building,
  UserPlus,
  Receipt,
  Calculator,
  ShoppingCart,
  Users,
  HardHat,
  Boxes,
} from 'lucide-react';

interface QuickCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (actionId: string) => void;
}

export const QuickCreateModal: React.FC<QuickCreateModalProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  if (!isOpen) return null;

  const actions = [
    { id: 'projects', label: 'Create New Construction Project', desc: 'Initialize WBS, client contract, site location and budget', icon: Building, color: 'text-cyan-400' },
    { id: 'workforce', label: 'Add Worker / Mark Attendance', desc: 'Update daily muster roll and calculate wage disbursements', icon: Users, color: 'text-emerald-400' },
    { id: 'boq', label: 'Create BOQ Estimate & Quotation', desc: 'Calculate parametric cement, steel, sand & labour rates', icon: Calculator, color: 'text-purple-400' },
    { id: 'procurement', label: 'Create Purchase Requisition / PO', desc: 'Send multi-vendor RFQ for steel, cement or brick delivery', icon: ShoppingCart, color: 'text-amber-400' },
    { id: 'inventory', label: 'Record Stock Issue / Receipt', desc: 'Issue materials from central warehouse directly to site', icon: Boxes, color: 'text-cyan-300' },
    { id: 'finance', label: 'Post Double-Entry Journal Voucher', desc: 'Record milestone advance, wage payment, or vendor invoice', icon: Receipt, color: 'text-rose-400' },
    { id: 'siteops', label: 'Log Daily Site Progress via Voice AI', desc: 'Convert speech note to structured site activities', icon: HardHat, color: 'text-yellow-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#090D16] border border-white/10 rounded-3xl w-full max-w-xl p-6 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">Quick Action Center</h3>
            <p className="text-xs text-slate-400">Instantly initiate any construction operational workflow</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={() => {
                  onSelectAction(act.id);
                  onClose();
                }}
                className="p-3.5 rounded-2xl bg-[#0E1424] border border-white/5 hover:border-cyan-500/50 hover:bg-[#141C30] transition text-left cursor-pointer flex items-start gap-3 group"
              >
                <div className={`p-2 rounded-xl bg-[#070B14] border border-white/5 group-hover:scale-105 transition ${act.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {act.label}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                    {act.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-2 text-center text-[11px] text-slate-500">
          Tip: You can also press <kbd className="bg-slate-900 border border-white/10 text-slate-300 px-2 py-0.5 rounded-md font-mono">⌘K</kbd> anywhere to search or execute workflows.
        </div>
      </div>
    </div>
  );
};
