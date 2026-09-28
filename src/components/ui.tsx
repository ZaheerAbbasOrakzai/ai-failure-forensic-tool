import { cn } from '../lib/utils';
import { ReactNode } from 'react';

// Card Component
export function Card({ children, className, hover = false, glow }: { 
  children: ReactNode; 
  className?: string;
  hover?: boolean;
  glow?: 'orange' | 'blue' | 'green' | 'red' | 'none';
}) {
  return (
    <div className={cn(
      'rounded-xl border border-zinc-800/80 bg-zinc-900/50 backdrop-blur-sm',
      hover && 'hover-lift hover:border-zinc-700/80 cursor-pointer',
      glow === 'orange' && 'glow-orange',
      glow === 'blue' && 'glow-blue',
      glow === 'green' && 'glow-green',
      glow === 'red' && 'glow-red',
      className
    )}>
      {children}
    </div>
  );
}

// Badge Component
export function Badge({ children, variant = 'default', className }: {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  className?: string;
}) {
  const variants = {
    default: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    outline: 'bg-transparent text-zinc-400 border-zinc-700',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}

// Button Component
export function Button({ children, variant = 'primary', size = 'md', className, ...props }: {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  [key: string]: any;
}) {
  const variants = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20',
    secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700',
    ghost: 'hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200',
    danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
  };

  return (
    <button className={cn(
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 active:scale-[0.98]',
      variants[variant],
      sizes[size],
      className
    )} {...props}>
      {children}
    </button>
  );
}

// Stat Card
export function StatCard({ label, value, change, changeType, icon: Icon, accent }: {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: any;
  accent?: 'orange' | 'blue' | 'green' | 'purple' | 'red';
}) {
  const accentColors = {
    orange: 'from-orange-500/20 to-orange-500/5 text-orange-400',
    blue: 'from-blue-500/20 to-blue-500/5 text-blue-400',
    green: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400',
    purple: 'from-purple-500/20 to-purple-500/5 text-purple-400',
    red: 'from-red-500/20 to-red-500/5 text-red-400',
  };

  return (
    <Card className="p-5 relative overflow-hidden noise-bg">
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
          </div>
          {Icon && (
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br', accentColors[accent || 'orange'])}>
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>
        {change && (
          <div className={cn(
            'flex items-center gap-1 mt-3 text-xs font-medium',
            changeType === 'positive' && 'text-emerald-400',
            changeType === 'negative' && 'text-red-400',
            changeType === 'neutral' && 'text-zinc-400',
          )}>
            <span>{change}</span>
          </div>
        )}
      </div>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/20 to-transparent pointer-events-none" />
    </Card>
  );
}

// Empty State
export function EmptyState({ icon: Icon, title, description, action }: {
  icon?: any;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-zinc-500" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-zinc-200 mb-1">{title}</h3>
      <p className="text-sm text-zinc-500 text-center max-w-sm mb-4">{description}</p>
      {action}
    </div>
  );
}

// Separator
export function Separator({ className }: { className?: string }) {
  return <div className={cn('h-px bg-zinc-800/80', className)} />;
}

// Tooltip wrapper
export function Tooltip({ children, content }: { children: ReactNode; content: string }) {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-zinc-800" />
      </div>
    </div>
  );
}

// Progress Bar
export function ProgressBar({ value, max = 100, color = 'orange', className }: {
  value: number;
  max?: number;
  color?: 'orange' | 'blue' | 'green' | 'red' | 'purple';
  className?: string;
}) {
  const colors = {
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
    green: 'bg-emerald-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className={cn('w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden', className)}>
      <div 
        className={cn('h-full rounded-full transition-all duration-500', colors[color])}
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );
}

// Avatar
export function Avatar({ initials, size = 'md', color = 'orange' }: {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'orange' | 'blue' | 'green' | 'purple';
}) {
  const sizes = { sm: 'w-6 h-6 text-[10px]', md: 'w-8 h-8 text-xs', lg: 'w-10 h-10 text-sm' };
  const colors = {
    orange: 'from-orange-500 to-red-600',
    blue: 'from-blue-500 to-indigo-600',
    green: 'from-emerald-500 to-teal-600',
    purple: 'from-purple-500 to-pink-600',
  };

  return (
    <div className={cn(
      'rounded-full bg-gradient-to-br flex items-center justify-center font-semibold text-white',
      sizes[size],
      colors[color]
    )}>
      {initials}
    </div>
  );
}
