import { Flame, Clock, Target, TrendingUp } from 'lucide-react';

export const STAT_CARDS = [
  {
    key: 'streak',
    title: 'Current Streak',
    subtitle: 'Consecutive productive days',
    icon: Flame,
    variant: 'streak',
    format: (value: number) => `${value} 🔥`,
  },
  {
    key: 'avgHours',
    title: 'Avg Hours/Day',
    subtitle: 'Based on logged entries',
    icon: Clock,
    variant: 'hours',
    format: (value: number) => value,
  },
  {
    key: 'todayCompletion',
    title: "Today's Completion",
    subtitle: '6 subjects tracked',
    icon: Target,
    variant: 'completion',
    format: (value: number) => `${value}%`,
  },
  {
    key: 'weeklyConsistency',
    title: 'Consistency',
    subtitle: 'Days logged vs total days',
    icon: TrendingUp,
    format: (value: number) => `${value}%`,
  },
];

export const CHARTS = [
  { component: 'HoursLineChart' },
  { component: 'SubjectBarChart' },
  { component: 'SubjectPieChart' },
];
