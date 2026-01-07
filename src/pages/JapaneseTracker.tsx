import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { JapaneseEntry } from '@/types/study';
import { getJapaneseEntries, saveJapaneseEntry, deleteJapaneseEntry } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Headphones, BookOpen, Languages } from 'lucide-react';
import { format } from 'date-fns';

export default function JapaneseTracker() {
  const [entries, setEntries] = useState<JapaneseEntry[]>(getJapaneseEntries());
  const [isOpen, setIsOpen] = useState(false);
  
  const [newEntry, setNewEntry] = useState<Partial<JapaneseEntry>>({
    date: new Date().toISOString().split('T')[0],
    script: 'Hiragana',
    grammar: false,
    vocabularyCount: 0,
    listeningPractice: false,
    notes: '',
  });

  const handleSave = () => {
    const entry: JapaneseEntry = {
      id: Date.now().toString(),
      date: newEntry.date!,
      script: newEntry.script as 'Hiragana' | 'Katakana' | 'Both',
      grammar: newEntry.grammar!,
      vocabularyCount: newEntry.vocabularyCount!,
      listeningPractice: newEntry.listeningPractice!,
      notes: newEntry.notes!,
    };
    
    saveJapaneseEntry(entry);
    setEntries(getJapaneseEntries());
    setIsOpen(false);
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      script: 'Hiragana',
      grammar: false,
      vocabularyCount: 0,
      listeningPractice: false,
      notes: '',
    });
  };

  const handleDelete = (id: string) => {
    deleteJapaneseEntry(id);
    setEntries(getJapaneseEntries());
  };

  const stats = {
    totalSessions: entries.length,
    totalVocab: entries.reduce((sum, e) => sum + e.vocabularyCount, 0),
    grammarSessions: entries.filter(e => e.grammar).length,
    listeningSessions: entries.filter(e => e.listeningPractice).length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Japanese N5 Tracker</h1>
            <p className="text-muted-foreground">Track your JLPT N5 preparation</p>
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
                <DialogTitle>Log Japanese Study Session</DialogTitle>
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
                    <label className="text-sm text-muted-foreground">Script Focus</label>
                    <Select
                      value={newEntry.script}
                      onValueChange={(value) => setNewEntry({ ...newEntry, script: value as 'Hiragana' | 'Katakana' | 'Both' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hiragana">Hiragana</SelectItem>
                        <SelectItem value="Katakana">Katakana</SelectItem>
                        <SelectItem value="Both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Vocabulary Learned</label>
                  <Input
                    type="number"
                    value={newEntry.vocabularyCount}
                    onChange={(e) => setNewEntry({ ...newEntry, vocabularyCount: parseInt(e.target.value) || 0 })}
                    placeholder="Number of new words"
                  />
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={newEntry.grammar}
                      onCheckedChange={(checked) => setNewEntry({ ...newEntry, grammar: !!checked })}
                    />
                    <span className="text-sm">Grammar Practice</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={newEntry.listeningPractice}
                      onCheckedChange={(checked) => setNewEntry({ ...newEntry, listeningPractice: !!checked })}
                    />
                    <span className="text-sm">Listening Practice</span>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Notes</label>
                  <Textarea
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                    placeholder="What did you learn today?"
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
            <div className="w-10 h-10 rounded-xl bg-japanese/20 flex items-center justify-center mx-auto mb-2">
              <Languages className="w-5 h-5 text-japanese" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.totalSessions}</p>
            <p className="text-xs text-muted-foreground">Sessions</p>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-dsa/20 flex items-center justify-center mx-auto mb-2">
              <BookOpen className="w-5 h-5 text-dsa" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.totalVocab}</p>
            <p className="text-xs text-muted-foreground">Words Learned</p>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-aptitude/20 flex items-center justify-center mx-auto mb-2">
              <BookOpen className="w-5 h-5 text-aptitude" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.grammarSessions}</p>
            <p className="text-xs text-muted-foreground">Grammar Sessions</p>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-communication/20 flex items-center justify-center mx-auto mb-2">
              <Headphones className="w-5 h-5 text-communication" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.listeningSessions}</p>
            <p className="text-xs text-muted-foreground">Listening Sessions</p>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Script</th>
                  <th className="text-center p-4 text-sm font-medium text-muted-foreground">Grammar</th>
                  <th className="text-center p-4 text-sm font-medium text-muted-foreground">Vocab</th>
                  <th className="text-center p-4 text-sm font-medium text-muted-foreground">Listening</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Notes</th>
                  <th className="text-center p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-muted-foreground">
                      No sessions yet. Start learning Japanese! 🇯🇵
                    </td>
                  </tr>
                ) : (
                  entries.map(entry => (
                    <tr key={entry.id} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="p-4 text-sm">{format(new Date(entry.date), 'MMM d, yyyy')}</td>
                      <td className="p-4">
                        <span className="subject-badge subject-japanese">{entry.script}</span>
                      </td>
                      <td className="text-center p-4">
                        {entry.grammar ? <span className="text-communication">✓</span> : <span className="text-muted-foreground/30">-</span>}
                      </td>
                      <td className="text-center p-4 font-mono">{entry.vocabularyCount}</td>
                      <td className="text-center p-4">
                        {entry.listeningPractice ? <span className="text-communication">✓</span> : <span className="text-muted-foreground/30">-</span>}
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
