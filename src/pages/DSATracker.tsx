import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DSAProblem } from '@/types/study';
import { getDSAProblems, saveDSAProblem, deleteDSAProblem } from '@/lib/storage';
import { DSATopicChart } from '@/components/dashboard/Charts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Filter } from 'lucide-react';
import { format } from 'date-fns';

const DSA_TOPICS = [
  'Arrays', 'Strings', 'Linked Lists', 'Stacks', 'Queues', 
  'Trees', 'Graphs', 'Dynamic Programming', 'Recursion', 
  'Binary Search', 'Sorting', 'Hashing', 'Heaps', 'Greedy'
];

export default function DSATracker() {
  const [problems, setProblems] = useState<DSAProblem[]>(getDSAProblems());
  const [isOpen, setIsOpen] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterTopic, setFilterTopic] = useState<string>('all');
  
  const [newProblem, setNewProblem] = useState<Partial<DSAProblem>>({
    date: new Date().toISOString().split('T')[0],
    topic: '',
    problemName: '',
    difficulty: 'Medium',
    solved: false,
    timeTaken: 0,
    revisionNeeded: false,
  });

  const handleSave = () => {
    if (!newProblem.topic || !newProblem.problemName) return;
    
    const problem: DSAProblem = {
      id: Date.now().toString(),
      date: newProblem.date!,
      topic: newProblem.topic,
      problemName: newProblem.problemName,
      difficulty: newProblem.difficulty as 'Easy' | 'Medium' | 'Hard',
      solved: newProblem.solved!,
      timeTaken: newProblem.timeTaken!,
      revisionNeeded: newProblem.revisionNeeded!,
    };
    
    saveDSAProblem(problem);
    setProblems(getDSAProblems());
    setIsOpen(false);
    setNewProblem({
      date: new Date().toISOString().split('T')[0],
      topic: '',
      problemName: '',
      difficulty: 'Medium',
      solved: false,
      timeTaken: 0,
      revisionNeeded: false,
    });
  };

  const handleDelete = (id: string) => {
    deleteDSAProblem(id);
    setProblems(getDSAProblems());
  };

  const handleToggleSolved = (problem: DSAProblem) => {
    saveDSAProblem({ ...problem, solved: !problem.solved });
    setProblems(getDSAProblems());
  };

  const filteredProblems = problems.filter(p => {
    if (filterDifficulty !== 'all' && p.difficulty !== filterDifficulty) return false;
    if (filterTopic !== 'all' && p.topic !== filterTopic) return false;
    return true;
  });

  const stats = {
    total: problems.length,
    solved: problems.filter(p => p.solved).length,
    easy: problems.filter(p => p.difficulty === 'Easy' && p.solved).length,
    medium: problems.filter(p => p.difficulty === 'Medium' && p.solved).length,
    hard: problems.filter(p => p.difficulty === 'Hard' && p.solved).length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">DSA Problem Tracker</h1>
            <p className="text-muted-foreground">Track your data structures & algorithms practice</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Problem
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Problem</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Date</label>
                    <Input
                      type="date"
                      value={newProblem.date}
                      onChange={(e) => setNewProblem({ ...newProblem, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Topic</label>
                    <Select
                      value={newProblem.topic}
                      onValueChange={(value) => setNewProblem({ ...newProblem, topic: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {DSA_TOPICS.map(topic => (
                          <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Problem Name</label>
                  <Input
                    value={newProblem.problemName}
                    onChange={(e) => setNewProblem({ ...newProblem, problemName: e.target.value })}
                    placeholder="e.g., Two Sum"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Difficulty</label>
                    <Select
                      value={newProblem.difficulty}
                      onValueChange={(value) => setNewProblem({ ...newProblem, difficulty: value as 'Easy' | 'Medium' | 'Hard' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Time Taken (min)</label>
                    <Input
                      type="number"
                      value={newProblem.timeTaken}
                      onChange={(e) => setNewProblem({ ...newProblem, timeTaken: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={newProblem.solved}
                      onCheckedChange={(checked) => setNewProblem({ ...newProblem, solved: !!checked })}
                    />
                    <span className="text-sm">Solved</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={newProblem.revisionNeeded}
                      onCheckedChange={(checked) => setNewProblem({ ...newProblem, revisionNeeded: !!checked })}
                    />
                    <span className="text-sm">Needs Revision</span>
                  </label>
                </div>

                <Button onClick={handleSave} className="w-full">Save Problem</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-communication">{stats.solved}</p>
            <p className="text-xs text-muted-foreground">Solved</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-communication">{stats.easy}</p>
            <p className="text-xs text-muted-foreground">Easy</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-java">{stats.medium}</p>
            <p className="text-xs text-muted-foreground">Medium</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-oracle">{stats.hard}</p>
            <p className="text-xs text-muted-foreground">Hard</p>
          </div>
        </div>

        {/* Chart */}
        <DSATopicChart />

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter:</span>
          </div>
          <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterTopic} onValueChange={setFilterTopic}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {DSA_TOPICS.map(topic => (
                <SelectItem key={topic} value={topic}>{topic}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Problem</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Topic</th>
                  <th className="text-center p-4 text-sm font-medium text-muted-foreground">Difficulty</th>
                  <th className="text-center p-4 text-sm font-medium text-muted-foreground">Time</th>
                  <th className="text-center p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-center p-4 text-sm font-medium text-muted-foreground">Revision</th>
                  <th className="text-center p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProblems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-muted-foreground">
                      No problems found. Start adding some!
                    </td>
                  </tr>
                ) : (
                  filteredProblems.map(problem => (
                    <tr key={problem.id} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="p-4 text-sm">{format(new Date(problem.date), 'MMM d')}</td>
                      <td className="p-4 font-medium">{problem.problemName}</td>
                      <td className="p-4">
                        <span className="subject-badge subject-dsa">{problem.topic}</span>
                      </td>
                      <td className="text-center p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          problem.difficulty === 'Easy' ? 'bg-communication/20 text-communication' :
                          problem.difficulty === 'Medium' ? 'bg-java/20 text-java' :
                          'bg-oracle/20 text-oracle'
                        }`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="text-center p-4 font-mono text-sm">{problem.timeTaken}m</td>
                      <td className="text-center p-4">
                        <Checkbox
                          checked={problem.solved}
                          onCheckedChange={() => handleToggleSolved(problem)}
                        />
                      </td>
                      <td className="text-center p-4">
                        {problem.revisionNeeded && (
                          <span className="text-japanese">📌</span>
                        )}
                      </td>
                      <td className="text-center p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(problem.id)}
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
