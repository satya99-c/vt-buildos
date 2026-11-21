import React, { useState } from 'react';
import {
  Calculator,
  Download,
} from 'lucide-react';

export const BOQEstimatorView: React.FC = () => {
  // Input parameters
  const [plotWidth, setPlotWidth] = useState(50);
  const [plotLength, setPlotLength] = useState(80);
  const [floors, setFloors] = useState(3); // G+2
  const [builtUpPerFloor, setBuiltUpPerFloor] = useState(1400); // sq ft
  const [finishQuality, setFinishQuality] = useState<'Standard' | 'Premium' | 'Luxury'>('Premium');
  const [contractorMarginPct, setContractorMarginPct] = useState(15);

  const totalBuiltUpArea = builtUpPerFloor * floors; // sq ft
  const plotAreaSqFt = plotWidth * plotLength;
  const plotAreaSqYds = (plotAreaSqFt / 9).toFixed(1);

  // Dynamic engineering quantity estimators based on Indian Standard Codes (IS 456)
  const cementBags = Math.round(totalBuiltUpArea * 0.45);
  const cementCost = cementBags * 380;

  const steelTons = Number(((totalBuiltUpArea * 3.8) / 1000).toFixed(2));
  const steelCost = Math.round(steelTons * 64500);

  const sandBrass = Number((totalBuiltUpArea * 0.018).toFixed(1));
  const sandCost = Math.round(sandBrass * 3800);

  const aggregateBrass = Number((totalBuiltUpArea * 0.015).toFixed(1));
  const aggregateCost = Math.round(aggregateBrass * 3200);

  const brickPcs = Math.round(totalBuiltUpArea * 8.2);
  const brickCost = Math.round(brickPcs * 9.5);

  const tileRate = finishQuality === 'Luxury' ? 140 : finishQuality === 'Premium' ? 95 : 65;
  const tileCost = Math.round(totalBuiltUpArea * 1.2 * tileRate);

  const mepRate = finishQuality === 'Luxury' ? 320 : finishQuality === 'Premium' ? 240 : 180;
  const mepCost = Math.round(totalBuiltUpArea * mepRate);

  const labourRate = finishQuality === 'Luxury' ? 480 : finishQuality === 'Premium' ? 420 : 360;
  const labourCost = Math.round(totalBuiltUpArea * labourRate);

  const totalMaterialCost = cementCost + steelCost + sandCost + aggregateCost + brickCost + tileCost + mepCost;
  const directCivilCost = totalMaterialCost + labourCost;
  const contractorMargin = Math.round(directCivilCost * (contractorMarginPct / 100));
  const grandQuotationTotal = directCivilCost + contractorMargin;
  const ratePerSqFt = Math.round(grandQuotationTotal / totalBuiltUpArea);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-[#141C2E] border border-cyan-400/40 text-cyan-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">BOQ & Construction Cost Estimator</h1>
              <p className="text-xs text-slate-400">
                Parametric quantity surveying engine grounded in IS 456 construction standards
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => alert(`Quotation generated for ₹${grandQuotationTotal.toLocaleString('en-IN')}! Ready for client review.`)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition cursor-pointer self-start md:self-auto shadow-sm"
        >
          <Download className="w-4 h-4 stroke-[3]" />
          <span>Export Client Quotation PDF</span>
        </button>
      </div>

      {/* Input Parameters Section - Solid Surface, No Gradient, Rounded-3xl */}
      <div className="bg-[#0E1424] p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span>1. Site Dimensions & Building Specifications</span>
          <span className="text-[10px] text-cyan-300 font-mono bg-[#141C2E] px-2.5 py-0.5 rounded-full border border-cyan-400/30">
            Live Re-calculation
          </span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Plot Width (ft)</label>
            <input
              type="number"
              value={plotWidth}
              onChange={(e) => setPlotWidth(Number(e.target.value))}
              className="w-full bg-[#111726] border border-slate-700/80 rounded-2xl p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Plot Length (ft)</label>
            <input
              type="number"
              value={plotLength}
              onChange={(e) => setPlotLength(Number(e.target.value))}
              className="w-full bg-[#111726] border border-slate-700/80 rounded-2xl p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Floors (G+N)</label>
            <input
              type="number"
              value={floors}
              min={1}
              max={15}
              onChange={(e) => setFloors(Number(e.target.value))}
              className="w-full bg-[#111726] border border-slate-700/80 rounded-2xl p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Area / Floor (sq.ft)</label>
            <input
              type="number"
              value={builtUpPerFloor}
              onChange={(e) => setBuiltUpPerFloor(Number(e.target.value))}
              className="w-full bg-[#111726] border border-slate-700/80 rounded-2xl p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Finishes Quality</label>
            <select
              value={finishQuality}
              onChange={(e) => setFinishQuality(e.target.value as any)}
              className="w-full bg-[#111726] border border-slate-700/80 rounded-2xl p-2.5 text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="Standard">Standard (₹1,900/sqft)</option>
              <option value="Premium">Premium (₹2,400/sqft)</option>
              <option value="Luxury">Luxury (₹3,100/sqft)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Builder Margin (%)</label>
            <input
              type="number"
              value={contractorMarginPct}
              onChange={(e) => setContractorMarginPct(Number(e.target.value))}
              className="w-full bg-[#111726] border border-slate-700/80 rounded-2xl p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80 mt-2">
          <div className="flex items-center gap-4">
            <span>Plot Area: <strong className="text-white">{plotAreaSqFt} sq.ft ({plotAreaSqYds} Sq.Yds)</strong></span>
            <span>•</span>
            <span>Total Built-up: <strong className="text-cyan-400 font-bold">{totalBuiltUpArea.toLocaleString()} sq.ft</strong></span>
          </div>
          <span className="text-emerald-400 font-mono font-semibold">
            Estimated Unit Rate: ₹{ratePerSqFt.toLocaleString()} / sq.ft (All-Inclusive)
          </span>
        </div>
      </div>

      {/* Bill of Quantities Table - Rounded-3xl */}
      <div className="bg-[#0E1424] rounded-3xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-[#111726] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Itemized Quantity Takeoff & Material Specifications</h3>
          <span className="text-xs text-slate-400 font-mono">IS 456 Structural Norms</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-[#090D16] text-slate-400 font-semibold">
                <th className="p-3.5">BOQ Line Item Description</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5 text-right font-mono">Quantity</th>
                <th className="p-3.5">Unit</th>
                <th className="p-3.5 text-right font-mono">Standard Rate (₹)</th>
                <th className="p-3.5 text-right font-mono text-cyan-300">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              <tr className="hover:bg-slate-800/20">
                <td className="p-3.5 text-white font-bold">UltraTech PPC / OPC 53 Grade Cement</td>
                <td className="p-3.5 text-slate-400">Cement & Binders</td>
                <td className="p-3.5 text-right font-mono text-slate-200">{cementBags.toLocaleString()}</td>
                <td className="p-3.5 text-slate-400">50kg Bags</td>
                <td className="p-3.5 text-right font-mono text-slate-300">₹380</td>
                <td className="p-3.5 text-right font-mono text-white font-bold">₹{cementCost.toLocaleString()}</td>
              </tr>
              <tr className="hover:bg-slate-800/20">
                <td className="p-3.5 text-white font-bold">Tata Tiscon Fe 550D TMT Reinforcement Steel</td>
                <td className="p-3.5 text-slate-400">Reinforcement</td>
                <td className="p-3.5 text-right font-mono text-slate-200">{steelTons}</td>
                <td className="p-3.5 text-slate-400">Metric Tons</td>
                <td className="p-3.5 text-right font-mono text-slate-300">₹64,500</td>
                <td className="p-3.5 text-right font-mono text-white font-bold">₹{steelCost.toLocaleString()}</td>
              </tr>
              <tr className="hover:bg-slate-800/20">
                <td className="p-3.5 text-white font-bold">Zone-II Double Washed M-Sand for Masonry & Plaster</td>
                <td className="p-3.5 text-slate-400">Aggregates</td>
                <td className="p-3.5 text-right font-mono text-slate-200">{sandBrass}</td>
                <td className="p-3.5 text-slate-400">Brass (100 cft)</td>
                <td className="p-3.5 text-right font-mono text-slate-300">₹3,800</td>
                <td className="p-3.5 text-right font-mono text-white font-bold">₹{sandCost.toLocaleString()}</td>
              </tr>
              <tr className="hover:bg-slate-800/20">
                <td className="p-3.5 text-white font-bold">20mm Hard Granite Blue Metal Coarse Aggregate</td>
                <td className="p-3.5 text-slate-400">Aggregates</td>
                <td className="p-3.5 text-right font-mono text-slate-200">{aggregateBrass}</td>
                <td className="p-3.5 text-slate-400">Brass</td>
                <td className="p-3.5 text-right font-mono text-slate-300">₹3,200</td>
                <td className="p-3.5 text-right font-mono text-white font-bold">₹{aggregateCost.toLocaleString()}</td>
              </tr>
              <tr className="hover:bg-slate-800/20">
                <td className="p-3.5 text-white font-bold">First Class Table-Moulded Wirecut Clay Bricks</td>
                <td className="p-3.5 text-slate-400">Masonry</td>
                <td className="p-3.5 text-right font-mono text-slate-200">{brickPcs.toLocaleString()}</td>
                <td className="p-3.5 text-slate-400">Numbers</td>
                <td className="p-3.5 text-right font-mono text-slate-300">₹9.50</td>
                <td className="p-3.5 text-right font-mono text-white font-bold">₹{brickCost.toLocaleString()}</td>
              </tr>
              <tr className="hover:bg-slate-800/20">
                <td className="p-3.5 text-white font-bold">Kajaria Vitrified Flooring & Designer Wall Tiles</td>
                <td className="p-3.5 text-slate-400">Finishes</td>
                <td className="p-3.5 text-right font-mono text-slate-200">{(totalBuiltUpArea * 1.2).toLocaleString()}</td>
                <td className="p-3.5 text-slate-400">Sq.Ft</td>
                <td className="p-3.5 text-right font-mono text-slate-300">₹{tileRate}</td>
                <td className="p-3.5 text-right font-mono text-white font-bold">₹{tileCost.toLocaleString()}</td>
              </tr>
              <tr className="hover:bg-slate-800/20">
                <td className="p-3.5 text-white font-bold">Concealed MEP (Polycab FRLS Wires & Supreme CPVC Pipes)</td>
                <td className="p-3.5 text-slate-400">Services</td>
                <td className="p-3.5 text-right font-mono text-slate-200">{totalBuiltUpArea.toLocaleString()}</td>
                <td className="p-3.5 text-slate-400">Sq.Ft</td>
                <td className="p-3.5 text-right font-mono text-slate-300">₹{mepRate}</td>
                <td className="p-3.5 text-right font-mono text-white font-bold">₹{mepCost.toLocaleString()}</td>
              </tr>
              <tr className="hover:bg-slate-800/20 bg-[#11182A]">
                <td className="p-3.5 text-cyan-300 font-bold">Direct Civil & Structural Labour Wages</td>
                <td className="p-3.5 text-slate-400">Muster Labour</td>
                <td className="p-3.5 text-right font-mono text-slate-200">{totalBuiltUpArea.toLocaleString()}</td>
                <td className="p-3.5 text-slate-400">Sq.Ft</td>
                <td className="p-3.5 text-right font-mono text-slate-300">₹{labourRate}</td>
                <td className="p-3.5 text-right font-mono text-cyan-300 font-bold">₹{labourCost.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals & Quotation Summary - Solid Surface, No Gradient */}
        <div className="p-5 bg-[#090D16] border-t border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between text-slate-300">
            <span>Direct Materials & Supplies:</span>
            <span className="font-mono font-bold">₹{totalMaterialCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Direct Site Labour & Shuttering:</span>
            <span className="font-mono font-bold">₹{labourCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Subtotal Direct Construction Cost:</span>
            <span className="font-mono font-bold text-white">₹{directCivilCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-cyan-400">
            <span>Builder Overhead & Margin ({contractorMarginPct}%):</span>
            <span className="font-mono font-bold">+₹{contractorMargin.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
            <span className="text-white">Grand Quotation Total:</span>
            <span className="font-mono text-cyan-300 text-lg font-bold">₹{grandQuotationTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
