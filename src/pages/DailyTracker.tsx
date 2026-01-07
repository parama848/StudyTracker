import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DailyEntry, SUBJECTS } from '@/types/study';
import { getDailyEntries, saveDailyEntry, calculateDailyCompletion, getStartDate } from '@/lib/storage';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format, parseISO, addDays, differenceInDays } from 'date-fns';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DailyTracker() {
  const [entries, setEntries] = useState<DailyEntry[]>(getDailyEntries());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editEntry, setEditEntry] = useState<DailyEntry | null>(null);
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  const startDate = getStartDate();
  
  // Generate all 90 days
  const allDays = useMemo(() => {
    const start = parseISO(startDate);
    return Array.from({ length: 90 }, (_, i) => {
      const date = addDays(start, i);
      return format(date, 'yyyy-MM-dd');
    });
  }, [startDate]);

const paginatedDays = useMemo(() => {
  return allDays.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );
}, [allDays, page]);


  const getEntryForDate = (date: string) => entries.find(e => e.date === date);

  const openEditor = (date: string) => {
    const existing = getEntryForDate(date);
    if (existing) {
      setEditEntry(existing);
    } else {
      setEditEntry({
        date,
        javaFullStack: false,
        dsa: false,
        oracleJava: false,
        aptitude: false,
        japanese: false,
        communication: false,
        hoursStudied: 0,
        energyLevel: 3,
        notes: '',
      });
    }
    setSelectedDate(date);
  };

  const saveEntry = () => {
    if (!editEntry) return;
    saveDailyEntry(editEntry);
    setEntries(getDailyEntries());
    setSelectedDate(null);
    setEditEntry(null);
  };

  const getDayNumber = (date: string) => {
    return differenceInDays(parseISO(date), parseISO(startDate)) + 1;
  };

  const totalPages = Math.ceil(allDays.length / itemsPerPage);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Daily Study Tracker</h1>
            <p className="text-muted-foreground">Track your daily progress across all subjects</p>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Day</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                  {SUBJECTS.map(s => (
                    <th key={s.key} className="text-center p-4 text-sm font-medium text-muted-foreground">
                      <span className={`subject-badge subject-${s.color}`}>{s.label.split(' ')[0]}</span>
                    </th>
                  ))}
                  <th className="text-center p-4 text-sm font-medium text-muted-foreground">Hours</th>
                  <th className="text-center p-4 text-sm font-medium text-muted-foreground">Completion</th>
                  <th className="text-center p-4 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDays.map(date => {
                  const entry = getEntryForDate(date);
                  const dayNum = getDayNumber(date);
                  const completion = entry ? calculateDailyCompletion(entry) : 0;
                  const isPast = parseISO(date) <= new Date();
                  
                  return (
                    <tr key={date} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="p-4 font-mono text-sm">Day {dayNum}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {format(parseISO(date), 'MMM d, yyyy')}
                      </td>
                      {SUBJECTS.map(s => (
                        <td key={s.key} className="text-center p-4">
                          {entry?.[s.key] ? (
                            <span className="text-communication">✓</span>
                          ) : (
                            <span className="text-muted-foreground/30">-</span>
                          )}
                        </td>
                      ))}
                      <td className="text-center p-4 font-mono text-sm">
                        {entry ? entry.hoursStudied : '-'}
                      </td>
                      <td className="text-center p-4">
                        {entry ? (
                          <span className={`font-mono text-sm ${
                            completion >= 80 ? 'completion-high' : 
                            completion >= 50 ? 'completion-medium' : 
                            'completion-low'
                          }`}>
                            {completion}%
                          </span>
                        ) : (
                          <span className="text-muted-foreground/30">-</span>
                        )}
                      </td>
                      <td className="text-center p-4">
                        <Dialog open={selectedDate === date} onOpenChange={(open) => !open && setSelectedDate(null)}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openEditor(date)}
                              disabled={!isPast}
                            >
                              {entry ? 'Edit' : 'Log'}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>
                                Day {dayNum} - {format(parseISO(date), 'MMMM d, yyyy')}
                              </DialogTitle>
                            </DialogHeader>
                            {editEntry && (
                              <div className="space-y-4 mt-4">
                                <div className="grid grid-cols-2 gap-2">
                                  {SUBJECTS.map(subject => (
                                    <label
                                      key={subject.key}
                                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                                        editEntry[subject.key] 
                                          ? 'border-primary/50 bg-primary/5' 
                                          : 'border-border hover:border-muted-foreground/30'
                                      }`}
                                    >
                                      <Checkbox
                                        checked={editEntry[subject.key]}
                                        onCheckedChange={(checked) => 
                                          setEditEntry({ ...editEntry, [subject.key]: !!checked })
                                        }
                                      />
                                      <span className="text-sm">{subject.label}</span>
                                    </label>
                                  ))}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground">Hours Studied</label>
                                    <Input
                                      type="number"
                                      min="0"
                                      max="24"
                                      step="0.5"
                                      value={editEntry.hoursStudied}
                                      onChange={(e) => 
                                        setEditEntry({ ...editEntry, hoursStudied: parseFloat(e.target.value) || 0 })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground">Energy Level</label>
                                    <div className="flex gap-1">
                                      {[1, 2, 3, 4, 5].map((level) => (
                                        <button
                                          key={level}
                                          onClick={() => 
                                            setEditEntry({ ...editEntry, energyLevel: level as 1 | 2 | 3 | 4 | 5 })
                                          }
                                          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                                            editEntry.energyLevel >= level
                                              ? 'bg-primary text-primary-foreground'
                                              : 'bg-muted text-muted-foreground'
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
                                    value={editEntry.notes}
                                    onChange={(e) => setEditEntry({ ...editEntry, notes: e.target.value })}
                                    placeholder="What did you learn today?"
                                    rows={3}
                                  />
                                </div>

                                <Button onClick={saveEntry} className="w-full">
                                  Save Entry
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {page * itemsPerPage + 1}-{Math.min((page + 1) * itemsPerPage, allDays.length)} of {allDays.length} days
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
