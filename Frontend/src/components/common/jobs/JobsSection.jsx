import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import JobsHeader from './JobsHeader';
import JobFilters from './JobFilters';
import JobCard from './JobCard';
import JobPagination from './JobPagination';
import JobDetails from './JobDetails';
import ApplicationForm from '../applicationForm/ApplicationForm';
import { useJobs } from '../../../pages/Candidate/hooks/useJobs';

const JOBS_PER_PAGE = 5;

function JobsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl border border-white/10 bg-[#110e17] p-6 h-52 animate-pulse"
        />
      ))}
    </div>
  );
}

export default function JobsSection() {
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('Newest');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyingJob, setApplyingJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { jobs, isLoading, isError, refetch } = useJobs();

  // Client-side filter by active tab (OPEN / CLOSED / PAUSED) and search term
  const filtered = useMemo(() => {
    let result = [...jobs];

    if (activeTab === 'open') result = result.filter((j) => j.status === 'OPEN');
    else if (activeTab === 'closed') result = result.filter((j) => j.status === 'CLOSED');
    else if (activeTab === 'paused') result = result.filter((j) => j.status === 'PAUSED');

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (j) =>
          j.title?.toLowerCase().includes(term) ||
          j.requiredSkills?.some((s) => s.toLowerCase().includes(term))
      );
    }

    if (sortBy === 'Newest') {
      result = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'Oldest') {
      result = result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'Deadline') {
      result = result.sort((a, b) => new Date(a.applicationDeadline) - new Date(b.applicationDeadline));
    }

    return result;
  }, [jobs, activeTab, searchTerm, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / JOBS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * JOBS_PER_PAGE, currentPage * JOBS_PER_PAGE);

  if (selectedJob) {
    return (
      <JobDetails
        job={selectedJob}
        onBack={() => setSelectedJob(null)}
        onApply={(job) => { setSelectedJob(null); setApplyingJob(job); }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Page Header with Tabs */}
      <JobsHeader
        activeTab={activeTab}
        setActiveTab={(tab) => { setActiveTab(tab); setCurrentPage(1); }}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        searchTerm={searchTerm}
        setSearchTerm={(val) => { setSearchTerm(val); setCurrentPage(1); }}
      />

      {/* Filter Options Row */}
      {showFilters && <JobFilters onClearAll={() => { setSearchTerm(''); setActiveTab('all'); }} />}

      {/* Meta Row: Count & Sorting */}
      <div className="flex items-center justify-between text-xs text-white/60 mb-3 pt-1">
        <span className="font-medium text-white/70">
          {isLoading ? 'Loading…' : `${filtered.length} job${filtered.length !== 1 ? 's' : ''} found`}
        </span>

        <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
          <span>Sort by:</span>
          <div className="relative group">
            <button className="flex items-center gap-1 font-semibold text-white">
              <span>{sortBy}</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/50" />
            </button>
            <div className="absolute right-0 top-6 bg-[#110e17] border border-white/10 rounded-xl shadow-2xl z-20 hidden group-hover:block min-w-[120px]">
              {['Newest', 'Oldest', 'Deadline'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSortBy(opt)}
                  className={`block w-full text-left px-4 py-2.5 text-xs hover:bg-white/5 transition-colors ${sortBy === opt ? 'text-[#c084fc] font-bold' : 'text-white/70'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Job Cards List */}
      {isLoading ? (
        <JobsSkeleton />
      ) : isError ? (
        <div className="py-12 text-center text-white/50 space-y-3">
          <p>Failed to load jobs.</p>
          <button onClick={refetch} className="text-[#c084fc] text-xs underline cursor-pointer">Retry</button>
        </div>
      ) : paginated.length === 0 ? (
        <div className="py-12 text-center text-white/50">
          <p>No jobs match your filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {paginated.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onViewDetails={(j) => setSelectedJob(j)}
              onApply={(j) => setApplyingJob(j)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !isError && filtered.length > JOBS_PER_PAGE && (
        <JobPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      {/* Application Form Modal */}
      {applyingJob && (
        <ApplicationForm
          job={applyingJob}
          isModal={true}
          onCancel={() => setApplyingJob(null)}
          onSuccess={() => setApplyingJob(null)}
        />
      )}
    </div>
  );
}
