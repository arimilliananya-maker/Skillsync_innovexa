'use client'

import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function TagInput({
  value,
  onChange,
  suggestions,
  placeholder = 'Type and press Enter',
  id,
  invalid,
}: {
  value: string[]
  onChange: (next: string[]) => void
  suggestions: string[]
  placeholder?: string
  id?: string
  invalid?: boolean
}) {
  const [draft, setDraft] = useState('')
  const add = (tag: string) => {
    const t = tag.trim()
    if (!t || value.some((v) => v.toLowerCase() === t.toLowerCase())) return
    onChange([...value, t])
    setDraft('')
  }
  const remaining = suggestions.filter((s) => !value.includes(s) && s.toLowerCase().includes(draft.toLowerCase())).slice(0, 10)

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          'flex min-h-9 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-card px-2 py-1.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/40',
          invalid && 'border-destructive',
        )}
      >
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
            {tag}
            <button type="button" onClick={() => onChange(value.filter((v) => v !== tag))} aria-label={`Remove ${tag}`} className="rounded hover:text-destructive">
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing || e.keyCode === 229) return
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault()
              add(draft)
            } else if (e.key === 'Backspace' && !draft && value.length) onChange(value.slice(0, -1))
          }}
          placeholder={value.length ? '' : placeholder}
          className="min-w-24 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
          aria-invalid={invalid}
        />
      </div>
      {remaining.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {remaining.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="inline-flex items-center gap-1 rounded-md border border-dashed px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Plus className="size-3" aria-hidden="true" />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
