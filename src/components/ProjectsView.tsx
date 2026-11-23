import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  Plus,
  Search,
  LayoutGrid,
  List,
  MapPin,
  X,
  ChevronRight,
  Database,
  Building,
} from 'lucide-react';
import { Project } from '../types';
import { dbFetchProjects, dbInsertProject } from '../lib/supabase';

interface ProjectsViewProps {
  projects: Project[];
  onSelectProjectForCustomerView?: (project: Project) => void;
  onProjectsChange?: (projects: Project[]) => void;
  autoOpenCreateModal?: boolean;
  onModalConsumed?: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects: initialPropsProjects,
  onProjectsChange,
  autoOpenCreateModal,
  onModalConsumed,
}) => {
  const [projects, setProjects] = useState<Project[]>(initialPropsProjects);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  useEffect(() => {
    if (autoOpenCreateModal) {
      setShowNewProjectModal(true);
      if (onModalConsumed) onModalConsumed();
    }
  }, [autoOpenCreateModal]);

  // New project form state
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [siteAddress, setSiteAddress] = useState('');
  const [contractAmount, setContractAmount] = useState(0);
  const [budgetAmount, setBudgetAmount] = useState(0);
  const [plotDims, setPlotDims] = useState('');
  const [floors, setFloors] = useState(0);
  const [buildingType, setBuildingType] = useState('Residential Villa');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadDb() {
      const dbProjects = await dbFetchProjects();
      if (dbProjects && dbProjects.length > 0) {
        setProjects(dbProjects);
        if (onProjectsChange) onProjectsChange(dbProjects);
      }
    }
    loadDb();
  }, []);

  const handleCreateProject = async () => {
    if (!projectName.trim() || !clientName.trim()) {
      alert('Please enter both Project Name and Client Name.');
      return;
    }

    setSaving(true);
    const newProjData: Omit<Project, 'id'> = {
      code: 'VT-PRJ-' + (projects.length + 101),
      name: projectName,
      client: clientName,
      location: siteAddress.split(',')[1]?.trim() || siteAddress.split(',')[0]?.trim() || 'Site',
      siteAddress: siteAddress,
      plotDimensions: plotDims,
      buildingType: buildingType,
      floors: Number(floors),
      contractAmount: Number(contractAmount),
      budget: Number(budgetAmount),
      spent: 0,
      progress: 0,
      status: 'Construction',
      startDate: new Date().toISOString().split('T')[0],
      completionDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      projectManager: 'Site Lead Engineer',
      teamSize: 12,
      cpi: 1.0,
      spi: 1.0,
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18015f6?auto=format&fit=crop&w=800&q=80',
    };

    const saved = await dbInsertProject(newProjData);
    const finalizedProject: Project = saved || {
      ...newProjData,
      id: 'proj-' + Date.now(),
    };

    const updated = [finalizedProject, ...projects];
    setProjects(updated);
    if (onProjectsChange) onProjectsChange(updated);

    setSaving(false);
    setShowNewProjectModal(false);
    setProjectName('');
    setClientName('');
    setSiteAddress('');
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPhase = selectedPhase === 'All' || p.status === selectedPhase;
    return matchesSearch && matchesPhase;
  });

  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);
  const avgProgress =
    projects.length > 0 ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-[#141C2E] border border-cyan-400/40 text-cyan-400">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">Projects Portfolio Command Center</h1>
              <p className="text-xs text-slate-400">
                Multi-project governance, budget tracking, and milestones (Synced to Supabase)
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowNewProjectModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-sm transition cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Summary Metrics - Solid Panels, No Gradients */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0E1424] p-4 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Total Active Projects</div>
          <div className="text-2xl font-bold text-white mt-1 font-mono-numbers">{projects.length} Sites</div>
          <div className="text-[11px] text-cyan-400 mt-0.5">Live database tracking</div>
        </div>

        <div className="bg-[#0E1424] p-4 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Total Portfolio Budget</div>
          <div className="text-2xl font-bold text-white mt-1 font-mono-numbers">
            ₹{(totalBudget / 10000000).toFixed(2)} Cr
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
            Spent: ₹{(totalSpent / 10000000).toFixed(2)} Cr
          </div>
        </div>

        <div className="bg-[#0E1424] p-4 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Average Site Progress</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1 font-mono-numbers">{avgProgress}%</div>
          <div className="w-full bg-[#111726] h-1.5 rounded-full overflow-hidden mt-1.5">
            <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${avgProgress}%` }}></div>
          </div>
        </div>

        <div className="bg-[#0E1424] p-4 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Database Persistence</div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs mt-2">
            <Database className="w-4 h-4" />
            <span>Supabase Sync Active</span>
          </div>
        </div>
      </div>

      {/* Filter and View Toggle Toolbar - Rounded-2xl */}
      <div className="bg-[#0E1424] p-3 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by project, client, or site..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111726] border border-slate-700/80 rounded-2xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 bg-[#111726] p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl cursor-pointer transition ${viewMode === 'grid' ? 'bg-[#141C2E] text-cyan-300' : 'text-slate-400'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-xl cursor-pointer transition ${viewMode === 'list' ? 'bg-[#141C2E] text-cyan-300' : 'text-slate-400'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Projects List / Grid / Empty State */}
      {filteredProjects.length === 0 ? (
        <div className="bg-[#0E1424] p-16 rounded-3xl border border-slate-800 text-center space-y-4">
          <Building className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Construction Projects Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click "+ Add New Project" above to create your first construction site. It will be stored directly into your Supabase database!
          </p>
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-cyan-400 text-slate-950 font-bold text-xs hover:bg-cyan-300 transition"
          >
            Create First Project
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedProject(p)}
              className="bg-[#0E1424] rounded-3xl border border-slate-800 overflow-hidden cursor-pointer flex flex-col justify-between hover:border-cyan-400/40 transition group shadow-sm"
            >
              <div className="h-44 w-full relative overflow-hidden bg-slate-900">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-xl bg-black/80 text-[11px] font-mono text-cyan-300 font-bold border border-cyan-400/30">
                    {p.code}
                  </span>
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#141C2E] text-cyan-300 border border-cyan-400/40">
                    {p.status}
                  </span>
                </div>

                <div className="absolute bottom-2.5 left-3 right-3 bg-black/60 backdrop-blur-sm p-2 rounded-xl">
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span>{p.location}</span>
                  </p>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="text-xs text-slate-400 flex justify-between">
                  <span>Client: <strong className="text-slate-200">{p.client}</strong></span>
                  <span className="font-mono text-cyan-300 font-bold">₹{(p.contractAmount / 10000000).toFixed(2)} Cr</span>
                </div>

                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800 text-slate-400">
                  <span>Site Manager: {p.projectManager}</span>
                  <span className="text-cyan-400 font-bold flex items-center gap-0.5">
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#0E1424] rounded-3xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-[#111726] text-slate-400 font-semibold">
                <th className="p-3.5">Code & Project</th>
                <th className="p-3.5">Client</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5 text-right">Contract Value</th>
                <th className="p-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredProjects.map((p) => (
                <tr key={p.id} onClick={() => setSelectedProject(p)} className="hover:bg-slate-800/20 transition cursor-pointer">
                  <td className="p-3.5">
                    <div className="font-bold text-white">{p.name}</div>
                    <div className="text-[10px] text-cyan-400 font-mono">{p.code}</div>
                  </td>
                  <td className="p-3.5 text-slate-300">{p.client}</td>
                  <td className="p-3.5 text-slate-400">{p.location}</td>
                  <td className="p-3.5 text-right font-mono text-white">
                    ₹{(p.contractAmount / 10000000).toFixed(2)} Cr
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#141C2E] text-cyan-300 border border-cyan-400/30">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Single Project Modal - Rounded-3xl */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0E1424] border border-cyan-400/40 rounded-3xl w-full max-w-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-cyan-400 font-mono">{selectedProject.code}</span>
                <h3 className="text-lg font-bold text-white">{selectedProject.name}</h3>
                <p className="text-xs text-slate-400">{selectedProject.siteAddress}</p>
              </div>
              <button onClick={() => setSelectedProject(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#111726] p-3.5 rounded-2xl border border-slate-800">
                <div className="text-slate-400">Client</div>
                <div className="text-white font-bold mt-0.5">{selectedProject.client}</div>
              </div>
              <div className="bg-[#111726] p-3.5 rounded-2xl border border-slate-800">
                <div className="text-slate-400">Contract Value</div>
                <div className="text-emerald-400 font-bold font-mono mt-0.5">
                  ₹{(selectedProject.contractAmount / 10000000).toFixed(2)} Cr
                </div>
              </div>
              <div className="bg-[#111726] p-3.5 rounded-2xl border border-slate-800">
                <div className="text-slate-400">Plot Dimensions</div>
                <div className="text-white mt-0.5">{selectedProject.plotDimensions}</div>
              </div>
              <div className="bg-[#111726] p-3.5 rounded-2xl border border-slate-800">
                <div className="text-slate-400">Building Type & Floors</div>
                <div className="text-white mt-0.5">{selectedProject.buildingType} ({selectedProject.floors} Floors)</div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-5 py-2 rounded-2xl bg-slate-800 text-xs text-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW PROJECT MODAL - Rounded-3xl */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0E1424] border border-cyan-400/40 rounded-3xl w-full max-w-xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Create New Construction Project</h3>
              </div>
              <button onClick={() => setShowNewProjectModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Project Name *</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Skyline Luxury Villa"
                  className="w-full bg-[#111726] border border-slate-700/80 rounded-2xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Client Name *</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. K. Subrahmanyam"
                  className="w-full bg-[#111726] border border-slate-700/80 rounded-2xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="col-span-2">
                <label className="text-slate-400 block mb-1 font-medium">Site Address & Location</label>
                <input
                  type="text"
                  value={siteAddress}
                  onChange={(e) => setSiteAddress(e.target.value)}
                  placeholder="Plot 42, Beach Road Extension, Kakinada"
                  className="w-full bg-[#111726] border border-slate-700/80 rounded-2xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Contract Amount (₹)</label>
                <input
                  type="number"
                  value={contractAmount === 0 ? '' : contractAmount}
                  placeholder="0"
                  onChange={(e) => setContractAmount(e.target.value === '' ? 0 : Number(e.target.value))}
                  className="w-full bg-[#111726] border border-slate-700/80 rounded-2xl p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Estimated Budget (₹)</label>
                <input
                  type="number"
                  value={budgetAmount === 0 ? '' : budgetAmount}
                  placeholder="0"
                  onChange={(e) => setBudgetAmount(e.target.value === '' ? 0 : Number(e.target.value))}
                  className="w-full bg-[#111726] border border-slate-700/80 rounded-2xl p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Plot Dimensions</label>
                <input
                  type="text"
                  value={plotDims}
                  onChange={(e) => setPlotDims(e.target.value)}
                  placeholder="e.g. 50 ft x 80 ft"
                  className="w-full bg-[#111726] border border-slate-700/80 rounded-2xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Floors</label>
                <input
                  type="number"
                  value={floors === 0 ? '' : floors}
                  placeholder="0"
                  onChange={(e) => setFloors(e.target.value === '' ? 0 : Number(e.target.value))}
                  className="w-full bg-[#111726] border border-slate-700/80 rounded-2xl p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800 text-xs">
              <button onClick={() => setShowNewProjectModal(false)} className="px-4 py-2 rounded-2xl bg-slate-800 text-slate-300">
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={saving}
                className="px-5 py-2 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                <span>{saving ? 'Saving to Database...' : 'Save & Store in Database'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
