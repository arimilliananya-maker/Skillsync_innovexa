'use client'

import { Compass, FolderPlus, GraduationCap, Lightbulb, Search, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'
import { NotificationIcon } from '@/components/shared/notification-icon'
import { Chip, EmptyState, LinkButton, Panel, ProgressBar, StatusChip } from '@/components/shared/ui-bits'
import { UserAvatar } from '@/components/shared/user-avatar'
import { timeAgo } from '@/lib/format'
import { matchPersonToUser, matchProjectToUser } from '@/lib/matching'
import { currentStageIndex, roadmapProgress } from '@/lib/roadmap'
import { isMember, profileCompletion, projectsForUser, teamOf } from '@/lib/selectors'
import { useStore } from '@/lib/store'
import type { User } from '@/lib/types'

const QUICK = [
  { href: '/feed?compose=1', label: 'Share an Idea', icon: Lightbulb },
  { href: '/discover', label: 'Find Teammates', icon: UserPlus },
  { href: '/discover?tab=projects', label: 'Explore Projects', icon: Search },
  { href: '/mentors', label: 'Find a Mentor', icon: GraduationCap },
  { href: '/projects/new', label: 'Create a Project', icon: FolderPlus },
]

export function StudentDashboard({ user }: { user: User }) {
  const users = useStore((s) => s.users)
  const projects = useStore((s) => s.projects)
  const teams = useStore((s) => s.teams)
  const mentorships = useStore((s) => s.mentorships)
  const notifications = useStore((s) => s.notifications)
  const invitations = useStore((s) => s.invitations)

  const mine = useMemo(() => projectsForUser(user, projects, teams), [user, projects, teams])
  const completion = profileCompletion(user)

  const collaborators = useMemo(
    () =>
      users
        .filter((u) => u.role === 'student' && u.id !== user.id && u.status === 'active')
        .map((u) => ({ u, m: matchPersonToUser(u, user, mine) }))
        .filter((x) => x.m.score > 0)
        .sort((a, b) => b.m.score - a.m.score)
        .slice(0, 3),
    [users, user, mine],
  )

  const recommended = useMemo(
    () =>
      projects
        .filter((p) => p.moderation === 'approved' && p.status !== 'Completed' && !isMember(teamOf(p, teams), user.id) && p.ownerId !== user.id)
        .map((p) => ({ p, m: matchProjectToUser(p, teamOf(p, teams), user, users) }))
        .sort((a, b) => b.m.score - a.m.score)
        .slice(0, 3),
    [projects, teams, user, users],
  )

  const myMentorships = mentorships.filter((m) => m.studentId === user.id)
  const myNotifs = notifications.filter((n) => n.userId === user.id).slice(0, 5)
  const pendingInvites = invitations.filter((i) => i.toId === user.id && i.status === 'pending' && i.kind === 'invite').length

  const activity = mine
    .flatMap((p) => p.updates.map((u) => ({ ...u, project: p })))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-5 rounded-2xl border bg-card p-5 shadow-xs md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex items-center gap-4">
          <UserAvatar user={user} size="lg" />
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-navy md:text-2xl">Welcome back, {user.name.split(' ')[0]}</h1>
            <p className="text-sm text-muted-foreground">
              {user.department} · {user.year} · {user.college}
            </p>
          </div>
        </div>
        <div className="w-full md:w-64">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Profile completion</span>
            <span className="font-semibold text-navy">{completion.percent}%</span>
          </div>
          <ProgressBar value={completion.percent} className="mt-2" />
          {completion.missing[0] && (
            <Link href="/profile" className="mt-2 inline-block text-xs font-medium text-primary hover:underline">
              Next: {completion.missing[0]}
            </Link>
          )}
        </div>
      </section>

      <nav aria-label="Quick actions" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {QUICK.map((q) => (
          <Link key={q.href} href={q.href} className="flex items-center gap-3 rounded-xl border bg-card p-3.5 text-sm font-medium text-navy shadow-xs transition-colors hover:border-primary/40 hover:bg-accent/40">
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-accent text-primary">
              <q.icon className="size-4" aria-hidden="true" />
            </span>
            {q.label}
          </Link>
        ))}
      </nav>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Panel title="Active projects" action={<Link href="/projects" className="text-xs font-medium text-primary hover:underline">View all</Link>} bodyClassName="p-0">
            {mine.length === 0 ? (
              <div className="p-5">
                <EmptyState icon={FolderPlus} title="No active projects yet" description="Create a project or join a team to see it here." action={<LinkButton href="/projects/new" size="sm">Create a project</LinkButton>} />
              </div>
            ) : (
              <ul className="divide-y">
                {mine.slice(0, 4).map((p) => {
                  const pct = roadmapProgress(p.roadmap)
                  const stage = p.roadmap[currentStageIndex(p.roadmap)]
                  const team = teamOf(p, teams)
                  return (
                    <li key={p.id}>
                      <Link href={`/projects/${p.id}`} className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-navy">{p.title}</p>
                            <StatusChip status={p.status} />
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {p.domain} · Stage {stage.index + 1}: {stage.title} · {team?.members.length ?? 0} members
                          </p>
                        </div>
                        <div className="flex w-full items-center gap-3 sm:w-48">
                          <ProgressBar value={pct} />
                          <span className="w-9 text-right text-xs font-medium text-navy">{pct}%</span>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </Panel>

          <Panel title="Recommended collaborators" action={<Link href="/discover" className="text-xs font-medium text-primary hover:underline">Discover more</Link>}>
            <div className="grid gap-3 md:grid-cols-3">
              {collaborators.map(({ u, m }) => (
                <Link key={u.id} href={`/profile/${u.id}`} className="flex flex-col rounded-xl border p-4 transition-colors hover:border-primary/40">
                  <div className="flex items-center gap-3">
                    <UserAvatar user={u} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-navy">{u.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{u.department}</p>
                    </div>
                    <span className="ml-auto text-xs font-semibold text-primary">{m.score}%</span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{m.reasons[0]}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {u.skills.slice(0, 3).map((s) => (
                      <Chip key={s}>{s}</Chip>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Rule-based matching on skills, interests, domains and availability.</p>
          </Panel>

          <Panel title="Recommended projects" action={<Link href="/discover?tab=projects" className="text-xs font-medium text-primary hover:underline">Explore</Link>} bodyClassName="p-0">
            <ul className="divide-y">
              {recommended.map(({ p, m }) => (
                <li key={p.id}>
                  <Link href={`/projects/${p.id}`} className="flex items-start gap-4 px-5 py-4 hover:bg-muted/40">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-navy">{p.title}</p>
                        <Chip tone="primary">{p.domain}</Chip>
                      </div>
                      <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{p.problem}</p>
                      {m.reasons[0] && <p className="mt-1 text-xs text-success">{m.reasons[0]}</p>}
                    </div>
                    <span className="text-sm font-semibold text-primary">{m.score}%</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          {pendingInvites > 0 && (
            <Link href="/teams" className="rounded-xl border border-violet/30 bg-violet/5 p-4 text-sm">
              <p className="font-medium text-navy">
                {pendingInvites} pending team invitation{pendingInvites > 1 ? 's' : ''}
              </p>
              <p className="text-xs text-muted-foreground">Review and respond in My Teams</p>
            </Link>
          )}

          <Panel title="Notifications" action={<Link href="/notifications" className="text-xs font-medium text-primary hover:underline">View all</Link>} bodyClassName="p-0">
            {myNotifs.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">You&apos;re all caught up.</p>
            ) : (
              <ul className="divide-y">
                {myNotifs.map((n) => (
                  <li key={n.id}>
                    <Link href={n.link} className="flex gap-3 px-5 py-3 hover:bg-muted/40">
                      <NotificationIcon kind={n.kind} />
                      <div className="min-w-0">
                        <p className={`text-sm ${n.read ? 'text-foreground/80' : 'font-medium text-navy'}`}>{n.title}</p>
                        <p className="line-clamp-1 text-xs text-muted-foreground">{n.body}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">{timeAgo(n.createdAt)}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Mentorship requests" action={<Link href="/mentors" className="text-xs font-medium text-primary hover:underline">Mentor Connect</Link>}>
            {myMentorships.length === 0 ? (
              <EmptyState icon={GraduationCap} title="No mentorship requests" action={<LinkButton href="/mentors" size="sm" variant="outline">Find a mentor</LinkButton>} className="py-6" />
            ) : (
              <ul className="flex flex-col gap-3">
                {myMentorships.map((m) => {
                  const mentor = users.find((u) => u.id === m.mentorId)
                  return (
                    <li key={m.id} className="flex items-center gap-3">
                      <UserAvatar user={mentor} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-navy">{mentor?.name}</p>
                        <p className="text-xs text-muted-foreground">{m.mode}</p>
                      </div>
                      <Chip tone={m.status === 'accepted' ? 'success' : m.status === 'rejected' ? 'danger' : 'warning'}>{m.status}</Chip>
                    </li>
                  )
                })}
              </ul>
            )}
          </Panel>

          <Panel title="Team activity">
            {activity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent updates from your teams.</p>
            ) : (
              <ol className="flex flex-col gap-4">
                {activity.map((a) => {
                  const author = users.find((u) => u.id === a.authorId)
                  return (
                    <li key={a.id} className="flex gap-3">
                      <UserAvatar user={author} size="xs" className="mt-0.5" />
                      <div className="min-w-0 text-sm">
                        <p className="text-foreground/90">
                          <span className="font-medium text-navy">{author?.name.split(' ')[0]}</span> {a.text}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {a.project.title} · {timeAgo(a.createdAt)}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ol>
            )}
          </Panel>
        </div>
      </div>
      <Link href="/discover" className="sr-only">
        <Compass /> Discover
      </Link>
    </div>
  )
}
