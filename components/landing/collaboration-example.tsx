import { ArrowDown, Code2, Cpu, Sprout } from 'lucide-react'

const PEOPLE = [
  { icon: Sprout, name: 'Priya', dept: 'Agriculture', role: 'Has the idea', skills: ['Soil Science', 'Field Research'] },
  { icon: Code2, name: 'Arjun', dept: 'Computer Science', role: 'Recommended', skills: ['Python', 'Data Analysis'], reason: 'Covers missing Python & data skills' },
  { icon: Cpu, name: 'Rahul', dept: 'Electronics', role: 'Recommended', skills: ['IoT', 'Embedded C'], reason: 'Covers missing IoT & hardware skills' },
]

export function CollaborationExample() {
  return (
    <section>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:px-6 md:py-20 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-primary">A collaboration example</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance text-navy">An agriculture idea meets the right engineers</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Priya, an agriculture student, shares an idea for a smart irrigation system. SkillSync compares the project’s required skills with her current team and recommends
            students who fill the gaps – and explains every recommendation.
          </p>
          <ul className="mt-6 flex flex-col gap-2 text-sm text-foreground/80">
            <li>• Complementary technical skills</li>
            <li>• Shared interests in smart farming and sustainability</li>
            <li>• Relevant project experience and matching availability</li>
          </ul>
          <p className="mt-6 text-xs text-muted-foreground">Recommendations use transparent, rule-based scoring – not a black-box AI model.</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          {PEOPLE.map((p, i) => (
            <div key={p.name} className="w-full max-w-md">
              <div className={`flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-xs ${i === 0 ? 'border-primary/30 ring-4 ring-primary/5' : ''}`}>
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                  <p.icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-navy">{p.name}</p>
                    <span className="text-xs text-muted-foreground">{p.dept}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {p.skills.map((s) => (
                      <span key={s} className="rounded-md bg-muted px-1.5 py-0.5 text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                  {p.reason && <p className="mt-1.5 text-xs text-success">{p.reason}</p>}
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${i === 0 ? 'bg-violet/10 text-violet' : 'bg-success/10 text-success'}`}>{p.role}</span>
              </div>
              {i === 0 && (
                <div className="flex justify-center py-1 text-muted-foreground">
                  <ArrowDown className="size-4" aria-hidden="true" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
