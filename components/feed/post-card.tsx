'use client'

import { Bookmark, Flag, Hand, Heart, MessageCircle, MoreHorizontal, Pencil, Sparkles, Trash2, UserPlus, Users } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { Chip, StatusChip } from '@/components/shared/ui-bits'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { timeAgo } from '@/lib/format'
import { isMember } from '@/lib/selectors'
import { useCurrentUser, useStore } from '@/lib/store'
import type { Post } from '@/lib/types'
import { cn } from '@/lib/utils'

export function PostCard({ post, onEdit }: { post: Post; onEdit: () => void }) {
  const user = useCurrentUser()
  const users = useStore((s) => s.users)
  const projects = useStore((s) => s.projects)
  const teams = useStore((s) => s.teams)
  const invitations = useStore((s) => s.invitations)
  const { toggleLike, toggleSave, toggleInterest, addComment, deletePost, requestJoin, createReport } = useStore.getState()
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')
  const [joinOpen, setJoinOpen] = useState(false)
  const [joinMsg, setJoinMsg] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!user) return null
  const author = users.find((u) => u.id === post.authorId)
  const project = projects.find((p) => p.id === post.projectId)
  const team = project ? teams.find((t) => t.id === project.teamId) : undefined
  const mine = post.authorId === user.id
  const liked = post.likes.includes(user.id)
  const saved = post.saves.includes(user.id)
  const interested = post.interested.includes(user.id)
  const member = isMember(team, user.id)
  const requested = team && invitations.some((i) => i.teamId === team.id && i.fromId === user.id && i.kind === 'join-request' && i.status === 'pending')
  const canJoin = user.role === 'student' && !mine && post.kind !== 'Completed' && team && !member

  const submitComment = () => {
    if (!comment.trim()) return
    addComment(post.id, comment.trim())
    setComment('')
  }

  return (
    <article className="rounded-xl border bg-card shadow-xs">
      <div className="p-5">
        <header className="flex items-start gap-3">
          <UserAvatar user={author} size="md" link />
          <div className="min-w-0 flex-1">
            <Link href={`/profile/${author?.id}`} className="text-sm font-medium text-navy hover:underline">
              {author?.name}
            </Link>
            <p className="text-xs text-muted-foreground">
              {post.department} · {timeAgo(post.createdAt)}
            </p>
          </div>
          <StatusChip status={post.kind} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Post options">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(mine || user.role === 'admin') && (
                <>
                  {mine && (
                    <DropdownMenuItem onClick={onEdit}>
                      <Pencil className="size-4" /> Edit
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem variant="destructive" onClick={() => setConfirmDelete(true)}>
                    <Trash2 className="size-4" /> Delete
                  </DropdownMenuItem>
                </>
              )}
              {!mine && (
                <DropdownMenuItem
                  onClick={() => {
                    createReport('post', post.id, 'Reported from feed for review')
                    toast.success('Thanks – an administrator will review this post')
                  }}
                >
                  <Flag className="size-4" /> Report
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <div className="mt-4">
          <h2 className="text-lg font-semibold text-navy">{project ? <Link href={`/projects/${project.id}`} className="hover:underline">{post.title}</Link> : post.title}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-pretty text-foreground/85">{post.description}</p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <Chip tone="primary">{post.domain}</Chip>
          {post.skills.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>

        <dl className="mt-4 grid gap-2 rounded-lg bg-muted/50 p-3 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-muted-foreground" aria-hidden="true" />
            <dt className="sr-only">Team size</dt>
            <dd>
              {team ? team.members.length : post.teamSize} member{(team ? team.members.length : post.teamSize) === 1 ? '' : 's'}
              {project ? ` of ${project.maxTeamSize}` : ''}
            </dd>
          </div>
          {post.lookingFor && (
            <div className="flex items-start gap-2">
              <UserPlus className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <dt className="sr-only">Looking for</dt>
              <dd className="text-foreground/85">{post.lookingFor}</dd>
            </div>
          )}
        </dl>
      </div>

      <footer className="flex flex-wrap items-center gap-1 border-t px-3 py-2">
        <Button variant="ghost" size="sm" onClick={() => toggleLike(post.id)} aria-pressed={liked} className={cn(liked && 'text-destructive')}>
          <Heart className={cn('size-4', liked && 'fill-current')} /> {post.likes.length}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setShowComments((s) => !s)} aria-expanded={showComments}>
          <MessageCircle className="size-4" /> {post.comments.length}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            toggleSave(post.id)
            toast(saved ? 'Removed from saved' : 'Saved for later')
          }}
          aria-pressed={saved}
          className={cn(saved && 'text-primary')}
        >
          <Bookmark className={cn('size-4', saved && 'fill-current')} /> {saved ? 'Saved' : 'Save'}
        </Button>
        {!mine && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              toggleInterest(post.id)
              if (!interested) toast.success(`${author?.name.split(' ')[0]} has been notified of your interest`)
            }}
            aria-pressed={interested}
            className={cn(interested && 'text-violet')}
          >
            <Sparkles className="size-4" /> {interested ? 'Interested' : 'Interested?'} {post.interested.length > 0 && `· ${post.interested.length}`}
          </Button>
        )}
        {canJoin && (
          <Button size="sm" className="ml-auto" variant={requested ? 'secondary' : 'default'} disabled={!!requested} onClick={() => setJoinOpen(true)}>
            <Hand className="size-4" /> {requested ? 'Request sent' : 'Request to join'}
          </Button>
        )}
      </footer>

      {showComments && (
        <div className="border-t bg-muted/30 px-5 py-4">
          {post.comments.length > 0 && (
            <ul className="mb-4 flex flex-col gap-3">
              {post.comments.map((c) => {
                const a = users.find((u) => u.id === c.authorId)
                return (
                  <li key={c.id} className="flex gap-2.5">
                    <UserAvatar user={a} size="xs" className="mt-0.5" />
                    <div className="rounded-lg bg-card px-3 py-2 text-sm">
                      <p>
                        <span className="font-medium text-navy">{a?.name}</span> <span className="text-xs text-muted-foreground">· {timeAgo(c.createdAt)}</span>
                      </p>
                      <p className="text-foreground/85">{c.text}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              submitComment()
            }}
          >
            <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a comment…" aria-label="Write a comment" />
            <Button type="submit" disabled={!comment.trim()}>
              Post
            </Button>
          </form>
        </div>
      )}

      <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request to join {team?.name}</DialogTitle>
            <DialogDescription>Tell the team what skills you bring and why you&apos;re interested.</DialogDescription>
          </DialogHeader>
          <Textarea rows={4} value={joinMsg} onChange={(e) => setJoinMsg(e.target.value)} aria-label="Message to the team" placeholder={`Hi! I have experience with ${user.skills.slice(0, 2).join(' and ')} and would love to contribute.`} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setJoinOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!team) return
                const ok = requestJoin(team.id, joinMsg.trim() || `I'd like to join ${team.name}.`)
                setJoinOpen(false)
                setJoinMsg('')
                if (ok) toast.success('Join request sent to the project lead')
                else toast.error('You already have a pending request for this team')
              }}
            >
              Send request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this post?</DialogTitle>
            <DialogDescription>This removes “{post.title}” from the feed. This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deletePost(post.id)
                toast.success('Post deleted')
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </article>
  )
}
