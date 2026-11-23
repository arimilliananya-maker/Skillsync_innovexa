import type { ReactNode } from 'react'
import { Logo } from '@/components/shared/logo'

export function AuthLayout({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_520px]">
      <div className="flex flex-col">
        <header className="flex h-16 items-center px-6">
          <Logo />
        </header>
        <main className="flex flex-1 items-start justify-center px-4 py-8 md:items-center md:px-6">{children}</main>
      </div>
      <aside className="hidden border-l bg-navy p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        {aside ?? (
          <>
            <p className="text-sm font-medium text-primary-foreground/70">From Ideas to Collaboration to Innovation</p>
            <blockquote>
              <p className="text-xl leading-relaxed font-medium text-balance">
                “I had the irrigation idea for a year. SkillSync matched me with a CSE and an electronics student in a week.”
              </p>
              <footer className="mt-4 text-sm text-primary-foreground/70">Priya Sharma · Agriculture, 3rd Year (demo persona)</footer>
            </blockquote>
            <p className="text-xs text-primary-foreground/50">Demo prototype · No real accounts are created. Data is stored in this browser.</p>
          </>
        )}
      </aside>
    </div>
  )
}
