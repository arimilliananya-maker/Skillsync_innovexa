import type { Project, Task, Team, User } from './types'

export function teamOf(project: Project | undefined, teams: Team[]) {
  return project ? teams.find((t) => t.id === project.teamId) : undefined
}

export function isMember(team: Team | undefined, userId: string) {
  return !!team?.members.some((m) => m.userId === userId)
}

export function projectsForUser(user: User, projects: Project[], teams: Team[]) {
  const live = projects.filter((p) => p.moderation !== 'removed')
  if (user.role === 'mentor') return live.filter((p) => p.mentorId === user.id)
  if (user.role === 'student') return live.filter((p) => p.ownerId === user.id || isMember(teamOf(p, teams), user.id))
  return live
}

export function canEditProject(user: User | undefined, project: Project, teams: Team[]) {
  if (!user) return false
  if (user.role === 'admin') return true
  if (project.mentorId === user.id) return true
  return project.ownerId === user.id || isMember(teamOf(project, teams), user.id)
}

export function taskProgress(tasks: Task[]) {
  if (!tasks.length) return 0
  return Math.round((tasks.filter((t) => t.status === 'Done').length / tasks.length) * 100)
}

export function profileCompletion(user: User) {
  const checks: [boolean, string][] = [
    [!!user.bio, 'Add a short bio'],
    [user.skills.length >= 3, 'Add at least 3 skills'],
    [user.interests.length >= 2, 'Add your interests'],
    [user.domains.length > 0, 'Choose preferred domains'],
    [user.previousProjects.length > 0, 'List previous projects'],
    [!!user.github, 'Link your GitHub'],
    [!!user.portfolio, 'Link your portfolio'],
    [user.achievements.length > 0, 'Add an achievement'],
  ]
  const done = checks.filter(([ok]) => ok).length
  return { percent: Math.round((done / checks.length) * 100), missing: checks.filter(([ok]) => !ok).map(([, l]) => l) }
}

export function userById(users: User[], id: string | undefined) {
  return users.find((u) => u.id === id)
}
