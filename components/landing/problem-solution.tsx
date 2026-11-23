import { CircleAlert, CircleCheck } from 'lucide-react'

const PROBLEMS = [
  'Students have promising ideas but lack the technical skills to build them.',
  'Talented students in other departments never hear about meaningful projects.',
  'Finding the right mentor depends on luck and personal networks.',
  'Projects stall without a clear path from idea to finished outcome.',
]
const SOLUTIONS = [
  'Explainable skill matching surfaces collaborators who fill your team’s gaps.',
  'A shared project feed makes ideas visible across every department and college.',
  'Mentor Connect links teams with faculty, alumni and industry experts.',
  'A guided 13-stage roadmap takes every project from idea to showcase.',
]

export function ProblemSolution() {
  return (
    <section className="border-y bg-card">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">Why SkillSync</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance text-navy">Ideas are everywhere. The right team is hard to find.</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-background p-6">
            <h3 className="font-semibold text-navy">The problem</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {PROBLEMS.map((p) => (
                <li key={p} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive/70" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-primary/20 bg-accent/50 p-6">
            <h3 className="font-semibold text-navy">The SkillSync solution</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {SOLUTIONS.map((p) => (
                <li key={p} className="flex gap-3 text-sm leading-relaxed text-foreground/80">
                  <CircleCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
