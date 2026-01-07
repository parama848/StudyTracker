import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Code2, 
  Award, 
  Languages, 
  MessageSquare,
  ClipboardList,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/daily', icon: Calendar, label: 'Daily' },
  { path: '/dsa', icon: Code2, label: 'DSA' },
  { path: '/oracle', icon: Award, label: 'Oracle' },
  { path: '/japanese', icon: Languages, label: 'Japanese' },
  { path: '/communication', icon: MessageSquare, label: 'Comm' },
  { path: '/weekly-review', icon: ClipboardList, label: 'Review' },
];

export function MobileNav() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-card border-b border-border flex items-center justify-between px-4 z-50 lg:hidden">
        <h1 className="font-bold text-foreground">StudyTrack</h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-accent"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Mobile Menu */}
      <nav className={`fixed top-14 left-0 right-0 bg-card border-b border-border p-4 z-50 lg:hidden transition-transform ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="grid grid-cols-4 gap-2">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsOpen(false)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs ${
                location.pathname === path 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around py-2 z-50 lg:hidden">
        {navItems.slice(0, 5).map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center gap-1 p-2 ${
              location.pathname === path 
                ? 'text-primary' 
                : 'text-muted-foreground'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
