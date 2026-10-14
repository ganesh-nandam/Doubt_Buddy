import { useState, useCallback } from 'react';
import { SocraticChat } from './SocraticChat';
import { DoubtHistory } from './DoubtHistory';
import { WeakSpotSummary } from './WeakSpotSummary';
import { PracticeQuestions } from './PracticeQuestions';
import { CameraUpload } from './CameraUpload';
import type { DoubtHistoryItem, WeakSpot, PracticeQuestion } from '@/types';
import { studentWeakSpots, practiceQuestions, practiceQuestionBank } from '@/data';

export function StudentMode() {
  const [extraDoubts, setExtraDoubts] = useState<DoubtHistoryItem[]>([]);
  const [weakSpots, setWeakSpots] = useState<WeakSpot[]>(studentWeakSpots);
  const [practiceQs, setPracticeQs] = useState<PracticeQuestion[]>(practiceQuestions);

  /**
   * Picks 3 practice questions for the given list of weak-spot topics,
   * choosing difficulty based on mastery level:
   *   mastery < 40  → easy
   *   mastery 40-60 → medium
   *   mastery > 60  → hard
   */
  const buildPracticeQuestions = (spots: WeakSpot[]): PracticeQuestion[] => {
    const sorted = [...spots].sort((a, b) => a.mastery - b.mastery);
    const result: PracticeQuestion[] = [];
    const seen = new Set<string>();

    for (const spot of sorted) {
      const bank = practiceQuestionBank[spot.topic];
      if (!bank) continue;

      const difficulty = spot.mastery < 40 ? 'easy' : spot.mastery < 60 ? 'medium' : 'hard';
      const q = bank[difficulty];
      if (q && !seen.has(q.id)) {
        result.push(q);
        seen.add(q.id);
      }
      if (result.length >= 3) break;
    }

    // If fewer than 3 from weak spots, fill from the static set
    if (result.length < 3) {
      for (const q of practiceQuestions) {
        if (result.length >= 3) break;
        if (!seen.has(q.id)) {
          result.push(q);
          seen.add(q.id);
        }
      }
    }

    return result.slice(0, 3);
  };

  const handleNewDoubt = (topic: string, question: string) => {
    const newDoubt: DoubtHistoryItem = {
      id: `nd-${Date.now()}`,
      topic: topic,
      question: question,
      status: 'in-progress',
      date: 'Just now',
      subject: 'Math',
    };
    setExtraDoubts((prev) => [newDoubt, ...prev]);
  };

  /**
   * Called when the chat detects a topic in the student's message.
   * If the topic isn't already in weak spots, adds it with a low mastery
   * (since the student is asking about it = likely struggling).
   */
  const handleTopicDetected = useCallback((topic: string, subject: string) => {
    setWeakSpots((prev) => {
      const existing = prev.find((w) => w.topic === topic);
      if (existing) {
        // Increment attempts since they're engaging with this topic
        return prev.map((w) =>
          w.topic === topic
            ? { ...w, attempts: w.attempts + 1 }
            : w
        );
      }
      const newSpot: WeakSpot = {
        id: `dyn-${Date.now()}`,
        topic,
        subject,
        mastery: 45,
        attempts: 1,
        trend: 'declining',
      };
      const updated = [...prev, newSpot];
      setPracticeQs(buildPracticeQuestions(updated));
      return updated;
    });
  }, []);

  /**
   * Called when the student expresses struggle ("I don't know", "confused", etc.)
   * Drops the mastery for that topic to reflect the struggle.
   */
  const handleStruggling = useCallback((topic: string, subject: string) => {
    setWeakSpots((prev) => {
      const existing = prev.find((w) => w.topic === topic);
      if (existing) {
        // Drop mastery by 5 to reflect ongoing struggle, min 20
        const updated = prev.map((w) =>
          w.topic === topic
            ? {
                ...w,
                mastery: Math.max(20, w.mastery - 5),
                trend: 'declining' as const,
                attempts: w.attempts + 1,
              }
            : w
        );
        setPracticeQs(buildPracticeQuestions(updated));
        return updated;
      }
      // Not in weak spots yet — add with low mastery
      const newSpot: WeakSpot = {
        id: `dyn-${Date.now()}`,
        topic,
        subject,
        mastery: 30,
        attempts: 2,
        trend: 'declining',
      };
      const updated = [...prev, newSpot];
      setPracticeQs(buildPracticeQuestions(updated));
      return updated;
    });
  }, []);

  const handleUpload = (_fileName: string) => {
    // In a real app, this would trigger the tutor to analyze the photo
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left sidebar */}
        <div className="space-y-6 lg:col-span-3">
          <DoubtHistory extraDoubts={extraDoubts} />
          <WeakSpotSummary weakSpots={weakSpots} />
        </div>

        {/* Center: Chat */}
        <div className="lg:col-span-6 lg:h-[calc(100vh-140px)]">
          <SocraticChat
            onNewDoubt={handleNewDoubt}
            onTopicDetected={handleTopicDetected}
            onStruggling={handleStruggling}
          />
        </div>

        {/* Right sidebar */}
        <div className="space-y-6 lg:col-span-3">
          <PracticeQuestions questions={practiceQs} />
          <CameraUpload onUpload={handleUpload} />
        </div>
      </div>
    </div>
  );
}
