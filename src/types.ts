export type TenantId = 'vt-dev' | 'abc-const' | 'xyz-build';

export interface Organization {
  id: TenantId;
  name: string;
  code: string;
  plan: 'Internal Operations' | 'SaaS Starter' | 'SaaS Professional' | 'SaaS Enterprise';
  branches: string[];
  activeProjectsCount: number;
}

export type UserRole = 
  | 'Owner' 
  | 'Administrator' 
  | 'Finance Manager' 
  | 'Project Manager' 
  | 'Site Engineer' 
  | 'Supervisor' 
  | 'Storekeeper' 
  | 'Customer' 
  | 'Supplier';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  assignedProjects: string[];
}

export interface Project {
  id: string;
  code: string;
  name: string;
  client: string;
  location: string;
  siteAddress: string;
  plotDimensions: string;
  buildingType: string;
  floors: number;
  contractAmount: number; // in INR
  budget: number;
  spent: number;
  progress: number; // percentage
  status: 'In Progress' | 'Design' | 'Construction' | 'Commissioning' | 'Delayed' | 'Completed';
  startDate: string;
  completionDate: string;
  projectManager: string;
  teamSize: number;
  cpi: number; // Cost Performance Index
  spi: number; // Schedule Performance Index
  image: string;
}

export interface WorkerAttendance {
  id: string;
  name: string;
  role: string;
  category: 'Skilled' | 'Unskilled' | 'Mason' | 'Carpenter' | 'Bar Bender';
  dailyWage: number;
  assignedSite: string;
  status: 'P' | 'A' | 'H'; // Present, Absent, Halfday
  toPayToday: number;
  mobile: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Cement' | 'Steel' | 'Aggregates' | 'Masonry' | 'Electrical' | 'Plumbing' | 'Finishes';
  unit: string;
  openingStock: number;
  purchased: number;
  issued: number;
  closingStock: number;
  minSafetyLevel: number;
  unitRate: number;
  lastUpdated: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  item: string;
  quantity: number;
  unit: string;
  amount: number;
  orderDate: string;
  deliveryDate: string;
  status: 'Draft' | 'Requested' | 'Approved' | 'Dispatched' | 'Delivered' | 'Paid';
  paymentDue: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  reference: string;
  account: string;
  description: string;
  debit: number;
  credit: number;
  project: string;
}

export interface BOQCalculationItem {
  item: string;
  category: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}
