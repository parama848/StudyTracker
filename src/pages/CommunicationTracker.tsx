import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CommunicationEntry } from '@/types/study';
import { getCommunicationEntries, saveCommunicationEntry, deleteCommunicationEntry } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Mic, MessageSquare, Users } from 'lucide-react';
import { format } from 'date-fns';

export default function CommunicationTracker() {
  const [entries, setEntries] = useState<CommunicationEntry[]>(getCommunicationEntries());
  const [isOpen, setIsOpen] = useState(false);
  
  const [newEntry, setNewEntry] = useState<Partial<CommunicationEntry>>({
    date: new Date().toISOString().split('T')[0],
    activity: 'speaking',
    minutes: 0,
    confidenceLevel: 3,
    notes: '',
  });

  const handleSave = () => {
    const entry: CommunicationEntry = {
      id: Date.now().toString(),
      date: newEntry.date!,
      activity: newEntry.activity as 'speaking' | 'explaining' | 'mock interview',
      minutes: newEntry.minutes!,
      confidenceLevel: newEntry.confidenceLevel as 1 | 2 | 3 | 4 | 5,
      notes: newEntry.notes!,
    };
    
    saveCommunicationEntry(entry);
    setEntries(getCommunicationEntries());
    setIsOpen(false);
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      activity: 'speaking',
      minutes: 0,
      confidenceLevel: 3,
      notes: '',
    });
  };

  const handleDelete = (id: string) => {
    deleteCommunicationEntry(id);
    setEntries(getCommunicationEntries());
  };

  const stats = {
    totalSessions: entries.length,
    totalMinutes: entries.reduce((sum, e) => sum + e.minutes, 0),
    avgConfidence: entries.length > 0 
      ? Math.round(entries.reduce((sum, e) => sum + e.confidenceLevel, 0) / entries.length * 10) / 10
      : 0,
    mockInterviews: entries.filter(e => e.activity === 'mock interview').length,
  };

  const activityIcon = {
    speaking: <Mic className="w-4 h-4" />,
    explaining: <MessageSquare className="w-4 h-4" />,
    'mock interview': <Users className="w-4 h-4" />,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Communication Tracker</h1>
            <p className="text-muted-foreground">Track your speaking and presentation practice</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Communication Session</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Date</label>
                    <Input
                      type="date"
                      value={newEntry.date}
                      onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Activity Type</label>
                    <Select
                      value={newEntry.activity}
                      onValueChange={(value) => setNewEntry({ ...newEntry, activity: value as 'speaking' | 'explaining' | 'mock interview' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="speaking">Speaking Practice</SelectItem>
                        <SelectItem value="explaining">Technical Explaining</SelectItem>
                        <SelectItem value="mock interview">Mock Interview</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Duration (minutes)</label>
                  <Input
                    type="number"
                    value={newEntry.minutes}
                    onChange={(e) => setNewEntry({ ...newEntry, minutes: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Confidence Level</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        onClick={() => setNewEntry({ ...newEntry, confidenceLevel: level as 1 | 2 | 3 | 4 | 5 })}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                          newEntry.confidenceLevel! >= level
                            ? 'bg-communication text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Notes</label>
                  <Textarea
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                    placeholder="What did you practice? Any feedback?"
                    rows={3}
                  />
                </div>

                <Button onClick={handleSave} className="w-full">Save Session</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{stats.totalSessions}</p>
            <p className="text-xs text-muted-foreground">Sessions</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-dsa">{stats.totalMinutes}</p>
            <p className="text-xs text-muted-foreground">Total Minutes</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-communication">{stats.avgConfidence}</p>
            <p className="text-xs text-muted-foreground">Avg Confidence</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-japanese">{stats.mockInterviews}</p>
            <p className="text-xs text-muted-foreground">Mock Interviews</p>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Activity</th>
                  <th className="text-center p-4 text-sm font-medium text-muted-foreground">Duration</th>
                  <th className="text-center p-4 text-sm font-medium text-muted-foreground">Confidence</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Notes</th>
                  <th className="text-center p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-muted-foreground">
                      No sessions yet. Start practicing your communication skills! 🎤
                    </td>
                  </tr>
                ) : (
                  entries.map(entry => (
                    <tr key={entry.id} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="p-4 text-sm">{format(new Date(entry.date), 'MMM d, yyyy')}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-communication">{activityIcon[entry.activity]}</span>
                          <span className="capitalize">{entry.activity}</span>
                        </div>
                      </td>
                      <td className="text-center p-4 font-mono">{entry.minutes}m</td>
                      <td className="text-center p-4">
                        <div className="flex justify-center gap-0.5">
                          {[1, 2, 3, 4, 5].map(level => (
                            <div 
                              key={level}
                              className={`w-2 h-6 rounded-sm ${
                                level <= entry.confidenceLevel 
                                  ? 'bg-communication' 
                                  : 'bg-muted'
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">{entry.notes}</td>
                      <td className="text-center p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(entry.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
