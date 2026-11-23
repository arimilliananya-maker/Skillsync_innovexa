import { Bell, CalendarClock, FolderKanban, GraduationCap, Handshake, UsersRound } from 'lucide-react'
import type { NotificationKind } from '@/lib/types'
import { cn } from '@/lib/utils'

const MAP = {
  collaboration: { icon: Handshake, cls: 'bg-accent text-primary' },
  mentorship: { icon: GraduationCap, cls: 'bg-violet/10 text-violet' },
  project: { icon: FolderKanban, cls: 'bg-success/10 text-success' },
  meeting: { icon: CalendarClock, cls: 'bg-warning/15 text-[oklch(0.5_0.12_70)]' },
  team: { icon: UsersRound, cls: 'bg-accent text-primary' },
  system: { icon: Bell, cls: 'bg-muted text-muted-foreground' },
} satisfies Record<NotificationKind, { icon: typeof Bell; cls: string }>

export function NotificationIcon({ kind, className }: { kind: NotificationKind; className?: string }) {
  const { icon: Icon, cls } = MAP[kind]
  return (
    <span className={cn('inline-flex size-8 shrink-0 items-center justify-center rounded-lg', cls, className)}>
      <Icon className="size-4" aria-hidden="true" />
    </span>
  )
}
