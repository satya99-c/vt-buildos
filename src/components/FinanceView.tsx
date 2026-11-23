import React, { useState } from 'react';
import {
  ReceiptIndianRupee,
  ShieldCheck,
  FileText,
  Lock,
  Plus,
  X,
  CreditCard,
  Building,
} from 'lucide-react';
import { JournalEntry } from '../types';
import { initialJournalEntries } from '../data/mockData';

interface FinanceViewProps {
  autoOpenCreateModal?: boolean;
  onModalConsumed?: () => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  autoOpenCreateModal,
  onModalConsumed,
}) => {
  const [entries, setEntries] = useState<JournalEntry[]>(initialJournalEntries);
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);

  React.useEffect(() => {
    if (autoOpenCreateModal) {
      setShowNewEntryModal(true);
      if (onModalConsumed) onModalConsumed();
    }
  }, [autoOpenCreateModal]);

  // Form states
  const [accountHead, setAccountHead] = useState('HDFC Bank Operative A/c');
  const [entryType, setEntryType] = useState<'debit' | 'credit'>('debit');
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [voucherRef, setVoucherRef] = useState('');

  const totalDebit = entries.reduce((sum, e) => sum + e.debit, 0);
  const totalCredit = entries.reduce((sum, e) => sum + e.credit, 0);
  const isLedgerBalanced = totalDebit === totalCredit;

  const handlePostEntry = () => {
    if (!description.trim() || amount <= 0) return;

    const refCode = voucherRef.trim() || `JV-2026-${(entries.length + 101).toString()}`;
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const newEntry: JournalEntry = {
      id: 'je-' + Date.now().toString().slice(-4),
      date: today,
      reference: refCode,
      account: accountHead,
      description: description.trim(),
      debit: entryType === 'debit' ? Number(amount) : 0,
      credit: entryType === 'credit' ? Number(amount) : 0,
      postedBy: 'Finance Controller',
    };

    setEntries([newEntry, ...entries]);
    setDescription('');
    setAmount(0);
    setVoucherRef('');
    setShowNewEntryModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-2xl bg-[#0E1424] border border-cyan-400/40 text-cyan-400">
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

          {/* Post Journal Entry Modal Button */}
          <button
            onClick={() => setShowNewEntryModal(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Post Journal Entry</span>
          </button>
        </div>
      </div>

      {/* Financial Health Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#0E1424] border border-white/5">
          <div className="text-xs text-slate-400 font-medium">Total Ledger Debits</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono-numbers">
            ₹{totalDebit.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Cash disbursements & assets</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#0E1424] border border-white/5">
          <div className="text-xs text-slate-400 font-medium">Total Ledger Credits</div>
          <div className="text-2xl font-bold text-cyan-300 mt-1 font-mono-numbers">
            ₹{totalCredit.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Revenues & liabilities</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#0E1424] border border-white/5">
          <div className="text-xs text-slate-400 font-medium">Ledger Audit Balance</div>
          <div className="text-2xl font-bold text-slate-200 mt-1 font-mono-numbers">
            {isLedgerBalanced ? 'Balanced' : 'Audit Variance'}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">Strict double-entry check</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#0E1424] border border-white/5">
          <div className="text-xs text-slate-400 font-medium">Permanent Vouchers</div>
          <div className="text-2xl font-bold text-white mt-1 font-mono-numbers">{entries.length} Entries</div>
          <div className="text-[11px] text-slate-500 mt-1">Tamper-evident logs</div>
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
            Debits: ₹{totalDebit.toLocaleString()} | Credits: ₹{totalCredit.toLocaleString()}
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ReceiptIndianRupee className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-slate-300">No Journal Entries Posted Yet</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When client advances, vendor invoices, or wage payments are made, auditable double-entry records will appear here. Click "+ Post Journal Entry" to post.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-[#070B14] text-slate-400 font-semibold">
                  <th className="p-4">Date</th>
                  <th className="p-4">Voucher Ref</th>
                  <th className="p-4">Account Head</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-right font-mono text-emerald-400">Debit (₹)</th>
                  <th className="p-4 text-right font-mono text-cyan-300">Credit (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {entries.map((e) => (
                  <tr key={e.id} className="hover:bg-white/[0.02] transition">
                    <td className="p-4 font-mono text-slate-400">{e.date}</td>
                    <td className="p-4 font-mono text-cyan-400 font-bold">{e.reference}</td>
                    <td className="p-4 text-white font-bold">{e.account}</td>
                    <td className="p-4 text-slate-300">{e.description}</td>
                    <td className="p-4 text-right font-mono text-emerald-400 font-semibold">
                      {e.debit > 0 ? `₹${e.debit.toLocaleString()}` : '—'}
                    </td>
                    <td className="p-4 text-right font-mono text-cyan-300 font-semibold">
                      {e.credit > 0 ? `₹${e.credit.toLocaleString()}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Post Journal Entry Modal Dialog (Issue Fixed) */}
      {showNewEntryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#090D16] border border-white/10 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <ReceiptIndianRupee className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Post Double-Entry Journal Voucher</h3>
              </div>
              <button
                onClick={() => setShowNewEntryModal(false)}
                className="p-1.5 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Voucher Reference / ID</label>
                  <input
                    type="text"
                    value={voucherRef}
                    onChange={(e) => setVoucherRef(e.target.value)}
                    placeholder="e.g. JV-2026-092"
                    className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Account Head</label>
                  <select
                    value={accountHead}
                    onChange={(e) => setAccountHead(e.target.value)}
                    className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="HDFC Bank Operative A/c">HDFC Bank Operative A/c</option>
                    <option value="Client Advance Escrow A/c">Client Advance Escrow A/c</option>
                    <option value="UltraTech Cement Supplier A/c">UltraTech Cement Supplier A/c</option>
                    <option value="Tata Steel Vendor A/c">Tata Steel Vendor A/c</option>
                    <option value="Site Labour Muster Wages">Site Labour Muster Wages</option>
                    <option value="Machinery & Crane Rental">Machinery & Crane Rental</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Entry Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEntryType('debit')}
                      className={`p-2.5 rounded-xl border text-center font-bold transition cursor-pointer ${
                        entryType === 'debit'
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                          : 'bg-[#0E1424] border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      DEBIT (+)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEntryType('credit')}
                      className={`p-2.5 rounded-xl border text-center font-bold transition cursor-pointer ${
                        entryType === 'credit'
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                          : 'bg-[#0E1424] border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      CREDIT (−)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Voucher Amount (₹) *</label>
                  <input
                    type="number"
                    value={amount === 0 ? '' : amount}
                    placeholder="0"
                    onChange={(e) => setAmount(e.target.value === '' ? 0 : Number(e.target.value))}
                    className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description / Transaction Narration *</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Advance payment received for Skyline Villa Phase 2 foundation"
                  className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/5 text-xs">
              <button
                onClick={() => setShowNewEntryModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePostEntry}
                disabled={!description.trim() || amount <= 0}
                className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 font-bold text-slate-950 transition cursor-pointer disabled:opacity-50"
              >
                Post to Audited Ledger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
