import { X, Clock, HelpCircle, CheckCircle2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { Student } from '@/types';

interface StudentDetailProps {
  student: Student | null;
  onClose: () => void;
}

const trendConfig = {
  improving: { icon: TrendingUp, color: 'text-brand-500' },
  declining: { icon: TrendingDown, color: 'text-coral-500' },
  stable: { icon: Minus, color: 'text-ink-400' },
};

function formatEngagement(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

export function StudentDetail({ student, onClose }: StudentDetailProps) {
  if (!student) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-ink-950/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="h-full w-full max-w-md overflow-y-auto scrollbar-thin bg-white shadow-lift animate-slide-in"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'slideInRight 0.3s ease-out' }}
      >
        <style>{`@keyframes slideInRight{0%{transform:translateX(100%)}100%{transform:translateX(0)}}`}</style>

        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-br from-brand-500 to-brand-600 px-6 py-5 text-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 transition-all hover:bg-white/20"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold backdrop-blur-sm">
              {student.avatar}
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">{student.name}</h3>
              <p className="text-sm text-white/80">Last active {student.lastActive}</p>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-6">
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-ink-50 p-3 text-center">
              <Clock className="mx-auto mb-1 text-ink-400" size={16} />
              <p className="text-sm font-bold text-ink-900">{formatEngagement(student.engagementMinutes)}</p>
              <p className="text-[10px] text-ink-400">Engagement</p>
            </div>
            <div className="rounded-xl bg-ink-50 p-3 text-center">
              <HelpCircle className="mx-auto mb-1 text-ink-400" size={16} />
              <p className="text-sm font-bold text-ink-900">{student.doubtsAsked}</p>
              <p className="text-[10px] text-ink-400">Doubts Asked</p>
            </div>
            <div className="rounded-xl bg-ink-50 p-3 text-center">
              <CheckCircle2 className="mx-auto mb-1 text-ink-400" size={16} />
              <p className="text-sm font-bold text-ink-900">{student.doubtsResolved}</p>
              <p className="text-[10px] text-ink-400">Resolved</p>
            </div>
          </div>

          {/* Frustration meter */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-bold text-ink-800">Frustration Level</h4>
              <span className={`text-sm font-bold ${
                student.frustrationLevel >= 6 ? 'text-coral-500' :
                student.frustrationLevel >= 4 ? 'text-accent-500' : 'text-brand-500'
              }`}>
                {student.frustrationLevel}/7
              </span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map((level) => (
                <div
                  key={level}
                  className={`h-2 flex-1 rounded-full ${
                    level <= student.frustrationLevel
                      ? student.frustrationLevel >= 6
                        ? 'bg-coral-500'
                        : student.frustrationLevel >= 4
                        ? 'bg-accent-500'
                        : 'bg-brand-500'
                      : 'bg-ink-100'
                  }`}
                />
              ))}
            </div>
            {student.frustrationLevel >= 6 && (
              <p className="mt-2 rounded-lg bg-coral-50 px-3 py-2 text-xs text-coral-600">
                High frustration detected — consider reaching out for a 1:1 session.
              </p>
            )}
          </div>

          {/* Weak spots */}
          <div>
            <h4 className="mb-3 text-sm font-bold text-ink-800">Weak Spots Breakdown</h4>
            <div className="space-y-3">
              {[...student.weakSpots].sort((a, b) => a.mastery - b.mastery).map((spot) => {
                const cfg = trendConfig[spot.trend];
                const TrendIcon = cfg.icon;
                return (
                  <div key={spot.id} className="rounded-xl border border-ink-100 p-3">
                    <div className="mb-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-ink-800">{spot.topic}</span>
                        <span className="rounded-md bg-ink-100 px-1.5 py-0.5 text-[10px] font-medium text-ink-500">
                          {spot.subject}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-ink-700">{spot.mastery}%</span>
                        <TrendIcon className={cfg.color} size={14} />
                      </div>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                      <div
                        className={`h-full rounded-full ${
                          spot.mastery < 40 ? 'bg-coral-500' :
                          spot.mastery < 60 ? 'bg-accent-500' : 'bg-brand-500'
                        } transition-all duration-700`}
                        style={{ width: `${spot.mastery}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-[10px] text-ink-400">{spot.attempts} attempts · {spot.trend}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action */}
          <button className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg active:scale-95">
            Assign Personalized Practice
          </button>
        </div>
      </div>
    </div>
  );
}
