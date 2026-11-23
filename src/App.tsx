import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ProjectsView } from './components/ProjectsView';
import { WorkforceView } from './components/WorkforceView';
import { InventoryView } from './components/InventoryView';
import { ProcurementView } from './components/ProcurementView';
import { FinanceView } from './components/FinanceView';
import { BOQEstimatorView } from './components/BOQEstimatorView';
import { SiteOperationsView } from './components/SiteOperationsView';
import { QualitySafetyView } from './components/QualitySafetyView';
import { SchedulingView } from './components/SchedulingView';
import { CRMView } from './components/CRMView';
import { CustomerPortalView } from './components/CustomerPortalView';
import { MobileSimulatorView } from './components/MobileSimulatorView';
import { DataImportCenterView } from './components/DataImportCenterView';
import { ReferenceGalleryView } from './components/ReferenceGalleryView';
import { WhatsAppSyncView } from './components/WhatsAppSyncView';
import { AICopilotDrawer } from './components/AICopilotDrawer';
import { QuickCreateModal } from './components/QuickCreateModal';
import { SupabaseModal } from './components/SupabaseModal';
import { ConstructionSplashScreen } from './components/ConstructionSplashScreen';
import { organizations, initialProjects, demoProjects } from './data/mockData';
import { Organization, TenantId, UserProfile, UserRole, Project } from './types';
import { dbFetchProjects } from './lib/supabase';

export const App: React.FC = () => {
  // Splash screen starts false so user lands directly into the interactive dashboard
  const [showSplash, setShowSplash] = useState(false);
  const [currentOrgId, setCurrentOrgId] = useState<TenantId>('vt-dev');
  const [currentRole, setCurrentRole] = useState<UserRole>('Owner');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [activeActionModal, setActiveActionModal] = useState<string | null>(null);

  const handleSelectQuickAction = (actionId: string) => {
    setActiveTab(actionId);
    setActiveActionModal(actionId);
  };

  // Sync projects from Supabase if connected
  const refreshProjectsFromDb = async () => {
    const dbProjects = await dbFetchProjects();
    if (dbProjects && dbProjects.length > 0) {
      setProjects(dbProjects);
    }
  };

  useEffect(() => {
    refreshProjectsFromDb();
  }, []);

  const currentOrg = organizations.find((o) => o.id === currentOrgId) || organizations[0];

  const currentUser: UserProfile = {
    id: 'usr-1',
    name: 'VT Administrator',
    email: 'admin@vtdevelopers.in',
    role: currentRole,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    assignedProjects: projects.map((p) => p.id),
  };

  const handleSelectOrg = (id: TenantId) => {
    setCurrentOrgId(id);
  };

  const handleSelectRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'Customer') {
      setActiveTab('customer-portal');
    } else if (role === 'Site Engineer') {
      setActiveTab('mobile-app');
    }
  };

  const handleLoadDemoData = () => {
    setProjects(demoProjects);
  };

  const handleResetData = () => {
    setProjects([]);
  };

  const handleAddProject = (p: Project) => {
    setProjects([p, ...projects]);
  };

  return (
    <div className="flex h-screen bg-[#050811] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar
        currentOrg={currentOrg}
        organizations={organizations}
        onSelectOrg={handleSelectOrg}
        currentRole={currentRole}
        onSelectRole={handleSelectRole}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <Header
          currentOrg={currentOrg}
          user={currentUser}
          projects={projects}
          onOpenQuickCreate={() => setIsQuickCreateOpen(true)}
          onOpenAiAssistant={() => setIsAiOpen(true)}
          onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
          onReplaySplash={() => setShowSplash(true)}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />

        {/* View Content (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#050811] relative">
          <div className="max-w-7xl mx-auto pb-12">
            {activeTab === 'dashboard' && (
              <DashboardView
                projects={projects}
                onNavigateToProjects={() => setActiveTab('projects')}
                onNavigateToWorkforce={() => setActiveTab('workforce')}
                onNavigateToInventory={() => setActiveTab('inventory')}
                onNavigateToBoq={() => setActiveTab('boq')}
                onNavigateToFinance={() => setActiveTab('finance')}
                onNavigateToScheduling={() => setActiveTab('scheduling')}
                onLoadDemoData={handleLoadDemoData}
                onResetData={handleResetData}
                onAddProject={handleAddProject}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsView
                projects={projects}
                onProjectsChange={(updated) => setProjects(updated)}
                onSelectProjectForCustomerView={() => setActiveTab('customer-portal')}
                autoOpenCreateModal={activeActionModal === 'projects'}
                onModalConsumed={() => setActiveActionModal(null)}
              />
            )}

            {activeTab === 'workforce' && (
              <WorkforceView
                autoOpenAddModal={activeActionModal === 'workforce'}
                onModalConsumed={() => setActiveActionModal(null)}
              />
            )}

            {activeTab === 'inventory' && (
              <InventoryView
                autoOpenAddModal={activeActionModal === 'inventory'}
                onModalConsumed={() => setActiveActionModal(null)}
              />
            )}

            {activeTab === 'procurement' && (
              <ProcurementView
                autoOpenCreateModal={activeActionModal === 'procurement'}
                onModalConsumed={() => setActiveActionModal(null)}
              />
            )}

            {activeTab === 'finance' && (
              <FinanceView
                autoOpenCreateModal={activeActionModal === 'finance'}
                onModalConsumed={() => setActiveActionModal(null)}
              />
            )}

            {activeTab === 'boq' && <BOQEstimatorView />}

            {activeTab === 'siteops' && <SiteOperationsView />}

            {activeTab === 'quality' && <QualitySafetyView />}

            {activeTab === 'scheduling' && <SchedulingView />}

            {activeTab === 'crm' && <CRMView />}

            {activeTab === 'customer-portal' && <CustomerPortalView project={projects[0]} />}

            {activeTab === 'mobile-app' && <MobileSimulatorView />}

            {activeTab === 'import-center' && <DataImportCenterView />}

            {activeTab === 'whatsapp-sync' && (
              <WhatsAppSyncView
                projects={projects}
                onProjectCreated={(newP) => setProjects([newP, ...projects])}
              />
            )}

            {activeTab === 'references' && <ReferenceGalleryView />}
          </div>
        </main>
      </div>

      {/* Supabase Live Settings & Schema Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConnectionChange={() => refreshProjectsFromDb()}
      />

      {/* AI Copilot Drawer */}
      <AICopilotDrawer
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        onNavigateToBoq={() => {
          setIsAiOpen(false);
          setActiveTab('boq');
        }}
      />

      {/* Quick Action Modal */}
      <QuickCreateModal
        isOpen={isQuickCreateOpen}
        onClose={() => setIsQuickCreateOpen(false)}
        onSelectAction={handleSelectQuickAction}
      />

      {/* Animated Construction Intro Splash Screen (Click anywhere to enter) */}
      {showSplash && <ConstructionSplashScreen onEnter={() => setShowSplash(false)} />}
    </div>
  );
};

export default App;
