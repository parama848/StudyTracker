import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Code2, 
  Award, 
  Languages, 
  MessageSquare,
  ClipboardList,
  FileDown,
  Flame
} from 'lucide-react';
import { getDayNumber } from '@/lib/storage';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/daily', icon: Calendar, label: 'Daily Tracker' },
  { path: '/dsa', icon: Code2, label: 'DSA Problems' },
  { path: '/oracle', icon: Award, label: 'Oracle Java' },
  { path: '/japanese', icon: Languages, label: 'Japanese N5' },
  { path: '/communication', icon: MessageSquare, label: 'Communication' },
  { path: '/weekly-review', icon: ClipboardList, label: 'Weekly Review' },
];

export function Sidebar() {
  const location = useLocation();
  const dayNumber = getDayNumber();
  const progress = Math.round((dayNumber / 90) * 100);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Flame className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">StudyTrack</h1>
            <p className="text-xs text-muted-foreground">90-Day Challenge</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="p-4 border-b border-border">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Day {dayNumber} of 90</span>
          <span className="text-primary font-mono">{progress}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`nav-link flex items-center gap-3 ${
              location.pathname === path ? 'active' : ''
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Export Button */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => {
            const { exportToCSV } = require('@/lib/storage');
            exportToCSV();
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          <FileDown className="w-4 h-4" />
          <span className="text-sm">Export CSV</span>
        </button>
      </div>
    </aside>
  );
}
