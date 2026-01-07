import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { OracleTopic } from '@/types/study';
import { getOracleTopics, saveOracleTopic, deleteOracleTopic } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

const ORACLE_TOPICS = [
  'Java Basics', 'Operators & Statements', 'Core Java APIs', 
  'Methods & Encapsulation', 'Class Design', 'Inheritance', 
  'Exceptions', 'Modules', 'Concurrency', 'I/O', 'JDBC',
  'Annotations', 'Generics', 'Collections'
];

export default function OracleTracker() {
  const [topics, setTopics] = useState<OracleTopic[]>(getOracleTopics());
  const [isOpen, setIsOpen] = useState(false);
  
  const [newTopic, setNewTopic] = useState<Partial<OracleTopic>>({
    topic: '',
    studied: false,
    mcqsDone: 0,
    mcqsCorrect: 0,
    weakArea: false,
  });

  const handleSave = () => {
    if (!newTopic.topic) return;
    
    const topic: OracleTopic = {
      id: Date.now().toString(),
      topic: newTopic.topic,
      studied: newTopic.studied!,
      mcqsDone: newTopic.mcqsDone!,
      mcqsCorrect: newTopic.mcqsCorrect!,
      weakArea: newTopic.weakArea!,
    };
    
    saveOracleTopic(topic);
    setTopics(getOracleTopics());
    setIsOpen(false);
    setNewTopic({
      topic: '',
      studied: false,
      mcqsDone: 0,
      mcqsCorrect: 0,
      weakArea: false,
    });
  };

  const handleDelete = (id: string) => {
    deleteOracleTopic(id);
    setTopics(getOracleTopics());
  };

  const handleToggleStudied = (topic: OracleTopic) => {
    saveOracleTopic({ ...topic, studied: !topic.studied });
    setTopics(getOracleTopics());
  };

  const calculateAccuracy = (topic: OracleTopic) => {
    if (topic.mcqsDone === 0) return 0;
    return Math.round((topic.mcqsCorrect / topic.mcqsDone) * 100);
  };

  const stats = {
    totalTopics: topics.length,
    studied: topics.filter(t => t.studied).length,
    totalMcqs: topics.reduce((sum, t) => sum + t.mcqsDone, 0),
    avgAccuracy: topics.length > 0 
      ? Math.round(topics.reduce((sum, t) => sum + calculateAccuracy(t), 0) / topics.length) 
      : 0,
    weakAreas: topics.filter(t => t.weakArea).length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Oracle Java SE 17 Tracker</h1>
            <p className="text-muted-foreground">Track your certification preparation progress</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Topic
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Topic</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Topic</label>
                  <select
                    className="w-full p-2 rounded-md bg-background border border-input"
                    value={newTopic.topic}
                    onChange={(e) => setNewTopic({ ...newTopic, topic: e.target.value })}
                  >
                    <option value="">Select a topic</option>
                    {ORACLE_TOPICS.map(topic => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">MCQs Done</label>
                    <Input
                      type="number"
                      value={newTopic.mcqsDone}
                      onChange={(e) => setNewTopic({ ...newTopic, mcqsDone: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">MCQs Correct</label>
                    <Input
                      type="number"
                      value={newTopic.mcqsCorrect}
                      onChange={(e) => setNewTopic({ ...newTopic, mcqsCorrect: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={newTopic.studied}
                      onCheckedChange={(checked) => setNewTopic({ ...newTopic, studied: !!checked })}
                    />
                    <span className="text-sm">Studied</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={newTopic.weakArea}
                      onCheckedChange={(checked) => setNewTopic({ ...newTopic, weakArea: !!checked })}
                    />
                    <span className="text-sm">Weak Area</span>
                  </label>
                </div>

                <Button onClick={handleSave} className="w-full">Save Topic</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{stats.totalTopics}</p>
            <p className="text-xs text-muted-foreground">Topics Added</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-communication">{stats.studied}</p>
            <p className="text-xs text-muted-foreground">Studied</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-dsa">{stats.totalMcqs}</p>
            <p className="text-xs text-muted-foreground">MCQs Done</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className={`text-2xl font-bold ${stats.avgAccuracy >= 70 ? 'text-communication' : 'text-oracle'}`}>
              {stats.avgAccuracy}%
            </p>
            <p className="text-xs text-muted-foreground">Avg Accuracy</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-oracle">{stats.weakAreas}</p>
            <p className="text-xs text-muted-foreground">Weak Areas</p>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.length === 0 ? (
            <div className="col-span-full glass-card p-8 text-center text-muted-foreground">
              No topics added yet. Start adding Oracle Java SE 17 topics!
            </div>
          ) : (
            topics.map(topic => {
              const accuracy = calculateAccuracy(topic);
              return (
                <div key={topic.id} className="glass-card p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={topic.studied}
                        onCheckedChange={() => handleToggleStudied(topic)}
                      />
                      <span className={`font-medium ${topic.studied ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {topic.topic}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {topic.weakArea && (
                        <AlertCircle className="w-4 h-4 text-oracle" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(topic.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Accuracy</span>
                      <span className={`font-mono ${accuracy >= 70 ? 'text-communication' : accuracy >= 50 ? 'text-java' : 'text-oracle'}`}>
                        {accuracy}%
                      </span>
                    </div>
                    <Progress 
                      value={accuracy} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>MCQs: {topic.mcqsCorrect}/{topic.mcqsDone}</span>
                    {topic.weakArea && (
                      <span className="text-oracle text-xs">Needs Focus</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
