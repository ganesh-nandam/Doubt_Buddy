import { Clock, AlertCircle, ChevronRight } from 'lucide-react';
import { students } from '@/data';
import type { Student } from '@/types';

const frustrationColors: Record<number, string> = {
  1: 'text-brand-500',
  2: 'text-brand-500',
  3: 'text-accent-500',
  4: 'text-accent-500',
  5: 'text-accent-500',
  6: 'text-coral-500',
  7: 'text-coral-500',
};

const frustrationBars: Record<number, string> = {
  1: 'bg-brand-500',
  2: 'bg-brand-500',
  3: 'bg-accent-500',
  4: 'bg-accent-500',
  5: 'bg-accent-500',
  6: 'bg-coral-500',
  7: 'bg-coral-500',
};

function formatEngagement(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

interface StudentRosterProps {
  onStudentClick: (student: Student) => void;
}

export function StudentRoster({ onStudentClick }: StudentRosterProps) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-base font-bold text-ink-900">Student Roster</h3>
        <span className="rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-semibold text-ink-600">
          {students.length} active
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ink-100 text-left">
              <th className="pb-2 pr-3 text-xs font-semibold text-ink-400">Student</th>
              <th className="hidden pb-2 pr-3 text-xs font-semibold text-ink-400 sm:table-cell">Top Struggle</th>
              <th className="hidden pb-2 pr-3 text-xs font-semibold text-ink-400 md:table-cell">Engagement</th>
              <th className="pb-2 pr-3 text-xs font-semibold text-ink-400">Frustration</th>
              <th className="pb-2 text-xs font-semibold text-ink-400"></th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const topStruggle = [...student.weakSpots].sort((a, b) => a.mastery - b.mastery)[0];
              return (
                <tr
                  key={student.id}
                  onClick={() => onStudentClick(student)}
                  className="group cursor-pointer border-b border-ink-50 transition-all hover:bg-brand-50/30"
                >
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-bold text-white">
                        {student.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink-800">{student.name}</p>
                        <p className="text-[10px] text-ink-400">{student.lastActive}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden py-3 pr-3 sm:table-cell">
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="text-coral-400" size={13} />
                      <span className="text-xs text-ink-600">{topStruggle?.topic}</span>
                    </div>
                    <span className="ml-4 text-[10px] text-ink-400">{topStruggle?.mastery}% mastery</span>
                  </td>
                  <td className="hidden py-3 pr-3 md:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Clock className="text-ink-400" size={13} />
                      <span className="text-xs font-medium text-ink-700">{formatEngagement(student.engagementMinutes)}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((bar) => (
                        <div
                          key={bar}
                          className={`h-3 w-1 rounded-full ${
                            bar <= student.frustrationLevel
                              ? frustrationBars[student.frustrationLevel]
                              : 'bg-ink-100'
                          }`}
                        />
                      ))}
                      <span className={`ml-1 text-xs font-bold ${frustrationColors[student.frustrationLevel]}`}>
                        {student.frustrationLevel}
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <ChevronRight className="text-ink-300 transition-all group-hover:translate-x-0.5 group-hover:text-brand-400" size={16} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
