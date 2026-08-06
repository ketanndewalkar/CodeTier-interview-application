export const INITIAL_ORG_STATS = {
  activeJobs: { value: 12, label: 'Open positions', change: '+20%', trend: 'up' },
  totalApplications: { value: 486, label: 'Received applications', change: '+15%', trend: 'up' },
  interviewsScheduled: { value: 42, label: 'Upcoming interviews', change: '+8%', trend: 'up' },
  candidatesHired: { value: 18, label: 'Successful hires', change: '+12%', trend: 'up' },
};

export const INITIAL_PIPELINE = [
  { label: 'Applications', count: 486, percentage: '100%', color: 'from-[#7c3aed] to-[#6d28d9]', hex: '#7c3aed' },
  { label: 'Shortlisted', count: 120, percentage: '24.7%', color: 'from-[#10b981] to-[#059669]', hex: '#10b981' },
  { label: 'Interview Scheduled', count: 45, percentage: '9.3%', color: 'from-[#f59e0b] to-[#d97706]', hex: '#f59e0b' },
  { label: 'Hired', count: 18, percentage: '3.7%', color: 'from-[#3b82f6] to-[#2563eb]', hex: '#3b82f6' },
];

export const RECENT_APPLICATIONS_DATA = [
  {
    id: 'app-1',
    applicationId: '6a8e314207b092445ad45354',
    candidate: {
      name: 'Anjali Sharma',
      avatar: 'AS',
      color: 'bg-[#6C4F91]',
      email: 'anjali.sharma@email.com',
      phone: '+91 98765 43210',
      location: 'Chatrapati Sambhaji Nagar',
      experienceYears: '2 Years',
      noticePeriod: '15 Days',
      expectedSalary: '₹ 200,000',
      portfolio: '—',
      coverLetter: 'Passionate developer excited to contribute.',
      message: 'i feel i am great fit for it.'
    },
    jobRole: 'Full Stack Developer',
    department: 'Engineering',
    experience: 'Junior',
    jobType: 'Full Time',
    appliedOn: '01 Nov 2024',
    status: 'SHORTLISTED',
    schedulingStatus: 'INTERVIEW SCHEDULED',
    statusBg: 'bg-[#2a1d3f] text-[#c084fc] border border-[#7c3aed]/40',
    resumeName: 'Anjali_Sharma_Resume.pdf',
    resumeSize: '1.2 MB',
    timeline: [
      { title: 'Application Submitted', desc: 'Candidate submitted the application', time: '01 Nov 2024, 10:24 AM' },
      { title: 'Application Shortlisted', desc: 'Marked as shortlisted by HR', time: '02 Nov 2024, 02:15 PM' },
      { title: 'Interview Scheduled', desc: 'Interview has been scheduled', time: '03 Nov 2024, 11:30 AM' }
    ]
  },
  {
    id: 'app-2',
    applicationId: '7b9f425318c103556be56465',
    candidate: {
      name: 'Rahul Patil',
      avatar: 'RP',
      color: 'bg-indigo-800',
      email: 'rahul.patil@gmail.com',
      phone: '+91 98123 45678',
      location: 'Pune, India',
      experienceYears: '5 Years',
      noticePeriod: '30 Days',
      expectedSalary: '₹ 1,500,000',
      portfolio: 'https://github.com/rahulpatil',
      coverLetter: 'Passionate Backend Engineer with expertise in Node.js & Go.',
      message: 'Looking forward to contributing to your engineering team.'
    },
    jobRole: 'Backend Developer',
    department: 'Engineering',
    experience: 'Mid Level',
    jobType: 'Full Time',
    appliedOn: '31 Oct 2024',
    status: 'APPLIED',
    schedulingStatus: 'NOT SCHEDULED',
    statusBg: 'bg-blue-950/80 text-blue-400 border border-blue-500/30',
    resumeName: 'Rahul_Patil_Backend_Resume.pdf',
    resumeSize: '2.1 MB',
    timeline: [
      { title: 'Application Submitted', desc: 'Candidate submitted the application', time: '31 Oct 2024, 04:12 PM' }
    ]
  },
  {
    id: 'app-3',
    applicationId: '8c0a536429d214667cf67576',
    candidate: {
      name: 'Amit Kumar',
      avatar: 'AK',
      color: 'bg-purple-900',
      email: 'amit.kumar@email.com',
      phone: '+91 97654 32109',
      location: 'Bengaluru, India',
      experienceYears: '6 Years',
      noticePeriod: 'Immediate',
      expectedSalary: '₹ 2,200,000',
      portfolio: 'https://amitkumar.io',
      coverLetter: 'DevOps & Cloud Automation specialist with AWS & Kubernetes certifications.',
      message: 'Ready for immediate onboarding and infrastructure scaling.'
    },
    jobRole: 'DevOps Engineer',
    department: 'Engineering',
    experience: 'Senior',
    jobType: 'Full Time',
    appliedOn: '30 Oct 2024',
    status: 'INTERVIEW',
    schedulingStatus: 'INTERVIEW SCHEDULED',
    statusBg: 'bg-purple-950/80 text-purple-300 border border-purple-500/30',
    resumeName: 'Amit_Kumar_DevOps.pdf',
    resumeSize: '1.8 MB',
    timeline: [
      { title: 'Application Submitted', desc: 'Candidate submitted the application', time: '30 Oct 2024, 09:15 AM' },
      { title: 'Shortlisted for Interview', desc: 'Moved to technical interview stage', time: '30 Oct 2024, 03:00 PM' }
    ]
  },
  {
    id: 'app-4',
    applicationId: '9d1b647530e325778de78687',
    candidate: {
      name: 'Deepak Singh',
      avatar: 'DS',
      color: 'bg-rose-900',
      email: 'deepak.singh@email.com',
      phone: '+91 96543 21098',
      location: 'Delhi NCR, India',
      experienceYears: '3 Years',
      noticePeriod: '60 Days',
      expectedSalary: '₹ 1,100,000',
      portfolio: 'https://deepaksingh.dev',
      coverLetter: 'Full stack developer proficient in React and Python.',
      message: 'Applying for full stack engineering roles.'
    },
    jobRole: 'Full Stack Developer',
    department: 'Engineering',
    experience: 'Junior',
    jobType: 'Full Time',
    appliedOn: '29 Oct 2024',
    status: 'REJECTED',
    schedulingStatus: 'CANCELLED',
    statusBg: 'bg-rose-950/80 text-rose-400 border border-rose-500/30',
    resumeName: 'Deepak_Singh_Resume.pdf',
    resumeSize: '1.4 MB',
    timeline: [
      { title: 'Application Submitted', desc: 'Candidate submitted the application', time: '29 Oct 2024, 01:20 PM' },
      { title: 'Application Rejected', desc: 'Did not meet experience criteria', time: '30 Oct 2024, 10:00 AM' }
    ]
  },
  {
    id: 'app-5',
    applicationId: '0e2c758641f436889ef89798',
    candidate: {
      name: 'Nikita Tiwari',
      avatar: 'NT',
      color: 'bg-indigo-900',
      email: 'nikita.tiwari@tech.org',
      phone: '+91 95432 10987',
      location: 'Mumbai, India',
      experienceYears: '4 Years',
      noticePeriod: '15 Days',
      expectedSalary: '₹ 1,400,000',
      portfolio: 'https://nikitatiwari.design',
      coverLetter: 'Frontend developer with sharp eye for UI polish & animation.',
      message: 'Excited about building high-craft design systems.'
    },
    jobRole: 'Frontend Developer',
    department: 'Engineering',
    experience: 'Mid Level',
    jobType: 'Full Time',
    appliedOn: '29 Oct 2024',
    status: 'APPLIED',
    schedulingStatus: 'NOT SCHEDULED',
    statusBg: 'bg-blue-950/80 text-blue-400 border border-blue-500/30',
    resumeName: 'Nikita_Tiwari_Frontend.pdf',
    resumeSize: '1.6 MB',
    timeline: [
      { title: 'Application Submitted', desc: 'Candidate submitted the application', time: '29 Oct 2024, 06:45 PM' }
    ]
  },
  {
    id: 'app-6',
    applicationId: '1f3d869752a547990fa90809',
    candidate: {
      name: 'Priya Kapoor',
      avatar: 'PK',
      color: 'bg-purple-700',
      email: 'priya.kapoor@design.com',
      phone: '+91 94321 09876',
      location: 'Bengaluru, India',
      experienceYears: '4 Years',
      noticePeriod: '30 Days',
      expectedSalary: '₹ 1,600,000',
      portfolio: 'https://behance.net/priyakapoor',
      coverLetter: 'UI/UX Designer specializing in SaaS products and design systems.',
      message: 'Looking to lead user research and component system design.'
    },
    jobRole: 'UI/UX Designer',
    department: 'Design',
    experience: 'Mid Level',
    jobType: 'Full Time',
    appliedOn: '28 Oct 2024',
    status: 'SHORTLISTED',
    schedulingStatus: 'NOT SCHEDULED',
    statusBg: 'bg-[#2a1d3f] text-[#c084fc] border border-[#7c3aed]/40',
    resumeName: 'Priya_Kapoor_Portfolio_Resume.pdf',
    resumeSize: '3.4 MB',
    timeline: [
      { title: 'Application Submitted', desc: 'Candidate submitted the application', time: '28 Oct 2024, 11:10 AM' },
      { title: 'Application Shortlisted', desc: 'Shortlisted by Design Lead', time: '29 Oct 2024, 04:30 PM' }
    ]
  },
  {
    id: 'app-7',
    applicationId: '2a4e970863b658001ab01910',
    candidate: {
      name: 'Sagar Mehta',
      avatar: 'SM',
      color: 'bg-blue-800',
      email: 'sagar.mehta@email.com',
      phone: '+91 93210 98765',
      location: 'Ahmedabad, India',
      experienceYears: '5 Years',
      noticePeriod: '30 Days',
      expectedSalary: '₹ 1,800,000',
      portfolio: 'https://github.com/sagarmehta',
      coverLetter: 'Backend Architect with microservices expertise.',
      message: 'Interested in backend infrastructure role.'
    },
    jobRole: 'Backend Developer',
    department: 'Engineering',
    experience: 'Mid Level',
    jobType: 'Full Time',
    appliedOn: '30 Oct 2024',
    status: 'APPLIED',
    schedulingStatus: 'NOT SCHEDULED',
    statusBg: 'bg-blue-950/80 text-blue-400 border border-blue-500/30',
    resumeName: 'Sagar_Mehta_Resume.pdf',
    resumeSize: '1.9 MB',
    timeline: [
      { title: 'Application Submitted', desc: 'Candidate submitted the application', time: '30 Oct 2024, 02:30 PM' }
    ]
  },
  {
    id: 'app-8',
    applicationId: '3b5f081974c769112bc12021',
    candidate: {
      name: 'Yash Khan',
      avatar: 'YK',
      color: 'bg-rose-800',
      email: 'yash.khan@dev.io',
      phone: '+91 92109 87654',
      location: 'Hyderabad, India',
      experienceYears: '2 Years',
      noticePeriod: '15 Days',
      expectedSalary: '₹ 800,000',
      portfolio: '—',
      coverLetter: 'DevOps enthusiast looking for junior cloud engineering roles.',
      message: 'Eager to learn CI/CD pipelines.'
    },
    jobRole: 'DevOps Engineer',
    department: 'Engineering',
    experience: 'Junior',
    jobType: 'Full Time',
    appliedOn: '27 Oct 2024',
    status: 'REJECTED',
    schedulingStatus: 'CANCELLED',
    statusBg: 'bg-rose-950/80 text-rose-400 border border-rose-500/30',
    resumeName: 'Yash_Khan_Resume.pdf',
    resumeSize: '0.9 MB',
    timeline: [
      { title: 'Application Submitted', desc: 'Candidate submitted the application', time: '27 Oct 2024, 08:00 AM' },
      { title: 'Application Rejected', desc: 'Minimum 5 years required for this senior position', time: '28 Oct 2024, 09:30 AM' }
    ]
  }
];

export const ACTIVE_JOBS_DATA = [
  {
    id: 'job-1',
    title: 'Frontend Developer',
    level: 'Mid Level • Full Time',
    department: 'Engineering',
    departmentBg: 'bg-[#2e1a47] text-[#c084fc] border border-[#7c3aed]/30',
    location: 'Bangalore, India',
    status: 'OPEN',
    statusBg: 'bg-emerald-950/90 text-emerald-400 border border-emerald-500/30',
    applicationsCount: 128,
    newAppsCount: '+12 New',
    createdOn: '18 Nov 2024',
    iconType: 'code',
    iconBg: 'bg-[#2d124d] text-[#a855f7]',
    actionText: 'View'
  },
  {
    id: 'job-2',
    title: 'Backend Developer',
    level: 'Mid Level • Full Time',
    department: 'Engineering',
    departmentBg: 'bg-[#2e1a47] text-[#c084fc] border border-[#7c3aed]/30',
    location: 'Bangalore, India',
    status: 'OPEN',
    statusBg: 'bg-emerald-950/90 text-emerald-400 border border-emerald-500/30',
    applicationsCount: 90,
    newAppsCount: '+8 New',
    createdOn: '17 Nov 2024',
    iconType: 'server',
    iconBg: 'bg-[#1e293b] text-[#38bdf8]',
    actionText: 'View'
  },
  {
    id: 'job-3',
    title: 'DevOps Engineer',
    level: 'Senior Level • Full Time',
    department: 'Engineering',
    departmentBg: 'bg-[#2e1a47] text-[#c084fc] border border-[#7c3aed]/30',
    location: 'Pune, India',
    status: 'PAUSED',
    statusBg: 'bg-amber-950/90 text-amber-400 border border-amber-500/30',
    applicationsCount: 60,
    newAppsCount: '+5 New',
    createdOn: '16 Nov 2024',
    iconType: 'cloud',
    iconBg: 'bg-[#451a03] text-[#f97316]',
    actionText: 'View'
  },
  {
    id: 'job-4',
    title: 'UI/UX Designer',
    level: 'Mid Level • Full Time',
    department: 'Design',
    departmentBg: 'bg-[#4a1d3f] text-[#f472b6] border border-[#ec4899]/30',
    location: 'Mumbai, India',
    status: 'OPEN',
    statusBg: 'bg-emerald-950/90 text-emerald-400 border border-emerald-500/30',
    applicationsCount: 64,
    newAppsCount: '+9 New',
    createdOn: '15 Nov 2024',
    iconType: 'pen',
    iconBg: 'bg-[#3b0764] text-[#e879f9]',
    actionText: 'View'
  },
  {
    id: 'job-5',
    title: 'Data Analyst',
    level: 'Entry Level • Full Time',
    department: 'Analytics',
    departmentBg: 'bg-[#1e3a8a]/60 text-[#60a5fa] border border-[#3b82f6]/30',
    location: 'Hyderabad, India',
    status: 'CLOSED',
    statusBg: 'bg-rose-950/90 text-rose-400 border border-rose-500/30',
    applicationsCount: 45,
    newAppsCount: '+3 New',
    createdOn: '14 Nov 2024',
    iconType: 'chart',
    iconBg: 'bg-[#450a0a] text-[#f87171]',
    actionText: 'View Summary'
  },
  {
    id: 'job-6',
    title: 'QA Automation Engineer',
    level: 'Mid Level • Full Time',
    department: 'Engineering',
    departmentBg: 'bg-[#2e1a47] text-[#c084fc] border border-[#7c3aed]/30',
    location: 'Chennai, India',
    status: 'PAUSED',
    statusBg: 'bg-amber-950/90 text-amber-400 border border-amber-500/30',
    applicationsCount: 30,
    newAppsCount: '+2 New',
    createdOn: '13 Nov 2024',
    iconType: 'shield',
    iconBg: 'bg-[#042f2e] text-[#2dd4bf]',
    actionText: 'View'
  },
  {
    id: 'job-7',
    title: 'Technical Writer',
    level: 'Entry Level • Part Time',
    department: 'Content',
    departmentBg: 'bg-[#064e3b]/60 text-[#34d399] border border-[#10b981]/30',
    location: 'Remote',
    status: 'DRAFT',
    statusBg: 'bg-zinc-800/90 text-zinc-400 border border-zinc-700/50',
    applicationsCount: 0,
    newAppsCount: '-',
    createdOn: '12 Nov 2024',
    iconType: 'file',
    iconBg: 'bg-[#1e1b4b] text-[#818cf8]',
    actionText: 'Edit'
  },
  {
    id: 'job-8',
    title: 'Product Manager',
    level: 'Senior Level • Full Time',
    department: 'Product',
    departmentBg: 'bg-[#713f12]/60 text-[#fbbf24] border border-[#f59e0b]/30',
    location: 'Bangalore, India',
    status: 'DRAFT',
    statusBg: 'bg-zinc-800/90 text-zinc-400 border border-zinc-700/50',
    applicationsCount: 0,
    newAppsCount: '-',
    createdOn: '11 Nov 2024',
    iconType: 'lock',
    iconBg: 'bg-[#451a03] text-[#fbbf24]',
    actionText: 'Edit'
  }
];

export const UPCOMING_INTERVIEWS_DATA = [
  {
    id: 'int-1',
    timePill: '10:00 AM',
    candidate: { name: 'Anjali Sharma', role: 'Frontend Developer', avatar: 'AS', color: 'bg-[#7c3aed]' },
    round: 'Technical Round',
    date: '18 Nov 2024 • 10:00 AM',
    interviewer: { name: 'Vikram Kumar', avatarImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' }
  },
  {
    id: 'int-2',
    timePill: '02:00 PM',
    candidate: { name: 'Rahul Patil', role: 'Backend Developer', avatar: 'RP', color: 'bg-[#5b21b6]' },
    round: 'Technical Round',
    date: '18 Nov 2024 • 02:00 PM',
    interviewer: { name: 'Sagar Mehta', avatarImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' }
  },
  {
    id: 'int-3',
    timePill: '04:00 PM',
    candidate: { name: 'Amit Kumar', role: 'DevOps Engineer', avatar: 'AK', color: 'bg-[#4c1d95]' },
    round: 'HR Round',
    date: '18 Nov 2024 • 04:00 PM',
    interviewer: { name: 'Priya Kapoor', avatarImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' }
  }
];

export const HIRING_PERFORMANCE_METRICS = [
  {
    title: 'Average Hiring Time',
    value: '18 Days',
    change: '+10%',
    color: 'text-[#c084fc]',
    bg: 'bg-purple-950/60 text-[#c084fc] border-purple-500/20'
  },
  {
    title: 'Interview Success Rate',
    value: '72%',
    change: '+6%',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/20'
  },
  {
    title: 'Offer Acceptance Rate',
    value: '85%',
    change: '+8%',
    color: 'text-amber-400',
    bg: 'bg-amber-950/60 text-amber-400 border-amber-500/20'
  }
];
