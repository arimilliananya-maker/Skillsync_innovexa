'use client'

import { Activity, BadgeCheck, Building2, Flag, FolderKanban, Users } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'
import { Panel, StatCard } from '@/components/shared/ui-bits'
import { UserAvatar } from '@/components/shared/user-avatar'
import { timeAgo } from '@/lib/format'
import { ROLE_LABEL } from '@/lib/nav'
import { useStore } from '@/lib/store'
import { DonutChart, HBarChart, TrendChart, countBy, monthlyCumulative } from './charts'

export function AdminDashboard() {
  const users = useStore((s) => s.users)
  const projects = useStore((s) => s.projects)
  const institutions = useStore((s) => s.institutions)
  const reports = useStore((s) => s.reports)
  const activity = useStore((s) => s.activity)

  const pendingVerification = users.filter((u) => u.role === 'mentor' && !u.verified).length + institutions.filter((i) => i.status === 'pending').length
  const openReports = reports.filter((r) => r.status === 'open').length
  const growth = useMemo(() => monthlyCumulative(users.map((u) => u.joinedAt)), [users])
  const roles = useMemo(() => countBy(users, (u) => ROLE_LABEL[u.role]), [users])
  const status = useMemo(() => countBy(projects, (p) => (p.moderation === 'approved' ? p.status : p.moderation === 'flagged' ? 'Flagged' : 'Removed')), [projects])

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight text-navy">Platform analytics</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total users" value={users.length} hint={`${users.filter((u) => u.status === 'suspended').length} suspended`} icon={Users} />
        <StatCard label="Projects" value={projects.length} hint={`${projects.filter((p) => p.moderation === 'flagged').length} flagged`} icon={FolderKanban} tone="violet" />
        <StatCard label="Pending verification" value={pendingVerification} icon={BadgeCheck} tone="warning" />
        <StatCard label="Open reports" value={openReports} icon={Flag} tone={openReports ? 'warning' : 'success'} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="User growth" className="lg:col-span-2">
          <TrendChart data={growth} label="Users" />
        </Panel>
        <Panel title="Users by role">
          <DonutChart data={roles} />
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Projects by status">
          <HBarChart data={status} />
        </Panel>
        <Panel title="Activity monitor" className="lg:col-span-2" action={<Activity className="size-4 text-muted-foreground" aria-hidden="true" />} bodyClassName="p-0">
          <ul className="max-h-80 divide-y overflow-y-auto">
            {activity.slice(0, 20).map((a) => {
              const u = users.find((x) => x.id === a.userId)
              return (
                <li key={a.id} className="flex items-center gap-3 px-5 py-2.5 text-sm">
                  <UserAvatar user={u} size="xs" />
                  <p className="min-w-0 flex-1 truncate">
                    <span className="font-medium text-navy">{u?.name ?? 'System'}</span> <span className="text-foreground/80">{a.action}</span>
                  </p>
                  <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(a.createdAt)}</span>
                </li>
              )
            })}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: '/admin/users', label: 'Manage users', icon: Users },
          { href: '/admin/institutions', label: 'Institutions', icon: Building2 },
          { href: '/admin/verification', label: 'Verification queue', icon: BadgeCheck },
          { href: '/admin/moderation', label: 'Moderation & reports', icon: Flag },
        ].map((l) => (
          <Link key={l.href} href={l.href} className="flex items-center gap-3 rounded-xl border bg-card p-4 text-sm font-medium text-navy shadow-xs hover:border-primary/40">
            <l.icon className="size-4 text-primary" aria-hidden="true" /> {l.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
