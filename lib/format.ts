export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.round(days / 30)
  return `${months}mo ago`
}

export function formatDate(date: string) {
  const d = new Date(date.length === 10 ? `${date}T00:00:00` : date)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function daysUntil(date: string) {
  const d = new Date(date.length === 10 ? `${date}T00:00:00` : date)
  return Math.ceil((d.getTime() - Date.now()) / 86_400_000)
}

export function initials(name: string) {
  return name
    .replace(/^(Dr\.|Prof\.)\s*/i, '')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function splitLines(text: string) {
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}
