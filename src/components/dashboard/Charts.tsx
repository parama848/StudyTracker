import { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { getDailyEntries, getDSAProblems } from '@/lib/storage';
import { SUBJECTS } from '@/types/study';
import { format, parseISO } from 'date-fns';

const COLORS = {
  java: 'hsl(38, 92%, 50%)',
  dsa: 'hsl(190, 95%, 45%)',
  oracle: 'hsl(0, 84%, 55%)',
  aptitude: 'hsl(270, 70%, 60%)',
  japanese: 'hsl(330, 85%, 65%)',
  communication: 'hsl(160, 84%, 45%)',
};

export function HoursLineChart() {
  const entries = getDailyEntries();
  
  const data = useMemo(() => {
    return entries
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-14)
      .map(entry => ({
        date: format(parseISO(entry.date), 'MMM d'),
        hours: entry.hoursStudied,
      }));
  }, [entries]);

  if (data.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Study Hours Trend</h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          No data yet. Start logging your study hours!
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold mb-4">Study Hours Trend (Last 14 Days)</h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 16%)" />
          <XAxis 
            dataKey="date" 
            stroke="hsl(215, 20%, 55%)" 
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="hsl(215, 20%, 55%)" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(222, 47%, 8%)', 
              border: '1px solid hsl(222, 47%, 16%)',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'hsl(210, 40%, 98%)' }}
          />
          <Line 
            type="monotone" 
            dataKey="hours" 
            stroke="hsl(38, 92%, 50%)" 
            strokeWidth={2}
            dot={{ fill: 'hsl(38, 92%, 50%)', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: 'hsl(38, 92%, 50%)' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SubjectBarChart() {
  const entries = getDailyEntries();
  
  const data = useMemo(() => {
    return SUBJECTS.map(subject => ({
      name: subject.label.split(' ')[0],
      count: entries.filter(e => e[subject.key]).length,
      color: COLORS[subject.color as keyof typeof COLORS],
    }));
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Subject Completion</h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          No data yet. Start tracking your subjects!
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold mb-4">Subject Completion Count</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 16%)" />
          <XAxis 
            dataKey="name" 
            stroke="hsl(215, 20%, 55%)" 
            fontSize={11}
            tickLine={false}
          />
          <YAxis 
            stroke="hsl(215, 20%, 55%)" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(222, 47%, 8%)', 
              border: '1px solid hsl(222, 47%, 16%)',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'hsl(210, 40%, 98%)' }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SubjectPieChart() {
  const entries = getDailyEntries();
  
  const data = useMemo(() => {
    return SUBJECTS.map(subject => ({
      name: subject.label,
      value: entries.filter(e => e[subject.key]).length,
      color: COLORS[subject.color as keyof typeof COLORS],
    })).filter(d => d.value > 0);
  }, [entries]);

  if (data.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Subject Balance</h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          No data yet. Start tracking to see your balance!
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold mb-4">Subject Balance</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(222, 47%, 8%)', 
              border: '1px solid hsl(222, 47%, 16%)',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'hsl(210, 40%, 98%)' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5 text-xs">
            <div 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name.split(' ')[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DSATopicChart() {
  const problems = getDSAProblems();
  
  const data = useMemo(() => {
    const topicCounts: Record<string, number> = {};
    problems.forEach(p => {
      if (p.solved) {
        topicCounts[p.topic] = (topicCounts[p.topic] || 0) + 1;
      }
    });
    return Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [problems]);

  if (data.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">DSA Problems by Topic</h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          No solved problems yet. Start solving!
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold mb-4">DSA Problems by Topic</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 16%)" />
          <XAxis 
            type="number"
            stroke="hsl(215, 20%, 55%)" 
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            type="category"
            dataKey="topic" 
            stroke="hsl(215, 20%, 55%)" 
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={80}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(222, 47%, 8%)', 
              border: '1px solid hsl(222, 47%, 16%)',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="count" fill="hsl(190, 95%, 45%)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
