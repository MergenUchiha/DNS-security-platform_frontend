import { ReactNode, ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import type { LabMode, FinalAction } from '../types';

// ── Button ───────────────────────────────────────────────────────────────────
interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost' | 'outline' | 'success' | 'warn';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', loading, children, className, disabled, ...rest }: BtnProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-mono font-medium rounded transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  const variants = {
    primary: 'bg-cyber-500 hover:bg-cyber-400 text-black focus:ring-cyber-500 shadow-[0_0_12px_rgba(20,184,166,0.3)] hover:shadow-[0_0_20px_rgba(20,184,166,0.5)]',
    danger: 'bg-danger-600 hover:bg-danger-500 text-white focus:ring-danger-500',
    ghost: 'bg-transparent hover:bg-white/5 text-gray-300 hover:text-white focus:ring-white/20',
    outline: 'border border-cyber-500/50 hover:border-cyber-400 text-cyber-400 hover:bg-cyber-500/10 focus:ring-cyber-500',
    success: 'bg-success-500 hover:bg-success-400 text-black focus:ring-success-500',
    warn: 'bg-warn-500 hover:bg-warn-400 text-black focus:ring-warn-500',
  };
  return (
    <button className={clsx(base, sizes[size], variants[variant], className)} disabled={disabled || loading} {...rest}>
      {loading && <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
interface CardProps { children: ReactNode; className?: string; glow?: boolean; }
export function Card({ children, className, glow }: CardProps) {
  return (
    <div className={clsx(
      'rounded-xl border bg-gray-900/80 backdrop-blur-sm',
      glow ? 'border-cyber-500/40 shadow-[0_0_30px_rgba(20,184,166,0.1)]' : 'border-gray-700/50',
      'dark:bg-gray-900/80 dark:border-gray-700/50',
      'light:bg-white/80 light:border-gray-200',
      className
    )}>
      {children}
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
interface BadgeProps { children: ReactNode; variant?: 'info' | 'warn' | 'alert' | 'success' | 'ghost' | 'safe' | 'attack' | 'mitigated'; }
export function Badge({ children, variant = 'ghost' }: BadgeProps) {
  const variants = {
    info: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    warn: 'bg-warn-500/20 text-warn-400 border border-warn-500/30',
    alert: 'bg-danger-500/20 text-danger-400 border border-danger-500/30',
    success: 'bg-success-500/20 text-success-400 border border-success-500/30',
    ghost: 'bg-gray-700/50 text-gray-300 border border-gray-600/50',
    safe: 'bg-success-500/20 text-success-400 border border-success-500/40',
    attack: 'bg-danger-500/20 text-danger-400 border border-danger-500/40',
    mitigated: 'bg-cyber-500/20 text-cyber-400 border border-cyber-500/40',
  };
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium', variants[variant])}>
      {children}
    </span>
  );
}

// ── ModeBadge ─────────────────────────────────────────────────────────────────
export function ModeBadge({ mode }: { mode: LabMode }) {
  const map: Record<LabMode, 'safe' | 'attack' | 'mitigated'> = {
    SAFE: 'safe', ATTACK: 'attack', MITIGATED: 'mitigated',
  };
  return <Badge variant={map[mode]}>{mode}</Badge>;
}

// ── ActionBadge ───────────────────────────────────────────────────────────────
export function ActionBadge({ action }: { action: FinalAction | string | null }) {
  if (!action) return null;
  const map: Record<string, 'success' | 'alert' | 'warn'> = {
    PASS: 'success', BLOCK: 'alert', FORCE_SAFE_IP: 'warn',
  };
  return <Badge variant={map[action] ?? 'ghost'}>{action}</Badge>;
}

// ── SeverityBadge ─────────────────────────────────────────────────────────────
export function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, 'info' | 'warn' | 'alert'> = {
    INFO: 'info', WARN: 'warn', ALERT: 'alert',
  };
  return <Badge variant={map[severity] ?? 'ghost'}>{severity}</Badge>;
}

// ── Input ─────────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}
export function Input({ label, className, ...rest }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">{label}</label>}
      <input
        className={clsx(
          'bg-gray-800/80 border border-gray-600/50 rounded-lg px-3 py-2 text-sm font-mono text-gray-100',
          'placeholder:text-gray-500 focus:outline-none focus:border-cyber-500/80 focus:ring-1 focus:ring-cyber-500/40',
          'transition-colors duration-150',
          className
        )}
        {...rest}
      />
    </div>
  );
}

// ── Select ────────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}
export function Select({ label, children, className, ...rest }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">{label}</label>}
      <select
        className={clsx(
          'bg-gray-800/80 border border-gray-600/50 rounded-lg px-3 py-2 text-sm font-mono text-gray-100',
          'focus:outline-none focus:border-cyber-500/80 focus:ring-1 focus:ring-cyber-500/40',
          'transition-colors duration-150',
          className
        )}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
interface StatCardProps { label: string; value: number | string; icon?: ReactNode; color?: string; }
export function StatCard({ label, value, icon, color = 'text-cyber-400' }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">{label}</p>
          <p className={clsx('text-3xl font-display font-bold', color)}>{value}</p>
        </div>
        {icon && <div className={clsx('opacity-30', color)}>{icon}</div>}
      </div>
    </Card>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return (
    <div className={clsx('border-2 border-gray-600 border-t-cyber-500 rounded-full animate-spin', sizes[size])} />
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
export function EmptyState({ icon, message }: { icon?: ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-gray-500">
      {icon && <div className="opacity-30 text-5xl">{icon}</div>}
      <p className="font-mono text-sm">{message}</p>
    </div>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-display font-bold text-white mb-2">{title}</h1>
      {subtitle && <p className="text-gray-400 font-body">{subtitle}</p>}
    </div>
  );
}

// ── Code Block ────────────────────────────────────────────────────────────────
export function CodeBlock({ data }: { data: unknown }) {
  return (
    <pre className="bg-black/50 border border-gray-700/50 rounded-lg p-3 text-xs font-mono text-cyber-300 overflow-x-auto max-h-48">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

// ── Alert Banner ──────────────────────────────────────────────────────────────
interface AlertBannerProps { title?: string; message: string; variant?: 'danger' | 'warn' | 'success' | 'info'; }
export function AlertBanner({ title, message, variant = 'danger' }: AlertBannerProps) {
  const styles = {
    danger: 'bg-danger-500/10 border-danger-500/40 text-danger-400',
    warn: 'bg-warn-500/10 border-warn-500/40 text-warn-400',
    success: 'bg-success-500/10 border-success-500/40 text-success-400',
    info: 'bg-blue-500/10 border-blue-500/40 text-blue-400',
  };
  return (
    <div className={clsx('border rounded-lg p-4', styles[variant])}>
      {title && <p className="font-mono font-semibold text-sm mb-1">{title}</p>}
      <p className="font-body text-sm">{message}</p>
    </div>
  );
}
