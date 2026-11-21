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
} from 'lucide-react';
import { PurchaseOrder } from '../types';
import { initialPurchaseOrders } from '../data/mockData';

export const ProcurementView: React.FC = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

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
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
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

        <button
          onClick={() => alert('New Purchase Requisition form opened!')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Create Purchase Requisition</span>
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
              className="p-3 rounded-2xl border text-center transition cursor-pointer bg-[#090D16] border-white/5 text-slate-400 hover:border-cyan-500/50"
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
              Once you provide supplier quotations or create purchase requisitions, POs with status tracking and delivery schedules will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-[#090D16] text-slate-400 font-semibold">
                  <th className="p-4">PO Number</th>
                  <th className="p-4">Supplier Name</th>
                  <th className="p-4">Item</th>
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
                    <td className="p-4 text-right font-mono text-white">₹{po.amount}</td>
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-[10px] bg-slate-800 text-slate-300 border border-white/5">
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
    </div>
  );
};
