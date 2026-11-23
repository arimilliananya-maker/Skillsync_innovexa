import { ArrowRight, CheckCircle2, Cpu, Sprout, Code2 } from 'lucide-react'
import { LinkButton } from '@/components/shared/ui-bits'

function DashboardPreview() {
  const stages = ['Idea Submission', 'Problem Identification', 'Idea Clarification', 'Feasibility Analysis', 'Solution Selection', 'Architecture & Planning']
  return (
    <div className="relative">
      <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/10 via-violet/10 to-transparent blur-2xl" aria-hidden="true" />
      <div className="overflow-hidden rounded-2xl border bg-card shadow-xl shadow-navy/5">
        <div className="flex items-center gap-1.5 border-b bg-muted/40 px-4 py-2.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="ml-3 text-xs text-muted-foreground">AquaSense – Smart Irrigation System</span>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-5">
          <div className="sm:col-span-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-navy">Project roadmap</p>
              <span className="text-xs font-medium text-primary">Stage 6 of 13</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-primary to-violet" />
            </div>
            <ul className="mt-4 flex flex-col gap-2">
              {stages.map((s, i) => (
                <li key={s} className="flex items-center gap-2.5 text-sm">
                  {i < 5 ? (
                    <CheckCircle2 className="size-4 text-success" aria-hidden="true" />
                  ) : (
                    <span className="inline-flex size-4 items-center justify-center rounded-full border-2 border-primary" aria-hidden="true" />
                  )}
                  <span className={i < 5 ? 'text-muted-foreground' : 'font-medium text-navy'}>
                    {i + 1}. {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3 sm:col-span-2">
            <p className="text-sm font-semibold text-navy">Suggested collaborators</p>
            {[
              { name: 'Arjun Mehta', dept: 'CSE · Python, ML', icon: Code2, hue: 260, score: 86 },
              { name: 'Rahul Verma', dept: 'ECE · IoT, Embedded C', icon: Cpu, hue: 30, score: 82 },
            ].map((p) => (
              <div key={p.name} className="rounded-xl border p-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="inline-flex size-8 items-center justify-center rounded-full text-xs font-semibold"
                    style={{ backgroundColor: `oklch(0.93 0.05 ${p.hue})`, color: `oklch(0.38 0.14 ${p.hue})` }}
                  >
                    {p.name.split(' ').map((n) => n[0])}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-navy">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{p.dept}</p>
                  </div>
                  <span className="text-xs font-semibold text-primary">{p.score}%</span>
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <p.icon className="size-3.5" aria-hidden="true" />
                  Fills a missing skill
                </p>
              </div>
            ))}
            <div className="rounded-xl bg-accent p-3">
              <p className="flex items-center gap-1.5 text-xs font-medium text-accent-foreground">
                <Sprout className="size-3.5" aria-hidden="true" /> Mentor: Dr. Suresh Patil
              </p>
              <p className="mt-1 text-xs text-muted-foreground">“Include a control plot in your trials.”</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,oklch(0.94_0.04_275/0.7),transparent_55%)]" aria-hidden="true" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-2">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-violet" aria-hidden="true" />
            From Ideas to Collaboration to Innovation
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance text-navy md:text-5xl">Great Ideas Deserve the Right People.</h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-pretty text-muted-foreground">
            Connect with talented students, discover complementary skills, find experienced mentors, and transform your ideas into meaningful projects.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/register" size="lg" className="h-11 px-5">
              Get Started <ArrowRight className="size-4" />
            </LinkButton>
            <LinkButton href="#how-it-works" variant="outline" size="lg" className="h-11 bg-card px-5">
              Explore How It Works
            </LinkButton>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-6">
            {[
              ['13', 'guided project stages'],
              ['4', 'roles in one ecosystem'],
              ['5', 'domain roadmap templates'],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="text-2xl font-semibold text-navy">{n}</dd>
                <dd className="text-xs text-muted-foreground">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
        <DashboardPreview />
      </div>
    </section>
  )
}
