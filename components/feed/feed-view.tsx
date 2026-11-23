'use client'

import { Bookmark, Newspaper, Plus, Search, SlidersHorizontal } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { EmptyState, NativeSelect, PageHeader } from '@/components/shared/ui-bits'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DEPARTMENTS, SKILL_CATALOG } from '@/lib/matching'
import { DOMAINS } from '@/lib/roadmap'
import { useCurrentUser, useStore } from '@/lib/store'
import type { Post } from '@/lib/types'
import { cn } from '@/lib/utils'
import { PostCard } from './post-card'
import { PostComposer } from './post-composer'

export function FeedView() {
  const user = useCurrentUser()
  const posts = useStore((s) => s.posts)
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [composerOpen, setComposerOpen] = useState(params.get('compose') === '1')
  const [editing, setEditing] = useState<Post | null>(null)
  const [q, setQ] = useState('')
  const [domain, setDomain] = useState('')
  const [skill, setSkill] = useState('')
  const [status, setStatus] = useState('')
  const [dept, setDept] = useState('')
  const [savedOnly, setSavedOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return posts.filter((p) => {
      if (term && !`${p.title} ${p.description} ${p.skills.join(' ')}`.toLowerCase().includes(term)) return false
      if (domain && p.domain !== domain) return false
      if (skill && !p.skills.some((s) => s.toLowerCase() === skill.toLowerCase())) return false
      if (status && p.kind !== status) return false
      if (dept && p.department !== dept) return false
      if (savedOnly && user && !p.saves.includes(user.id)) return false
      return true
    })
  }, [posts, q, domain, skill, status, dept, savedOnly, user])

  const activeFilters = [domain, skill, status, dept].filter(Boolean).length
  const clear = () => {
    setDomain('')
    setSkill('')
    setStatus('')
    setDept('')
    setQ('')
    setSavedOnly(false)
  }

  const closeComposer = (open: boolean) => {
    setComposerOpen(open)
    if (!open) {
      setEditing(null)
      if (params.get('compose')) router.replace(pathname)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Project Feed"
        actions={
          user?.role === 'student' && (
            <Button onClick={() => setComposerOpen(true)}>
              <Plus className="size-4" /> New post
            </Button>
          )
        }
      />

      <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-xs">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search ideas, projects and skills" className="pl-9" aria-label="Search posts" />
          </div>
          <Button variant="outline" onClick={() => setShowFilters((s) => !s)} aria-expanded={showFilters}>
            <SlidersHorizontal className="size-4" /> Filters{activeFilters ? ` (${activeFilters})` : ''}
          </Button>
          <Button variant={savedOnly ? 'secondary' : 'outline'} size="icon" onClick={() => setSavedOnly((s) => !s)} aria-pressed={savedOnly} aria-label="Show saved posts only">
            <Bookmark className={cn('size-4', savedOnly && 'fill-current')} />
          </Button>
        </div>
        {showFilters && (
          <div className="grid gap-2 sm:grid-cols-4">
            <NativeSelect value={domain} onChange={(e) => setDomain(e.target.value)} aria-label="Domain">
              <option value="">All domains</option>
              {DOMAINS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </NativeSelect>
            <NativeSelect value={skill} onChange={(e) => setSkill(e.target.value)} aria-label="Skill">
              <option value="">Any skill</option>
              {SKILL_CATALOG.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </NativeSelect>
            <NativeSelect value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
              <option value="">Any status</option>
              <option>Idea</option>
              <option>Ongoing</option>
              <option>Completed</option>
            </NativeSelect>
            <NativeSelect value={dept} onChange={(e) => setDept(e.target.value)} aria-label="Department">
              <option value="">All departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </NativeSelect>
          </div>
        )}
      </div>

      <div className="mt-2 flex gap-1 text-sm" role="tablist" aria-label="Post type">
        {['', 'Idea', 'Ongoing', 'Completed'].map((k) => (
          <button
            key={k || 'all'}
            role="tab"
            aria-selected={status === k}
            onClick={() => setStatus(k)}
            className={cn('rounded-lg px-3 py-1.5 transition-colors', status === k ? 'bg-accent font-medium text-accent-foreground' : 'text-muted-foreground hover:text-navy')}
          >
            {k ? (k === 'Idea' ? 'Ideas' : k) : 'All'}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Newspaper}
            title="No posts match your filters"
            description="Try a different search or clear the filters."
            action={
              <Button variant="outline" size="sm" onClick={clear}>
                Clear filters
              </Button>
            }
          />
        ) : (
          filtered.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              onEdit={() => {
                setEditing(p)
                setComposerOpen(true)
              }}
            />
          ))
        )}
      </div>

      <PostComposer open={composerOpen} onOpenChange={closeComposer} post={editing} />
    </div>
  )
}
