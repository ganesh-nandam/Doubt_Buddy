import { useState, useEffect } from 'react';
import { PenLine, CheckCircle2, Eye, Lightbulb, RotateCcw, Sparkles } from 'lucide-react';
import type { PracticeQuestion } from '@/types';

interface PracticeQuestionsProps {
  questions: PracticeQuestion[];
}

export function PracticeQuestions({ questions }: PracticeQuestionsProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  // Reset all state when the questions change (new weak spots detected)
  useEffect(() => {
    setAnswers({});
    setChecked({});
    setShowHint({});
    setCompleted({});
  }, [questions]);

  const handleCheck = (id: string, correctAnswer: string) => {
    const userAnswer = (answers[id] || '').trim().toLowerCase().replace(/\s/g, '');
    const expected = correctAnswer.trim().toLowerCase().replace(/\s/g, '');
    const isCorrect = userAnswer === expected;
    setChecked({ ...checked, [id]: true });
    if (isCorrect) setCompleted({ ...completed, [id]: true });
  };

  const handleReset = (id: string) => {
    setAnswers({ ...answers, [id]: '' });
    setChecked({ ...checked, [id]: false });
    setCompleted({ ...completed, [id]: false });
  };

  const completedCount = Object.values(completed).filter(Boolean).length;

  return (
    <div className="rounded-3xl bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <PenLine className="text-brand-500" size={18} />
        <h3 className="font-display text-base font-bold text-ink-900">Personalized Practice</h3>
        <span className="ml-auto rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-600">
          {completedCount}/{questions.length} done
        </span>
      </div>

      {questions.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-sm text-ink-400">No practice questions yet.</p>
          <p className="mt-1 text-xs text-ink-400">
            Weak spots from your chat will appear here.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-xs text-ink-500">
            Based on your weak spots — tackle these to build mastery.
          </p>

          <div className="space-y-3">
            {questions.map((q, idx) => {
              const isDone = completed[q.id];
              const isChecked = checked[q.id];
              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border p-4 transition-all animate-fade-in-up ${
                    isDone
                      ? 'border-brand-200 bg-brand-50/50'
                      : 'border-ink-100 bg-ink-50/30'
                  }`}
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-ink-200 text-xs font-bold text-ink-600">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-ink-800">{q.question}</p>
                        <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-accent-50 px-1.5 py-0.5 text-[10px] font-semibold text-accent-600">
                          <Sparkles size={9} />
                          {q.topic}
                        </span>
                      </div>
                    </div>
                    {isDone && <CheckCircle2 className="shrink-0 text-brand-500" size={20} />}
                  </div>

                  {showHint[q.id] && (
                    <div className="mb-3 flex items-start gap-1.5 rounded-lg bg-accent-50 p-2.5 animate-fade-in">
                      <Lightbulb className="mt-0.5 shrink-0 text-accent-500" size={14} />
                      <p className="text-xs text-accent-700">{q.hint}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={answers[q.id] || ''}
                      onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      disabled={isDone}
                      placeholder="Your answer…"
                      className={`flex-1 rounded-lg border bg-white px-3 py-2 text-sm outline-none transition-all ${
                        isDone
                          ? 'border-brand-200 text-brand-700'
                          : isChecked
                          ? 'border-ink-200'
                          : 'border-ink-100 focus:border-brand-300 focus:ring-2 focus:ring-brand-100'
                      } disabled:cursor-not-allowed`}
                    />
                    {!isDone && (
                      <>
                        <button
                          onClick={() => setShowHint({ ...showHint, [q.id]: !showHint[q.id] })}
                          className="flex items-center gap-1 rounded-lg border border-ink-200 px-2.5 py-2 text-xs font-medium text-ink-600 transition-all hover:bg-ink-50"
                        >
                          <Eye size={14} />
                          Hint
                        </button>
                        <button
                          onClick={() => handleCheck(q.id, q.answer)}
                          disabled={!answers[q.id]?.trim()}
                          className="rounded-lg bg-brand-500 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-brand-600 active:scale-95 disabled:opacity-40"
                        >
                          Check
                        </button>
                      </>
                    )}
                    {isDone && (
                      <button
                        onClick={() => handleReset(q.id)}
                        className="flex items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-medium text-ink-500 transition-all hover:bg-ink-50"
                      >
                        <RotateCcw size={14} />
                      </button>
                    )}
                  </div>

                  {isChecked && !isDone && (
                    <div className="mt-2 animate-fade-in rounded-lg bg-coral-50 px-3 py-2">
                      <p className="text-xs text-coral-600">
                        Not quite. Correct answer: <span className="font-semibold">{q.answer}</span>
                      </p>
                    </div>
                  )}
                  {isDone && (
                    <div className="mt-2 animate-fade-in rounded-lg bg-brand-50 px-3 py-2">
                      <p className="text-xs text-brand-600">
                        Correct! Answer: <span className="font-semibold">{q.answer}</span>
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
