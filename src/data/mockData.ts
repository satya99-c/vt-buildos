import { Organization, Project, WorkerAttendance, InventoryItem, PurchaseOrder, JournalEntry } from '../types';

export const organizations: Organization[] = [
  {
    id: 'vt-dev',
    name: 'VT Developers',
    code: 'VT-HQ',
    plan: 'Internal Operations',
    branches: ['Hyderabad HQ', 'Jubilee Hills Hub', 'Financial District Site Office'],
    activeProjectsCount: 3,
  },
];

export const initialProjects: Project[] = [];

export const demoProjects: Project[] = [
  {
    id: 'proj-vt-101',
    code: 'VT-PRJ-101',
    name: 'VT Grandeur Luxury Towers',
    client: 'Srikanth Raju (Venkata Sai Estates)',
    location: 'Jubilee Hills, Road No. 36',
    siteAddress: 'Plot 412, Jubilee Hills, Hyderabad - 500033',
    plotDimensions: '120 x 80 ft (9,600 sq.ft)',
    buildingType: 'G+14 High-Rise Residential',
    floors: 14,
    contractAmount: 345000000, // 34.5 Cr
    budget: 310000000, // 31.0 Cr
    spent: 198400000, // 19.84 Cr
    progress: 68,
    status: 'Construction',
    startDate: '2025-04-15',
    completionDate: '2027-02-28',
    projectManager: 'Er. K. V. Sharma',
    teamSize: 48,
    cpi: 1.04,
    spi: 0.98,
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18015f6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'proj-vt-102',
    code: 'VT-PRJ-102',
    name: 'VT Lakefront Smart Villas',
    client: 'Ananya Rao (Greenfield Holdings)',
    location: 'Financial District, Nanakramguda',
    siteAddress: 'Survey 108, Outer Ring Road, Hyderabad - 500032',
    plotDimensions: '60 x 50 ft per Villa (24 Units)',
    buildingType: 'G+2 Gated Villa Community',
    floors: 3,
    contractAmount: 182000000, // 18.2 Cr
    budget: 165000000, // 16.5 Cr
    spent: 89000000, // 8.9 Cr
    progress: 54,
    status: 'Construction',
    startDate: '2025-08-01',
    completionDate: '2026-11-30',
    projectManager: 'Er. Ramesh Babu',
    teamSize: 32,
    cpi: 1.02,
    spi: 1.01,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'proj-vt-103',
    code: 'VT-PRJ-103',
    name: 'VT Horizon Commercial Hub',
    client: 'Navin Reddy (Reddy Enterprises)',
    location: 'Hitec City, Mindspace Zone',
    siteAddress: 'Block C, Cyberabad, Hyderabad - 500081',
    plotDimensions: '150 x 100 ft',
    buildingType: 'B2+G+9 Commercial Grade-A',
    floors: 10,
    contractAmount: 268000000, // 26.8 Cr
    budget: 242000000, // 24.2 Cr
    spent: 48400000, // 4.84 Cr
    progress: 22,
    status: 'Construction',
    startDate: '2026-01-10',
    completionDate: '2027-08-15',
    projectManager: 'Er. Mohammed Irfan',
    teamSize: 26,
    cpi: 0.99,
    spi: 0.96,
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
  },
];

export const initialWorkers: WorkerAttendance[] = [];

export const demoWorkers: WorkerAttendance[] = [
  { id: 'wrk-1', name: 'Raju Narayana', role: 'Head Mason', category: 'Mason', dailyWage: 950, assignedSite: 'VT Grandeur Luxury Towers', status: 'P', toPayToday: 950, mobile: '+91 98480 11223' },
  { id: 'wrk-2', name: 'Chandra Shekar', role: 'Bar Bender Lead', category: 'Bar Bender', dailyWage: 900, assignedSite: 'VT Grandeur Luxury Towers', status: 'P', toPayToday: 900, mobile: '+91 98480 22334' },
  { id: 'wrk-3', name: 'Subba Rao', role: 'Formwork Carpenter', category: 'Carpenter', dailyWage: 850, assignedSite: 'VT Lakefront Smart Villas', status: 'P', toPayToday: 850, mobile: '+91 98480 33445' },
  { id: 'wrk-4', name: 'Srinivas Varma', role: 'Concrete Pourer', category: 'Skilled', dailyWage: 800, assignedSite: 'VT Horizon Commercial Hub', status: 'P', toPayToday: 800, mobile: '+91 98480 44556' },
  { id: 'wrk-5', name: 'Balaram Naik', role: 'Excavation Helper', category: 'Unskilled', dailyWage: 650, assignedSite: 'VT Horizon Commercial Hub', status: 'H', toPayToday: 325, mobile: '+91 98480 55667' },
  { id: 'wrk-6', name: 'Kishan Kumar', role: 'Scaffolder Lead', category: 'Skilled', dailyWage: 850, assignedSite: 'VT Grandeur Luxury Towers', status: 'P', toPayToday: 850, mobile: '+91 98480 66778' },
];

export const initialInventory: InventoryItem[] = [];

export const demoInventory: InventoryItem[] = [
  { id: 'inv-1', name: 'Ultratech OPC 53 Grade Cement', category: 'Cement', unit: 'Bags (50kg)', openingStock: 600, purchased: 1200, issued: 1100, closingStock: 700, minSafetyLevel: 300, unitRate: 385, lastUpdated: '2026-11-21' },
  { id: 'inv-2', name: 'Tata Tiscon Fe550D TMT Rebar (16mm)', category: 'Steel', unit: 'Metric Ton (MT)', openingStock: 15, purchased: 45, issued: 38, closingStock: 22, minSafetyLevel: 10, unitRate: 64500, lastUpdated: '2026-11-21' },
  { id: 'inv-3', name: 'Tata Tiscon Fe550D TMT Rebar (12mm)', category: 'Steel', unit: 'Metric Ton (MT)', openingStock: 12, purchased: 30, issued: 25, closingStock: 17, minSafetyLevel: 8, unitRate: 65200, lastUpdated: '2026-11-20' },
  { id: 'inv-4', name: 'River Sand / Robo Sand Class-I', category: 'Aggregates', unit: 'Tippers (20T)', openingStock: 8, purchased: 24, issued: 20, closingStock: 12, minSafetyLevel: 5, unitRate: 28000, lastUpdated: '2026-11-21' },
  { id: 'inv-5', name: 'Red Clay Kiln Bricks (9x4x3 in)', category: 'Masonry', unit: 'Pieces', openingStock: 15000, purchased: 50000, issued: 35000, closingStock: 30000, minSafetyLevel: 10000, unitRate: 9.5, lastUpdated: '2026-11-19' },
  { id: 'inv-6', name: 'Polycab FRLS Copper Wiring (2.5 sq.mm)', category: 'Electrical', unit: 'Coils (90m)', openingStock: 40, purchased: 120, issued: 95, closingStock: 65, minSafetyLevel: 25, unitRate: 2150, lastUpdated: '2026-11-21' },
];

export const initialPurchaseOrders: PurchaseOrder[] = [];

export const demoPurchaseOrders: PurchaseOrder[] = [
  { id: 'PO-2026-081', supplier: 'Tata Steel Authorized Distributor', projectName: 'VT Grandeur Luxury Towers', category: 'Steel', orderDate: '2026-11-18', deliveryDate: '2026-11-23', status: 'In Transit', totalAmount: 2451000, paymentStatus: 'Partially Paid' },
  { id: 'PO-2026-082', supplier: 'UltraTech ReadyMix Concrete Plant', projectName: 'VT Grandeur Luxury Towers', category: 'Cement', orderDate: '2026-11-20', deliveryDate: '2026-11-22', status: 'Pending Approval', totalAmount: 1155000, paymentStatus: 'Pending' },
  { id: 'PO-2026-083', supplier: 'Sri Sai Ram Crushed Aggregates', projectName: 'VT Lakefront Smart Villas', category: 'Aggregates', orderDate: '2026-11-19', deliveryDate: '2026-11-21', status: 'Delivered', totalAmount: 672000, paymentStatus: 'Paid' },
];

export const initialJournalEntries: JournalEntry[] = [];

export const demoJournalEntries: JournalEntry[] = [
  { id: 'VCH-901', date: '2026-11-20', type: 'Bank Payment', referenceNo: 'NEFT-9921448', description: 'Payment to Tata Steel for 38 MT Rebar batch', debitAccount: 'Direct Project WIP - Steel', creditAccount: 'HDFC Current A/c - 0021', amount: 2451000, status: 'Posted' },
  { id: 'VCH-902', date: '2026-11-21', type: 'Cash Voucher', referenceNo: 'PETTY-0442', description: 'Weekly muster labour advance disbursement', debitAccount: 'Direct Labor Expenses', creditAccount: 'Site Petty Cash Box', amount: 185000, status: 'Posted' },
  { id: 'VCH-903', date: '2026-11-19', type: 'Client Receipt', referenceNo: 'RTGS-781923', description: 'Milestone 4 slab casting payment from Srikanth Raju', debitAccount: 'ICICI Escrow A/c - 8812', creditAccount: 'Customer Milestone Advances', amount: 4500000, status: 'Posted' },
];

export const sampleDailyTasks: any[] = [];
