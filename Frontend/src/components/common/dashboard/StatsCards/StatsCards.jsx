import StatCard from './StatCard';

/**
 * @param {{
 *   totalApplications: number,
 *   scheduledInterviews: number,
 *   hired: number,
 *   activeJobListings: number,
 *   isError?: boolean,
 * }} props
 */
export default function StatsCards({
  totalApplications = 0,
  scheduledInterviews = 0,
  hired = 0,
  activeJobListings = 0,
  isError = false,
}) {
  const cards = [
    {
      id: 'active-jobs',
      title: 'Active Job Listings',
      value: isError ? '—' : activeJobListings,
      badgeType: 'active',
      iconName: 'Briefcase',
    },
    {
      id: 'total-applications',
      title: 'Total Applications',
      value: isError ? '—' : totalApplications,
      badgeType: 'trend',
      iconName: 'ShoppingBag',
    },
    {
      id: 'interviews-scheduled',
      title: 'Interviews Scheduled',
      value: isError ? '—' : scheduledInterviews,
      badgeType: 'trend',
      iconName: 'Ticket',
    },
    {
      id: 'hired',
      title: 'Hired',
      value: isError ? '—' : hired,
      badgeType: 'trend',
      iconName: 'UserCheck',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {cards.map((card) => (
        <StatCard
          key={card.id}
          title={card.title}
          value={card.value}
          badgeType={card.badgeType}
          iconName={card.iconName}
        />
      ))}
    </div>
  );
}
