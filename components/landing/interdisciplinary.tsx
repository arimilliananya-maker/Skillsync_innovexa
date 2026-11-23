import Image from 'next/image'

const DOMAINS = [
  { name: 'Software & Technology', detail: 'Architecture, development and software testing' },
  { name: 'Agriculture', detail: 'Field design, field implementation and trials' },
  { name: 'Research', detail: 'Literature review, methodology and experiments' },
  { name: 'Healthcare', detail: 'Clinical needs, ethics and validation' },
  { name: 'Business', detail: 'Market research, business model and pilots' },
]

export function Interdisciplinary() {
  return (
    <section id="interdisciplinary" className="scroll-mt-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:px-6 md:py-20 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border">
          <Image
            src="/images/collaboration.png"
            alt="Students from agriculture, computer science and electronics collaborating on a smart irrigation prototype"
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-primary">Interdisciplinary by design</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance text-navy">One 13-stage journey, adapted to every domain</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Every project follows the same 13 stages – from idea submission to showcase – while the activities inside each stage adapt to your domain.
          </p>
          <ul className="mt-6 divide-y rounded-2xl border bg-card">
            {DOMAINS.map((d) => (
              <li key={d.name} className="flex flex-col gap-0.5 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-medium text-navy">{d.name}</span>
                <span className="text-sm text-muted-foreground">{d.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
