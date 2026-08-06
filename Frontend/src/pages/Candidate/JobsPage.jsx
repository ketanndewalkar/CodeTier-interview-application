import { useState } from 'react';
import Sidebar from '../../components/dashboard/Sidebar/Sidebar';
import Navbar from '../../components/dashboard/Navbar/Navbar';
import JobsSectionPage from './JobsSection';

function DashboardLayout({ children }) {
  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans selection:bg-[#6C4F91] selection:text-white flex">
      {children}
    </div>
  );
}

function MainContent({ children, isCollapsed }) {
  return (
    <main
      className={`flex-1 ${isCollapsed ? 'ml-20' : 'ml-64'
        } transition-all duration-300 px-6 sm:px-8 pb-8 max-w-[1600px] mx-auto overflow-x-hidden`}
    >
      {children}
    </main>
  );
}

export default function JobsPage({ defaultTab = 'jobs' }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <DashboardLayout>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <MainContent isCollapsed={isCollapsed}>
        <Navbar />

        {activeTab === 'jobs' && <JobsSectionPage />}
      </MainContent>
    </DashboardLayout>
  );
}
