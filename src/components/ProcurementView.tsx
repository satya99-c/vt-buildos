import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileCheck,
  Building2,
  Filter,
  X,
  PackagePlus,
} from 'lucide-react';
import { PurchaseOrder } from '../types';
import { initialPurchaseOrders } from '../data/mockData';

interface ProcurementViewProps {
  autoOpenCreateModal?: boolean;
  onModalConsumed?: () => void;
}

export const ProcurementView: React.FC<ProcurementViewProps> = ({
  autoOpenCreateModal,
  onModalConsumed,
}) => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const [showPoModal, setShowPoModal] = useState(false);

  React.useEffect(() => {
    if (autoOpenCreateModal) {
      setShowPoModal(true);
      if (onModalConsumed) onModalConsumed();
    }
  }, [autoOpenCreateModal]);

  // Form states
  const [supplierName, setSupplierName] = useState('');
  const [itemName, setItemName] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [poStatus, setPoStatus] = useState<PurchaseOrder['status']>('Pending Approval');

  const handleCreatePo = () => {
    if (!supplierName.trim() || !itemName.trim()) return;

    const newPo: PurchaseOrder = {
      id: 'po-' + Date.now().toString().slice(-4),
      poNumber: `PO-2026-${(purchaseOrders.length + 101).toString()}`,
      supplier: supplierName.trim(),
      item: itemName.trim(),
      amount: Number(amount) || 0,
      status: poStatus,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    setPurchaseOrders([newPo, ...purchaseOrders]);
    setSupplierName('');
    setItemName('');
    setAmount(0);
    setPoStatus('Pending Approval');
    setShowPoModal(false);
  };

  const workflowSteps = [
    '1. Site Request',
    '2. Manager Approval',
    '3. Supplier Quotation',
    '4. Purchase Order',
    '5. Site Delivery',
    '6. Stock Entry',
    '7. Tax Invoice',
    '8. Bank Payment',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-2xl bg-[#0E1424] border border-cyan-400/40 text-cyan-400">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">Procurement & Supplier Management</h1>
              <p className="text-xs text-slate-400">
                End-to-end 8-stage automated pipeline from site request to supplier payment
              </p>
            </div>
          </div>
        </div>

        {/* Modal open button (Issue Fixed) */}
        <button
          onClick={() => setShowPoModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create Purchase Requisition</span>
        </button>
      </div>

      {/* 8-Stage Workflow Bar */}
      <div className="p-5 rounded-3xl bg-[#0E1424] border border-white/5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Procurement Workflow Stages (Section 2.E)
          </span>
          <span className="text-xs text-slate-400 font-mono">Pipeline Ready</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {workflowSteps.map((step, idx) => (
            <div
              key={idx}
              onClick={() => setActiveWorkflowStep(idx)}
              className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                activeWorkflowStep === idx
                  ? 'bg-[#141C30] border-cyan-400/50 text-cyan-300'
                  : 'bg-[#090D16] border-white/5 text-slate-400 hover:border-cyan-500/50'
              }`}
            >
              <div className="text-[10px] font-mono font-bold text-cyan-400">STAGE {idx + 1}</div>
              <div className="text-xs font-bold mt-0.5 truncate text-slate-200">{step.split('. ')[1]}</div>
              <div className="mt-1 text-[9px] font-mono text-slate-500">Ready</div>
            </div>
          ))}
        </div>
      </div>

      {/* Purchase Orders Table */}
      <div className="rounded-3xl border border-white/5 bg-[#0E1424] overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-[#090D16] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Purchase Orders</h3>
          <span className="text-xs text-slate-400 font-mono">{purchaseOrders.length} Orders</span>
        </div>

        {purchaseOrders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShoppingCart className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-slate-300">No Purchase Orders Created Yet</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Once you provide supplier quotations or create purchase requisitions, POs with status tracking and delivery schedules will appear here. Click "+ Create Purchase Requisition" to add.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-[#090D16] text-slate-400 font-semibold">
                  <th className="p-4">PO Number</th>
                  <th className="p-4">Supplier Name</th>
                  <th className="p-4">Item Description</th>
                  <th className="p-4 text-right font-mono">Amount</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {purchaseOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-white/[0.02] transition">
                    <td className="p-4 font-mono text-cyan-400 font-bold">{po.poNumber}</td>
                    <td className="p-4 text-slate-200">{po.supplier}</td>
                    <td className="p-4 text-slate-300">{po.item}</td>
                    <td className="p-4 text-right font-mono text-white">₹{po.amount.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                        {po.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Purchase Requisition Modal (Issue Fixed) */}
      {showPoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#090D16] border border-white/10 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <PackagePlus className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Create Purchase Requisition / PO</h3>
              </div>
              <button
                onClick={() => setShowPoModal(false)}
                className="p-1.5 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Supplier / Vendor Name *</label>
                <input
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="e.g. UltraTech Cement Corp / Tata Steel Ltd"
                  className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Material / Line Item Description *</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. 500 Bags UltraTech PPC 53 Grade Cement"
                  className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Requisition Amount (₹)</label>
                  <input
                    type="number"
                    value={amount === 0 ? '' : amount}
                    placeholder="0"
                    onChange={(e) => setAmount(e.target.value === '' ? 0 : Number(e.target.value))}
                    className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Initial Status</label>
                  <select
                    value={poStatus}
                    onChange={(e) => setPoStatus(e.target.value as any)}
                    className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Approved">Approved</option>
                    <option value="Ordered">Ordered (PO Dispatched)</option>
                    <option value="Delivered">Delivered On-Site</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/5 text-xs">
              <button
                onClick={() => setShowPoModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePo}
                disabled={!supplierName.trim() || !itemName.trim()}
                className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 font-bold text-slate-950 transition cursor-pointer disabled:opacity-50"
              >
                Issue Purchase Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
