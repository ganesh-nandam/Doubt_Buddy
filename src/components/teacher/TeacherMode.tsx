import { useState } from 'react';
import { AnalyticsStats } from './AnalyticsStats';
import { ClassWeakSpots } from './ClassWeakSpots';
import { StudentRoster } from './StudentRoster';
import { RemediationWorksheet } from './RemediationWorksheet';
import { StudentDetail } from './StudentDetail';
import type { Student } from '@/types';

export function TeacherMode() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-ink-900">Class Dashboard</h2>
        <p className="mt-1 text-sm text-ink-500">Class 10-B · Mathematics & Physics · 32 students</p>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <AnalyticsStats />
      </div>

      {/* Remediation CTA */}
      <div className="mb-6">
        <RemediationWorksheet />
      </div>

      {/* Weak spots + Roster */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <ClassWeakSpots />
        </div>
        <div className="lg:col-span-7">
          <StudentRoster onStudentClick={setSelectedStudent} />
        </div>
      </div>

      {/* Student detail drawer */}
      <StudentDetail student={selectedStudent} onClose={() => setSelectedStudent(null)} />
    </div>
  );
}
