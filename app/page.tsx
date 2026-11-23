import { LandingHeader } from '@/components/landing/landing-header'
import { Hero } from '@/components/landing/hero'
import { ProblemSolution } from '@/components/landing/problem-solution'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Features } from '@/components/landing/features'
import { CollaborationExample } from '@/components/landing/collaboration-example'
import { MentorSection } from '@/components/landing/mentor-section'
import { Interdisciplinary } from '@/components/landing/interdisciplinary'
import { CtaSection, LandingFooter } from '@/components/landing/footer'

export default function LandingPage() {
  return (
    <div className="min-h-svh bg-background">
      <LandingHeader />
      <main>
        <Hero />
        <ProblemSolution />
        <HowItWorks />
        <Features />
        <CollaborationExample />
        <MentorSection />
        <Interdisciplinary />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}
