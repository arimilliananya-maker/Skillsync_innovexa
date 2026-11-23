import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/shared/logo'
import { LinkButton } from '@/components/shared/ui-bits'

export function CtaSection() {
  return (
    <section className="px-4 pb-16 md:px-6 md:pb-20">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-primary to-violet px-6 py-14 text-center text-primary-foreground md:px-12">
        <h2 className="text-3xl font-semibold tracking-tight text-balance">Your next project is one connection away</h2>
        <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">Explore SkillSync as a student, mentor, college authority or platform administrator.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <LinkButton href="/register" size="lg" className="h-11 bg-card px-5 text-navy hover:bg-card/90">
            Get Started <ArrowRight className="size-4" />
          </LinkButton>
          <LinkButton href="/login" size="lg" variant="outline" className="h-11 border-white/30 bg-transparent px-5 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
            Try a demo account
          </LinkButton>
        </div>
      </div>
    </section>
  )
}

export function LandingFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4 md:px-6">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            An interdisciplinary student innovation ecosystem connecting ideas, complementary skills, collaborators and mentors.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-navy">Platform</h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <li><a href="#how-it-works" className="hover:text-navy">How it works</a></li>
            <li><a href="#features" className="hover:text-navy">Features</a></li>
            <li><a href="#mentors" className="hover:text-navy">Mentor Connect</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-navy">Get started</h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <li><Link href="/register" className="hover:text-navy">Create an account</Link></li>
            <li><Link href="/login" className="hover:text-navy">Demo login</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted-foreground md:px-6">
          © 2026 SkillSync. Prototype – all data is sample data stored locally in your browser.
        </p>
      </div>
    </footer>
  )
}
