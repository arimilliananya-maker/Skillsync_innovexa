'use client'

import { Check, GraduationCap, Landmark, ShieldCheck, UserRound } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { TagInput } from '@/components/shared/tag-input'
import { Field, NativeSelect } from '@/components/shared/ui-bits'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { COLLEGES, DEPARTMENTS, INTEREST_CATALOG, SKILL_CATALOG, YEARS } from '@/lib/matching'
import { DOMAINS } from '@/lib/roadmap'
import { useStore } from '@/lib/store'
import type { Availability, Domain, MentorCategory, MentorshipMode, Role } from '@/lib/types'
import { cn } from '@/lib/utils'
import { splitLines } from '@/lib/format'

const ROLES: { role: Role; icon: typeof UserRound; title: string; body: string }[] = [
  { role: 'student', icon: UserRound, title: 'Student', body: 'Share ideas, join teams and build projects' },
  { role: 'mentor', icon: GraduationCap, title: 'Mentor', body: 'Guide student teams with your expertise' },
  { role: 'college', icon: Landmark, title: 'College Authority', body: 'Track innovation across your institution' },
  { role: 'admin', icon: ShieldCheck, title: 'Platform Admin', body: 'Manage users, institutions and moderation' },
]

const MENTOR_CATEGORIES: MentorCategory[] = ['Faculty', 'Industry Professional', 'Alumni', 'Domain Expert', 'Senior Student']
const AVAILABILITY: Availability[] = ['Full-time', 'Part-time', 'Weekends', 'Flexible']

export function RegisterWizard() {
  const router = useRouter()
  const users = useStore((s) => s.users)
  const register = useStore((s) => s.register)
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    role: 'student' as Role,
    name: '',
    email: '',
    password: '',
    college: COLLEGES[0],
    department: DEPARTMENTS[0],
    year: YEARS[1],
    bio: '',
    skills: [] as string[],
    interests: [] as string[],
    domains: [] as Domain[],
    availability: 'Part-time' as Availability,
    previousProjects: '',
    github: '',
    portfolio: '',
    mentorCategory: 'Faculty' as MentorCategory,
    organization: '',
    experience: '',
    mentorshipMode: 'Both' as MentorshipMode,
  })
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }))

  const needsSkills = form.role === 'student' || form.role === 'mentor'
  const steps = needsSkills ? ['Role', 'Account', 'Profile', 'Skills', 'Projects & links'] : ['Role', 'Account', 'Institution']

  const validate = () => {
    const e: Record<string, string> = {}
    if (step === 1) {
      if (form.name.trim().length < 2) e.name = 'Enter your full name'
      if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address'
      else if (users.some((u) => u.email.toLowerCase() === form.email.toLowerCase())) e.email = 'An account with this email already exists'
      if (form.password.length < 6) e.password = 'Use at least 6 characters'
    }
    if (step === 2) {
      if (!form.college.trim()) e.college = 'Required'
      if (!form.department.trim()) e.department = 'Required'
      if (form.role === 'mentor' && !form.organization.trim()) e.organization = 'Enter your role and organisation'
    }
    if (step === 3) {
      if (form.skills.length < 2) e.skills = 'Add at least 2 skills'
      if (form.domains.length === 0) e.domains = 'Choose at least one domain'
    }
    if (step === 4) {
      for (const k of ['github', 'portfolio'] as const)
        if (form[k] && !/^https?:\/\/\S+\.\S+/.test(form[k])) e[k] = 'Enter a full URL starting with https://'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (!validate()) return
    if (step < steps.length - 1) setStep(step + 1)
    else finish()
  }

  const finish = () => {
    register({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      role: form.role,
      college: form.college,
      department: form.department,
      year: form.role === 'student' ? form.year : form.role === 'mentor' ? form.mentorCategory : form.role === 'college' ? 'Representative' : 'Admin',
      bio: form.bio,
      skills: form.skills,
      interests: form.interests,
      domains: form.domains,
      availability: form.availability,
      previousProjects: splitLines(form.previousProjects),
      achievements: [],
      github: form.github,
      portfolio: form.portfolio,
      ...(form.role === 'mentor'
        ? {
            mentorCategory: form.mentorCategory,
            organization: form.organization,
            experience: form.experience || '—',
            expertise: form.skills,
            guidanceAreas: form.interests.length ? form.interests : form.skills,
            mentorshipMode: form.mentorshipMode,
          }
        : {}),
    })
    toast.success(form.role === 'mentor' ? 'Account created – your mentor profile is pending verification' : 'Welcome to SkillSync!')
    router.push('/dashboard')
  }

  return (
    <div className="w-full max-w-lg">
      <h1 className="text-2xl font-semibold tracking-tight text-navy">Create your SkillSync account</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Already registered?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>

      <ol className="mt-6 flex items-center gap-2" aria-label="Registration progress">
        {steps.map((s, i) => (
          <li key={s} className="flex flex-1 flex-col gap-1.5">
            <span className={cn('h-1 rounded-full', i <= step ? 'bg-primary' : 'bg-muted')} />
            <span className={cn('hidden text-xs sm:block', i === step ? 'font-medium text-navy' : 'text-muted-foreground')} aria-current={i === step ? 'step' : undefined}>
              {s}
            </span>
          </li>
        ))}
      </ol>

      <form
        className="mt-8 flex flex-col gap-4"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          next()
        }}
      >
        {step === 0 && (
          <fieldset>
            <legend className="mb-3 text-sm font-medium text-navy">How will you use SkillSync?</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {ROLES.map((r) => (
                <label
                  key={r.role}
                  className={cn(
                    'relative flex cursor-pointer gap-3 rounded-xl border bg-card p-4 transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/50',
                    form.role === r.role ? 'border-primary bg-accent/50' : 'hover:border-primary/30',
                  )}
                >
                  <input type="radio" name="role" className="sr-only" checked={form.role === r.role} onChange={() => set('role', r.role)} />
                  <r.icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <span>
                    <span className="block text-sm font-medium text-navy">{r.title}</span>
                    <span className="block text-xs text-muted-foreground">{r.body}</span>
                  </span>
                  {form.role === r.role && <Check className="absolute top-3 right-3 size-4 text-primary" aria-hidden="true" />}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <>
            <Field label="Full name" htmlFor="name" error={errors.name}>
              <Input id="name" autoComplete="name" value={form.name} onChange={(e) => set('name', e.target.value)} aria-invalid={!!errors.name} />
            </Field>
            <Field label="Email" htmlFor="email" error={errors.email}>
              <Input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} aria-invalid={!!errors.email} />
            </Field>
            <Field label="Password" htmlFor="password" error={errors.password} hint="Demo only – passwords are not stored.">
              <Input id="password" type="password" autoComplete="new-password" value={form.password} onChange={(e) => set('password', e.target.value)} aria-invalid={!!errors.password} />
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <Field label={form.role === 'admin' ? 'Organisation' : 'College'} htmlFor="college" error={errors.college}>
              <Input id="college" list="college-list" value={form.college} onChange={(e) => set('college', e.target.value)} />
              <datalist id="college-list">
                {COLLEGES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={form.role === 'college' ? 'Office / Department' : 'Department'} htmlFor="department" error={errors.department}>
                <Input id="department" list="dept-list" value={form.department} onChange={(e) => set('department', e.target.value)} />
                <datalist id="dept-list">
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d} />
                  ))}
                </datalist>
              </Field>
              {form.role === 'student' && (
                <Field label="Academic year" htmlFor="year">
                  <NativeSelect id="year" value={form.year} onChange={(e) => set('year', e.target.value)}>
                    {YEARS.map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </NativeSelect>
                </Field>
              )}
              {form.role === 'mentor' && (
                <Field label="Mentor category" htmlFor="mcat">
                  <NativeSelect id="mcat" value={form.mentorCategory} onChange={(e) => set('mentorCategory', e.target.value as MentorCategory)}>
                    {MENTOR_CATEGORIES.map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </NativeSelect>
                </Field>
              )}
            </div>
            {form.role === 'mentor' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Role & organisation" htmlFor="org" error={errors.organization}>
                  <Input id="org" placeholder="Senior Engineer, Acme Labs" value={form.organization} onChange={(e) => set('organization', e.target.value)} aria-invalid={!!errors.organization} />
                </Field>
                <Field label="Experience" htmlFor="exp">
                  <Input id="exp" placeholder="8 years" value={form.experience} onChange={(e) => set('experience', e.target.value)} />
                </Field>
              </div>
            )}
            {needsSkills && (
              <Field label="Short bio" htmlFor="bio">
                <Textarea id="bio" rows={3} value={form.bio} onChange={(e) => set('bio', e.target.value)} placeholder="What are you passionate about building?" />
              </Field>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <Field label={form.role === 'mentor' ? 'Areas of expertise' : 'Skills'} htmlFor="skills" error={errors.skills}>
              <TagInput id="skills" value={form.skills} onChange={(v) => set('skills', v)} suggestions={SKILL_CATALOG} invalid={!!errors.skills} />
            </Field>
            <Field label={form.role === 'mentor' ? 'Areas of guidance' : 'Interests'} htmlFor="interests">
              <TagInput id="interests" value={form.interests} onChange={(v) => set('interests', v)} suggestions={INTEREST_CATALOG} />
            </Field>
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-navy">Preferred project domains</legend>
              <div className="flex flex-wrap gap-2">
                {DOMAINS.map((d) => {
                  const on = form.domains.includes(d)
                  return (
                    <button
                      key={d}
                      type="button"
                      aria-pressed={on}
                      onClick={() => set('domains', on ? form.domains.filter((x) => x !== d) : [...form.domains, d])}
                      className={cn('rounded-lg border px-3 py-1.5 text-sm transition-colors', on ? 'border-primary bg-accent text-accent-foreground' : 'bg-card hover:border-primary/30')}
                    >
                      {d}
                    </button>
                  )
                })}
              </div>
              {errors.domains && <p className="mt-1.5 text-xs text-destructive">{errors.domains}</p>}
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Availability" htmlFor="avail">
                <NativeSelect id="avail" value={form.availability} onChange={(e) => set('availability', e.target.value as Availability)}>
                  {AVAILABILITY.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </NativeSelect>
              </Field>
              {form.role === 'mentor' && (
                <Field label="Mentorship offered" htmlFor="mode">
                  <NativeSelect id="mode" value={form.mentorshipMode} onChange={(e) => set('mentorshipMode', e.target.value as MentorshipMode)}>
                    <option>One-time guidance</option>
                    <option>Continuous mentorship</option>
                    <option>Both</option>
                  </NativeSelect>
                </Field>
              )}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <Field label="Previous projects" htmlFor="prev" hint="One project per line">
              <Textarea id="prev" rows={3} value={form.previousProjects} onChange={(e) => set('previousProjects', e.target.value)} placeholder={'Campus Event App\nWater Quality Study'} />
            </Field>
            <Field label="GitHub" htmlFor="github" error={errors.github}>
              <Input id="github" type="url" placeholder="https://github.com/username" value={form.github} onChange={(e) => set('github', e.target.value)} aria-invalid={!!errors.github} />
            </Field>
            <Field label="Portfolio" htmlFor="portfolio" error={errors.portfolio}>
              <Input id="portfolio" type="url" placeholder="https://yourname.dev" value={form.portfolio} onChange={(e) => set('portfolio', e.target.value)} aria-invalid={!!errors.portfolio} />
            </Field>
          </>
        )}

        <div className="mt-2 flex items-center justify-between gap-3">
          <Button type="button" variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 0}>
            Back
          </Button>
          <Button type="submit" className="h-10 px-5">
            {step === steps.length - 1 ? 'Create account' : 'Continue'}
          </Button>
        </div>
      </form>
    </div>
  )
}
