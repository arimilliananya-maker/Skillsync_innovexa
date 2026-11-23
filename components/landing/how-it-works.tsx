import { Lightbulb, Rocket, Route, UsersRound } from 'lucide-react'

const STEPS = [
  { icon: Lightbulb, title: 'Share your idea', body: 'Post an idea or project with the problem, proposed solution and the skills it needs.' },
  { icon: UsersRound, title: 'Find your team', body: 'See students whose skills complement yours, with clear reasons for every recommendation.' },
  { icon: Route, title: 'Follow the roadmap', body: 'Work through 13 guided stages tailored to your domain, with tasks, checklists and mentor reviews.' },
  { icon: Rocket, title: 'Showcase the result', body: 'Publish your completed project to your portfolio and your college’s Innovation Spotlight.' },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">How it works</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance text-navy">One journey from first idea to final showcase</h2>
        </div>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative rounded-2xl border bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
                  <s.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-muted-foreground/60">0{i + 1}</span>
              </div>
              <h3 className="mt-5 font-semibold text-navy">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
