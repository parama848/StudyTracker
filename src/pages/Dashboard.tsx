import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { SubjectProgress } from '@/components/dashboard/SubjectProgress';
import { TodayCard } from '@/components/dashboard/TodayCard';
import { HoursLineChart, SubjectBarChart, SubjectPieChart } from '@/components/dashboard/Charts';
import { 
  getDailyEntries, 
  calculateStreak, 
  calculateAverageHours, 
  getDayNumber,
  getWeekNumber,
  calculateDailyCompletion 
} from '@/lib/storage';
import { Flame, Clock, Target, Calendar, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

export default function Dashboard() {
  const entries = getDailyEntries();
  
  const stats = useMemo(() => {
    const streak = calculateStreak(entries);
    const avgHours = calculateAverageHours(entries);
    const dayNumber = getDayNumber();
    const weekNumber = getWeekNumber();
    
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = entries.find(e => e.date === today);
    const todayCompletion = todayEntry ? calculateDailyCompletion(todayEntry) : 0;
    
    const weeklyConsistency = entries.length > 0 
      ? Math.round((entries.length / dayNumber) * 100) 
      : 0;
    
    return { streak, avgHours, dayNumber, weekNumber, todayCompletion, weeklyConsistency };
  }, [entries]);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Week {stats.weekNumber} • Day {stats.dayNumber} of 90
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Current Streak"
            value={`${stats.streak} 🔥`}
            subtitle="Consecutive productive days"
            icon={Flame}
            variant="streak"
          />
          <StatCard
            title="Avg Hours/Day"
            value={stats.avgHours}
            subtitle="Based on logged entries"
            icon={Clock}
            variant="hours"
          />
          <StatCard
            title="Today's Completion"
            value={`${stats.todayCompletion}%`}
            subtitle="6 subjects tracked"
            icon={Target}
            variant="completion"
          />
          <StatCard
            title="Consistency"
            value={`${stats.weeklyConsistency}%`}
            subtitle="Days logged vs total days"
            icon={TrendingUp}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          <TodayCard />
          <SubjectProgress />
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          <HoursLineChart />
          <SubjectBarChart />
          <SubjectPieChart />
        </div>
      </div>
    </DashboardLayout>
  );
}
