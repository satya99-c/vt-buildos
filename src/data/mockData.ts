import { Organization, Project, WorkerAttendance, InventoryItem, PurchaseOrder, JournalEntry } from '../types';

export const organizations: Organization[] = [
  {
    id: 'vt-dev',
    name: 'VT Developers',
    code: 'VT-HQ',
    plan: 'Internal Operations',
    branches: ['Main Office'],
    activeProjectsCount: 0,
  },
];

export const initialProjects: Project[] = [];

export const initialWorkers: WorkerAttendance[] = [];

export const initialInventory: InventoryItem[] = [];

export const initialPurchaseOrders: PurchaseOrder[] = [];

export const initialJournalEntries: JournalEntry[] = [];

export const sampleDailyTasks: any[] = [];
