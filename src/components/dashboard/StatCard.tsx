import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'streak' | 'hours' | 'completion';
}

const variantStyles = {
  default: 'from-muted to-muted',
  streak: 'from-primary/20 to-primary/5',
  hours: 'from-dsa/20 to-dsa/5',
  completion: 'from-communication/20 to-communication/5',
};

const iconStyles = {
  default: 'text-muted-foreground',
  streak: 'text-primary',
  hours: 'text-dsa',
  completion: 'text-communication',
};

export function StatCard({ title, value, subtitle, icon: Icon, variant = 'default' }: StatCardProps) {
  return (
    <div className={`stat-card relative overflow-hidden ${variant === 'streak' ? 'animate-pulse-glow' : ''}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${variantStyles[variant]} opacity-50`} />
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-background/50`}>
            <Icon className={`w-6 h-6 ${iconStyles[variant]}`} />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground font-mono animate-count-up">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
