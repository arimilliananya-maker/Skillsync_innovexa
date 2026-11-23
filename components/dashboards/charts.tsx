'use client'

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from 'recharts'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

export const PALETTE = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

export function HBarChart({ data, label = 'Projects' }: { data: { name: string; value: number }[]; label?: string }) {
  const config = { value: { label, color: 'var(--chart-1)' } } satisfies ChartConfig
  return (
    <ChartContainer config={config} className="aspect-auto w-full" style={{ height: Math.max(160, data.length * 36) }}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <CartesianGrid horizontal={false} />
        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={130} tick={{ fontSize: 12 }} />
        <XAxis type="number" hide allowDecimals={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel={false} />} />
        <Bar dataKey="value" fill="var(--color-value)" radius={6} barSize={18} />
      </BarChart>
    </ChartContainer>
  )
}

export function DonutChart({ data }: { data: { name: string; value: number }[] }) {
  const config = Object.fromEntries(data.map((d, i) => [d.name, { label: d.name, color: PALETTE[i % PALETTE.length] }])) satisfies ChartConfig
  const total = data.reduce((a, b) => a + b.value, 0)
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <ChartContainer config={config} className="aspect-square w-40 shrink-0">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={42} outerRadius={70} strokeWidth={2}>
            {data.map((d, i) => (
              <Cell key={d.name} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <ul className="flex w-full flex-col gap-2 text-sm">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center gap-2">
            <span className="size-2.5 rounded-sm" style={{ backgroundColor: PALETTE[i % PALETTE.length] }} aria-hidden="true" />
            <span className="flex-1 text-foreground/85">{d.name}</span>
            <span className="font-medium text-navy">{d.value}</span>
            <span className="w-10 text-right text-xs text-muted-foreground">{total ? Math.round((d.value / total) * 100) : 0}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function TrendChart({ data, label }: { data: { name: string; value: number }[]; label: string }) {
  const config = { value: { label, color: 'var(--chart-1)' } } satisfies ChartConfig
  return (
    <ChartContainer config={config} className="aspect-auto h-56 w-full">
      <AreaChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-value)" stopOpacity={0.25} />
            <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} width={28} allowDecimals={false} tick={{ fontSize: 12 }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area dataKey="value" type="monotone" stroke="var(--color-value)" strokeWidth={2} fill="url(#trendFill)" />
      </AreaChart>
    </ChartContainer>
  )
}

export function countBy<T>(items: T[], key: (t: T) => string) {
  const m = new Map<string, number>()
  items.forEach((i) => m.set(key(i), (m.get(key(i)) ?? 0) + 1))
  return Array.from(m, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
}

export function monthlyCumulative(dates: string[], months = 6) {
  const now = new Date()
  return Array.from({ length: months }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i) + 1, 1)
    return { name: new Date(d.getFullYear(), d.getMonth() - 1, 1).toLocaleString('en', { month: 'short' }), value: dates.filter((x) => new Date(x) < d).length }
  })
}
