export type Role = 'student' | 'mentor' | 'college' | 'admin'

export type Domain = 'Software & Technology' | 'Agriculture' | 'Research' | 'Healthcare' | 'Business'

export type Availability = 'Full-time' | 'Part-time' | 'Weekends' | 'Flexible'

export type MentorCategory = 'Faculty' | 'Industry Professional' | 'Alumni' | 'Domain Expert' | 'Senior Student'

export type MentorshipMode = 'One-time guidance' | 'Continuous mentorship' | 'Both'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  college: string
  department: string
  year: string
  bio: string
  skills: string[]
  interests: string[]
  domains: Domain[]
  availability: Availability
  previousProjects: string[]
  achievements: string[]
  github: string
  portfolio: string
  verified: boolean
  status: 'active' | 'suspended'
  joinedAt: string
  avatarHue: number
  mentorCategory?: MentorCategory
  expertise?: string[]
  experience?: string
  organization?: string
  guidanceAreas?: string[]
  mentorshipMode?: MentorshipMode
}

export interface ChecklistItem {
  id: string
  text: string
  done: boolean
}

export interface RoadmapStage {
  index: number
  title: string
  focus: string
  description: string
  objectives: string[]
  checklist: ChecklistItem[]
  resources: { title: string; url: string }[]
  notes: string
  mentorFeedback: string
  completed: boolean
  mentorReview: boolean
}

export type ProjectStatus = 'Idea' | 'Ongoing' | 'Completed'
export type CollaborationType = 'Remote' | 'Hybrid' | 'In-person'

export interface Discussion {
  id: string
  authorId: string
  text: string
  createdAt: string
  replies: { id: string; authorId: string; text: string; createdAt: string }[]
}

export interface Resource {
  id: string
  title: string
  url: string
  kind: 'Documentation' | 'Learning' | 'Tool' | 'Dataset' | 'Reference'
  addedBy: string
}

export interface Meeting {
  id: string
  title: string
  date: string
  time: string
  agenda: string
  createdBy: string
}

export interface ProgressUpdate {
  id: string
  authorId: string
  text: string
  createdAt: string
}

export interface Project {
  id: string
  title: string
  problem: string
  solution: string
  domain: Domain
  requiredSkills: string[]
  objectives: string[]
  outcomes: string[]
  teamRequirements: string
  ownerId: string
  teamId: string
  mentorId?: string
  status: ProjectStatus
  collaborationType: CollaborationType
  maxTeamSize: number
  deadline: string
  createdAt: string
  roadmap: RoadmapStage[]
  discussions: Discussion[]
  resources: Resource[]
  meetings: Meeting[]
  updates: ProgressUpdate[]
  spotlight: boolean
  moderation: 'approved' | 'flagged' | 'removed'
}

export interface TeamMember {
  userId: string
  role: string
  responsibility: string
}

export interface Team {
  id: string
  name: string
  description: string
  ownerId: string
  projectId?: string
  members: TeamMember[]
  requiredSkills: string[]
  createdAt: string
}

export interface Invitation {
  id: string
  teamId: string
  fromId: string
  toId: string
  kind: 'invite' | 'join-request'
  message: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

export type TaskStatus = 'To do' | 'In progress' | 'Done'
export type TaskPriority = 'Low' | 'Medium' | 'High'

export interface Task {
  id: string
  projectId: string
  title: string
  description: string
  assigneeId?: string
  priority: TaskPriority
  deadline: string
  status: TaskStatus
  createdAt: string
}

export interface Comment {
  id: string
  authorId: string
  text: string
  createdAt: string
}

export interface Post {
  id: string
  authorId: string
  projectId?: string
  kind: 'Idea' | 'Ongoing' | 'Completed'
  title: string
  description: string
  domain: Domain
  skills: string[]
  department: string
  teamSize: number
  lookingFor: string
  likes: string[]
  saves: string[]
  interested: string[]
  comments: Comment[]
  createdAt: string
}

export interface MentorshipFeedback {
  id: string
  text: string
  createdAt: string
}

export interface MentorshipSession {
  id: string
  title: string
  date: string
  time: string
  notes: string
}

export interface MentorshipRequest {
  id: string
  studentId: string
  mentorId: string
  projectId?: string
  mode: 'One-time guidance' | 'Continuous mentorship'
  message: string
  status: 'pending' | 'accepted' | 'rejected'
  progress: number
  feedback: MentorshipFeedback[]
  sessions: MentorshipSession[]
  createdAt: string
}

export interface Conversation {
  id: string
  kind: 'direct' | 'team' | 'mentor'
  name?: string
  participantIds: string[]
  projectId?: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  text: string
  createdAt: string
  simulated?: boolean
}

export type NotificationKind = 'collaboration' | 'mentorship' | 'project' | 'meeting' | 'team' | 'system'

export interface AppNotification {
  id: string
  userId: string
  kind: NotificationKind
  title: string
  body: string
  link: string
  read: boolean
  createdAt: string
}

export type OpportunityCategory = 'Hackathon' | 'Internship' | 'Workshop' | 'Innovation Competition' | 'Event'

export interface Opportunity {
  id: string
  title: string
  organization: string
  category: OpportunityCategory
  description: string
  eligibility: string
  deadline: string
  domain: Domain
  details: string
  location: string
  savedBy: string[]
  interestedBy: string[]
}

export interface Announcement {
  id: string
  authorId: string
  title: string
  body: string
  createdAt: string
  pinned: boolean
}

export interface Institution {
  id: string
  name: string
  location: string
  type: 'University' | 'Engineering College' | 'Agricultural University' | 'Medical College' | 'Business School'
  verified: boolean
  status: 'active' | 'pending' | 'suspended'
}

export interface Report {
  id: string
  reporterId: string
  targetType: 'user' | 'project' | 'post'
  targetId: string
  reason: string
  status: 'open' | 'resolved' | 'dismissed'
  createdAt: string
}

export interface ActivityLog {
  id: string
  userId: string
  action: string
  createdAt: string
}
