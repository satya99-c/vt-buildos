# VT BuildOS — Construction ERP & Operations Platform

> **Modern Dark-Themed Construction Management Platform** built for **VT Developers** (Internal Operations) and engineered for multi-tenant **SaaS** subscription scalability.

---

## 🏗️ Highlights & Implemented Reference Blueprints

This platform incorporates all **14 modules** and synthesizes all **8 visual reference designs** provided in the specification with an **obsidian dark theme** (`#050811` background, `#070D1E` cards, glowing cyan `#06B6D4` and emerald `#10B981` accents):

1. **Compreo Business Systems (Ref #1)**:
   - Executive Project Cost Dashboard (WBS Level 1–5 budget vs actual divergence table).
   - Cost distribution donut chart (Material 48%, Labor 26%, Equipment 14%, Subcontract 8%).
   - Cumulative S-Curve (Planned vs Actual vs AI Forecast).
   - Top 5 projects by budget utilization.
2. **Nexgile ConstructIQ (Ref #2)**:
   - Multi-project portfolio management command center.
   - Interactive Grid & List portfolio view with status pills, team size, location, and days countdown.
   - CPI (Cost Performance Index) and SPI (Schedule Performance Index) indicators.
3. **BQE Core Financial Health (Ref #3)**:
   - Comparative balance sheet (Assets vs Liabilities & Retained Equity).
   - Monthly cashflow inflows vs outflows.
   - Aged receivables & payables tracking.
4. **Site Engineer Mobile App (Ref #4)**:
   - Interactive on-screen iPhone 16 Pro simulator.
   - Screen 1: Site Plan & Tasks (+ Add Task).
   - Screen 2: Daily Progress Report (Issues, tasks, attendance logs).
   - Screen 3: Labour Attendance with interactive **P (Present), A (Absent), H (Half Day)** buttons with instant daily wage calculation.
   - **Offline-First Mode Toggle** demonstrating offline action queue and sync recovery.
5. **Customer Transparency Portal (Ref #5)**:
   - Clean client view with Budget, Paid, and Remaining milestones.
   - 68% progress bar (8 of 12 milestones completed).
   - Live high-resolution site progress photos gallery.
   - **100% Escrow Protection Guarantee** badge.
6. **Intuit Enterprise Suite ERP (Ref #6)**:
   - Quick Action Center modal for instant creation of projects, customer records, expense vouchers, POs, and muster entries.
   - Operating cash flow and project profit margin indicators.
7. **Mastt Single Project Command Center (Ref #7)**:
   - 5-metric value banner (Budget, Committed, Variance, FFC/EAC, Total Paid).
   - Milestone execution roadmap.
   - GIS coordinates and CAD drawing links for Kakinada sites.
8. **BuildAxis AI ERP (Ref #8)**:
   - Live site weather widget (29°C Partly Cloudy in Kakinada).
   - AI Project Insights card with 84/100 success probability.
   - Conversational **BuildOS AI Copilot** drawer grounded in active ERP data.

---

## 📦 Key Functional Modules

| Module | Features & Capabilities |
| :--- | :--- |
| **1. Organization & Tenants** | Multi-company switcher (VT Developers, ABC Constructions, XYZ Builders) & RBAC simulation. |
| **2. Executive Dashboard** | WBS cost divergence, S-Curves, portfolio KPIs (₹73.75 Cr value), and critical alerts. |
| **3. Projects & Portfolio** | Multi-site command center with filtering, budget tracking, and single-project drilldown. |
| **4. Workforce Management** | Daily attendance muster with **P/A/H** toggles, trade categories, and live wage calculation. |
| **5. Inventory & Materials** | Permanent stock movement ledger: `Opening + Purchased − Issued = Closing Stock`. |
| **6. Procurement & Orders** | 8-stage automated workflow from site request to supplier bank payment + vendor rate comparison. |
| **7. Finance & Audited Ledger** | Immutable double-entry general ledger enforcing balanced debits & credits, P&L, balance sheet. |
| **8. BOQ & Cost Estimator** | Live parametric estimator calculating cement bags, steel MT, sand brass, bricks, labour & builder margin. |
| **9. Site Operations & AI Voice** | Daily tasks tracker + **AI Voice Note Transcriber** converting engineer speech into structured reports. |
| **10. Quality & Safety (HSE)** | Cube test logs (IS 456), safety incident-free counter (348 days), defect punch lists. |
| **11. Scheduling & Timeline** | Critical path timeline, milestones, and delay risk forecasting. |
| **12. CRM & Client Pipeline** | Inquiry tracking, site survey stages, and architectural proposal values. |
| **13. Customer Portal** | Milestone transparency, photo gallery, escrow security assurance. |
| **14. Mobile App Simulator** | Site engineer phone interface with offline queue simulation. |
| **15. Data Import Center** | Dedicated Excel/CSV ingestion tool with column mapper, duplicate detector, and rollback logs. |

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons.
- **Database (Schema ready)**: PostgreSQL with Row-Level Security (RLS) policies in `schema.sql`.
- **Theme Palette**:
  - Background: Deep Obsidian `#050811`
  - Cards & Panels: Midnight Space Blue `#070D1E` / `#0C152B`
  - Accents: Cyber Cyan `#06B6D4` / Sky Blue `#38BDF8` / Emerald `#10B981`

---

## 🚀 Getting Started

To run the application locally:

```bash
# 1. Start the Vite development server
npm run dev

# 2. Build for production
npm run build

# 3. Preview production build
npm run preview
```

Open `http://localhost:3000` (or the printed port) in your browser.
