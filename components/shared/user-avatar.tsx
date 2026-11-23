import Link from 'next/link'
import { initials } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { User } from '@/lib/types'

const SIZES = {
  xs: 'size-6 text-[10px]',
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-14 text-lg',
  xl: 'size-20 text-2xl',
}

export function UserAvatar({
  user,
  size = 'md',
  className,
  link = false,
}: {
  user?: Pick<User, 'name' | 'avatarHue' | 'id'>
  size?: keyof typeof SIZES
  className?: string
  link?: boolean
}) {
  const hue = user?.avatarHue ?? 260
  const el = (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center rounded-full font-semibold', SIZES[size], className)}
      style={{ backgroundColor: `oklch(0.93 0.05 ${hue})`, color: `oklch(0.38 0.14 ${hue})` }}
      aria-hidden={link ? undefined : true}
    >
      {initials(user?.name ?? '?')}
    </span>
  )
  if (link && user)
    return (
      <Link href={`/profile/${user.id}`} aria-label={`View ${user.name}'s profile`} className="rounded-full">
        {el}
      </Link>
    )
  return el
}

export function AvatarStack({ users, max = 4 }: { users: User[]; max?: number }) {
  const shown = users.slice(0, max)
  return (
    <div className="flex -space-x-2">
      {shown.map((u) => (
        <UserAvatar key={u.id} user={u} size="sm" className="ring-2 ring-card" />
      ))}
      {users.length > max && (
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground ring-2 ring-card">
          +{users.length - max}
        </span>
      )}
    </div>
  )
}
