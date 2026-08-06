import { ArrowRight } from 'lucide-react';
import { Toaster } from '../../ui/Toaster';

export default function QuickActionsCard({ onUpdateProfile }) {
  const handleUpdate = () => {
    if (onUpdateProfile) {
      onUpdateProfile();
    } else {
      Toaster('Profile settings updated successfully!', 'success');
    }
  };

  return (
    <div className="bg-[#110e17] border border-white/12 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
      {/* Title */}
      <h3 className="font-heading text-base font-bold text-white tracking-tight">
        Quick Actions
      </h3>

      {/* Subtext */}
      <p className="text-[11px] text-emerald-400/80 font-medium leading-relaxed">
        Update your profile to get better job recommendations.
      </p>

      {/* Action Button */}
      <button
        onClick={handleUpdate}
        className="w-full bg-[#5B3E81] hover:bg-[#6d499c] text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all duration-200 shadow-md border border-[#7C3AED]/40 cursor-pointer group"
      >
        <span>Update Profile</span>
        <ArrowRight className="w-4 h-4 text-purple-200 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
