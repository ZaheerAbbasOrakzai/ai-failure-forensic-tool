import { cn } from '../lib/utils';
import { ReactNode, useEffect, useState } from 'react';

export function Card({ children, className, hover = false, glow, animate = false }: { 
  children: ReactNode; 
  className?: string;
  hover?: boolean;
  glow?: 'orange' | 'blue' | 'green' | 'red' | 'none';
  animate?: boolean;
}) {
  const [isVisible, setIsVisible] = useState(!animate);
  
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    }
  }, [animate]);

  return (
    <div className={cn(
      'rounded-xl border border-zinc-800/80 bg-zinc-900/50 backdrop-blur-sm relative overflow-hidden transition-all duration-300',
      hover && 'hover-lift-xl hover:border-zinc-700/80 cursor-pointer',
      glow === 'orange' && 'glow-orange border-orange-500/20',
      glow === 'blue' && 'glow-blue border-blue-500/20',
      glow === 'green' && 'glow-green border-emerald-500/20',
      glow === 'red' && 'glow-red border-red-500/20',
      animate && !isVisible && 'opacity-0 translate-y-4',
      animate && isVisible && 'opacity-100 translate-y-0 animate-in',
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function Badge({ children, variant = 'default', className, pulse = false }: {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  className?: string;
  pulse?: boolean;
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
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border transition-all duration-200',
      variants[variant],
      pulse && variant === 'success' && 'status-pulse-success',
      pulse && variant === 'danger' && 'status-pulse-error',
      pulse && variant === 'warning' && 'status-pulse-warning',
      className
    )}>
      {children}
    </span>
  );
}

export function Button({ children, variant = 'primary', size = 'md', className, loading = false, ...props }: {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  loading?: boolean;
  [key: string]: any;
}) {
  const variants = {
    primary: 'bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30',
    secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 hover:border-zinc-600',
    ghost: 'hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200',
    danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
  };

  return (
    <button className={cn(
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
      variants[variant],
      sizes[size],
      className
    )} disabled={loading || props.disabled} {...props}>
      {loading && (
        <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}

export function StatCard({ label, value, change, changeType, icon: Icon, accent, animate = false }: {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: any;
  accent?: 'orange' | 'blue' | 'green' | 'purple' | 'red';
  animate?: boolean;
}) {
  const accentColors = {
    orange: 'from-orange-500/20 to-orange-500/5 text-orange-400 shadow-orange-500/10',
    blue: 'from-blue-500/20 to-blue-500/5 text-blue-400 shadow-blue-500/10',
    green: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 shadow-emerald-500/10',
    purple: 'from-purple-500/20 to-purple-500/5 text-purple-400 shadow-purple-500/10',
    red: 'from-red-500/20 to-red-500/5 text-red-400 shadow-red-500/10',
  };

  return (
    <Card className="p-5 relative overflow-hidden noise-bg hover-lift" animate={animate}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/[0.03] to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
          </div>
          {Icon && (
            <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg', accentColors[accent || 'orange'])}>
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>
        {change && (
          <div className={cn(
            'flex items-center gap-1 mt-3.5 text-xs font-medium',
            changeType === 'positive' && 'text-emerald-400',
            changeType === 'negative' && 'text-red-400',
            changeType === 'neutral' && 'text-zinc-400',
          )}>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.02] border border-white/[0.04]">
              {change}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}

export function EmptyState({ icon: Icon, title, description, action }: {
  icon?: any;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      {Icon && (
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border border-zinc-700/50 flex items-center justify-center mb-5 shadow-inner">
          <Icon className="w-8 h-8 text-zinc-500 animate-float" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-zinc-200 mb-1.5">{title}</h3>
      <p className="text-sm text-zinc-500 text-center max-w-sm mb-5 leading-relaxed">{description}</p>
      {action}
    </div>
  );
}

export function Separator({ className }: { className?: string }) {
  return <div className={cn('h-px bg-gradient-to-r from-transparent via-zinc-800/80 to-transparent', className)} />;
}

export function Tooltip({ children, content, position = 'top' }: { 
  children: ReactNode; 
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}) {
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative group inline-flex">
      {children}
      <div className={cn(
        'absolute z-50 px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none transform translate-y-1 group-hover:translate-y-0 shadow-lg',
        positions[position]
      )}>
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-zinc-800" />
      </div>
    </div>
  );
}

export function ProgressBar({ value, max = 100, color = 'orange', label, animated = false, className }: {
  value: number;
  max?: number;
  color?: 'orange' | 'blue' | 'green' | 'red' | 'purple';
  label?: string;
  animated?: boolean;
  className?: string;
}) {
  const colors = {
    orange: 'bg-gradient-to-r from-orange-500 to-orange-400',
    blue: 'bg-gradient-to-r from-blue-500 to-blue-400',
    green: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
    red: 'bg-gradient-to-r from-red-500 to-red-400',
    purple: 'bg-gradient-to-r from-purple-500 to-purple-400',
  };

  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-zinc-400">{label}</span>
          <span className="text-xs font-mono text-zinc-300">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className="w-full h-1.5 bg-zinc-800/80 rounded-full overflow-hidden relative">
        <div className="absolute inset-0 animate-shimmer" />
        <div 
          className={cn('h-full rounded-full relative shadow-sm', animated && 'progress-animate', colors[color])}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function Avatar({ initials, size = 'md', color = 'orange', status, ring = true }: {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'orange' | 'blue' | 'green' | 'purple';
  status?: 'online' | 'away' | 'offline';
  ring?: boolean;
}) {
  const sizes = { 
    sm: 'w-6 h-6 text-[10px]', 
    md: 'w-8 h-8 text-xs', 
    lg: 'w-10 h-10 text-sm' 
  };
  const statusSizes = { sm: 'w-2 h-2', md: 'w-2.5 h-2.5', lg: 'w-3 h-3' };
  const statusColors = {
    online: 'bg-emerald-400',
    away: 'bg-amber-400',
    offline: 'bg-zinc-500',
  };
  const colors = {
    orange: 'from-orange-500 to-red-600',
    blue: 'from-blue-500 to-indigo-600',
    green: 'from-emerald-500 to-teal-600',
    purple: 'from-purple-500 to-pink-600',
  };

  return (
    <div className="relative inline-flex">
      <div className={cn(
        'rounded-full bg-gradient-to-br flex items-center justify-center font-semibold text-white shadow-md',
        ring && 'ring-2 ring-zinc-900',
        sizes[size],
        colors[color]
      )}>
        {initials}
      </div>
      {status && (
        <span className={cn(
          'absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-zinc-900',
          statusSizes[size],
          statusColors[status]
        )} />
      )}
    </div>
  );
}
