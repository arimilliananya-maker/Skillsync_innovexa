import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AuthLayout } from '@/components/auth/auth-layout'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = { title: 'Log in – SkillSync' }

export default function LoginPage() {
  return (
    <AuthLayout>
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  )
}
