import { 
  DailyEntry, 
  DSAProblem, 
  OracleTopic, 
  JapaneseEntry, 
  CommunicationEntry, 
  WeeklyReview,
  TimeBlock 
} from '@/types/study';

const STORAGE_KEYS = {
  DAILY_ENTRIES: 'study_daily_entries',
  DSA_PROBLEMS: 'study_dsa_problems',
  ORACLE_TOPICS: 'study_oracle_topics',
  JAPANESE_ENTRIES: 'study_japanese_entries',
  COMMUNICATION_ENTRIES: 'study_communication_entries',
  WEEKLY_REVIEWS: 'study_weekly_reviews',
  TIME_BLOCKS: 'study_time_blocks',
  START_DATE: 'study_start_date',
};

// Generic storage helpers
function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Start Date
export function getStartDate(): string {
  const stored = localStorage.getItem(STORAGE_KEYS.START_DATE);
  if (stored) return stored;
  const today = new Date().toISOString().split('T')[0];
  localStorage.setItem(STORAGE_KEYS.START_DATE, today);
  return today;
}

export function setStartDate(date: string): void {
  localStorage.setItem(STORAGE_KEYS.START_DATE, date);
}

// Daily Entries
export function getDailyEntries(): DailyEntry[] {
  return getItem<DailyEntry[]>(STORAGE_KEYS.DAILY_ENTRIES, []);
}

export function saveDailyEntry(entry: DailyEntry): void {
  const entries = getDailyEntries();
  const index = entries.findIndex(e => e.date === entry.date);
  if (index >= 0) {
    entries[index] = entry;
  } else {
    entries.push(entry);
  }
  setItem(STORAGE_KEYS.DAILY_ENTRIES, entries);
}

export function getDailyEntry(date: string): DailyEntry | null {
  const entries = getDailyEntries();
  return entries.find(e => e.date === date) || null;
}

// DSA Problems
export function getDSAProblems(): DSAProblem[] {
  return getItem<DSAProblem[]>(STORAGE_KEYS.DSA_PROBLEMS, []);
}

export function saveDSAProblem(problem: DSAProblem): void {
  const problems = getDSAProblems();
  const index = problems.findIndex(p => p.id === problem.id);
  if (index >= 0) {
    problems[index] = problem;
  } else {
    problems.push(problem);
  }
  setItem(STORAGE_KEYS.DSA_PROBLEMS, problems);
}

export function deleteDSAProblem(id: string): void {
  const problems = getDSAProblems().filter(p => p.id !== id);
  setItem(STORAGE_KEYS.DSA_PROBLEMS, problems);
}

// Oracle Topics
export function getOracleTopics(): OracleTopic[] {
  return getItem<OracleTopic[]>(STORAGE_KEYS.ORACLE_TOPICS, []);
}

export function saveOracleTopic(topic: OracleTopic): void {
  const topics = getOracleTopics();
  const index = topics.findIndex(t => t.id === topic.id);
  if (index >= 0) {
    topics[index] = topic;
  } else {
    topics.push(topic);
  }
  setItem(STORAGE_KEYS.ORACLE_TOPICS, topics);
}

export function deleteOracleTopic(id: string): void {
  const topics = getOracleTopics().filter(t => t.id !== id);
  setItem(STORAGE_KEYS.ORACLE_TOPICS, topics);
}

// Japanese Entries
export function getJapaneseEntries(): JapaneseEntry[] {
  return getItem<JapaneseEntry[]>(STORAGE_KEYS.JAPANESE_ENTRIES, []);
}

export function saveJapaneseEntry(entry: JapaneseEntry): void {
  const entries = getJapaneseEntries();
  const index = entries.findIndex(e => e.id === entry.id);
  if (index >= 0) {
    entries[index] = entry;
  } else {
    entries.push(entry);
  }
  setItem(STORAGE_KEYS.JAPANESE_ENTRIES, entries);
}

export function deleteJapaneseEntry(id: string): void {
  const entries = getJapaneseEntries().filter(e => e.id !== id);
  setItem(STORAGE_KEYS.JAPANESE_ENTRIES, entries);
}

// Communication Entries
export function getCommunicationEntries(): CommunicationEntry[] {
  return getItem<CommunicationEntry[]>(STORAGE_KEYS.COMMUNICATION_ENTRIES, []);
}

export function saveCommunicationEntry(entry: CommunicationEntry): void {
  const entries = getCommunicationEntries();
  const index = entries.findIndex(e => e.id === entry.id);
  if (index >= 0) {
    entries[index] = entry;
  } else {
    entries.push(entry);
  }
  setItem(STORAGE_KEYS.COMMUNICATION_ENTRIES, entries);
}

export function deleteCommunicationEntry(id: string): void {
  const entries = getCommunicationEntries().filter(e => e.id !== id);
  setItem(STORAGE_KEYS.COMMUNICATION_ENTRIES, entries);
}

// Weekly Reviews
export function getWeeklyReviews(): WeeklyReview[] {
  return getItem<WeeklyReview[]>(STORAGE_KEYS.WEEKLY_REVIEWS, []);
}

export function saveWeeklyReview(review: WeeklyReview): void {
  const reviews = getWeeklyReviews();
  const index = reviews.findIndex(r => r.id === review.id);
  if (index >= 0) {
    reviews[index] = review;
  } else {
    reviews.push(review);
  }
  setItem(STORAGE_KEYS.WEEKLY_REVIEWS, reviews);
}

// Time Blocks
export function getTimeBlocks(): TimeBlock[] {
  return getItem<TimeBlock[]>(STORAGE_KEYS.TIME_BLOCKS, []);
}

export function saveTimeBlock(block: TimeBlock): void {
  const blocks = getTimeBlocks();
  const index = blocks.findIndex(b => b.id === block.id);
  if (index >= 0) {
    blocks[index] = block;
  } else {
    blocks.push(block);
  }
  setItem(STORAGE_KEYS.TIME_BLOCKS, blocks);
}

export function deleteTimeBlock(id: string): void {
  const blocks = getTimeBlocks().filter(b => b.id !== id);
  setItem(STORAGE_KEYS.TIME_BLOCKS, blocks);
}

// Analytics helpers
export function calculateStreak(entries: DailyEntry[]): number {
  if (entries.length === 0) return 0;
  
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < sortedEntries.length; i++) {
    const entryDate = new Date(sortedEntries[i].date);
    entryDate.setHours(0, 0, 0, 0);
    
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);
    
    if (entryDate.getTime() !== expectedDate.getTime()) {
      // Allow for yesterday if today hasn't been logged yet
      if (i === 0) {
        expectedDate.setDate(expectedDate.getDate() - 1);
        if (entryDate.getTime() !== expectedDate.getTime()) break;
      } else {
        break;
      }
    }
    
    const completion = calculateDailyCompletion(sortedEntries[i]);
    if (completion >= 50) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

export function calculateDailyCompletion(entry: DailyEntry): number {
  const subjects = [
    entry.javaFullStack,
    entry.dsa,
    entry.oracleJava,
    entry.aptitude,
    entry.japanese,
    entry.communication,
  ];
  const completed = subjects.filter(Boolean).length;
  return Math.round((completed / 6) * 100);
}

export function calculateAverageHours(entries: DailyEntry[]): number {
  if (entries.length === 0) return 0;
  const total = entries.reduce((sum, e) => sum + e.hoursStudied, 0);
  return Math.round((total / entries.length) * 10) / 10;
}

export function getDayNumber(): number {
  const startDate = new Date(getStartDate());
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.min(diffDays + 1, 90);
}

export function getWeekNumber(): number {
  return Math.ceil(getDayNumber() / 7);
}

// Export to CSV
export function exportToCSV(): void {
  const entries = getDailyEntries();
  if (entries.length === 0) {
    alert('No data to export');
    return;
  }
  
  const headers = [
    'Date',
    'Java Full Stack',
    'DSA',
    'Oracle Java SE 17',
    'Aptitude',
    'Japanese N5',
    'Communication',
    'Hours Studied',
    'Energy Level',
    'Completion %',
    'Notes'
  ];
  
  const rows = entries.map(e => [
    e.date,
    e.javaFullStack ? 'Yes' : 'No',
    e.dsa ? 'Yes' : 'No',
    e.oracleJava ? 'Yes' : 'No',
    e.aptitude ? 'Yes' : 'No',
    e.japanese ? 'Yes' : 'No',
    e.communication ? 'Yes' : 'No',
    e.hoursStudied,
    e.energyLevel,
    calculateDailyCompletion(e),
    `"${e.notes.replace(/"/g, '""')}"`
  ]);
  
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `study-progress-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
