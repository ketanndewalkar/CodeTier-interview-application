import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OrgSidebar from '../../components/common/organization/OrgSidebar';
import OrgHeader from '../../components/common/organization/OrgHeader';
import OrgDashboardOverview from '../../components/common/organization/OrgDashboardOverview';
import OrgJobsView from '../../components/common/organization/OrgJobsView';
import OrgApplicationsView from '../../components/common/organization/OrgApplicationsView';
import OrgInterviewsView from '../../components/common/organization/OrgInterviewsView';
import OrgCandidatesView from '../../components/common/organization/OrgCandidatesView';
import CreateJobModal from '../../components/common/organization/CreateJobModal';
import toast from 'react-hot-toast';


export default function OrganizationDashboard({ initialTab = 'dashboard' }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from path or prop
  const getTabFromPath = (pathname) => {
    const parts = pathname.split('/').filter(Boolean);
    if (
      parts.length > 1 &&
      ['dashboard', 'jobs', 'applications', 'interviews', 'candidates'].includes(parts[1])
    ) {
      return parts[1];
    }
    return initialTab;
  };

  const [activeTab, setActiveTab] = useState(() => getTabFromPath(location.pathname));
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);

  useEffect(() => {
    const currentTab = getTabFromPath(location.pathname);
    if (currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [location.pathname]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/organization/${tabId}`, { replace: true });
  };

  const handleCreateJobClick = () => {
    setJobToEdit(null);
    setIsCreateJobOpen(true);
  };

  const handleEditJobClick = (job) => {
    setJobToEdit(job);
    setIsCreateJobOpen(true);
  };

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans selection:bg-[#7c3aed] selection:text-white flex flex-col">
      {/* Sidebar Navigation */}
      <OrgSidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'
          } flex flex-col min-h-screen`}
      >
        {/* Top Header */}
        <OrgHeader
          onCreateJobClick={handleCreateJobClick}
          onSearch={(query) => {
            if (activeTab === 'dashboard') {
              handleTabChange('applications');
            }
          }}
        />

        {/* Tab Specific Views */}
        <main className="flex-1 p-6 sm:p-8 max-w-[1600px] w-full mx-auto">
          {activeTab === 'dashboard' && (
            <OrgDashboardOverview
              onCreateJobClick={handleCreateJobClick}
              onNavigateTab={handleTabChange}
            />
          )}

          {activeTab === 'jobs' && (
            <OrgJobsView onCreateJobClick={handleCreateJobClick} onEditJobClick={handleEditJobClick} />
          )}

          {activeTab === 'applications' && <OrgApplicationsView />}

          {activeTab === 'interviews' && <OrgInterviewsView />}

          {activeTab === 'candidates' && <OrgCandidatesView />}
        </main>
      </div>

      {/* Modals */}
      <CreateJobModal
        isOpen={isCreateJobOpen}
        onClose={() => {
          setIsCreateJobOpen(false);
          setJobToEdit(null);
        }}
        jobToEdit={jobToEdit}
      />

    </div>
  );
}
