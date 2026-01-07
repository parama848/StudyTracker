import { useState, useEffect } from 'react';
import { DailyEntry, SUBJECTS } from '@/types/study';
import { getDailyEntry, saveDailyEntry, calculateDailyCompletion } from '@/lib/storage';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Clock, Zap } from 'lucide-react';

const today = new Date().toISOString().split('T')[0];

const defaultEntry: DailyEntry = {
  date: today,
  javaFullStack: false,
  dsa: false,
  oracleJava: false,
  aptitude: false,
  japanese: false,
  communication: false,
  hoursStudied: 0,
  energyLevel: 3,
  notes: '',
};

export function TodayCard() {
  const [entry, setEntry] = useState<DailyEntry>(defaultEntry);
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const saved = getDailyEntry(today);
    if (saved) {
      setEntry(saved);
      setCompletion(calculateDailyCompletion(saved));
    }
  }, []);

  const updateEntry = (updates: Partial<DailyEntry>) => {
    const newEntry = { ...entry, ...updates };
    setEntry(newEntry);
    saveDailyEntry(newEntry);
    setCompletion(calculateDailyCompletion(newEntry));
  };

  const completionColor = completion >= 80 ? 'completion-high' : completion >= 50 ? 'completion-medium' : 'completion-low';

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Today's Progress</h3>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>
        <div className={`text-3xl font-bold font-mono ${completionColor}`}>
          {completion}%
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {SUBJECTS.map(subject => (
          <label
            key={subject.key}
            className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
              entry[subject.key] 
                ? 'border-primary/50 bg-primary/5' 
                : 'border-border hover:border-muted-foreground/30'
            }`}
          >
            <Checkbox
              checked={entry[subject.key]}
              onCheckedChange={(checked) => updateEntry({ [subject.key]: !!checked })}
            />
            <span className="text-sm">{subject.label}</span>
          </label>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Hours Studied
          </label>
          <Input
            type="number"
            min="0"
            max="24"
            step="0.5"
            value={entry.hoursStudied}
            onChange={(e) => updateEntry({ hoursStudied: parseFloat(e.target.value) || 0 })}
            className="bg-background"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Energy Level
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => updateEntry({ energyLevel: level as 1 | 2 | 3 | 4 | 5 })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  entry.energyLevel >= level
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Notes</label>
        <Textarea
          value={entry.notes}
          onChange={(e) => updateEntry({ notes: e.target.value })}
          placeholder="What did you learn today?"
          className="bg-background resize-none"
          rows={3}
        />
      </div>
    </div>
  );
}
