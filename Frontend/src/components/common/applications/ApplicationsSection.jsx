import { useState, useMemo } from 'react';
import ApplicationsHeader from './ApplicationsHeader';
import ApplicationsTable from './ApplicationsTable';
import ApplicationStatusCard from './ApplicationStatusCard';
import ApplicationInsightsCard from './ApplicationInsightsCard';
import QuickActionsCard from './QuickActionsCard';
import ApplicationDetailModal from './ApplicationDetailModal';
import { useApplications } from '../../../pages/Candidate/hooks/useApplications';

function ApplicationsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-20 bg-white/5 rounded-xl" />
      ))}
    </div>
  );
}

export default function ApplicationsSection() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const { applications, isLoading, isError, refetch } = useApplications();

  // Filter list based on selected filter tab
  const filteredApplications = useMemo(() => {
    if (!applications) return [];
    if (activeFilter === 'All') return applications;
    return applications.filter(
      (app) => app.applicationStatus?.toUpperCase() === activeFilter.toUpperCase()
    );
  }, [applications, activeFilter]);

  const counts = useMemo(() => {
    const list = applications || [];
    return {
      all: list.length,
      applied: list.filter((i) => i.applicationStatus === 'APPLIED').length,
      shortlisted: list.filter((i) => i.applicationStatus === 'SHORTLISTED').length,
      interviewing: list.filter((i) => i.applicationStatus === 'INTERVIEWING').length,
      rejected: list.filter((i) => i.applicationStatus === 'REJECTED').length,
    };
  }, [applications]);

  return (
    <div className="space-y-6">
      {/* Header with Title and Filter Tabs */}
      <ApplicationsHeader
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        counts={counts}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      {/* Main Grid: Table on Left (9 cols), Cards on Right (3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Applications Table (Left 9/12) */}
        <div className="lg:col-span-9">
          {isLoading ? (
            <div className="bg-[#110e17] border border-white/12 rounded-2xl p-6 sm:p-7 shadow-xl">
              <ApplicationsSkeleton />
            </div>
          ) : isError ? (
            <div className="bg-[#110e17] border border-white/12 rounded-2xl p-6 sm:p-7 shadow-xl text-center space-y-3">
              <p className="text-white/50">Failed to load applications.</p>
              <button onClick={refetch} className="text-[#c084fc] text-sm underline cursor-pointer">
                Retry
              </button>
            </div>
          ) : applications?.length === 0 ? (
            <div className="bg-[#110e17] border border-white/12 rounded-2xl py-16 px-6 text-center shadow-xl">
              <h3 className="text-white font-semibold text-lg mb-2">No Applications Yet</h3>
              <p className="text-purple-200/50 text-sm">
                You haven't applied to any jobs. Explore the Jobs tab to find open positions.
              </p>
            </div>
          ) : (
            <ApplicationsTable
              applications={filteredApplications}
              onViewDetails={(app) => setSelectedApp(app)}
            />
          )}
        </div>

        {/* Right Sidebar Stack (Right 3/12) */}
        <div className="lg:col-span-3 space-y-5">
          <ApplicationStatusCard />
          <ApplicationInsightsCard />
          <QuickActionsCard />
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApp && (
        <ApplicationDetailModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </div>
  );
}
