import { Clock, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import type { DoubtHistoryItem } from '@/types';
import { doubtHistory } from '@/data';

const statusConfig = {
  resolved: { icon: CheckCircle2, color: 'text-brand-500', bg: 'bg-brand-50', label: 'Resolved' },
  'in-progress': { icon: Loader2, color: 'text-accent-500', bg: 'bg-accent-50', label: 'In Progress' },
  open: { icon: Circle, color: 'text-ink-400', bg: 'bg-ink-50', label: 'Open' },
};

interface DoubtHistoryProps {
  extraDoubts: DoubtHistoryItem[];
}

export function DoubtHistory({ extraDoubts }: DoubtHistoryProps) {
  const allDoubts = [...extraDoubts, ...doubtHistory];

  return (
    <div className="rounded-3xl bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <Clock className="text-ink-400" size={18} />
        <h3 className="font-display text-base font-bold text-ink-900">Doubt History</h3>
        <span className="ml-auto rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-semibold text-ink-600">
          {allDoubts.length}
        </span>
      </div>

      <div className="space-y-2.5 max-h-[340px] overflow-y-auto scrollbar-thin pr-1">
        {allDoubts.map((doubt) => {
          const cfg = statusConfig[doubt.status];
          const Icon = cfg.icon;
          return (
            <div
              key={doubt.id}
              className="group cursor-pointer rounded-xl border border-ink-100 p-3 transition-all hover:border-brand-200 hover:bg-brand-50/50 hover:shadow-soft"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-800">{doubt.topic}</p>
                  <p className="mt-0.5 truncate text-xs text-ink-500">{doubt.question}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-[10px] font-medium text-ink-400">{doubt.date}</span>
                    <span className="text-[10px] text-ink-300">·</span>
                    <span className="text-[10px] font-medium text-ink-400">{doubt.subject}</span>
                  </div>
                </div>
                <div className={`flex shrink-0 items-center gap-1 rounded-full ${cfg.bg} px-2 py-1`}>
                  <Icon className={`${cfg.color} ${doubt.status === 'in-progress' ? 'animate-spin' : ''}`} size={12} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
