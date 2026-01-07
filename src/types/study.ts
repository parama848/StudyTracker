export interface DailyEntry {
  date: string;
  javaFullStack: boolean;
  dsa: boolean;
  oracleJava: boolean;
  aptitude: boolean;
  japanese: boolean;
  communication: boolean;
  hoursStudied: number;
  energyLevel: 1 | 2 | 3 | 4 | 5;
  notes: string;
}

export interface DSAProblem {
  id: string;
  date: string;
  topic: string;
  problemName: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  solved: boolean;
  timeTaken: number;
  revisionNeeded: boolean;
}

export interface OracleTopic {
  id: string;
  topic: string;
  studied: boolean;
  mcqsDone: number;
  mcqsCorrect: number;
  weakArea: boolean;
}

export interface JapaneseEntry {
  id: string;
  date: string;
  script: 'Hiragana' | 'Katakana' | 'Both';
  grammar: boolean;
  vocabularyCount: number;
  listeningPractice: boolean;
  notes: string;
}

export interface CommunicationEntry {
  id: string;
  date: string;
  activity: 'speaking' | 'explaining' | 'mock interview';
  minutes: number;
  confidenceLevel: 1 | 2 | 3 | 4 | 5;
  notes: string;
}

export interface WeeklyReview {
  id: string;
  weekNumber: number;
  whatWentWell: string;
  whatWasDifficult: string;
  oneWin: string;
  focusNextWeek: string;
}

export interface TimeBlock {
  id: string;
  date: string;
  timeSlot: string;
  subject: string;
  plannedTask: string;
  done: boolean;
}

export type SubjectKey = 'javaFullStack' | 'dsa' | 'oracleJava' | 'aptitude' | 'japanese' | 'communication';

export const SUBJECTS: { key: SubjectKey; label: string; color: string }[] = [
  { key: 'javaFullStack', label: 'Java Full Stack', color: 'java' },
  { key: 'dsa', label: 'DSA', color: 'dsa' },
  { key: 'oracleJava', label: 'Oracle Java SE 17', color: 'oracle' },
  { key: 'aptitude', label: 'Aptitude', color: 'aptitude' },
  { key: 'japanese', label: 'Japanese N5', color: 'japanese' },
  { key: 'communication', label: 'Communication', color: 'communication' },
];
