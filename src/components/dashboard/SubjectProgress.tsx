import { SUBJECTS, SubjectKey } from '@/types/study';
import { getDailyEntries } from '@/lib/storage';
import { useMemo } from 'react';

export function SubjectProgress() {
  const entries = getDailyEntries();

  const subjectStats = useMemo(() => {
    return SUBJECTS.map(subject => {
      const completed = entries.filter(e => e[subject.key]).length;
      const percentage = entries.length > 0 
        ? Math.round((completed / entries.length) * 100) 
        : 0;
      return { ...subject, completed, percentage };
    });
  }, [entries]);

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-6">Subject Progress</h3>
      <div className="space-y-4">
        {subjectStats.map(subject => (
          <div key={subject.key} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className={`subject-badge subject-${subject.color}`}>
                  {subject.label}
                </span>
              </div>
              <span className="text-sm font-mono text-muted-foreground">
                {subject.completed} days ({subject.percentage}%)
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${subject.percentage}%`,
                  backgroundColor: `hsl(var(--${subject.color}))`
                }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
