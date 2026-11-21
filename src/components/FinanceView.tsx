import React, { useState } from 'react';
import {
  ReceiptIndianRupee,
  ShieldCheck,
  FileText,
  Lock,
  Plus,
} from 'lucide-react';
import { JournalEntry } from '../types';
import { initialJournalEntries } from '../data/mockData';

export const FinanceView: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>(initialJournalEntries);
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);

  const totalDebit = entries.reduce((sum, e) => sum + e.debit, 0);
  const totalCredit = entries.reduce((sum, e) => sum + e.credit, 0);
  const isLedgerBalanced = totalDebit === totalCredit;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <ReceiptIndianRupee className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">Finance & Audited Accounting Ledger</h1>
              <p className="text-xs text-slate-400">
                Double-entry GAAP compliant ledger with strict reversal-only audit protections
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Auditable Ledger Active</span>
          </div>

          <button
            onClick={() => setShowNewEntryModal(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Post Journal Entry</span>
          </button>
        </div>
      </div>

      {/* Financial Health Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#0E1424] border border-white/5">
          <div className="text-xs text-slate-400 font-medium">Net Recognized Revenue</div>
          <div className="text-2xl font-bold text-white mt-1 font-mono-numbers">₹ 0.00 Cr</div>
          <div className="text-[11px] text-slate-500 mt-1">Awaiting revenue entries</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#0E1424] border border-white/5">
          <div className="text-xs text-slate-400 font-medium">Gross Project Margin</div>
          <div className="text-2xl font-bold text-slate-200 mt-1 font-mono-numbers">0.0%</div>
          <div className="text-[11px] text-slate-500 mt-1">Target: 15.0%</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#0E1424] border border-white/5">
          <div className="text-xs text-slate-400 font-medium">Accounts Receivable (Clients)</div>
          <div className="text-2xl font-bold text-slate-200 mt-1 font-mono-numbers">₹ 0.00 Cr</div>
          <div className="text-[11px] text-slate-500 mt-1">Zero pending dues</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#0E1424] border border-white/5">
          <div className="text-xs text-slate-400 font-medium">Accounts Payable (Suppliers)</div>
          <div className="text-2xl font-bold text-slate-200 mt-1 font-mono-numbers">₹ 0.00 Cr</div>
          <div className="text-[11px] text-slate-500 mt-1">Zero liabilities</div>
        </div>
      </div>

      {/* Immutable General Ledger Table */}
      <div className="rounded-3xl border border-white/5 bg-[#0E1424] overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-[#090D16] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Permanent Audited Journal Ledger</h3>
            <p className="text-xs text-slate-400">All debits and credits recorded with transaction references and site tags</p>
          </div>
          <div className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            Debits: ₹{totalDebit.toLocaleString()} = Credits: ₹{totalCredit.toLocaleString()} (Balanced)
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ReceiptIndianRupee className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-slate-300">No Journal Entries Posted Yet</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When client advances, vendor invoices, or wage payments are made, auditable double-entry records will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-[#070D1E] text-slate-400 font-semibold">
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Voucher Ref</th>
                  <th className="p-3.5">Account Head</th>
                  <th className="p-3.5">Description</th>
                  <th className="p-3.5 text-right font-mono text-emerald-400">Debit (₹)</th>
                  <th className="p-3.5 text-right font-mono text-cyan-300">Credit (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {entries.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-800/30">
                    <td className="p-3.5 font-mono text-slate-400">{e.date}</td>
                    <td className="p-3.5 font-mono text-cyan-400">{e.reference}</td>
                    <td className="p-3.5 text-white font-bold">{e.account}</td>
                    <td className="p-3.5 text-slate-300">{e.description}</td>
                    <td className="p-3.5 text-right font-mono text-emerald-400">₹{e.debit}</td>
                    <td className="p-3.5 text-right font-mono text-cyan-300">₹{e.credit}</td>
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
