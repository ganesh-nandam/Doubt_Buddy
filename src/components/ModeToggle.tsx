import { GraduationCap, Users } from 'lucide-react';
import type { Mode } from '@/types';

interface ModeToggleProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-2xl bg-ink-100 p-1.5 shadow-sm">
      <button
        onClick={() => onModeChange('student')}
        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
          mode === 'student'
            ? 'bg-white text-brand-600 shadow-soft'
            : 'text-ink-500 hover:text-ink-700'
        }`}
      >
        <GraduationCap size={18} />
        Student
      </button>
      <button
        onClick={() => onModeChange('teacher')}
        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
          mode === 'teacher'
            ? 'bg-white text-accent-600 shadow-soft'
            : 'text-ink-500 hover:text-ink-700'
        }`}
      >
        <Users size={18} />
        Teacher
      </button>
    </div>
  );
}
