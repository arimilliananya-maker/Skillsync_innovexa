import type { Metadata } from 'next'
import { AuthLayout } from '@/components/auth/auth-layout'
import { RegisterWizard } from '@/components/auth/register-wizard'

export const metadata: Metadata = { title: 'Create your account – SkillSync' }

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterWizard />
    </AuthLayout>
  )
}
