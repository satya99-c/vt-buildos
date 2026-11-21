import React, { useState } from 'react';
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  RefreshCw,
  RotateCcw,
  History,
  FileCheck,
} from 'lucide-react';

export const DataImportCenterView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'employees' | 'materials' | 'projects' | 'finance'>('employees');
  const [currentStep, setCurrentStep] = useState<number>(3); // preview step
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  // Column mapping example from Section 6 of prompt
  const employeeMapping = [
    { excelHeader: 'Employee Name', sampleVal: 'Ravi Teja', mappedField: 'employee_name', status: 'valid' },
    { excelHeader: 'Mobile', sampleVal: '9876543210', mappedField: 'phone_number', status: 'valid' },
    { excelHeader: 'Salary', sampleVal: '₹20,000', mappedField: 'monthly_salary', status: 'valid' },
    { excelHeader: 'Site', sampleVal: 'Site A (Skyline Villa)', mappedField: 'assigned_project', status: 'valid' },
    { excelHeader: 'Trade Category', sampleVal: 'Shuttering Carpenter', mappedField: 'trade_category', status: 'valid' },
  ];

  const previewRows = [
    { name: 'Ravi Teja', mobile: '9876543210', salary: '₹20,000', site: 'Skyline Luxury Villa', valid: true },
    { name: 'Kumar Swamy', mobile: '9876543211', salary: '₹18,000', site: 'Royal Palm Residency', valid: true },
    { name: 'Srinivasa Rao', mobile: '9440123890', salary: '₹22,000', site: 'Godavari Commercial', valid: true },
    { name: 'B. Chinna', mobile: '9177894561', salary: '₹16,500', site: 'Greenfield Eco Villas', valid: true },
    { name: 'K. Durga Prasad', mobile: '9885123456', salary: '₹25,000', site: 'Skyline Luxury Villa', valid: true },
  ];

  const handleExecuteImport = () => {
    setIsImporting(true);
    setTimeout(() => {
      setIsImporting(false);
      setImportSuccess(true);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">Dedicated Data Import Center</h1>
              <p className="text-xs text-slate-400">
                Seamlessly migrate legacy VT Developers spreadsheets, databases, and payroll records without manual data entry
              </p>
            </div>
          </div>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 self-start md:self-auto">
          <span>Reusable SaaS Migration Engine</span>
        </span>
      </div>

      {/* 4 Import Methods Supported (Section 6.B of Prompt) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl border border-white/10 bg-[#0E1424]">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
            <FileSpreadsheet className="w-4 h-4" />
            <span>1. Excel / CSV Upload</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Employees, materials, customers, suppliers & opening stock balances.
          </p>
          <span className="inline-block mt-3 text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded-full font-mono">
            Active Mode
          </span>
        </div>

        <div className="p-5 rounded-3xl border border-white/5 bg-[#0E1424]">
          <div className="flex items-center gap-2 text-slate-200 font-bold text-xs">
            <Database className="w-4 h-4 text-purple-400" />
            <span>2. Direct Database Link</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Safe MySQL or PostgreSQL dump scripts with automated schema mapping.
          </p>
        </div>

        <div className="p-5 rounded-3xl border border-white/5 bg-[#0E1424]">
          <div className="flex items-center gap-2 text-slate-200 font-bold text-xs">
            <RefreshCw className="w-4 h-4 text-emerald-400" />
            <span>3. REST API Sync</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Continuous sync from existing ERP or accounting software via webhooks.
          </p>
        </div>

        <div className="p-5 rounded-3xl border border-white/5 bg-[#0E1424]">
          <div className="flex items-center gap-2 text-slate-200 font-bold text-xs">
            <UploadCloud className="w-4 h-4 text-amber-400" />
            <span>4. Document & PDF Ingestion</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Bulk upload drawings, municipal approvals, bills & project photos.
          </p>
        </div>
      </div>

      {/* 7-Step Import Workflow Status Bar (Section 6.C of Prompt) */}
      <div className="p-6 rounded-3xl bg-[#0E1424] border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Import Pipeline: Step 3 of 7 — Column Mapping & Validation</h3>
          <span className="text-xs text-emerald-400 font-mono">5 Rows Ready for Ingestion</span>
        </div>

        {/* Column Mapping Table (Directly from Section 6 example) */}
        <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#090D16]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#070B14] text-slate-400 border-b border-white/5 font-semibold">
                <th className="p-3.5">Excel / CSV Column Header</th>
                <th className="p-3.5">Sample Source Value</th>
                <th className="p-3.5 text-center">Transform</th>
                <th className="p-3.5">Target VT BuildOS Field</th>
                <th className="p-3.5 text-right">Validation Check</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {employeeMapping.map((map, i) => (
                <tr key={i} className="hover:bg-white/[0.02]">
                  <td className="p-3.5 font-bold text-white font-mono">{map.excelHeader}</td>
                  <td className="p-3.5 text-cyan-300 font-mono">{map.sampleVal}</td>
                  <td className="p-3.5 text-center text-slate-500">➔</td>
                  <td className="p-3.5 font-mono text-emerald-400 font-semibold">{map.mappedField}</td>
                  <td className="p-3.5 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Valid 100%</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Data Validation Preview */}
        <div className="pt-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-300">Staged Records Preview (Zero Duplicates Detected)</span>
            <span className="text-[11px] text-slate-500 font-mono">Table: workforce.employees</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#070B14]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-[#090D16] text-slate-400">
                  <th className="p-3">Name</th>
                  <th className="p-3">Mobile</th>
                  <th className="p-3">Salary</th>
                  <th className="p-3">Assigned Site</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                {previewRows.map((r, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="p-3 text-white font-bold">{r.name}</td>
                    <td className="p-3 text-slate-300">{r.mobile}</td>
                    <td className="p-3 text-slate-300">{r.salary}</td>
                    <td className="p-3 text-cyan-300">{r.site}</td>
                    <td className="p-3 text-center text-emerald-400">✓ Ready</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Approve and Execute Import Button */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Audit logging: A rollback snapshot will be retained under <code>import_logs.snapshot_id #VT-MIG-088</code>.
          </div>

          <button
            onClick={handleExecuteImport}
            disabled={isImporting || importSuccess}
            className={`px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
              importSuccess
                ? 'bg-emerald-400 text-slate-950'
                : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950'
            }`}
          >
            {isImporting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Importing & Updating PostgreSQL Ledgers...</span>
              </>
            ) : importSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Import Succeeded! 5 Records Ingested</span>
              </>
            ) : (
              <>
                <FileCheck className="w-4 h-4" />
                <span>Approve & Execute Data Import</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
