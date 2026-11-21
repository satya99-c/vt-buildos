import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  AlertTriangle,
  History,
  Building,
  Search,
  Filter,
  CheckCircle,
  X,
  Layers,
} from 'lucide-react';
import { InventoryItem } from '../types';
import { initialInventory } from '../data/mockData';

export const InventoryView: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMovementModal, setShowMovementModal] = useState(false);

  // New item modal
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCat, setNewItemCat] = useState<'Cement' | 'Steel' | 'Aggregates' | 'Masonry' | 'Electrical' | 'Plumbing' | 'Finishes'>('Cement');
  const [newItemUnit, setNewItemUnit] = useState('Bags');
  const [newItemStock, setNewItemStock] = useState(0);
  const [newItemRate, setNewItemRate] = useState(0);
  const [newItemMin, setNewItemMin] = useState(50);

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    const item: InventoryItem = {
      id: 'mat-' + Date.now(),
      name: newItemName,
      category: newItemCat,
      unit: newItemUnit,
      openingStock: Number(newItemStock),
      purchased: 0,
      issued: 0,
      closingStock: Number(newItemStock),
      minSafetyLevel: Number(newItemMin),
      unitRate: Number(newItemRate),
      lastUpdated: 'Just now',
    };
    setInventory((prev) => [...prev, item]);
    setNewItemName('');
    setShowAddItemModal(false);
  };

  const categories = ['All', 'Cement', 'Steel', 'Aggregates', 'Masonry', 'Electrical', 'Plumbing', 'Finishes'];

  const filteredItems = inventory.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalInventoryValuation = inventory.reduce(
    (acc, item) => acc + item.closingStock * item.unitRate,
    0
  );
  const lowStockCount = inventory.filter((i) => i.closingStock <= i.minSafetyLevel).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">Construction Inventory & Materials</h1>
              <p className="text-xs text-slate-400">
                Audited stock movements formula: <code>Opening + Purchased − Issued = Closing Stock</code>
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAddItemModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Add Material Item</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-[#0E1424] border border-white/5">
          <div className="text-xs text-slate-400 font-medium">Total Material Stock Valuation</div>
          <div className="text-2xl font-bold text-white mt-1 font-mono-numbers">
            ₹{(totalInventoryValuation / 10000000).toFixed(2)} Cr
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Live warehouse & site balances</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#0E1424] border border-white/5">
          <div className="text-xs text-slate-400 font-medium">Safety Stock Threshold Alerts</div>
          <div className="text-2xl font-bold text-slate-200 mt-1 font-mono-numbers">{lowStockCount} Items</div>
          <div className="text-[11px] text-slate-500 mt-1">Awaiting re-order quantity</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#0E1424] border border-white/5">
          <div className="text-xs text-slate-400 font-medium">Total Materials Registered</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1 font-mono-numbers">{inventory.length} Items</div>
          <div className="text-[11px] text-slate-500 mt-1">Ready for site dispatch</div>
        </div>
      </div>

      {/* Table / Empty State */}
      <div className="rounded-3xl border border-white/5 bg-[#0E1424] overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Boxes className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-slate-300">Inventory Catalog is Empty</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Ready to record your construction materials (Cement, Steel, Aggregates, Bricks, MEP). Click "+ Add Material Item" to add your opening stock.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-[#090D16] text-slate-400 font-semibold">
                  <th className="p-4">Material Description</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-right font-mono">Opening Stock</th>
                  <th className="p-4 text-right font-mono text-emerald-400">Purchased (+)</th>
                  <th className="p-4 text-right font-mono text-rose-400">Issued to Sites (−)</th>
                  <th className="p-4 text-right font-mono text-cyan-300 font-bold">Closing Stock</th>
                  <th className="p-4 text-right font-mono">Unit Rate</th>
                  <th className="p-4 text-center">Safety Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition">
                    <td className="p-4 font-bold text-white">
                      <div>{item.name}</div>
                      <div className="text-[10px] text-slate-500 font-normal">Unit: {item.unit}</div>
                    </td>
                    <td className="p-4 text-slate-300">{item.category}</td>
                    <td className="p-4 text-right font-mono text-slate-300">{item.openingStock}</td>
                    <td className="p-4 text-right font-mono text-emerald-400">+{item.purchased}</td>
                    <td className="p-4 text-right font-mono text-rose-400">−{item.issued}</td>
                    <td className="p-4 text-right font-mono text-cyan-300 font-bold">{item.closingStock}</td>
                    <td className="p-4 text-right font-mono text-slate-300">₹{item.unitRate}</td>
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-[10px] bg-slate-800/80 text-slate-300 border border-white/5">
                        Threshold: {item.minSafetyLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#090D16] border border-white/10 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-base font-bold text-white">Add New Material Item</h3>
              <button onClick={() => setShowAddItemModal(false)} className="p-1.5 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Material Name</label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. UltraTech PPC Cement (50kg Bag)"
                  className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Category</label>
                <select
                  value={newItemCat}
                  onChange={(e) => setNewItemCat(e.target.value as any)}
                  className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="Cement">Cement</option>
                  <option value="Steel">Steel</option>
                  <option value="Aggregates">Aggregates</option>
                  <option value="Masonry">Masonry</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Finishes">Finishes</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Unit</label>
                  <input
                    type="text"
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    placeholder="Bags, MT, Pcs"
                    className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Unit Rate (₹)</label>
                  <input
                    type="number"
                    value={newItemRate === 0 ? '' : newItemRate}
                    placeholder="0"
                    onChange={(e) => setNewItemRate(e.target.value === '' ? 0 : Number(e.target.value))}
                    className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Opening Stock</label>
                  <input
                    type="number"
                    value={newItemStock === 0 ? '' : newItemStock}
                    placeholder="0"
                    onChange={(e) => setNewItemStock(e.target.value === '' ? 0 : Number(e.target.value))}
                    className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Min Safety Threshold</label>
                  <input
                    type="number"
                    value={newItemMin === 0 ? '' : newItemMin}
                    placeholder="0"
                    onChange={(e) => setNewItemMin(e.target.value === '' ? 0 : Number(e.target.value))}
                    className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/5 text-xs">
              <button onClick={() => setShowAddItemModal(false)} className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition">
                Cancel
              </button>
              <button onClick={handleAddItem} className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 font-bold text-slate-950 transition">
                Save Material
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
