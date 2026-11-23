import { Briefcase, Compass, FolderKanban, GraduationCap, Landmark, MessagesSquare, Newspaper, Target } from 'lucide-react'

const FEATURES = [
  { icon: Newspaper, title: 'Project feed', body: 'Share ideas, ongoing work and completed projects. Like, comment, save and request to join.' },
  { icon: Compass, title: 'Explainable matching', body: 'Rule-based recommendations that show exactly why a person or project fits.' },
  { icon: Target, title: 'Skill-gap analysis', body: 'See which skills your team is missing and who on campus can fill them.' },
  { icon: FolderKanban, title: 'Project workspace', body: 'Tasks, roadmap, discussions, resources, meetings and progress in one place.' },
  { icon: GraduationCap, title: 'Mentor Connect', body: 'Request one-time guidance or continuous mentorship from verified mentors.' },
  { icon: MessagesSquare, title: 'Messages', body: 'Direct, team and mentor conversations alongside a unified notification center.' },
  { icon: Briefcase, title: 'Opportunities', body: 'Hackathons, internships, workshops and competitions relevant to your domain.' },
  { icon: Landmark, title: 'College insights', body: 'Participation analytics, department trends and an Innovation Spotlight for faculty.' },
]

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 border-y bg-card">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">Platform features</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance text-navy">Everything a student team needs to go from idea to impact</h2>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-card p-6">
              <f.icon className="size-5 text-primary" aria-hidden="true" />
              <h3 className="mt-4 font-semibold text-navy">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
