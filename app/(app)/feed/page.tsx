import { Suspense } from 'react'
import { FeedView } from '@/components/feed/feed-view'

export default function FeedPage() {
  return (
    <Suspense>
      <FeedView />
    </Suspense>
  )
}
