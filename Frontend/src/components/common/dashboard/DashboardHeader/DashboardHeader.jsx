export default function DashboardHeader({ name = "Ketan" }) {
  return (
    <div className="mb-8 space-y-1.5">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight flex items-center gap-2">
        Welcome back, {name}!
      </h1>
      <p className="text-sm sm:text-base text-purple-200/70 font-normal">
        Here's what's happening with your job search today.
      </p>
    </div>
  );
}
