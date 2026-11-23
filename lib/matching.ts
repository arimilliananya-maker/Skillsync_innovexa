import type { Project, Team, User } from './types'

export const SKILL_CATALOG = [
  'Python', 'Machine Learning', 'Data Analysis', 'Data Visualization', 'SQL', 'React', 'Next.js', 'Node.js', 'TypeScript',
  'Flask', 'UI/UX Design', 'Figma', 'User Research', 'Content Writing', 'IoT', 'Electronics', 'Arduino', 'Embedded C',
  'PCB Design', 'Solar Systems', 'CAD', 'SolidWorks', '3D Printing', 'Prototyping', 'Soil Science', 'Crop Management',
  'Field Research', 'Irrigation Engineering', 'Data Collection', 'AutoCAD', 'Microbiology', 'Lab Research', 'Research',
  'Material Science', 'Technical Writing', 'Medical Devices', 'Signal Processing', 'MATLAB', 'Clinical Research',
  'Public Health', 'Patient Care', 'Data Privacy', 'Market Research', 'Business Strategy', 'Financial Modeling', 'Pitching',
]

export const INTEREST_CATALOG = [
  'Smart Farming', 'Sustainability', 'Water Conservation', 'IoT', 'Computer Vision', 'Renewable Energy', 'Robotics',
  'Entrepreneurship', 'Fintech', 'Healthcare Access', 'Wearables', 'EdTech', 'Open Source', 'Accessibility',
  'Public Health', 'Circular Economy', 'Research', 'AI for Good',
]

export const DEPARTMENTS = [
  'Agriculture', 'Agricultural Engineering', 'Biotechnology', 'Biomedical Engineering', 'Business Administration',
  'Computer Science & Engineering', 'Data Science', 'Electrical Engineering', 'Electronics & Communication',
  'Information Technology', 'Mechanical Engineering', 'Medicine (MBBS)',
]

export const COLLEGES = [
  'Riverside Institute of Technology',
  'Greenfield Agricultural University',
  'Meridian Medical College',
  'Northbridge School of Business',
]

export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate']

const norm = (s: string) => s.trim().toLowerCase()
const intersect = (a: string[], b: string[]) => {
  const set = new Set(b.map(norm))
  return a.filter((x) => set.has(norm(x)))
}

export interface MatchResult {
  score: number
  reasons: string[]
  matchedSkills: string[]
}

export function teamSkills(team: Team | undefined, users: User[]) {
  if (!team) return []
  const ids = new Set(team.members.map((m) => m.userId))
  return Array.from(new Set(users.filter((u) => ids.has(u.id)).flatMap((u) => u.skills)))
}

export function missingSkills(required: string[], have: string[]) {
  const set = new Set(have.map(norm))
  return required.filter((s) => !set.has(norm(s)))
}

export function skillCoverage(required: string[], have: string[]) {
  if (required.length === 0) return 100
  return Math.round(((required.length - missingSkills(required, have).length) / required.length) * 100)
}

/** Rule-based: how well does a candidate fill a project's skill gaps? */
export function matchPersonToProject(candidate: User, project: Project, team: Team | undefined, users: User[]): MatchResult {
  const have = teamSkills(team, users)
  const gaps = missingSkills(project.requiredSkills, have)
  const fills = intersect(candidate.skills, gaps)
  const reasons: string[] = []
  let score = 0

  if (fills.length) {
    score += Math.min(fills.length * 22, 55)
    reasons.push(`Complementary skills: covers missing ${fills.join(', ')}`)
  }
  const sharedInterests = intersect(candidate.interests, [project.domain, ...project.requiredSkills, ...(users.find((u) => u.id === project.ownerId)?.interests ?? [])])
  if (sharedInterests.length) {
    score += Math.min(sharedInterests.length * 6, 15)
    reasons.push(`Shared interests: ${sharedInterests.slice(0, 3).join(', ')}`)
  }
  if (candidate.domains.includes(project.domain)) {
    score += 10
    reasons.push(`Prefers ${project.domain} projects`)
  }
  if (candidate.previousProjects.length) {
    score += 8
    reasons.push(`Relevant experience: ${candidate.previousProjects[0]}`)
  }
  const owner = users.find((u) => u.id === project.ownerId)
  if (owner && owner.department !== candidate.department) {
    score += 5
    reasons.push(`Interdisciplinary: ${candidate.department} complements ${owner.department}`)
  }
  if (candidate.availability === owner?.availability || candidate.availability === 'Flexible') {
    score += 7
    reasons.push(`Matching availability (${candidate.availability})`)
  }
  return { score: Math.min(score, 100), reasons, matchedSkills: fills }
}

/** Rule-based: how complementary is a candidate to the current user? */
export function matchPersonToUser(candidate: User, me: User, myProjects: Project[]): MatchResult {
  const reasons: string[] = []
  let score = 0
  const neededSkills = Array.from(new Set(myProjects.flatMap((p) => p.requiredSkills)))
  const fills = intersect(candidate.skills, missingSkills(neededSkills, me.skills))
  if (fills.length) {
    score += Math.min(fills.length * 18, 50)
    reasons.push(`Complementary skills: ${fills.slice(0, 3).join(', ')}`)
  } else {
    const newSkills = candidate.skills.filter((s) => !me.skills.map(norm).includes(norm(s)))
    if (newSkills.length) {
      score += 10
      reasons.push(`Brings new skills: ${newSkills.slice(0, 2).join(', ')}`)
    }
  }
  const sharedInterests = intersect(candidate.interests, me.interests)
  if (sharedInterests.length) {
    score += Math.min(sharedInterests.length * 8, 24)
    reasons.push(`Shared interests: ${sharedInterests.slice(0, 3).join(', ')}`)
  }
  const sharedDomains = intersect(candidate.domains, me.domains)
  if (sharedDomains.length) {
    score += 8
    reasons.push(`Same preferred domain: ${sharedDomains[0]}`)
  }
  if (candidate.department !== me.department) {
    score += 6
    reasons.push(`Interdisciplinary: ${candidate.department}`)
  }
  if (candidate.availability === me.availability || candidate.availability === 'Flexible') {
    score += 6
    reasons.push(`Matching availability (${candidate.availability})`)
  }
  if (candidate.previousProjects.length) {
    score += 6
    reasons.push(`Project experience: ${candidate.previousProjects.length} past project${candidate.previousProjects.length > 1 ? 's' : ''}`)
  }
  return { score: Math.min(score, 100), reasons, matchedSkills: fills }
}

/** Rule-based: how relevant is a project to the current user? */
export function matchProjectToUser(project: Project, team: Team | undefined, me: User, users: User[]): MatchResult {
  const have = teamSkills(team, users)
  const gaps = missingSkills(project.requiredSkills, have)
  const fills = intersect(me.skills, gaps)
  const reasons: string[] = []
  let score = 0
  if (fills.length) {
    score += Math.min(fills.length * 22, 55)
    reasons.push(`Your skills fill gaps: ${fills.join(', ')}`)
  }
  if (me.domains.includes(project.domain)) {
    score += 15
    reasons.push(`Matches your domain: ${project.domain}`)
  }
  const shared = intersect(me.interests, [...project.requiredSkills, project.domain])
  if (shared.length) {
    score += 10
    reasons.push(`Related to your interests: ${shared.slice(0, 2).join(', ')}`)
  }
  const size = team?.members.length ?? 0
  if (size < project.maxTeamSize) {
    score += 10
    reasons.push(`${project.maxTeamSize - size} open spot${project.maxTeamSize - size > 1 ? 's' : ''} on the team`)
  }
  return { score: Math.min(score, 100), reasons, matchedSkills: fills }
}
