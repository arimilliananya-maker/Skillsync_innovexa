import {
  BadgeCheck,
  Bell,
  Briefcase,
  Building2,
  Compass,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  type LucideIcon,
  Megaphone,
  MessageSquare,
  Newspaper,
  ShieldAlert,
  UserRound,
  Users,
  UsersRound,
} from 'lucide-react'
import type { Role } from './types'

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

export const NAV: Record<Role, { section: string; items: NavItem[] }[]> = {
  student: [
    {
      section: 'Workspace',
      items: [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/projects', label: 'My Projects', icon: FolderKanban },
        { href: '/teams', label: 'My Teams', icon: UsersRound },
        { href: '/messages', label: 'Messages', icon: MessageSquare },
      ],
    },
    {
      section: 'Explore',
      items: [
        { href: '/feed', label: 'Project Feed', icon: Newspaper },
        { href: '/discover', label: 'Discover', icon: Compass },
        { href: '/mentors', label: 'Mentor Connect', icon: GraduationCap },
        { href: '/opportunities', label: 'Opportunities', icon: Briefcase },
      ],
    },
    { section: 'Account', items: [{ href: '/profile', label: 'Profile & Portfolio', icon: UserRound }] },
  ],
  mentor: [
    {
      section: 'Mentoring',
      items: [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/mentorship', label: 'Mentorship', icon: GraduationCap },
        { href: '/projects', label: 'Mentored Projects', icon: FolderKanban },
        { href: '/messages', label: 'Messages', icon: MessageSquare },
      ],
    },
    {
      section: 'Explore',
      items: [
        { href: '/feed', label: 'Project Feed', icon: Newspaper },
        { href: '/discover', label: 'Discover', icon: Compass },
        { href: '/opportunities', label: 'Opportunities', icon: Briefcase },
      ],
    },
    { section: 'Account', items: [{ href: '/profile', label: 'Mentor Profile', icon: UserRound }] },
  ],
  college: [
    {
      section: 'Institution',
      items: [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/projects', label: 'Explore Projects', icon: FolderKanban },
        { href: '/announcements', label: 'Announcements', icon: Megaphone },
        { href: '/messages', label: 'Messages', icon: MessageSquare },
      ],
    },
    {
      section: 'Explore',
      items: [
        { href: '/feed', label: 'Project Feed', icon: Newspaper },
        { href: '/discover', label: 'Students & Teams', icon: Compass },
        { href: '/opportunities', label: 'Opportunities', icon: Briefcase },
      ],
    },
  ],
  admin: [
    {
      section: 'Administration',
      items: [
        { href: '/dashboard', label: 'Analytics', icon: LayoutDashboard },
        { href: '/admin/users', label: 'Users', icon: Users },
        { href: '/admin/institutions', label: 'Institutions', icon: Building2 },
        { href: '/admin/verification', label: 'Verification', icon: BadgeCheck },
        { href: '/admin/moderation', label: 'Moderation', icon: ShieldAlert },
      ],
    },
    {
      section: 'Platform',
      items: [
        { href: '/projects', label: 'All Projects', icon: FolderKanban },
        { href: '/feed', label: 'Project Feed', icon: Newspaper },
        { href: '/notifications', label: 'Notifications', icon: Bell },
      ],
    },
  ],
}

export const ROLE_LABEL: Record<Role, string> = {
  student: 'Student',
  mentor: 'Mentor',
  college: 'College Authority',
  admin: 'Platform Admin',
}
