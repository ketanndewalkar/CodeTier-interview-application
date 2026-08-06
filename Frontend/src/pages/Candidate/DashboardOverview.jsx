import DashboardHeader from '../../components/common/dashboard/DashboardHeader/DashboardHeader';
import StatsCards from '../../components/common/dashboard/StatsCards/StatsCards';
import ApplicationOverview from '../../components/common/dashboard/ApplicationOverview/ApplicationOverview';
import ApplicationStatus from '../../components/common/dashboard/ApplicationStatus/ApplicationStatus';
import InterviewOverview from '../../components/common/dashboard/InterviewOverview/InterviewOverview';
import RecentApplications from '../../components/common/dashboard/RecentApplications/RecentApplications';
import JobMatches from '../../components/common/dashboard/JobMatches/JobMatches';
import { useDashboardStats } from './hooks/useDashboardStats';
import { useJobs } from './hooks/useJobs';
import { useUserStore } from '../../store/userStore';

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-[#110e17] border border-white/10 rounded-2xl p-6 h-32" />
      ))}
    </div>
  );
}

export default function DashboardOverview() {
  const { user } = useUserStore();
  const { stats, isLoading, isError } = useDashboardStats();
  const { jobs, isLoading: jobsLoading } = useJobs();

  return (
    <>
      <DashboardHeader name={user?.name ?? user?.username ?? 'there'} />

      {/* Stats Cards — live data */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <StatsCards
          totalApplications={stats?.totalApplications ?? 0}
          scheduledInterviews={stats?.scheduledInterviews ?? 0}
          hired={stats?.hired ?? 0}
          activeJobListings={stats?.activeJobListings ?? 0}
          isError={isError}
        />
      )}

      {/* Middle Section: Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6 items-stretch">
        <div className="lg:col-span-7">
          <ApplicationOverview stats={stats} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-5 space-y-6">
          <ApplicationStatus stats={stats} isLoading={isLoading} />
          <InterviewOverview stats={stats} isLoading={isLoading} />
        </div>
      </div>

      {/* Bottom Section: Recent Applications & Job Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <RecentApplications
            applications={stats?.recentApplications ?? []}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:col-span-5">
          <JobMatches jobs={jobs} isLoading={jobsLoading} />
        </div>
      </div>
    </>
  );
}
