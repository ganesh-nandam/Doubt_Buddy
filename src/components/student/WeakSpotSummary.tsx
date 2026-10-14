import { TrendingUp, TrendingDown, Minus, Target, Sparkles } from 'lucide-react';
import type { WeakSpot } from '@/types';

const trendConfig = {
  improving: { icon: TrendingUp, color: 'text-brand-500', bg: 'bg-brand-500', label: 'Improving' },
  declining: { icon: TrendingDown, color: 'text-coral-500', bg: 'bg-coral-500', label: 'Declining' },
  stable: { icon: Minus, color: 'text-ink-400', bg: 'bg-ink-400', label: 'Stable' },
};

function masteryColor(mastery: number): string {
  if (mastery < 40) return 'bg-coral-500';
  if (mastery < 60) return 'bg-accent-500';
  return 'bg-brand-500';
}

interface WeakSpotSummaryProps {
  weakSpots: WeakSpot[];
}

export function WeakSpotSummary({ weakSpots }: WeakSpotSummaryProps) {
  const sorted = [...weakSpots].sort((a, b) => a.mastery - b.mastery);
  const avgMastery =
    weakSpots.length > 0
      ? Math.round(weakSpots.reduce((s, w) => s + w.mastery, 0) / weakSpots.length)
      : 0;

  return (
    <div className="rounded-3xl bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <Target className="text-coral-500" size={18} />
        <h3 className="font-display text-base font-bold text-ink-900">Weak-Spot Summary</h3>
        <span className="ml-auto rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-semibold text-ink-600">
          Avg {avgMastery}%
        </span>
      </div>

      {sorted.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-sm text-ink-400">No weak spots detected yet.</p>
          <p className="mt-1 text-xs text-ink-400">Start chatting to identify areas to improve.</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {sorted.map((spot) => {
            const cfg = trendConfig[spot.trend];
            const TrendIcon = cfg.icon;
            const isNew = spot.id.startsWith('dyn-');
            return (
              <div key={spot.id} className={isNew ? 'animate-fade-in-up' : ''}>
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-ink-800">{spot.topic}</span>
                    {isNew && (
                      <span className="flex items-center gap-0.5 rounded-full bg-accent-100 px-1.5 py-0.5 text-[9px] font-bold text-accent-600">
                        <Sparkles size={9} /> NEW
                      </span>
                    )}
                    <span className="rounded-md bg-ink-100 px-1.5 py-0.5 text-[10px] font-medium text-ink-500">
                      {spot.attempts} {spot.attempts === 1 ? 'attempt' : 'attempts'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-ink-700">{spot.mastery}%</span>
                    <TrendIcon className={cfg.color} size={14} />
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100">
                  <div
                    className={`h-full rounded-full ${masteryColor(spot.mastery)} transition-all duration-700`}
                    style={{ width: `${spot.mastery}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
