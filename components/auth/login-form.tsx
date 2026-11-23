'use client'

import { ArrowRight, GraduationCap, Landmark, ShieldCheck, UserRound } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { type FormEvent, useState } from 'react'
import { toast } from 'sonner'
import { Field } from '@/components/shared/ui-bits'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ROLE_LABEL } from '@/lib/nav'
import { DEMO_ACCOUNTS } from '@/lib/seed'
import { useStore } from '@/lib/store'
import type { Role } from '@/lib/types'

const DEMO: { role: Role; icon: typeof UserRound; who: string }[] = [
  { role: 'student', icon: UserRound, who: 'Priya Sharma · Agriculture' },
  { role: 'mentor', icon: GraduationCap, who: 'Dr. Kavita Reddy · Faculty' },
  { role: 'college', icon: Landmark, who: 'Dr. Ramesh Iyer · Dean of Innovation' },
  { role: 'admin', icon: ShieldCheck, who: 'Nisha Varma · Platform Admin' },
]

export function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const users = useStore((s) => s.users)
  const login = useStore((s) => s.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)

  const next = params.get('next')
  const go = () => router.push(next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const errs: typeof errors = {}
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email address'
    if (password.length < 6) errs.password = 'Password must be at least 6 characters'
    setErrors(errs)
    if (Object.keys(errs).length) return
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
    if (!user) {
      setErrors({ email: 'No demo account found with this email. Try a demo account below or create one.' })
      return
    }
    setLoading(true)
    setTimeout(() => {
      login(user.id)
      toast.success(`Welcome back, ${user.name.split(' ')[0]}`)
      go()
    }, 400)
  }

  const demoLogin = (role: Role) => {
    login(DEMO_ACCOUNTS[role])
    toast.success(`Signed in as the ${ROLE_LABEL[role]} demo account`)
    go()
  }

  return (
    <div className="w-full max-w-md">
      <h1 className="text-2xl font-semibold tracking-tight text-navy">Log in to SkillSync</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        New here?{' '}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>

      <section aria-labelledby="demo-heading" className="mt-8">
        <h2 id="demo-heading" className="text-sm font-medium text-navy">
          Explore with a demo account
        </h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {DEMO.map((d) => (
            <button
              key={d.role}
              onClick={() => demoLogin(d.role)}
              className="group flex items-start gap-3 rounded-xl border bg-card p-3 text-left transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                <d.icon className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1 text-sm font-medium text-navy">
                  {ROLE_LABEL[d.role]}
                  <ArrowRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                </span>
                <span className="block truncate text-xs text-muted-foreground">{d.who}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <div className="my-8 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or sign in with email <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <Field label="Email" htmlFor="email" error={errors.email}>
          <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="priya@skillsync.demo" aria-invalid={!!errors.email} />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password} hint="Demo accounts accept any password of 6+ characters.">
          <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!errors.password} />
        </Field>
        <Button type="submit" className="h-10" disabled={loading}>
          {loading ? 'Signing in…' : 'Log in'}
        </Button>
      </form>
    </div>
  )
}
