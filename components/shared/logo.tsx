import Link from 'next/link'
import { cn } from '@/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet text-primary-foreground shadow-sm',
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
        <path d="M8 7h8a3 3 0 0 1 0 6H8a3 3 0 0 0 0 6h8" />
        <circle cx="5" cy="7" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="19" cy="19" r="1.6" fill="currentColor" stroke="none" />
      </svg>
    </span>
  )
}

export function Logo({ href = '/', className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={cn('inline-flex items-center gap-2 font-semibold tracking-tight text-navy', className)}>
      <LogoMark />
      <span className="text-[17px]">SkillSync</span>
    </Link>
  )
}
