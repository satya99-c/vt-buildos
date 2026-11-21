import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Project, WorkerAttendance, InventoryItem, PurchaseOrder, JournalEntry } from '../types';

let cachedClient: SupabaseClient | null = null;
let currentUrl: string = '';
let currentKey: string = '';

export function getSupabaseCredentials() {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('vt_supabase_url') || '' : '';
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem('vt_supabase_anon_key') || '' : '';

  return {
    url: storedUrl || envUrl,
    key: storedKey || envKey,
  };
}

export function getSupabase(): SupabaseClient | null {
  const { url, key } = getSupabaseCredentials();

  if (!url || !key) {
    return null;
  }

  if (cachedClient && currentUrl === url && currentKey === key) {
    return cachedClient;
  }

  try {
    currentUrl = url;
    currentKey = key;
    cachedClient = createClient(url, key);
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

export function saveSupabaseCredentials(url: string, key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('vt_supabase_url', url.trim());
    localStorage.setItem('vt_supabase_anon_key', key.trim());
    cachedClient = null; // force re-instantiation
  }
}

export function clearSupabaseCredentials() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('vt_supabase_url');
    localStorage.removeItem('vt_supabase_anon_key');
    cachedClient = null;
  }
}

// -------------------------------------------------------------
// DATABASE CRUD SERVICES
// -------------------------------------------------------------

// Projects
export async function dbFetchProjects(): Promise<Project[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return null;
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    code: row.code,
    name: row.name,
    client: row.client,
    location: row.location || '',
    siteAddress: row.site_address || '',
    plotDimensions: row.plot_dimensions || '',
    buildingType: row.building_type || 'Residential',
    floors: row.floors || 1,
    contractAmount: Number(row.contract_amount || 0),
    budget: Number(row.budget || 0),
    spent: Number(row.spent || 0),
    progress: Number(row.progress || 0),
    status: row.status || 'Construction',
    startDate: row.start_date || '',
    completionDate: row.completion_date || '',
    projectManager: row.project_manager || 'Site Manager',
    teamSize: row.team_size || 0,
    cpi: Number(row.cpi || 1.0),
    spi: Number(row.spi || 1.0),
    image: row.image || 'https://images.unsplash.com/photo-1541888946425-d0fbb18015f6?auto=format&fit=crop&w=800&q=80',
  }));
}

export async function dbInsertProject(p: Omit<Project, 'id'>): Promise<Project | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        code: p.code,
        name: p.name,
        client: p.client,
        location: p.location,
        site_address: p.siteAddress,
        plot_dimensions: p.plotDimensions,
        building_type: p.buildingType,
        floors: p.floors,
        contract_amount: p.contractAmount,
        budget: p.budget,
        spent: p.spent,
        progress: p.progress,
        status: p.status,
        start_date: p.startDate,
        completion_date: p.completionDate,
        project_manager: p.projectManager,
        team_size: p.teamSize,
        cpi: p.cpi,
        spi: p.spi,
        image: p.image,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error inserting project into Supabase:', error);
    return null;
  }

  return {
    ...p,
    id: data.id,
  };
}

// Workers
export async function dbFetchWorkers(): Promise<WorkerAttendance[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('workers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching workers:', error);
    return null;
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    role: row.role,
    category: row.category || 'Skilled',
    dailyWage: Number(row.daily_wage || 500),
    assignedSite: row.assigned_site || 'Site',
    status: row.status || 'P',
    toPayToday: Number(row.to_pay_today || 0),
    mobile: row.mobile || '',
  }));
}

export async function dbInsertWorker(w: Omit<WorkerAttendance, 'id'>): Promise<WorkerAttendance | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('workers')
    .insert([
      {
        name: w.name,
        role: w.role,
        category: w.category,
        daily_wage: w.dailyWage,
        assigned_site: w.assignedSite,
        status: w.status,
        to_pay_today: w.toPayToday,
        mobile: w.mobile,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error inserting worker:', error);
    return null;
  }

  return {
    ...w,
    id: data.id,
  };
}

export async function dbUpdateWorkerAttendance(id: string, status: string, toPayToday: number) {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { error } = await supabase
    .from('workers')
    .update({ status, to_pay_today: toPayToday })
    .eq('id', id);

  if (error) {
    console.error('Error updating worker attendance:', error);
    return false;
  }
  return true;
}

// Materials
export async function dbFetchMaterials(): Promise<InventoryItem[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching materials:', error);
    return null;
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    unit: row.unit,
    openingStock: Number(row.opening_stock || 0),
    purchased: Number(row.purchased || 0),
    issued: Number(row.issued || 0),
    closingStock: Number(row.closing_stock || 0),
    minSafetyLevel: Number(row.min_safety_level || 0),
    unitRate: Number(row.unit_rate || 0),
    lastUpdated: row.last_updated ? new Date(row.last_updated).toLocaleTimeString() : 'Recent',
  }));
}

export async function dbInsertMaterial(m: Omit<InventoryItem, 'id' | 'closingStock'>): Promise<InventoryItem | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('materials')
    .insert([
      {
        name: m.name,
        category: m.category,
        unit: m.unit,
        opening_stock: m.openingStock,
        purchased: m.purchased,
        issued: m.issued,
        min_safety_level: m.minSafetyLevel,
        unit_rate: m.unitRate,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error inserting material:', error);
    return null;
  }

  return {
    ...m,
    id: data.id,
    closingStock: Number(data.closing_stock || m.openingStock),
    lastUpdated: 'Just now',
  };
}

// Test Connection
export async function testSupabaseConnection(url: string, key: string): Promise<{ success: boolean; message: string }> {
  try {
    const testClient = createClient(url, key);
    const { data, error } = await testClient.from('organizations').select('count').limit(1);

    if (error) {
      if (error.code === '42P01') {
        return {
          success: true,
          message: 'Connected to Supabase! (Note: Run supabase_schema.sql to create tables).',
        };
      }
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Successfully connected and verified Supabase database!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to connect.' };
  }
}
