export type Mode = 'student' | 'teacher';

export interface ChatMessage {
  id: string;
  role: 'user' | 'tutor';
  text: string;
  timestamp: string;
}

export interface DoubtHistoryItem {
  id: string;
  topic: string;
  question: string;
  status: 'resolved' | 'in-progress' | 'open';
  date: string;
  subject: string;
}

export interface WeakSpot {
  id: string;
  topic: string;
  subject: string;
  mastery: number;
  attempts: number;
  trend: 'improving' | 'declining' | 'stable';
}

export interface PracticeQuestion {
  id: string;
  topic: string;
  question: string;
  hint: string;
  answer: string;
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  subjects: string[];
  engagementMinutes: number;
  doubtsAsked: number;
  doubtsResolved: number;
  weakSpots: WeakSpot[];
  frustrationLevel: number;
  lastActive: string;
}

export interface WorksheetQuestion {
  id: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  answer: string;
}
