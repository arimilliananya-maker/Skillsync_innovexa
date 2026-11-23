'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Logo } from '@/components/shared/logo'
import { LinkButton } from '@/components/shared/ui-bits'

const LINKS = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#mentors', label: 'Mentors' },
  { href: '#interdisciplinary', label: 'Interdisciplinary' },
]

export function LandingHeader() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 md:px-6">
        <Logo />
        <nav aria-label="Primary" className="hidden flex-1 items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-navy">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <LinkButton href="/login" variant="ghost">
            Log in
          </LinkButton>
          <LinkButton href="/register">Get Started</LinkButton>
        </div>
        <button className="ml-auto rounded-lg p-2 md:hidden" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t bg-background px-4 py-4 md:hidden">
          <nav aria-label="Mobile" className="flex flex-col gap-3">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm text-muted-foreground">
                {l.label}
              </a>
            ))}
            <div className="flex gap-2 pt-2">
              <LinkButton href="/login" variant="outline" className="flex-1">
                Log in
              </LinkButton>
              <LinkButton href="/register" className="flex-1">
                Get Started
              </LinkButton>
            </div>
            <Link href="/login" className="sr-only">
              Demo login
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
