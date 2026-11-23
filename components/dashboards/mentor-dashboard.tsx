'use client'

import { CalendarClock, Check, FolderKanban, GraduationCap, Inbox, UsersRound, X } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Chip, DemoNotice, EmptyState, Panel, ProgressBar, StatCard } from '@/components/shared/ui-bits'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Button } from '@/components/ui/button'
import { formatDate, timeAgo } from '@/lib/format'
import { roadmapProgress } from '@/lib/roadmap'
import { useStore } from '@/lib/store'
import type { User } from '@/lib/types'

export function MentorDashboard({ user }: { user: User }) {
  const users = useStore((s) => s.users)
  const projects = useStore((s) => s.projects)
  const mentorships = useStore((s) => s.mentorships)
  const respond = useStore((s) => s.respondMentorship)

  const mine = mentorships.filter((m) => m.mentorId === user.id)
  const pending = mine.filter((m) => m.status === 'pending')
  const active = mine.filter((m) => m.status === 'accepted')
  const mentored = projects.filter((p) => p.mentorId === user.id && p.moderation !== 'removed')
  const sessions = active
    .flatMap((m) => m.sessions.map((s) => ({ ...s, student: users.find((u) => u.id === m.studentId), requestId: m.id })))
    .filter((s) => s.date >= new Date().toISOString().slice(0, 10))
    .sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-navy">Welcome, {user.name}</h1>
          <p className="text-sm text-muted-foreground">
            {user.mentorCategory} · {user.organization}
          </p>
        </div>
        {!user.verified && <DemoNotice>Your mentor profile is pending admin verification</DemoNotice>}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Pending requests" value={pending.length} icon={Inbox} tone="warning" />
        <StatCard label="Assigned students" value={new Set(active.map((m) => m.studentId)).size} icon={UsersRound} />
        <StatCard label="Mentored projects" value={mentored.length} icon={FolderKanban} tone="violet" />
        <StatCard label="Upcoming sessions" value={sessions.length} icon={CalendarClock} tone="success" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Panel title="Mentorship requests" action={<Link href="/mentorship" className="text-xs font-medium text-primary hover:underline">Manage all</Link>} bodyClassName="p-0">
            {pending.length === 0 ? (
              <div className="p-5">
                <EmptyState icon={Inbox} title="No pending requests" description="New mentorship requests from students will appear here." className="py-8" />
              </div>
            ) : (
              <ul className="divide-y">
                {pending.map((m) => {
                  const st = users.find((u) => u.id === m.studentId)
                  const proj = projects.find((p) => p.id === m.projectId)
                  return (
                    <li key={m.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start">
                      <UserAvatar user={st} size="sm" link />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-navy">{st?.name}</p>
                          <Chip tone="violet">{m.mode}</Chip>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {st?.department} · {proj ? proj.title : 'General guidance'} · {timeAgo(m.createdAt)}
                        </p>
                        <p className="mt-2 text-sm text-foreground/85">{m.message}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => { respond(m.id, true); toast.success(`Accepted ${st?.name}’s request`) }}>
                          <Check className="size-3.5" /> Accept
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { respond(m.id, false); toast(`Declined ${st?.name}’s request`) }}>
                          <X className="size-3.5" /> Decline
                        </Button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </Panel>

          <Panel title="Mentored projects" bodyClassName="p-0">
            {mentored.length === 0 ? (
              <div className="p-5">
                <EmptyState icon={FolderKanban} title="No mentored projects yet" className="py-8" />
              </div>
            ) : (
              <ul className="divide-y">
                {mentored.map((p) => {
                  const pct = roadmapProgress(p.roadmap)
                  const review = p.roadmap.find((s) => s.mentorReview && !s.completed && !s.mentorFeedback)
                  return (
                    <li key={p.id}>
                      <Link href={`/projects/${p.id}?tab=guidance`} className="flex flex-col gap-2 px-5 py-4 hover:bg-muted/40 sm:flex-row sm:items-center">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-navy">{p.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {p.domain}
                            {review ? ` · Review due: ${review.title}` : ''}
                          </p>
                        </div>
                        <div className="flex w-full items-center gap-3 sm:w-48">
                          <ProgressBar value={pct} />
                          <span className="w-9 text-right text-xs font-medium">{pct}%</span>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel title="Upcoming sessions">
            {sessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sessions scheduled. Schedule one from Mentorship.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {sessions.slice(0, 5).map((s) => (
                  <li key={s.id} className="flex gap-3">
                    <div className="flex w-12 shrink-0 flex-col items-center rounded-lg bg-accent py-1.5 text-accent-foreground">
                      <span className="text-[10px] uppercase">{new Date(s.date).toLocaleString('en', { month: 'short' })}</span>
                      <span className="text-base leading-none font-semibold">{new Date(s.date).getDate()}</span>
                    </div>
                    <div className="min-w-0 text-sm">
                      <p className="font-medium text-navy">{s.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.student?.name} · {s.time}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Assigned students">
            {active.length === 0 ? (
              <EmptyState icon={GraduationCap} title="No assigned students" className="py-6" />
            ) : (
              <ul className="flex flex-col gap-4">
                {active.map((m) => {
                  const st = users.find((u) => u.id === m.studentId)
                  return (
                    <li key={m.id}>
                      <div className="flex items-center gap-3">
                        <UserAvatar user={st} size="sm" link />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-navy">{st?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {m.mode} · since {formatDate(m.createdAt)}
                          </p>
                        </div>
                        <span className="text-xs font-medium text-navy">{m.progress}%</span>
                      </div>
                      <ProgressBar value={m.progress} className="mt-2" tone="success" />
                    </li>
                  )
                })}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </div>
  )
}
