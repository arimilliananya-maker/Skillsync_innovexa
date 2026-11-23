'use client'

import { AdminDashboard } from '@/components/dashboards/admin-dashboard'
import { CollegeDashboard } from '@/components/dashboards/college-dashboard'
import { MentorDashboard } from '@/components/dashboards/mentor-dashboard'
import { StudentDashboard } from '@/components/dashboards/student-dashboard'
import { useCurrentUser } from '@/lib/store'

export default function DashboardPage() {
  const user = useCurrentUser()
  if (!user) return null
  if (user.role === 'mentor') return <MentorDashboard user={user} />
  if (user.role === 'college') return <CollegeDashboard user={user} />
  if (user.role === 'admin') return <AdminDashboard />
  return <StudentDashboard user={user} />
}
