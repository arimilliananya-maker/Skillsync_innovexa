import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ProjectStatus } from '@/lib/types'

export function PageHeader({ title, actions, eyebrow }: { title: string; actions?: ReactNode; eyebrow?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <div className="mb-1 text-sm text-muted-foreground">{eyebrow}</div>}
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function LinkButton({
  href,
  variant = 'default',
  size = 'default',
  className,
  ...props
}: ComponentProps<typeof Link> & {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'xs' | 'icon' | 'icon-sm'
}) {
  return <Link href={href} className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-12 text-center', className)}>
      <span className="mb-3 inline-flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <p className="font-medium text-navy">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function Panel({
  title,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <section className={cn('rounded-xl border bg-card shadow-xs', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b px-5 py-3.5">
          {title && <h2 className="text-sm font-semibold text-navy">{title}</h2>}
          {action}
        </div>
      )}
      <div className={cn('p-5', bodyClassName)}>{children}</div>
    </section>
  )
}

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  tone = 'primary',
}: {
  label: string
  value: ReactNode
  icon: LucideIcon
  hint?: string
  tone?: 'primary' | 'violet' | 'success' | 'warning'
}) {
  const tones = {
    primary: 'bg-accent text-primary',
    violet: 'bg-violet/10 text-violet',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/15 text-[oklch(0.5_0.12_70)]',
  }
  return (
    <div className="rounded-xl border bg-card p-4 shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className={cn('inline-flex size-8 items-center justify-center rounded-lg', tones[tone])}>
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-navy">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>}
    </div>
  )
}

export function Chip({ children, tone = 'default', className }: { children: ReactNode; tone?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'violet'; className?: string }) {
  const tones = {
    default: 'bg-muted text-foreground/80 border-transparent',
    primary: 'bg-accent text-accent-foreground border-transparent',
    success: 'bg-success/10 text-[oklch(0.45_0.12_155)] border-transparent',
    warning: 'bg-warning/15 text-[oklch(0.48_0.12_70)] border-transparent',
    danger: 'bg-destructive/10 text-destructive border-transparent',
    violet: 'bg-violet/10 text-violet border-transparent',
  }
  return <span className={cn('inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap', tones[tone], className)}>{children}</span>
}

export function StatusChip({ status }: { status: ProjectStatus | 'Idea' | 'Ongoing' | 'Completed' }) {
  const tone = status === 'Completed' ? 'success' : status === 'Ongoing' ? 'primary' : 'violet'
  return <Chip tone={tone}>{status}</Chip>
}

export function ProgressBar({ value, className, tone = 'primary' }: { value: number; className?: string; tone?: 'primary' | 'success' }) {
  return (
    <div
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-muted', className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn('h-full rounded-full transition-all', tone === 'success' ? 'bg-success' : 'bg-gradient-to-r from-primary to-violet')}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  )
}

export function NativeSelect({ className, children, ...props }: ComponentProps<'select'>) {
  return (
    <select
      className={cn(
        'h-9 w-full appearance-none rounded-lg border border-input bg-card bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")] bg-[length:16px] bg-[right_0.6rem_center] bg-no-repeat pr-8 pl-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}

export function Field({ label, htmlFor, error, children, hint }: { label: string; htmlFor?: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-navy">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export function DemoNotice({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('inline-flex items-center gap-1.5 rounded-md bg-warning/10 px-2 py-1 text-xs text-[oklch(0.45_0.11_70)]', className)}>
      <span className="size-1.5 rounded-full bg-warning" aria-hidden="true" />
      {children}
    </p>
  )
}
