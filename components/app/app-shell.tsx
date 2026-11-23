'use client'

import { Bell, LogOut, Menu, MessageSquare, RotateCcw, Shuffle, UserRound } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Logo } from '@/components/shared/logo'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { NAV, ROLE_LABEL } from '@/lib/nav'
import { DEMO_ACCOUNTS } from '@/lib/seed'
import { useCurrentUser, useHydrated, useStore } from '@/lib/store'
import type { Role } from '@/lib/types'
import { cn } from '@/lib/utils'

function SidebarNav({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav aria-label="Main" className="flex flex-col gap-6">
      {NAV[role].map((group) => (
        <div key={group.section}>
          <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{group.section}</p>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`))
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                      active && 'bg-sidebar-accent text-sidebar-accent-foreground',
                    )}
                  >
                    <item.icon className="size-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function LoadingShell() {
  return (
    <div className="flex min-h-svh" aria-busy="true" aria-label="Loading SkillSync">
      <div className="hidden w-64 border-r bg-sidebar p-4 lg:block">
        <Skeleton className="mb-8 h-8 w-32" />
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="mb-2 h-8 w-full" />
        ))}
      </div>
      <div className="flex-1 p-6">
        <Skeleton className="mb-6 h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="mt-6 h-72" />
      </div>
    </div>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const hydrated = useHydrated()
  const user = useCurrentUser()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const notifications = useStore((s) => s.notifications)
  const login = useStore((s) => s.login)
  const logout = useStore((s) => s.logout)
  const resetDemo = useStore((s) => s.resetDemo)
  const unread = useMemo(() => notifications.filter((n) => n.userId === user?.id && !n.read).length, [notifications, user?.id])

  useEffect(() => {
    if (hydrated && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`)
  }, [hydrated, user, router, pathname])

  if (!hydrated || !user) return <LoadingShell />

  if (user.status === 'suspended')
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-xl font-semibold">This account is suspended</h1>
        <p className="max-w-sm text-sm text-muted-foreground">A platform administrator has suspended this account. Contact your SkillSync administrator for help.</p>
        <Button
          onClick={() => {
            logout()
            router.push('/login')
          }}
        >
          Sign out
        </Button>
      </div>
    )

  const switchRole = (role: Role) => {
    login(DEMO_ACCOUNTS[role])
    router.push('/dashboard')
    toast.success(`Switched to the ${ROLE_LABEL[role]} demo account`)
  }

  return (
    <div className="flex min-h-svh">
      <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-r bg-sidebar lg:flex">
        <div className="flex h-16 items-center px-5">
          <Logo href="/dashboard" />
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <SidebarNav role={user.role} />
        </div>
        <div className="border-t p-3">
          <Link href={user.role === 'admin' || user.role === 'college' ? '/dashboard' : '/profile'} className="flex items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent">
            <UserAvatar user={user} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-navy">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{ROLE_LABEL[user.role]}</p>
            </div>
          </Link>
        </div>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex h-16 items-center px-5">
            <Logo href="/dashboard" />
          </div>
          <div className="overflow-y-auto px-3 py-2">
            <SidebarNav role={user.role} onNavigate={() => setMobileOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background/85 px-4 backdrop-blur md:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
            <Menu />
          </Button>
          <div className="lg:hidden">
            <Logo href="/dashboard" />
          </div>
          <div className="ml-auto flex items-center gap-1">
            <span className="mr-2 hidden rounded-md border bg-card px-2 py-1 text-xs text-muted-foreground md:inline">
              Demo mode · data saved in this browser
            </span>
            <Link
              href="/messages"
              className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Messages"
            >
              <MessageSquare className="size-4.5" />
            </Link>
            <Link
              href="/notifications"
              className="relative inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
            >
              <Bell className="size-4.5" />
              {unread > 0 && (
                <span className="absolute top-1 right-1 inline-flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                  {unread}
                </span>
              )}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="ml-1 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50" aria-label="Account menu">
                <UserAvatar user={user} size="sm" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <span className="block font-medium text-foreground">{user.name}</span>
                    <span className="block text-xs font-normal">{user.email}</span>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {(user.role === 'student' || user.role === 'mentor') && (
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <UserRound /> Profile
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => router.push('/notifications')}>
                  <Bell /> Notifications
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Switch demo role</DropdownMenuLabel>
                  {(Object.keys(DEMO_ACCOUNTS) as Role[])
                    .filter((r) => r !== user.role)
                    .map((r) => (
                      <DropdownMenuItem key={r} onClick={() => switchRole(r)}>
                        <Shuffle /> {ROLE_LABEL[r]}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    resetDemo()
                    toast.success('Demo data reset to the original sample data')
                  }}
                >
                  <RotateCcw /> Reset demo data
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    logout()
                    router.push('/login')
                  }}
                >
                  <LogOut /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-6 md:py-8">{children}</main>
      </div>
    </div>
  )
}

export function RoleGate({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const user = useCurrentUser()
  if (!user || !roles.includes(user.role))
    return (
      <div className="rounded-xl border border-dashed bg-card p-12 text-center">
        <p className="font-medium text-navy">This area is not available for your role</p>
        <p className="mt-1 text-sm text-muted-foreground">Use the account menu to switch to a different demo role.</p>
        <Link href="/dashboard" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
          Back to dashboard
        </Link>
      </div>
    )
  return <>{children}</>
}
