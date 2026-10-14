import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { classWeakSpotAggregation } from '@/data';

export function ClassWeakSpots() {
  const sorted = [...classWeakSpotAggregation].sort((a, b) => a.avgMastery - b.avgMastery);

  return (
    <div className="rounded-3xl bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-base font-bold text-ink-900">Class Weak-Spot Heatmap</h3>
        <span className="rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-semibold text-ink-600">
          {sorted.length} topics
        </span>
      </div>

      <div className="space-y-3">
        {sorted.map((spot) => {
          const isCritical = spot.avgMastery < 40;
          const isWarning = spot.avgMastery >= 40 && spot.avgMastery < 55;
          const barColor = isCritical ? 'bg-coral-500' : isWarning ? 'bg-accent-500' : 'bg-brand-500';

          return (
            <div key={spot.topic} className="flex items-center gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <div className={`h-2 w-2 shrink-0 rounded-full ${barColor}`} />
                <span className="truncate text-sm font-medium text-ink-700">{spot.topic}</span>
                <span className="shrink-0 rounded-md bg-ink-100 px-1.5 py-0.5 text-[10px] font-medium text-ink-500">
                  {spot.subject}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-ink-100">
                  <div
                    className={`h-full rounded-full ${barColor} transition-all duration-700`}
                    style={{ width: `${spot.avgMastery}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs font-bold text-ink-700">{spot.avgMastery}%</span>
                <span className="hidden w-16 text-right text-[10px] text-ink-400 sm:block">
                  {spot.studentsAffected} students
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
