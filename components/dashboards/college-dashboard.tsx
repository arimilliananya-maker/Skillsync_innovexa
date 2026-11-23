'use client'

import { FolderKanban, GraduationCap, Megaphone, Pin, Sparkles, Star, UsersRound } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { Chip, Panel, ProgressBar, StatCard, StatusChip } from '@/components/shared/ui-bits'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Button } from '@/components/ui/button'
import { timeAgo } from '@/lib/format'
import { roadmapProgress } from '@/lib/roadmap'
import { teamOf } from '@/lib/selectors'
import { useStore } from '@/lib/store'
import type { User } from '@/lib/types'
import { DonutChart, HBarChart, countBy } from './charts'

export function CollegeDashboard({ user }: { user: User }) {
  const users = useStore((s) => s.users)
  const projects = useStore((s) => s.projects)
  const teams = useStore((s) => s.teams)
  const mentorships = useStore((s) => s.mentorships)
  const announcements = useStore((s) => s.announcements)
  const toggleSpotlight = useStore((s) => s.toggleSpotlight)

  const live = projects.filter((p) => p.moderation !== 'removed')
  const students = users.filter((u) => u.role === 'student')
  const participating = new Set(teams.flatMap((t) => t.members.map((m) => m.userId)))
  const activeTeams = teams.filter((t) => {
    const p = live.find((x) => x.id === t.projectId)
    return p && p.status !== 'Completed'
  })
  const mentors = users.filter((u) => u.role === 'mentor')
  const activeMentors = new Set([...live.map((p) => p.mentorId).filter(Boolean), ...mentorships.filter((m) => m.status === 'accepted').map((m) => m.mentorId)])

  const byDept = useMemo(() => countBy(live, (p) => users.find((u) => u.id === p.ownerId)?.department ?? 'Other'), [live, users])
  const byDomain = useMemo(() => countBy(live, (p) => p.domain), [live])

  const promising = [...live]
    .filter((p) => p.status !== 'Idea')
    .sort((a, b) => roadmapProgress(b.roadmap) + (teamOf(b, teams)?.members.length ?? 0) * 3 - (roadmapProgress(a.roadmap) + (teamOf(a, teams)?.members.length ?? 0) * 3))
    .slice(0, 5)
  const spotlight = live.filter((p) => p.spotlight)

  const mentorStats = mentors
    .map((m) => ({ m, count: live.filter((p) => p.mentorId === m.id).length + mentorships.filter((r) => r.mentorId === m.id && r.status === 'accepted').length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-navy">Innovation overview</h1>
        <p className="text-sm text-muted-foreground">
          {user.college} · {user.department}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Student participation" value={`${Math.round((participating.size / Math.max(1, students.length)) * 100)}%`} hint={`${participating.size} of ${students.length} students in teams`} icon={UsersRound} />
        <StatCard label="Total projects" value={live.length} hint={`${live.filter((p) => p.status === 'Completed').length} completed`} icon={FolderKanban} tone="violet" />
        <StatCard label="Active teams" value={activeTeams.length} icon={Sparkles} tone="success" />
        <StatCard label="Active mentors" value={activeMentors.size} hint={`${mentors.length} registered`} icon={GraduationCap} tone="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Projects by department">
          <HBarChart data={byDept} />
        </Panel>
        <Panel title="Innovation by domain">
          <DonutChart data={byDomain} />
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Promising projects" className="lg:col-span-2" action={<Link href="/projects" className="text-xs font-medium text-primary hover:underline">Explore all</Link>} bodyClassName="p-0">
          <ul className="divide-y">
            {promising.map((p) => {
              const pct = roadmapProgress(p.roadmap)
              const team = teamOf(p, teams)
              return (
                <li key={p.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
                  <Link href={`/projects/${p.id}`} className="min-w-0 flex-1 hover:underline">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-navy">{p.title}</span>
                      <StatusChip status={p.status} />
                    </div>
                    <span className="block text-xs text-muted-foreground">
                      {p.domain} · {team?.members.length ?? 0} members · {pct}% roadmap complete
                    </span>
                  </Link>
                  <div className="flex items-center gap-3">
                    <ProgressBar value={pct} className="w-28" />
                    <Button
                      size="sm"
                      variant={p.spotlight ? 'secondary' : 'outline'}
                      onClick={() => {
                        toggleSpotlight(p.id)
                        toast.success(p.spotlight ? 'Removed from Innovation Spotlight' : 'Added to Innovation Spotlight')
                      }}
                      aria-pressed={p.spotlight}
                    >
                      <Star className={`size-3.5 ${p.spotlight ? 'fill-current text-warning' : ''}`} /> Spotlight
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        </Panel>

        <Panel title="Mentor participation">
          <ul className="flex flex-col gap-3">
            {mentorStats.map(({ m, count }) => (
              <li key={m.id} className="flex items-center gap-3">
                <UserAvatar user={m} size="sm" link />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-navy">{m.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.mentorCategory}</p>
                </div>
                <Chip tone="primary">{count} active</Chip>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Innovation Spotlight" className="lg:col-span-2">
          {spotlight.length === 0 ? (
            <p className="text-sm text-muted-foreground">Use the Spotlight button on promising projects to feature them here.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {spotlight.map((p) => (
                <Link key={p.id} href={`/projects/${p.id}`} className="rounded-xl border bg-gradient-to-br from-accent/60 to-card p-4 transition-colors hover:border-primary/40">
                  <div className="flex items-center gap-2">
                    <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
                    <Chip tone="primary">{p.domain}</Chip>
                  </div>
                  <p className="mt-2 font-semibold text-navy">{p.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.solution}</p>
                </Link>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Announcements" action={<Link href="/announcements" className="text-xs font-medium text-primary hover:underline">Manage</Link>}>
          {announcements.length === 0 ? (
            <p className="text-sm text-muted-foreground">No announcements yet.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {announcements.slice(0, 3).map((a) => (
                <li key={a.id}>
                  <p className="flex items-center gap-1.5 text-sm font-medium text-navy">
                    {a.pinned ? <Pin className="size-3.5 text-violet" aria-label="Pinned" /> : <Megaphone className="size-3.5 text-muted-foreground" aria-hidden="true" />}
                    {a.title}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{a.body}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{timeAgo(a.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  )
}
