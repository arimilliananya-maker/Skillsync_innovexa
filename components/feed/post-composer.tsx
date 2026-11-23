'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { TagInput } from '@/components/shared/tag-input'
import { Field, NativeSelect } from '@/components/shared/ui-bits'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SKILL_CATALOG } from '@/lib/matching'
import { DOMAINS } from '@/lib/roadmap'
import { type NewPostInput, useStore } from '@/lib/store'
import type { Domain, Post } from '@/lib/types'

const EMPTY: NewPostInput = { kind: 'Idea', title: '', description: '', domain: 'Software & Technology', skills: [], lookingFor: '', teamSize: 1 }

export function PostComposer({ open, onOpenChange, post }: { open: boolean; onOpenChange: (o: boolean) => void; post: Post | null }) {
  const createPost = useStore((s) => s.createPost)
  const updatePost = useStore((s) => s.updatePost)
  const [form, setForm] = useState<NewPostInput>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) return
    setErrors({})
    setForm(post ? { kind: post.kind, title: post.title, description: post.description, domain: post.domain, skills: post.skills, lookingFor: post.lookingFor, teamSize: post.teamSize } : EMPTY)
  }, [open, post])

  const set = <K extends keyof NewPostInput>(k: K, v: NewPostInput[K]) => setForm((f) => ({ ...f, [k]: v }))

  const submit = () => {
    const e: Record<string, string> = {}
    if (form.title.trim().length < 5) e.title = 'Title should be at least 5 characters'
    if (form.description.trim().length < 20) e.description = 'Describe your post in at least 20 characters'
    if (form.skills.length === 0) e.skills = 'Add at least one skill'
    setErrors(e)
    if (Object.keys(e).length) return
    if (post) {
      updatePost(post.id, form)
      toast.success('Post updated')
    } else {
      createPost(form)
      toast.success('Post published to the feed')
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{post ? 'Edit post' : 'Share with the community'}</DialogTitle>
          <DialogDescription>Ideas, ongoing projects and completed work are visible to all SkillSync members.</DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-navy">Type</legend>
            <div className="grid grid-cols-3 gap-2">
              {(['Idea', 'Ongoing', 'Completed'] as const).map((k) => (
                <button
                  type="button"
                  key={k}
                  aria-pressed={form.kind === k}
                  onClick={() => set('kind', k)}
                  className={`rounded-lg border px-3 py-2 text-sm ${form.kind === k ? 'border-primary bg-accent font-medium text-accent-foreground' : 'hover:border-primary/30'}`}
                >
                  {k === 'Idea' ? 'Idea' : k === 'Ongoing' ? 'Ongoing project' : 'Completed'}
                </button>
              ))}
            </div>
          </fieldset>
          <Field label="Title" htmlFor="p-title" error={errors.title}>
            <Input id="p-title" value={form.title} onChange={(e) => set('title', e.target.value)} aria-invalid={!!errors.title} />
          </Field>
          <Field label="Description" htmlFor="p-desc" error={errors.description}>
            <Textarea id="p-desc" rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} aria-invalid={!!errors.description} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Domain" htmlFor="p-domain">
              <NativeSelect id="p-domain" value={form.domain} onChange={(e) => set('domain', e.target.value as Domain)}>
                {DOMAINS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Current team size" htmlFor="p-size">
              <Input id="p-size" type="number" min={1} max={12} value={form.teamSize} onChange={(e) => set('teamSize', Math.max(1, Math.min(12, Number(e.target.value) || 1)))} />
            </Field>
          </div>
          <Field label="Required skills" htmlFor="p-skills" error={errors.skills}>
            <TagInput id="p-skills" value={form.skills} onChange={(v) => set('skills', v)} suggestions={SKILL_CATALOG} invalid={!!errors.skills} />
          </Field>
          <Field label="Collaboration requirements" htmlFor="p-looking" hint="Who are you looking for?">
            <Input id="p-looking" value={form.lookingFor} onChange={(e) => set('lookingFor', e.target.value)} placeholder="An electronics student with IoT experience" />
          </Field>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{post ? 'Save changes' : 'Publish'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
