import React, { useState } from 'react';
import {
  Calculator,
  Download,
  Printer,
  FileCheck,
  Building,
  Check,
  X,
  FileText,
} from 'lucide-react';
import { jsPDF } from 'jspdf';

export const BOQEstimatorView: React.FC = () => {
  // Input parameters - Defaulted to 0 with manual entry (Issue 1)
  const [plotWidth, setPlotWidth] = useState<number>(0);
  const [plotLength, setPlotLength] = useState<number>(0);
  const [floors, setFloors] = useState<number>(0);
  const [builtUpPerFloor, setBuiltUpPerFloor] = useState<number>(0);
  const [finishQuality, setFinishQuality] = useState<'Standard' | 'Premium' | 'Luxury'>('Standard');
  const [contractorMarginPct, setContractorMarginPct] = useState<number>(0);
  const [clientName, setClientName] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('');

  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);

  const totalBuiltUpArea = (builtUpPerFloor || 0) * (floors || 0);
  const plotAreaSqFt = (plotWidth || 0) * (plotLength || 0);
  const plotAreaSqYds = plotAreaSqFt > 0 ? (plotAreaSqFt / 9).toFixed(1) : '0';

  // Dynamic engineering quantity estimators based on Indian Standard Codes (IS 456)
  const cementBags = totalBuiltUpArea > 0 ? Math.round(totalBuiltUpArea * 0.45) : 0;
  const cementCost = cementBags * 380;

  const steelTons = totalBuiltUpArea > 0 ? Number(((totalBuiltUpArea * 3.8) / 1000).toFixed(2)) : 0;
  const steelCost = Math.round(steelTons * 64500);

  const sandBrass = totalBuiltUpArea > 0 ? Number((totalBuiltUpArea * 0.018).toFixed(1)) : 0;
  const sandCost = Math.round(sandBrass * 3800);

  const aggregateBrass = totalBuiltUpArea > 0 ? Number((totalBuiltUpArea * 0.015).toFixed(1)) : 0;
  const aggregateCost = Math.round(aggregateBrass * 3200);

  const brickPcs = totalBuiltUpArea > 0 ? Math.round(totalBuiltUpArea * 8.2) : 0;
  const brickCost = Math.round(brickPcs * 9.5);

  const tileRate = finishQuality === 'Luxury' ? 140 : finishQuality === 'Premium' ? 95 : 65;
  const tileCost = totalBuiltUpArea > 0 ? Math.round(totalBuiltUpArea * 1.2 * tileRate) : 0;

  const mepRate = finishQuality === 'Luxury' ? 320 : finishQuality === 'Premium' ? 240 : 180;
  const mepCost = totalBuiltUpArea > 0 ? Math.round(totalBuiltUpArea * mepRate) : 0;

  const labourRate = finishQuality === 'Luxury' ? 480 : finishQuality === 'Premium' ? 420 : 360;
  const labourCost = totalBuiltUpArea > 0 ? Math.round(totalBuiltUpArea * labourRate) : 0;

  const totalMaterialCost = cementCost + steelCost + sandCost + aggregateCost + brickCost + tileCost + mepCost;
  const directCivilCost = totalMaterialCost + labourCost;
  const contractorMargin = Math.round(directCivilCost * ((contractorMarginPct || 0) / 100));
  const grandQuotationTotal = directCivilCost + contractorMargin;
  const ratePerSqFt = totalBuiltUpArea > 0 ? Math.round(grandQuotationTotal / totalBuiltUpArea) : 0;

  // Direct 1-Click PDF Download using jsPDF (Issue Fixed: No popup blocker, direct file download)
  const handleDownloadPdf = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const quotationRef = `VT-QUOT-${Date.now().toString().slice(-6)}`;
      const todayDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      const client = clientName.trim() || 'Valued Client';
      const project = projectName.trim() || 'Residential Construction Turnkey';

      // Top Dark Header Bar
      doc.setFillColor(15, 23, 42); // #0f172a
      doc.rect(0, 0, 210, 24, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('VT DEVELOPERS', 14, 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(56, 189, 248); // sky-400
      doc.text('ENGINEERING EXCELLENCE · TURNKEY CIVIL CONSTRUCTION', 14, 18);

      doc.setFontSize(8);
      doc.setTextColor(226, 232, 240);
      doc.text(`REF: ${quotationRef}`, 196, 11, { align: 'right' });
      doc.text(`DATE: ${todayDate}`, 196, 17, { align: 'right' });

      // Particulars Boxes
      let y = 32;

      // Box 1: Client & Project Info
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, y, 88, 28, 2, 2, 'FD');

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('CLIENT & PROPOSAL DETAILS', 18, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(`Client: ${client}`, 18, y + 12);
      doc.text(`Project: ${project}`, 18, y + 17);
      doc.text(`Finish Tier: ${finishQuality} Specification`, 18, y + 22);

      // Box 2: Site Dimensions & Built-Up Area
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(108, y, 88, 28, 2, 2, 'FD');

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('SITE & AREA SPECIFICATIONS', 112, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(`Plot: ${plotWidth} ft x ${plotLength} ft (${plotAreaSqFt} sq.ft / ${plotAreaSqYds} sq.yds)`, 112, y + 12);
      doc.text(`Floors: ${floors} Floors (G+${Math.max(0, floors - 1)})`, 112, y + 17);
      doc.text(`Total Built-up Area: ${totalBuiltUpArea.toLocaleString()} sq.ft`, 112, y + 22);

      y += 34;

      // Table Title Banner
      doc.setFillColor(241, 245, 249);
      doc.rect(14, y, 182, 7, 'F');
      doc.setFillColor(2, 132, 199);
      doc.rect(14, y, 2.5, 7, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text('ITEMIZED BILL OF QUANTITIES (BOQ) & MATERIAL RATE BREAKDOWN', 19, y + 5);

      y += 9;

      // Table Header
      doc.setFillColor(15, 23, 42);
      doc.rect(14, y, 182, 7, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text('ITEM DESCRIPTION', 16, y + 5);
      doc.text('CATEGORY', 80, y + 5);
      doc.text('QUANTITY', 118, y + 5, { align: 'right' });
      doc.text('UNIT', 124, y + 5);
      doc.text('UNIT RATE (INR)', 162, y + 5, { align: 'right' });
      doc.text('AMOUNT (INR)', 194, y + 5, { align: 'right' });

      y += 7;

      // Table Rows
      const items = [
        { desc: 'UltraTech PPC / OPC 53 Grade Cement', cat: 'Cement', qty: cementBags.toLocaleString(), unit: '50kg Bags', rate: '380', amt: cementCost.toLocaleString() },
        { desc: 'Tata Tiscon Fe 550D TMT Reinforcement Steel', cat: 'Steel', qty: steelTons.toString(), unit: 'Metric Ton', rate: '64,500', amt: steelCost.toLocaleString() },
        { desc: 'Zone-II Double Washed River Sand / M-Sand', cat: 'Sand', qty: sandBrass.toString(), unit: 'Brass', rate: '3,800', amt: sandCost.toLocaleString() },
        { desc: '20mm Granite Blue Metal Coarse Aggregate', cat: 'Aggregates', qty: aggregateBrass.toString(), unit: 'Brass', rate: '3,200', amt: aggregateCost.toLocaleString() },
        { desc: 'First Class Table-Moulded Wirecut Bricks', cat: 'Masonry', qty: brickPcs.toLocaleString(), unit: 'Pcs', rate: '9.50', amt: brickCost.toLocaleString() },
        { desc: 'Kajaria Vitrified Flooring & Wall Tiles', cat: 'Finishes', qty: totalBuiltUpArea > 0 ? (totalBuiltUpArea * 1.2).toLocaleString() : '0', unit: 'Sq.Ft', rate: tileRate.toString(), amt: tileCost.toLocaleString() },
        { desc: 'Concealed MEP (Polycab & Supreme CPVC)', cat: 'Services', qty: totalBuiltUpArea.toLocaleString(), unit: 'Sq.Ft', rate: mepRate.toString(), amt: mepCost.toLocaleString() },
        { desc: 'Direct Civil & Structural Labour Wages', cat: 'Labour', qty: totalBuiltUpArea.toLocaleString(), unit: 'Sq.Ft', rate: labourRate.toString(), amt: labourCost.toLocaleString() },
      ];

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);

      items.forEach((item, index) => {
        if (index % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(14, y, 182, 6.5, 'F');
        }
        doc.setDrawColor(241, 245, 249);
        doc.line(14, y + 6.5, 196, y + 6.5);

        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.text(item.desc, 16, y + 4.5);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(item.cat, 80, y + 4.5);
        doc.text(item.qty, 118, y + 4.5, { align: 'right' });
        doc.text(item.unit, 124, y + 4.5);
        doc.text(`INR ${item.rate}`, 162, y + 4.5, { align: 'right' });
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.text(`INR ${item.amt}`, 194, y + 4.5, { align: 'right' });

        y += 6.5;
      });

      y += 5;

      // Financial Summary Box
      const summaryX = 110;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(summaryX, y, 86, 32, 2, 2, 'FD');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);

      doc.text('Direct Materials Cost:', summaryX + 4, y + 6);
      doc.text(`INR ${totalMaterialCost.toLocaleString()}`, 192, y + 6, { align: 'right' });

      doc.text('Direct Site Labour:', summaryX + 4, y + 11);
      doc.text(`INR ${labourCost.toLocaleString()}`, 192, y + 11, { align: 'right' });

      doc.text(`Contractor Margin (${contractorMarginPct}%):`, summaryX + 4, y + 16);
      doc.text(`+INR ${contractorMargin.toLocaleString()}`, 192, y + 16, { align: 'right' });

      // Grand Total Highlight
      doc.setFillColor(15, 23, 42);
      doc.rect(summaryX, y + 20, 86, 12, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('GRAND TOTAL ESTIMATE:', summaryX + 4, y + 26);
      doc.setFontSize(10);
      doc.text(`INR ${grandQuotationTotal.toLocaleString('en-IN')}`, 192, y + 26, { align: 'right' });

      doc.setFontSize(7.5);
      doc.setTextColor(56, 189, 248);
      doc.text(`Unit Rate: INR ${ratePerSqFt.toLocaleString()} / sq.ft`, summaryX + 4, y + 30);

      // Left terms box
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text('STATUTORY & IS 456 TERMS:', 14, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text('1. Grounded in IS 456:2000 plain & reinforced concrete standards.', 14, y + 11);
      doc.text('2. Concrete cube compressive strength verified at 7, 14, and 28 days.', 14, y + 16);
      doc.text('3. Milestones: 10% Advance, 20% Plinth, 40% Slabs, 20% MEP, 10% Handover.', 14, y + 21);
      doc.text('4. Quotation valid for 30 calendar days from issuance.', 14, y + 26);

      // Sign-off section
      y += 42;
      doc.setDrawColor(203, 213, 225);
      doc.line(14, y + 12, 65, y + 12);
      doc.line(145, y + 12, 196, y + 12);

      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text('Client Acceptance Signature', 14, y + 16);
      doc.text('For VT Developers (Authorized)', 145, y + 16);

      // Footer bar
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 287, 210, 10, 'F');
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(7);
      doc.text('VT BuildOS ERP · Confidential Client Commercial Quotation · Powered by VT Developers', 105, 293, { align: 'center' });

      // Save and trigger browser download
      const safeFileName = `VT-Quotation-${(clientName.trim() || 'Client').replace(/[^a-zA-Z0-9_-]/g, '_')}-${quotationRef}.pdf`;
      doc.save(safeFileName);
      setShowPdfModal(false);
    } catch (err) {
      console.error('Failed to generate PDF with jsPDF:', err);
      // Fallback to print
      handlePrintPdf();
    }
  };

  // Popup-blocker-free hidden iframe printing
  const handlePrintPdf = () => {
    const todayDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const quotationRef = `VT-QUOT-${Date.now().toString().slice(-6)}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>VT Developers - Client Quotation ${quotationRef}</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; margin: 40px; font-size: 13px; line-height: 1.5; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 25px; }
          .brand { font-size: 24px; font-weight: 800; color: #0f172a; }
          .tagline { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
          .meta { text-align: right; font-size: 11px; color: #475569; }
          .section-title { font-size: 14px; font-weight: bold; background: #f1f5f9; padding: 6px 10px; margin: 20px 0 10px 0; border-left: 4px solid #0284c7; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; font-size: 12px; }
          .info-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
          th { background: #0f172a; color: #ffffff; text-align: left; padding: 8px 10px; font-weight: 600; }
          td { border-bottom: 1px solid #e2e8f0; padding: 8px 10px; }
          .text-right { text-align: right; }
          .font-mono { font-family: monospace; }
          .totals-table { width: 350px; margin-left: auto; margin-top: 20px; }
          .totals-table td { padding: 6px 10px; }
          .grand-total { font-size: 15px; font-weight: bold; background: #0f172a; color: #ffffff; }
          .terms { font-size: 11px; color: #64748b; margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 15px; }
          @media print {
            body { margin: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">VT DEVELOPERS</div>
            <div class="tagline">Engineering Excellence · Turnkey Construction · ERP</div>
            <div style="font-size: 11px; color: #475569; margin-top: 4px;">Registered Head Office: Andhra Pradesh, India</div>
          </div>
          <div class="meta">
            <div><strong>QUOTATION REF:</strong> ${quotationRef}</div>
            <div><strong>DATE:</strong> ${todayDate}</div>
            <div><strong>VALIDITY:</strong> 30 Days</div>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-box">
            <strong>CLIENT & PROJECT PARTICULARS:</strong><br/>
            <strong>Client Name:</strong> ${clientName || 'Valued Client'}<br/>
            <strong>Project Name:</strong> ${projectName || 'Residential Construction'}<br/>
            <strong>Specifications:</strong> ${finishQuality} Finish Package
          </div>
          <div class="info-box">
            <strong>SITE & STRUCTURAL PARTICULARS:</strong><br/>
            <strong>Plot Dimensions:</strong> ${plotWidth} ft x ${plotLength} ft (${plotAreaSqFt} sq.ft / ${plotAreaSqYds} sq.yds)<br/>
            <strong>Number of Floors:</strong> ${floors} Floors (G+${Math.max(0, floors - 1)})<br/>
            <strong>Total Built-Up Area:</strong> ${totalBuiltUpArea.toLocaleString()} sq.ft
          </div>
        </div>

        <div class="section-title">BILL OF QUANTITIES (BOQ) & MATERIAL RATE BREAKDOWN</div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th class="text-right">Quantity</th>
              <th>Unit</th>
              <th class="text-right">Rate (₹)</th>
              <th class="text-right">Total Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>UltraTech PPC / OPC 53 Grade Cement</strong></td>
              <td>Cement</td>
              <td class="text-right font-mono">${cementBags.toLocaleString()}</td>
              <td>50kg Bags</td>
              <td class="text-right font-mono">₹380</td>
              <td class="text-right font-mono">₹${cementCost.toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>Tata Tiscon Fe 550D TMT Reinforcement Steel</strong></td>
              <td>Steel</td>
              <td class="text-right font-mono">${steelTons}</td>
              <td>MT</td>
              <td class="text-right font-mono">₹64,500</td>
              <td class="text-right font-mono">₹${steelCost.toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>Zone-II Double Washed River Sand</strong></td>
              <td>Sand</td>
              <td class="text-right font-mono">${sandBrass}</td>
              <td>Brass</td>
              <td class="text-right font-mono">₹3,800</td>
              <td class="text-right font-mono">₹${sandCost.toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>20mm Granite Blue Metal Coarse Aggregate</strong></td>
              <td>Aggregate</td>
              <td class="text-right font-mono">${aggregateBrass}</td>
              <td>Brass</td>
              <td class="text-right font-mono">₹3,200</td>
              <td class="text-right font-mono">₹${aggregateCost.toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>First-Class Wirecut Table Moulded Clay Bricks</strong></td>
              <td>Masonry</td>
              <td class="text-right font-mono">${brickPcs.toLocaleString()}</td>
              <td>Pcs</td>
              <td class="text-right font-mono">₹9.50</td>
              <td class="text-right font-mono">₹${brickCost.toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>Vitrified Flooring & Designer Wall Tiles</strong></td>
              <td>Finishes</td>
              <td class="text-right font-mono">${totalBuiltUpArea > 0 ? (totalBuiltUpArea * 1.2).toLocaleString() : '0'}</td>
              <td>Sq.Ft</td>
              <td class="text-right font-mono">₹${tileRate}</td>
              <td class="text-right font-mono">₹${tileCost.toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>Concealed MEP (Polycab & Supreme CPVC)</strong></td>
              <td>MEP</td>
              <td class="text-right font-mono">${totalBuiltUpArea.toLocaleString()}</td>
              <td>Sq.Ft</td>
              <td class="text-right font-mono">₹${mepRate}</td>
              <td class="text-right font-mono">₹${mepCost.toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>Direct Civil & Structural Labour Wages</strong></td>
              <td>Labour</td>
              <td class="text-right font-mono">${totalBuiltUpArea.toLocaleString()}</td>
              <td>Sq.Ft</td>
              <td class="text-right font-mono">₹${labourRate}</td>
              <td class="text-right font-mono">₹${labourCost.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <table class="totals-table">
          <tr>
            <td>Total Direct Materials Cost:</td>
            <td class="text-right font-mono">₹${totalMaterialCost.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Direct Site Labour & Shuttering:</td>
            <td class="text-right font-mono">₹${labourCost.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Subtotal Direct Construction:</td>
            <td class="text-right font-mono"><strong>₹${directCivilCost.toLocaleString()}</strong></td>
          </tr>
          <tr>
            <td>Builder Overhead & Margin (${contractorMarginPct}%):</td>
            <td class="text-right font-mono">+₹${contractorMargin.toLocaleString()}</td>
          </tr>
          <tr class="grand-total">
            <td>GRAND TOTAL ESTIMATE:</td>
            <td class="text-right font-mono">₹${grandQuotationTotal.toLocaleString('en-IN')}</td>
          </tr>
          <tr>
            <td colspan="2" style="font-size: 11px; text-align: right; color: #475569; padding-top: 4px;">
              Effective Unit Rate: <strong>₹${ratePerSqFt.toLocaleString()} / sq.ft</strong>
            </td>
          </tr>
        </table>

        <div class="terms">
          <strong>TERMS & CONDITIONS:</strong><br/>
          1. Rates are grounded in IS 456 / IS 875 Indian Standard structural civil guidelines.<br/>
          2. Steel and cement variances beyond ±5% will be adjusted based on prevailing market vouchers.<br/>
          3. Payment milestone schedule: 10% Advance on Agreement, 20% Foundation, 40% Floor Slabs, 20% Plastering & MEP, 10% Handover.
        </div>
      </body>
      </html>
    `;

    // Use invisible iframe to bypass popup blockers entirely
    const existingIframe = document.getElementById('vt-quotation-iframe');
    if (existingIframe) {
      existingIframe.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'vt-quotation-iframe';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();

      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      }, 250);
    }
    setShowPdfModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-2xl bg-[#0E1424] border border-cyan-400/40 text-cyan-400">
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

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setShowPdfModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition cursor-pointer"
          >
            <Download className="w-4 h-4 stroke-[3]" />
            <span>Export Client Quotation PDF</span>
          </button>
        </div>
      </div>

      {/* Input Parameters Section - Solid Surface, Default 0 with manual typing */}
      <div className="bg-[#0E1424] p-6 rounded-3xl border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>1. Site Dimensions & Building Specifications</span>
            <span className="text-[10px] text-cyan-300 font-mono bg-[#090D16] px-2.5 py-0.5 rounded-full border border-cyan-400/30">
              Manual Numeric Entry · Default 0
            </span>
          </h3>

          <span className="text-xs text-slate-400">Enter parameters below</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Plot Width (ft)</label>
            <input
              type="number"
              value={plotWidth === 0 ? '' : plotWidth}
              placeholder="0"
              onChange={(e) => setPlotWidth(e.target.value === '' ? 0 : Number(e.target.value))}
              className="w-full bg-[#090D16] border border-white/10 rounded-2xl p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Plot Length (ft)</label>
            <input
              type="number"
              value={plotLength === 0 ? '' : plotLength}
              placeholder="0"
              onChange={(e) => setPlotLength(e.target.value === '' ? 0 : Number(e.target.value))}
              className="w-full bg-[#090D16] border border-white/10 rounded-2xl p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Floors (G+N)</label>
            <input
              type="number"
              value={floors === 0 ? '' : floors}
              placeholder="0"
              onChange={(e) => setFloors(e.target.value === '' ? 0 : Number(e.target.value))}
              className="w-full bg-[#090D16] border border-white/10 rounded-2xl p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Area / Floor (sq.ft)</label>
            <input
              type="number"
              value={builtUpPerFloor === 0 ? '' : builtUpPerFloor}
              placeholder="0"
              onChange={(e) => setBuiltUpPerFloor(e.target.value === '' ? 0 : Number(e.target.value))}
              className="w-full bg-[#090D16] border border-white/10 rounded-2xl p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Finishes Quality</label>
            <select
              value={finishQuality}
              onChange={(e) => setFinishQuality(e.target.value as any)}
              className="w-full bg-[#090D16] border border-white/10 rounded-2xl p-2.5 text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
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
              value={contractorMarginPct === 0 ? '' : contractorMarginPct}
              placeholder="0"
              onChange={(e) => setContractorMarginPct(e.target.value === '' ? 0 : Number(e.target.value))}
              className="w-full bg-[#090D16] border border-white/10 rounded-2xl p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-3 border-t border-white/5 mt-2">
          <div className="flex items-center gap-4">
            <span>Plot Area: <strong className="text-white font-mono">{plotAreaSqFt} sq.ft ({plotAreaSqYds} Sq.Yds)</strong></span>
            <span>•</span>
            <span>Total Built-up: <strong className="text-cyan-400 font-mono font-bold">{totalBuiltUpArea.toLocaleString()} sq.ft</strong></span>
          </div>
          <span className="text-emerald-400 font-mono font-semibold">
            Estimated Unit Rate: ₹{ratePerSqFt.toLocaleString()} / sq.ft (All-Inclusive)
          </span>
        </div>
      </div>

      {/* Bill of Quantities Table - Rounded-3xl */}
      <div className="bg-[#0E1424] rounded-3xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-[#090D16] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Itemized Quantity Takeoff & Material Specifications</h3>
          <span className="text-xs text-slate-400 font-mono">IS 456 Structural Norms</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-[#070B14] text-slate-400 font-semibold">
                <th className="p-4">BOQ Line Item Description</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right font-mono">Quantity</th>
                <th className="p-4">Unit</th>
                <th className="p-4 text-right font-mono">Standard Rate (₹)</th>
                <th className="p-4 text-right font-mono text-cyan-300">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 text-white font-bold">UltraTech PPC / OPC 53 Grade Cement</td>
                <td className="p-4 text-slate-400">Cement & Binders</td>
                <td className="p-4 text-right font-mono text-slate-200">{cementBags.toLocaleString()}</td>
                <td className="p-4 text-slate-400">50kg Bags</td>
                <td className="p-4 text-right font-mono text-slate-300">₹380</td>
                <td className="p-4 text-right font-mono text-white font-bold">₹{cementCost.toLocaleString()}</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 text-white font-bold">Tata Tiscon Fe 550D TMT Reinforcement Steel</td>
                <td className="p-4 text-slate-400">Reinforcement</td>
                <td className="p-4 text-right font-mono text-slate-200">{steelTons}</td>
                <td className="p-4 text-slate-400">Metric Tons</td>
                <td className="p-4 text-right font-mono text-slate-300">₹64,500</td>
                <td className="p-4 text-right font-mono text-white font-bold">₹{steelCost.toLocaleString()}</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 text-white font-bold">Zone-II Double Washed M-Sand for Masonry & Plaster</td>
                <td className="p-4 text-slate-400">Aggregates</td>
                <td className="p-4 text-right font-mono text-slate-200">{sandBrass}</td>
                <td className="p-4 text-slate-400">Brass (100 cft)</td>
                <td className="p-4 text-right font-mono text-slate-300">₹3,800</td>
                <td className="p-4 text-right font-mono text-white font-bold">₹{sandCost.toLocaleString()}</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 text-white font-bold">20mm Hard Granite Blue Metal Coarse Aggregate</td>
                <td className="p-4 text-slate-400">Aggregates</td>
                <td className="p-4 text-right font-mono text-slate-200">{aggregateBrass}</td>
                <td className="p-4 text-slate-400">Brass</td>
                <td className="p-4 text-right font-mono text-slate-300">₹3,200</td>
                <td className="p-4 text-right font-mono text-white font-bold">₹{aggregateCost.toLocaleString()}</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 text-white font-bold">First Class Table-Moulded Wirecut Clay Bricks</td>
                <td className="p-4 text-slate-400">Masonry</td>
                <td className="p-4 text-right font-mono text-slate-200">{brickPcs.toLocaleString()}</td>
                <td className="p-4 text-slate-400">Numbers</td>
                <td className="p-4 text-right font-mono text-slate-300">₹9.50</td>
                <td className="p-4 text-right font-mono text-white font-bold">₹{brickCost.toLocaleString()}</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 text-white font-bold">Kajaria Vitrified Flooring & Designer Wall Tiles</td>
                <td className="p-4 text-slate-400">Finishes</td>
                <td className="p-4 text-right font-mono text-slate-200">{totalBuiltUpArea > 0 ? (totalBuiltUpArea * 1.2).toLocaleString() : '0'}</td>
                <td className="p-4 text-slate-400">Sq.Ft</td>
                <td className="p-4 text-right font-mono text-slate-300">₹{tileRate}</td>
                <td className="p-4 text-right font-mono text-white font-bold">₹{tileCost.toLocaleString()}</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 text-white font-bold">Concealed MEP (Polycab FRLS Wires & Supreme CPVC Pipes)</td>
                <td className="p-4 text-slate-400">Services</td>
                <td className="p-4 text-right font-mono text-slate-200">{totalBuiltUpArea.toLocaleString()}</td>
                <td className="p-4 text-slate-400">Sq.Ft</td>
                <td className="p-4 text-right font-mono text-slate-300">₹{mepRate}</td>
                <td className="p-4 text-right font-mono text-white font-bold">₹{mepCost.toLocaleString()}</td>
              </tr>
              <tr className="hover:bg-white/[0.02] bg-[#090D16]">
                <td className="p-4 text-cyan-300 font-bold">Direct Civil & Structural Labour Wages</td>
                <td className="p-4 text-slate-400">Muster Labour</td>
                <td className="p-4 text-right font-mono text-slate-200">{totalBuiltUpArea.toLocaleString()}</td>
                <td className="p-4 text-slate-400">Sq.Ft</td>
                <td className="p-4 text-right font-mono text-slate-300">₹{labourRate}</td>
                <td className="p-4 text-right font-mono text-cyan-300 font-bold">₹{labourCost.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals & Quotation Summary - Solid Surface, No Gradient */}
        <div className="p-6 bg-[#090D16] border-t border-white/5 space-y-2.5 text-xs">
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
          <div className="flex justify-between text-base font-extrabold text-white pt-3 border-t border-white/5">
            <span className="text-white">Grand Quotation Total:</span>
            <span className="font-mono text-cyan-300 text-lg font-bold">₹{grandQuotationTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* PDF Export Modal (Issue 2) */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#090D16] border border-white/10 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Export Client Quotation PDF</h3>
              </div>
              <button
                onClick={() => setShowPdfModal(false)}
                className="p-1.5 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Generate a formal client quotation with your company letterhead, IS 456 quantities, unit rates, and terms.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Client Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Srikanth Varma"
                  className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Project / Proposal Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Skyline Villa - Residential Turnkey"
                  className="w-full bg-[#0E1424] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="p-3 rounded-2xl bg-[#0E1424] border border-white/5 text-[11px] text-slate-300 space-y-1">
                <div className="flex justify-between font-mono">
                  <span>Built-up Area:</span>
                  <span className="text-white font-bold">{totalBuiltUpArea.toLocaleString()} sq.ft</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span>Grand Total:</span>
                  <span className="text-cyan-400 font-bold">₹{grandQuotationTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span>Rate / Sq.Ft:</span>
                  <span className="text-emerald-400 font-bold">₹{ratePerSqFt.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2 pt-3 border-t border-white/5 text-xs">
              <button
                onClick={() => setShowPdfModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePrintPdf}
                className="px-4 py-2 rounded-xl bg-[#12192B] hover:bg-[#1a253e] border border-slate-700 text-slate-200 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={handleDownloadPdf}
                className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 font-bold text-slate-950 transition flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF (.pdf)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
