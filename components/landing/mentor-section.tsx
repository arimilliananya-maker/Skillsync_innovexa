import { Award, Briefcase, GraduationCap, Microscope, School } from 'lucide-react'

const CATEGORIES = [
  { icon: School, title: 'Faculty', body: 'Professors guiding research, architecture and academic rigour.' },
  { icon: Briefcase, title: 'Industry Professionals', body: 'Practitioners who know how products are built in the real world.' },
  { icon: GraduationCap, title: 'Alumni', body: 'Graduates who have walked the same path and want to give back.' },
  { icon: Microscope, title: 'Domain Experts', body: 'Specialists in agriculture, healthcare, research and more.' },
  { icon: Award, title: 'Senior Students', body: 'Experienced peers for quick, practical one-time guidance.' },
]

export function MentorSection() {
  return (
    <section id="mentors" className="scroll-mt-20 border-y bg-navy text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-[oklch(0.8_0.1_280)]">Mentor Connect</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance">Guidance from people who have done it before</h2>
            <p className="mt-4 leading-relaxed text-primary-foreground/70">
              Send a mentorship request explaining what you need. Mentors accept requests, review your roadmap stages, give feedback and schedule guidance sessions.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-2">
            {CATEGORIES.map((c) => (
              <li key={c.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <c.icon className="size-5 text-[oklch(0.8_0.1_280)]" aria-hidden="true" />
                <h3 className="mt-3 font-semibold">{c.title}</h3>
                <p className="mt-1 text-sm text-primary-foreground/70">{c.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
