import { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck, X } from 'lucide-react';

interface TeacherLoginProps {
  onAuthenticated: () => void;
  onCancel: () => void;
}

const TEACHER_PASSWORD = 'admin123';

export function TeacherLogin({ onAuthenticated, onCancel }: TeacherLoginProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === TEACHER_PASSWORD) {
      onAuthenticated();
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 backdrop-blur-sm animate-fade-in p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="rounded-3xl bg-white p-8 shadow-lift"
          style={shaking ? { animation: 'shake 0.4s' } : undefined}
        >
          <style>{`@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}`}</style>

          {/* Close button */}
          <button
            onClick={onCancel}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 transition-all hover:bg-ink-50 hover:text-ink-600"
          >
            <X size={18} />
          </button>

          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 shadow-lg">
              <ShieldCheck className="text-white" size={30} />
            </div>
            <h2 className="font-display text-2xl font-bold text-ink-900">Teacher Access</h2>
            <p className="mt-1 text-sm text-ink-500">
              Enter the teacher passcode to view the class dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">
                Passcode
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
                  size={18}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  placeholder="Enter passcode"
                  className={`w-full rounded-xl border-2 bg-ink-50 py-3 pl-11 pr-11 text-sm font-medium text-ink-900 outline-none transition-all ${
                    error
                      ? 'border-coral-500 bg-coral-50'
                      : 'border-transparent focus:border-brand-400 focus:bg-white'
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 transition-colors hover:text-ink-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-coral-500">
                  Incorrect passcode. Hint: try "admin123"
                </p>
              )}
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 py-3 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110 active:scale-[0.98]"
            >
              Enter Dashboard
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full text-center text-sm font-medium text-ink-400 transition-colors hover:text-ink-600"
            >
              Cancel
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-ink-400">
          Demo passcode: <span className="font-mono font-semibold text-ink-600">admin123</span>
        </p>
      </div>
    </div>
  );
}
