'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { useSyncExternalStore } from 'react'
import { buildRoadmap } from './roadmap'
import { createSeed, type SeedData } from './seed'
import type {
  AppNotification,
  CollaborationType,
  Domain,
  Meeting,
  MentorshipSession,
  Post,
  ProjectStatus,
  Resource,
  Role,
  Task,
  User,
} from './types'

/**
 * Demo persistence layer. All data lives in localStorage so the prototype works without a backend.
 * Each action maps 1:1 to a future API endpoint, so a real database can replace this store later.
 */

let seq = 0
export const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${(seq++).toString(36)}`
const now = () => new Date().toISOString()

export interface NewProjectInput {
  title: string
  problem: string
  solution: string
  domain: Domain
  requiredSkills: string[]
  objectives: string[]
  outcomes: string[]
  teamRequirements: string
  collaborationType: CollaborationType
  maxTeamSize: number
  deadline: string
}

export interface NewPostInput {
  kind: Post['kind']
  title: string
  description: string
  domain: Domain
  skills: string[]
  lookingFor: string
  teamSize: number
}

export type RegisterInput = Omit<User, 'id' | 'verified' | 'status' | 'joinedAt' | 'avatarHue'>

interface State extends SeedData {
  currentUserId: string | null
}

interface Actions {
  login: (userId: string) => void
  logout: () => void
  register: (input: RegisterInput) => string
  updateProfile: (userId: string, patch: Partial<User>) => void
  resetDemo: () => void

  createPost: (input: NewPostInput) => string
  updatePost: (postId: string, patch: Partial<NewPostInput>) => void
  deletePost: (postId: string) => void
  toggleLike: (postId: string) => void
  toggleSave: (postId: string) => void
  toggleInterest: (postId: string) => void
  addComment: (postId: string, text: string) => void

  requestJoin: (teamId: string, message: string) => boolean
  createTeam: (name: string, description: string, requiredSkills: string[]) => string
  inviteToTeam: (teamId: string, toId: string, message: string) => boolean
  respondInvitation: (invitationId: string, accept: boolean) => void
  updateMember: (teamId: string, userId: string, role: string, responsibility: string) => void
  removeMember: (teamId: string, userId: string) => void

  createProject: (input: NewProjectInput) => string
  updateProject: (projectId: string, patch: Partial<NewProjectInput> & { status?: ProjectStatus }) => void
  deleteProject: (projectId: string) => void
  toggleChecklistItem: (projectId: string, stageIndex: number, itemId: string) => void
  toggleStage: (projectId: string, stageIndex: number) => void
  updateStageNotes: (projectId: string, stageIndex: number, notes: string) => void
  setStageFeedback: (projectId: string, stageIndex: number, feedback: string) => void
  addDiscussion: (projectId: string, text: string) => void
  addReply: (projectId: string, discussionId: string, text: string) => void
  addResource: (projectId: string, resource: Omit<Resource, 'id' | 'addedBy'>) => void
  removeResource: (projectId: string, resourceId: string) => void
  addMeeting: (projectId: string, meeting: Omit<Meeting, 'id' | 'createdBy'>) => void
  removeMeeting: (projectId: string, meetingId: string) => void
  addUpdate: (projectId: string, text: string) => void
  toggleSpotlight: (projectId: string) => void
  moderateProject: (projectId: string, state: 'approved' | 'flagged' | 'removed') => void

  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (taskId: string, patch: Partial<Task>) => void
  deleteTask: (taskId: string) => void

  requestMentorship: (mentorId: string, mode: 'One-time guidance' | 'Continuous mentorship', message: string, projectId?: string) => boolean
  respondMentorship: (requestId: string, accept: boolean) => void
  addMentorFeedback: (requestId: string, text: string) => void
  scheduleSession: (requestId: string, session: Omit<MentorshipSession, 'id'>) => void
  setMentorshipProgress: (requestId: string, progress: number) => void

  startConversation: (otherUserId: string) => string
  sendMessage: (conversationId: string, text: string) => void

  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void

  toggleSaveOpportunity: (id: string) => void
  toggleInterestOpportunity: (id: string) => void

  addAnnouncement: (title: string, body: string) => void
  deleteAnnouncement: (id: string) => void
  togglePinAnnouncement: (id: string) => void

  setUserStatus: (userId: string, status: 'active' | 'suspended') => void
  setUserVerified: (userId: string, verified: boolean) => void
  setUserRole: (userId: string, role: Role) => void
  setInstitution: (id: string, patch: { verified?: boolean; status?: 'active' | 'pending' | 'suspended' }) => void
  addInstitution: (name: string, location: string, type: SeedData['institutions'][number]['type']) => void
  resolveReport: (id: string, status: 'resolved' | 'dismissed') => void
  createReport: (targetType: 'user' | 'project' | 'post', targetId: string, reason: string) => void
}

const SIMULATED_REPLIES = [
  'Thanks for the message! Let me look into it and get back to you shortly.',
  'Sounds good – shall we discuss this in our next meeting?',
  'Great idea. I will share some notes on this by tomorrow.',
  'Got it, thanks for the update!',
]

export const useStore = create<State & Actions>()(
  persist(
    immer((set, get) => {
      const me = () => get().currentUserId ?? ''
      const nameOf = (id: string) => get().users.find((u) => u.id === id)?.name ?? 'Someone'

      const notify = (s: State, n: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => {
        if (!n.userId || n.userId === s.currentUserId) return
        s.notifications.unshift({ ...n, id: newId('n'), read: false, createdAt: now() })
      }
      const log = (s: State, action: string) => {
        s.activity.unshift({ id: newId('ac'), userId: s.currentUserId ?? '', action, createdAt: now() })
      }
      const teamMemberIds = (s: State, projectId: string) => {
        const p = s.projects.find((x) => x.id === projectId)
        const t = s.teams.find((x) => x.id === p?.teamId)
        return t?.members.map((m) => m.userId) ?? []
      }

      return {
        ...createSeed(),
        currentUserId: null,

        login: (userId) => set((s) => void (s.currentUserId = userId)),
        logout: () => set((s) => void (s.currentUserId = null)),
        register: (input) => {
          const id = newId('u')
          set((s) => {
            s.users.push({
              ...input,
              id,
              verified: input.role === 'student',
              status: 'active',
              joinedAt: now(),
              avatarHue: Math.floor(Math.random() * 360),
            })
            s.currentUserId = id
            s.notifications.unshift({
              id: newId('n'),
              userId: id,
              kind: 'system',
              title: 'Welcome to SkillSync',
              body: 'Complete your profile and share your first idea to get matched with collaborators.',
              link: '/profile',
              read: false,
              createdAt: now(),
            })
            s.activity.unshift({ id: newId('ac'), userId: id, action: `joined SkillSync as ${input.role}`, createdAt: now() })
          })
          return id
        },
        updateProfile: (userId, patch) =>
          set((s) => {
            const u = s.users.find((x) => x.id === userId)
            if (u) Object.assign(u, patch)
          }),
        resetDemo: () => set(() => ({ ...createSeed(), currentUserId: get().currentUserId })),

        createPost: (input) => {
          const id = newId('po')
          set((s) => {
            const u = s.users.find((x) => x.id === s.currentUserId)
            s.posts.unshift({ ...input, id, authorId: me(), department: u?.department ?? '', likes: [], saves: [], interested: [], comments: [], createdAt: now() })
            log(s, `shared “${input.title}”`)
          })
          return id
        },
        updatePost: (postId, patch) =>
          set((s) => {
            const p = s.posts.find((x) => x.id === postId)
            if (p) Object.assign(p, patch)
          }),
        deletePost: (postId) => set((s) => void (s.posts = s.posts.filter((p) => p.id !== postId))),
        toggleLike: (postId) =>
          set((s) => {
            const p = s.posts.find((x) => x.id === postId)
            if (!p) return
            const uid = me()
            if (p.likes.includes(uid)) p.likes = p.likes.filter((x) => x !== uid)
            else {
              p.likes.push(uid)
              notify(s, { userId: p.authorId, kind: 'project', title: 'New like', body: `${nameOf(uid)} liked “${p.title}”.`, link: '/feed' })
            }
          }),
        toggleSave: (postId) =>
          set((s) => {
            const p = s.posts.find((x) => x.id === postId)
            if (!p) return
            const uid = me()
            p.saves = p.saves.includes(uid) ? p.saves.filter((x) => x !== uid) : [...p.saves, uid]
          }),
        toggleInterest: (postId) =>
          set((s) => {
            const p = s.posts.find((x) => x.id === postId)
            if (!p) return
            const uid = me()
            if (p.interested.includes(uid)) p.interested = p.interested.filter((x) => x !== uid)
            else {
              p.interested.push(uid)
              notify(s, { userId: p.authorId, kind: 'collaboration', title: 'Someone is interested', body: `${nameOf(uid)} is interested in “${p.title}”.`, link: '/feed' })
            }
          }),
        addComment: (postId, text) =>
          set((s) => {
            const p = s.posts.find((x) => x.id === postId)
            if (!p) return
            p.comments.push({ id: newId('cm'), authorId: me(), text, createdAt: now() })
            notify(s, { userId: p.authorId, kind: 'project', title: 'New comment', body: `${nameOf(me())} commented on “${p.title}”.`, link: '/feed' })
          }),

        requestJoin: (teamId, message) => {
          const s = get()
          const team = s.teams.find((t) => t.id === teamId)
          if (!team) return false
          if (team.members.some((m) => m.userId === me())) return false
          if (s.invitations.some((i) => i.teamId === teamId && i.fromId === me() && i.status === 'pending')) return false
          set((st) => {
            st.invitations.unshift({ id: newId('inv'), teamId, fromId: me(), toId: team.ownerId, kind: 'join-request', message, status: 'pending', createdAt: now() })
            notify(st, { userId: team.ownerId, kind: 'collaboration', title: 'New join request', body: `${nameOf(me())} requested to join ${team.name}.`, link: '/teams' })
            log(st, `requested to join ${team.name}`)
          })
          return true
        },
        createTeam: (name, description, requiredSkills) => {
          const id = newId('t')
          set((s) => {
            s.teams.unshift({ id, name, description, ownerId: me(), members: [{ userId: me(), role: 'Team Lead', responsibility: 'Coordination' }], requiredSkills, createdAt: now() })
            s.conversations.unshift({ id: newId('cv'), kind: 'team', name, participantIds: [me()] })
            log(s, `created team ${name}`)
          })
          return id
        },
        inviteToTeam: (teamId, toId, message) => {
          const s = get()
          const team = s.teams.find((t) => t.id === teamId)
          if (!team || team.members.some((m) => m.userId === toId)) return false
          if (s.invitations.some((i) => i.teamId === teamId && i.toId === toId && i.status === 'pending')) return false
          set((st) => {
            st.invitations.unshift({ id: newId('inv'), teamId, fromId: me(), toId, kind: 'invite', message, status: 'pending', createdAt: now() })
            notify(st, { userId: toId, kind: 'team', title: 'Team invitation', body: `${nameOf(me())} invited you to join ${team.name}.`, link: '/teams' })
            log(st, `invited ${nameOf(toId)} to ${team.name}`)
          })
          return true
        },
        respondInvitation: (invitationId, accept) =>
          set((s) => {
            const inv = s.invitations.find((i) => i.id === invitationId)
            if (!inv) return
            inv.status = accept ? 'accepted' : 'rejected'
            const team = s.teams.find((t) => t.id === inv.teamId)
            if (!team) return
            const joiningId = inv.kind === 'invite' ? inv.toId : inv.fromId
            const otherId = inv.kind === 'invite' ? inv.fromId : inv.toId
            if (accept && !team.members.some((m) => m.userId === joiningId)) {
              team.members.push({ userId: joiningId, role: 'Contributor', responsibility: 'To be assigned' })
              const convo = s.conversations.find((c) => c.kind === 'team' && (c.projectId ? c.projectId === team.projectId : c.name === team.name))
              if (convo && !convo.participantIds.includes(joiningId)) convo.participantIds.push(joiningId)
              const post = s.posts.find((p) => p.projectId && p.projectId === team.projectId)
              if (post) post.teamSize = team.members.length
            }
            notify(s, {
              userId: otherId,
              kind: 'team',
              title: accept ? 'Request accepted' : 'Request declined',
              body: inv.kind === 'invite'
                ? `${nameOf(joiningId)} ${accept ? 'joined' : 'declined to join'} ${team.name}.`
                : `Your request to join ${team.name} was ${accept ? 'accepted' : 'declined'}.`,
              link: team.projectId ? `/projects/${team.projectId}` : '/teams',
            })
            if (inv.kind === 'join-request')
              s.notifications.unshift({
                id: newId('n'),
                userId: joiningId,
                kind: 'team',
                title: accept ? 'Welcome to the team' : 'Join request declined',
                body: `Your request to join ${team.name} was ${accept ? 'accepted' : 'declined'}.`,
                link: team.projectId ? `/projects/${team.projectId}` : '/teams',
                read: false,
                createdAt: now(),
              })
            if (accept) log(s, `${nameOf(joiningId)} joined ${team.name}`)
          }),
        updateMember: (teamId, userId, role, responsibility) =>
          set((s) => {
            const m = s.teams.find((t) => t.id === teamId)?.members.find((x) => x.userId === userId)
            if (m) Object.assign(m, { role, responsibility })
          }),
        removeMember: (teamId, userId) =>
          set((s) => {
            const team = s.teams.find((t) => t.id === teamId)
            if (!team || userId === team.ownerId) return
            team.members = team.members.filter((m) => m.userId !== userId)
            const post = s.posts.find((p) => p.projectId && p.projectId === team.projectId)
            if (post) post.teamSize = team.members.length
            s.tasks.forEach((t) => {
              if (t.projectId === team.projectId && t.assigneeId === userId) t.assigneeId = undefined
            })
            notify(s, { userId, kind: 'team', title: 'Removed from team', body: `You were removed from ${team.name}.`, link: '/teams' })
          }),

        createProject: (input) => {
          const projectId = newId('p')
          const teamId = newId('t')
          set((s) => {
            const u = s.users.find((x) => x.id === s.currentUserId)
            const roadmap = buildRoadmap(input.domain)
            roadmap[0].checklist.forEach((c, i) => (c.done = i < 2))
            s.teams.unshift({
              id: teamId,
              name: `${input.title.split(/[–-]/)[0].trim()} Team`,
              description: input.solution,
              ownerId: me(),
              projectId,
              members: [{ userId: me(), role: 'Project Lead', responsibility: 'Overall coordination' }],
              requiredSkills: input.requiredSkills,
              createdAt: now(),
            })
            s.projects.unshift({
              ...input,
              id: projectId,
              ownerId: me(),
              teamId,
              status: 'Idea',
              createdAt: now(),
              roadmap,
              discussions: [],
              resources: [],
              meetings: [],
              updates: [{ id: newId('up'), authorId: me(), text: 'Project created and 13-stage roadmap generated.', createdAt: now() }],
              spotlight: false,
              moderation: 'approved',
            })
            s.posts.unshift({
              id: newId('po'),
              authorId: me(),
              projectId,
              kind: 'Idea',
              title: input.title,
              description: input.solution || input.problem,
              domain: input.domain,
              skills: input.requiredSkills,
              department: u?.department ?? '',
              teamSize: 1,
              lookingFor: input.teamRequirements,
              likes: [],
              saves: [],
              interested: [],
              comments: [],
              createdAt: now(),
            })
            s.conversations.unshift({ id: newId('cv'), kind: 'team', name: `${input.title.split(/[–-]/)[0].trim()} Team`, participantIds: [me()], projectId })
            s.notifications.unshift({ id: newId('n'), userId: me(), kind: 'project', title: 'Project created', body: `Your 13-stage roadmap for “${input.title}” is ready.`, link: `/projects/${projectId}?tab=roadmap`, read: false, createdAt: now() })
            log(s, `created project “${input.title}”`)
          })
          return projectId
        },
        updateProject: (projectId, patch) =>
          set((s) => {
            const p = s.projects.find((x) => x.id === projectId)
            if (!p) return
            Object.assign(p, patch)
            const post = s.posts.find((x) => x.projectId === projectId)
            if (post) {
              if (patch.title) post.title = patch.title
              if (patch.status) post.kind = patch.status
              if (patch.requiredSkills) post.skills = patch.requiredSkills
              if (patch.teamRequirements) post.lookingFor = patch.teamRequirements
            }
          }),
        deleteProject: (projectId) =>
          set((s) => {
            const p = s.projects.find((x) => x.id === projectId)
            s.projects = s.projects.filter((x) => x.id !== projectId)
            s.posts = s.posts.filter((x) => x.projectId !== projectId)
            s.tasks = s.tasks.filter((x) => x.projectId !== projectId)
            if (p) s.teams = s.teams.filter((t) => t.id !== p.teamId)
          }),
        toggleChecklistItem: (projectId, stageIndex, itemId) =>
          set((s) => {
            const p = s.projects.find((x) => x.id === projectId)
            const stage = p?.roadmap[stageIndex]
            const item = stage?.checklist.find((c) => c.id === itemId)
            if (!p || !stage || !item) return
            item.done = !item.done
            const allDone = stage.checklist.every((c) => c.done)
            if (allDone && !stage.completed) {
              stage.completed = true
              p.updates.unshift({ id: newId('up'), authorId: me(), text: `Completed stage ${stageIndex + 1}: ${stage.title}.`, createdAt: now() })
              log(s, `completed stage “${stage.title}” on ${p.title}`)
            } else if (!allDone) stage.completed = false
            if (p.status === 'Idea' && stageIndex >= 1 && item.done) p.status = 'Ongoing'
          }),
        toggleStage: (projectId, stageIndex) =>
          set((s) => {
            const p = s.projects.find((x) => x.id === projectId)
            const stage = p?.roadmap[stageIndex]
            if (!p || !stage) return
            stage.completed = !stage.completed
            stage.checklist.forEach((c) => (c.done = stage.completed))
            if (stage.completed) {
              p.updates.unshift({ id: newId('up'), authorId: me(), text: `Completed stage ${stageIndex + 1}: ${stage.title}.`, createdAt: now() })
              if (p.status === 'Idea') p.status = 'Ongoing'
              if (p.roadmap.every((x) => x.completed)) p.status = 'Completed'
              teamMemberIds(s, projectId).forEach((uid) =>
                notify(s, { userId: uid, kind: 'project', title: 'Stage completed', body: `${p.title}: “${stage.title}” is complete.`, link: `/projects/${projectId}?tab=roadmap` }),
              )
              log(s, `completed stage “${stage.title}” on ${p.title}`)
            }
          }),
        updateStageNotes: (projectId, stageIndex, notes) =>
          set((s) => {
            const stage = s.projects.find((x) => x.id === projectId)?.roadmap[stageIndex]
            if (stage) stage.notes = notes
          }),
        setStageFeedback: (projectId, stageIndex, feedback) =>
          set((s) => {
            const p = s.projects.find((x) => x.id === projectId)
            const stage = p?.roadmap[stageIndex]
            if (!p || !stage) return
            stage.mentorFeedback = feedback
            teamMemberIds(s, projectId).forEach((uid) =>
              notify(s, { userId: uid, kind: 'mentorship', title: 'New mentor feedback', body: `${nameOf(me())} reviewed “${stage.title}” on ${p.title}.`, link: `/projects/${projectId}?tab=roadmap` }),
            )
          }),
        addDiscussion: (projectId, text) =>
          set((s) => {
            const p = s.projects.find((x) => x.id === projectId)
            if (!p) return
            p.discussions.unshift({ id: newId('d'), authorId: me(), text, createdAt: now(), replies: [] })
            teamMemberIds(s, projectId).forEach((uid) =>
              notify(s, { userId: uid, kind: 'project', title: 'New discussion', body: `${nameOf(me())} started a discussion in ${p.title}.`, link: `/projects/${projectId}?tab=discussions` }),
            )
          }),
        addReply: (projectId, discussionId, text) =>
          set((s) => {
            const d = s.projects.find((x) => x.id === projectId)?.discussions.find((x) => x.id === discussionId)
            if (!d) return
            d.replies.push({ id: newId('r'), authorId: me(), text, createdAt: now() })
            notify(s, { userId: d.authorId, kind: 'project', title: 'New reply', body: `${nameOf(me())} replied to your discussion.`, link: `/projects/${projectId}?tab=discussions` })
          }),
        addResource: (projectId, resource) =>
          set((s) => {
            s.projects.find((x) => x.id === projectId)?.resources.unshift({ ...resource, id: newId('res'), addedBy: me() })
          }),
        removeResource: (projectId, resourceId) =>
          set((s) => {
            const p = s.projects.find((x) => x.id === projectId)
            if (p) p.resources = p.resources.filter((r) => r.id !== resourceId)
          }),
        addMeeting: (projectId, meeting) =>
          set((s) => {
            const p = s.projects.find((x) => x.id === projectId)
            if (!p) return
            p.meetings.push({ ...meeting, id: newId('mt'), createdBy: me() })
            p.meetings.sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
            const ids = new Set([...teamMemberIds(s, projectId), p.mentorId ?? ''])
            ids.forEach((uid) =>
              notify(s, { userId: uid, kind: 'meeting', title: 'Meeting scheduled', body: `${meeting.title} on ${meeting.date} at ${meeting.time} (${p.title}).`, link: `/projects/${projectId}?tab=meetings` }),
            )
          }),
        removeMeeting: (projectId, meetingId) =>
          set((s) => {
            const p = s.projects.find((x) => x.id === projectId)
            if (p) p.meetings = p.meetings.filter((m) => m.id !== meetingId)
          }),
        addUpdate: (projectId, text) =>
          set((s) => {
            s.projects.find((x) => x.id === projectId)?.updates.unshift({ id: newId('up'), authorId: me(), text, createdAt: now() })
          }),
        toggleSpotlight: (projectId) =>
          set((s) => {
            const p = s.projects.find((x) => x.id === projectId)
            if (!p) return
            p.spotlight = !p.spotlight
            if (p.spotlight)
              teamMemberIds(s, projectId).forEach((uid) =>
                notify(s, { userId: uid, kind: 'project', title: 'Innovation Spotlight', body: `${p.title} was featured in the college Innovation Spotlight.`, link: `/projects/${projectId}` }),
              )
          }),
        moderateProject: (projectId, state) =>
          set((s) => {
            const p = s.projects.find((x) => x.id === projectId)
            if (!p) return
            p.moderation = state
            notify(s, { userId: p.ownerId, kind: 'system', title: 'Moderation update', body: `${p.title} was ${state} by a platform administrator.`, link: `/projects/${projectId}` })
            log(s, `marked project “${p.title}” as ${state}`)
          }),

        addTask: (task) =>
          set((s) => {
            s.tasks.unshift({ ...task, id: newId('tk'), createdAt: now() })
            const p = s.projects.find((x) => x.id === task.projectId)
            if (task.assigneeId)
              notify(s, { userId: task.assigneeId, kind: 'project', title: 'New task assigned', body: `“${task.title}” in ${p?.title ?? 'a project'}.`, link: `/projects/${task.projectId}?tab=tasks` })
          }),
        updateTask: (taskId, patch) =>
          set((s) => {
            const t = s.tasks.find((x) => x.id === taskId)
            if (!t) return
            const wasDone = t.status === 'Done'
            Object.assign(t, patch)
            if (!wasDone && t.status === 'Done') {
              const p = s.projects.find((x) => x.id === t.projectId)
              p?.updates.unshift({ id: newId('up'), authorId: me(), text: `Completed task “${t.title}”.`, createdAt: now() })
            }
            if (patch.assigneeId)
              notify(s, { userId: patch.assigneeId, kind: 'project', title: 'Task assigned', body: `You were assigned “${t.title}”.`, link: `/projects/${t.projectId}?tab=tasks` })
          }),
        deleteTask: (taskId) => set((s) => void (s.tasks = s.tasks.filter((t) => t.id !== taskId))),

        requestMentorship: (mentorId, mode, message, projectId) => {
          const s = get()
          if (s.mentorships.some((m) => m.mentorId === mentorId && m.studentId === me() && m.status === 'pending')) return false
          set((st) => {
            st.mentorships.unshift({ id: newId('mr'), studentId: me(), mentorId, projectId, mode, message, status: 'pending', progress: 0, feedback: [], sessions: [], createdAt: now() })
            const p = st.projects.find((x) => x.id === projectId)
            notify(st, { userId: mentorId, kind: 'mentorship', title: 'New mentorship request', body: `${nameOf(me())} requested ${mode.toLowerCase()}${p ? ` for ${p.title}` : ''}.`, link: '/mentorship' })
            log(st, `requested mentorship from ${nameOf(mentorId)}`)
          })
          return true
        },
        respondMentorship: (requestId, accept) =>
          set((s) => {
            const r = s.mentorships.find((x) => x.id === requestId)
            if (!r) return
            r.status = accept ? 'accepted' : 'rejected'
            if (accept) {
              r.progress = 10
              const p = s.projects.find((x) => x.id === r.projectId)
              if (p && !p.mentorId) p.mentorId = r.mentorId
              if (!s.conversations.some((c) => c.kind === 'mentor' && c.participantIds.includes(r.mentorId) && c.participantIds.includes(r.studentId)))
                s.conversations.unshift({ id: newId('cv'), kind: 'mentor', participantIds: [r.mentorId, r.studentId] })
            }
            notify(s, {
              userId: r.studentId,
              kind: 'mentorship',
              title: accept ? 'Mentorship accepted' : 'Mentorship declined',
              body: `${nameOf(r.mentorId)} ${accept ? 'accepted' : 'declined'} your mentorship request.`,
              link: '/mentors',
            })
            log(s, `${accept ? 'accepted' : 'declined'} mentorship request from ${nameOf(r.studentId)}`)
          }),
        addMentorFeedback: (requestId, text) =>
          set((s) => {
            const r = s.mentorships.find((x) => x.id === requestId)
            if (!r) return
            r.feedback.unshift({ id: newId('f'), text, createdAt: now() })
            notify(s, { userId: r.studentId, kind: 'mentorship', title: 'New mentor feedback', body: `${nameOf(r.mentorId)}: “${text.slice(0, 80)}”`, link: r.projectId ? `/projects/${r.projectId}?tab=mentor` : '/mentors' })
          }),
        scheduleSession: (requestId, session) =>
          set((s) => {
            const r = s.mentorships.find((x) => x.id === requestId)
            if (!r) return
            r.sessions.push({ ...session, id: newId('s') })
            notify(s, { userId: r.studentId, kind: 'meeting', title: 'Guidance session scheduled', body: `${session.title} with ${nameOf(r.mentorId)} on ${session.date} at ${session.time}.`, link: r.projectId ? `/projects/${r.projectId}?tab=mentor` : '/mentors' })
          }),
        setMentorshipProgress: (requestId, progress) =>
          set((s) => {
            const r = s.mentorships.find((x) => x.id === requestId)
            if (r) r.progress = progress
          }),

        startConversation: (otherUserId) => {
          const existing = get().conversations.find(
            (c) => c.kind !== 'team' && c.participantIds.length === 2 && c.participantIds.includes(me()) && c.participantIds.includes(otherUserId),
          )
          if (existing) return existing.id
          const id = newId('cv')
          const other = get().users.find((u) => u.id === otherUserId)
          set((s) => {
            s.conversations.unshift({ id, kind: other?.role === 'mentor' ? 'mentor' : 'direct', participantIds: [me(), otherUserId] })
          })
          return id
        },
        sendMessage: (conversationId, text) => {
          const senderId = me()
          set((s) => {
            s.messages.push({ id: newId('ms'), conversationId, senderId, text, createdAt: now() })
          })
          const convo = get().conversations.find((c) => c.id === conversationId)
          const others = convo?.participantIds.filter((p) => p !== senderId) ?? []
          if (!convo || others.length === 0) return
          others.forEach((uid) =>
            set((s) =>
              notify(s, {
                userId: uid,
                kind: 'collaboration',
                title: convo.kind === 'team' ? `New message in ${convo.name}` : 'New message',
                body: `${nameOf(senderId)}: ${text.slice(0, 80)}`,
                link: `/messages?c=${conversationId}`,
              }),
            ),
          )
          const responder = others[Math.floor(Math.random() * others.length)]
          setTimeout(() => {
            if (!get().conversations.some((c) => c.id === conversationId)) return
            set((s) => {
              s.messages.push({
                id: newId('ms'),
                conversationId,
                senderId: responder,
                text: SIMULATED_REPLIES[Math.floor(Math.random() * SIMULATED_REPLIES.length)],
                createdAt: now(),
                simulated: true,
              })
            })
          }, 1800)
        },

        markNotificationRead: (id) =>
          set((s) => {
            const n = s.notifications.find((x) => x.id === id)
            if (n) n.read = true
          }),
        markAllNotificationsRead: () =>
          set((s) => {
            s.notifications.forEach((n) => {
              if (n.userId === s.currentUserId) n.read = true
            })
          }),

        toggleSaveOpportunity: (id) =>
          set((s) => {
            const o = s.opportunities.find((x) => x.id === id)
            if (!o) return
            o.savedBy = o.savedBy.includes(me()) ? o.savedBy.filter((x) => x !== me()) : [...o.savedBy, me()]
          }),
        toggleInterestOpportunity: (id) =>
          set((s) => {
            const o = s.opportunities.find((x) => x.id === id)
            if (!o) return
            o.interestedBy = o.interestedBy.includes(me()) ? o.interestedBy.filter((x) => x !== me()) : [...o.interestedBy, me()]
          }),

        addAnnouncement: (title, body) =>
          set((s) => {
            s.announcements.unshift({ id: newId('an'), authorId: me(), title, body, createdAt: now(), pinned: false })
            const author = s.users.find((u) => u.id === s.currentUserId)
            s.users
              .filter((u) => u.role === 'student' && u.college === author?.college)
              .forEach((u) => notify(s, { userId: u.id, kind: 'system', title: 'College announcement', body: title, link: '/dashboard' }))
            log(s, `posted announcement “${title}”`)
          }),
        deleteAnnouncement: (id) => set((s) => void (s.announcements = s.announcements.filter((a) => a.id !== id))),
        togglePinAnnouncement: (id) =>
          set((s) => {
            const a = s.announcements.find((x) => x.id === id)
            if (a) a.pinned = !a.pinned
          }),

        setUserStatus: (userId, status) =>
          set((s) => {
            const u = s.users.find((x) => x.id === userId)
            if (!u) return
            u.status = status
            log(s, `${status === 'suspended' ? 'suspended' : 'reactivated'} account of ${u.name}`)
          }),
        setUserVerified: (userId, verified) =>
          set((s) => {
            const u = s.users.find((x) => x.id === userId)
            if (!u) return
            u.verified = verified
            notify(s, { userId, kind: 'system', title: verified ? 'Account verified' : 'Verification revoked', body: verified ? 'Your account has been verified by SkillSync.' : 'Your verification was revoked.', link: '/profile' })
            log(s, `${verified ? 'verified' : 'unverified'} ${u.name}`)
          }),
        setUserRole: (userId, role) =>
          set((s) => {
            const u = s.users.find((x) => x.id === userId)
            if (u) u.role = role
          }),
        setInstitution: (id, patch) =>
          set((s) => {
            const i = s.institutions.find((x) => x.id === id)
            if (!i) return
            Object.assign(i, patch)
            log(s, `updated institution ${i.name}`)
          }),
        addInstitution: (name, location, type) =>
          set((s) => {
            s.institutions.unshift({ id: newId('i'), name, location, type, verified: false, status: 'pending' })
          }),
        resolveReport: (id, status) =>
          set((s) => {
            const r = s.reports.find((x) => x.id === id)
            if (r) r.status = status
          }),
        createReport: (targetType, targetId, reason) =>
          set((s) => {
            s.reports.unshift({ id: newId('rp'), reporterId: me(), targetType, targetId, reason, status: 'open', createdAt: now() })
            s.users.filter((u) => u.role === 'admin').forEach((u) => notify(s, { userId: u.id, kind: 'system', title: 'New report', body: `A ${targetType} was reported: ${reason}`, link: '/admin/moderation' }))
          }),
      }
    }),
    {
      name: 'skillsync-demo-v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

const subscribeNoop = () => () => {}
/** True only after the client has mounted (and localStorage data is available). */
export function useHydrated() {
  return useSyncExternalStore(subscribeNoop, () => true, () => false)
}

export function useCurrentUser() {
  return useStore((s) => s.users.find((u) => u.id === s.currentUserId))
}

export function useUserMap() {
  const users = useStore((s) => s.users)
  return users
}
