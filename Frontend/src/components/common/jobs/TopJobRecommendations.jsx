import { ChevronRight, Sparkles } from 'lucide-react';

export default function TopJobRecommendations() {
  const recommendations = [
    { id: 1, title: 'Senior React Developer', company: 'TechCorp' },
    { id: 2, title: 'Lead Product Designer', company: 'DesignHub' },
    { id: 3, title: 'DevOps Architect', company: 'CloudNet' },
  ];

  return (
    <div className="bg-[#110e17] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#a855f7]" />
          <h3 className="text-sm font-semibold text-white">Top Recommendations</h3>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-xl bg-[#181322] border border-white/5 hover:border-[#6C4F91]/50 transition-colors group cursor-pointer"
          >
            <div>
              <div className="text-xs font-semibold text-white group-hover:text-[#d8b4fe] transition-colors">
                {item.title}
              </div>
              <div className="text-[11px] text-white/50">{item.company}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-[#a855f7] transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
}
