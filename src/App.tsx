import { useState } from 'react';
import { BrainCircuit, Bell, Settings } from 'lucide-react';
import type { Mode } from '@/types';
import { ModeToggle } from '@/components/ModeToggle';
import { TeacherLogin } from '@/components/TeacherLogin';
import { StudentMode } from '@/components/student/StudentMode';
import { TeacherMode } from '@/components/teacher/TeacherMode';

function App() {
  const [mode, setMode] = useState<Mode>('student');
  const [teacherAuthed, setTeacherAuthed] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleModeChange = (newMode: Mode) => {
    if (newMode === 'teacher') {
      if (teacherAuthed) {
        setMode('teacher');
      } else {
        setShowLoginModal(true);
      }
    } else {
      setMode('student');
    }
  };

  const handleAuthenticated = () => {
    setTeacherAuthed(true);
    setMode('teacher');
    setShowLoginModal(false);
  };

  const handleCancelLogin = () => {
    setShowLoginModal(false);
  };

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-md">
              <BrainCircuit className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold tracking-tight text-ink-900">
                DOUBT<span className="text-brand-500">-</span>BUDDY
              </h1>
            </div>
          </div>

          {/* Mode Toggle */}
          <ModeToggle mode={mode} onModeChange={handleModeChange} />

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-ink-400 transition-all hover:bg-ink-50 hover:text-ink-600">
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-coral-500" />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-400 transition-all hover:bg-ink-50 hover:text-ink-600">
              <Settings size={18} />
            </button>
            <div className="ml-1 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-bold text-white shadow-sm">
              {mode === 'student' ? 'AS' : 'TR'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {mode === 'student' ? <StudentMode /> : <TeacherMode />}

      {/* Teacher login modal overlay */}
      {showLoginModal && (
        <TeacherLogin onAuthenticated={handleAuthenticated} onCancel={handleCancelLogin} />
      )}
    </div>
  );
}

export default App;
