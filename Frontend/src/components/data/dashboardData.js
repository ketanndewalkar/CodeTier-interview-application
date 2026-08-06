export const sidebarNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', active: true },
  { id: 'jobs', label: 'Jobs', icon: 'Briefcase', active: false },
  { id: 'applications', label: 'Applications', icon: 'FileText', active: false },
  { id: 'interviews', label: 'Interviews', icon: 'Calendar', active: false },
  { id: 'candidates', label: 'Candidates', icon: 'Users', active: false },
];

export const statsCardsData = [
  {
    id: 'total-jobs',
    title: 'Total Jobs',
    value: '12',
    badge: 'Active',
    badgeType: 'active',
    icon: 'Briefcase',
  },
  {
    id: 'total-applications',
    title: 'Total Applications',
    value: '450',
    badge: '+12.5%',
    badgeType: 'trend',
    icon: 'ShoppingBag',
  },
  {
    id: 'interviews-scheduled',
    title: 'Interviews Scheduled',
    value: '35',
    badge: '+8.2%',
    badgeType: 'trend',
    icon: 'Ticket',
  },
  {
    id: 'hired',
    title: 'Hired',
    value: '5',
    badge: '+11.1%',
    badgeType: 'trend',
    icon: 'UserCheck',
  },
];

export const applicationOverviewData = {
  chartData: [
    { date: '18 Oct', applications: 50, shortlisted: 20 },
    { date: '25 Oct', applications: 115, shortlisted: 55 },
    { date: '1 Nov', applications: 100, shortlisted: 45 },
    { date: '8 Nov', applications: 160, shortlisted: 90 },
    { date: '15 Nov', applications: 195, shortlisted: 100 },
  ],
  summaryStats: [
    { label: 'Total Applications', count: '450', change: '+12.5%' },
    { label: 'Shortlisted', count: '120', change: '+8.3%' },
    { label: 'Interviews', count: '35', change: '+5.7%' },
    { label: 'Hired', count: '5', change: '+11.1%' },
  ],
};

export const applicationStatusData = {
  total: 450,
  statuses: [
    { name: 'Applied', value: 250, percentage: '55.6%', color: '#7C3AED' },
    { name: 'Shortlisted', value: 120, percentage: '26.7%', color: '#10B981' },
    { name: 'Interviewing', value: 35, percentage: '7.8%', color: '#F59E0B' },
    { name: 'Offered', value: 8, percentage: '1.8%', color: '#3B82F6' },
    { name: 'Rejected', value: 37, percentage: '8.1%', color: '#EF4444' },
  ],
};

export const interviewOverviewData = {
  chartData: [
    { date: '18 Oct', scheduled: 18, completed: 8, cancelled: 2, pending: 4 },
    { date: '25 Oct', scheduled: 28, completed: 12, cancelled: 3, pending: 6 },
    { date: '1 Nov', scheduled: 22, completed: 10, cancelled: 1, pending: 5 },
    { date: '8 Nov', scheduled: 30, completed: 15, cancelled: 2, pending: 7 },
    { date: '15 Nov', scheduled: 35, completed: 18, cancelled: 5, pending: 12 },
  ],
  legend: [
    { name: 'Scheduled', count: 35, color: '#8B5CF6' },
    { name: 'Completed', count: 18, color: '#10B981' },
    { name: 'Cancelled', count: 5, color: '#EF4444' },
    { name: 'Pending', count: 12, color: '#F59E0B' },
  ],
};

export const recentApplicationsData = [
  {
    id: 1,
    company: 'ABC Technologies',
    logoText: 'ABC',
    logoBg: 'bg-[#6C4F91]',
    position: 'Frontend Developer',
    techStack: 'React • JavaScript',
    status: 'SHORTLISTED',
    appliedOn: '16 Nov 2024',
  },
  {
    id: 2,
    company: 'Netron Solutions',
    logoText: 'N',
    logoBg: 'bg-[#2563EB]',
    position: 'Backend Developer',
    techStack: 'Node.js • MongoDB',
    status: 'INTERVIEWING',
    appliedOn: '15 Nov 2024',
  },
  {
    id: 3,
    company: 'TechCorp',
    logoText: 'TC',
    logoBg: 'bg-[#0D9488]',
    position: 'UI/UX Designer',
    techStack: 'Figma • Adobe XD',
    status: 'APPLIED',
    appliedOn: '14 Nov 2024',
  },
  {
    id: 4,
    company: 'InnoVision',
    logoText: 'IV',
    logoBg: 'bg-[#DC2626]',
    position: 'Full Stack Developer',
    techStack: 'MERN Stack',
    status: 'REJECTED',
    appliedOn: '13 Nov 2024',
  },
  {
    id: 5,
    company: 'CloudNet',
    logoText: '☁',
    logoBg: 'bg-[#7C3AED]',
    position: 'DevOps Engineer',
    techStack: 'AWS • Docker',
    status: 'INTERVIEWING',
    appliedOn: '12 Nov 2024',
  },
];

export const topJobMatchesData = [
  { id: 1, role: 'Frontend Developer', score: 92 },
  { id: 2, role: 'UI/UX Designer', score: 85 },
  { id: 3, role: 'Full Stack Developer', score: 78 },
  { id: 4, role: 'Backend Developer', score: 72 },
  { id: 5, role: 'DevOps Engineer', score: 65 },
];
