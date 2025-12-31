'use client'

import { Activity, Users, BookOpen } from 'lucide-react'
import DottedMap from 'dotted-map'
import { Area, AreaChart, CartesianGrid } from 'recharts'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

export function FeaturesShowcase() {
  return (
    <section className="px-4 py-16 md:py-32">
      <div className="mx-auto grid max-w-5xl border md:grid-cols-2">
        {/* Global Reach Section */}
        <div>
          <div className="p-6 sm:p-12">
            <span className="text-muted-foreground flex items-center gap-2">
              <Users className="size-4" />
              Global ACM Network
            </span>
            <p className="mt-8 text-2xl font-semibold">
              Connect with ACM chapters worldwide. Join a global community of tech enthusiasts.
            </p>
          </div>
          <div aria-hidden className="relative">
            <div className="absolute inset-0 z-10 m-auto size-fit">
              <div className="rounded-[--radius] bg-white/80 backdrop-blur-sm z-[1] relative flex size-fit w-fit items-center gap-2 border px-3 py-1 text-xs font-medium shadow-md shadow-black/5">
                <span className="text-lg">🇮🇳</span> Connected from Mumbai, India
              </div>
              <div className="rounded-[--radius] bg-white/60 backdrop-blur-sm absolute inset-2 -bottom-2 mx-auto border px-3 py-4 text-xs font-medium shadow-md shadow-black/5"></div>
            </div>
            <div className="relative overflow-hidden">
              <div className="[background-image:radial-gradient(var(--tw-gradient-stops))] z-1 to-background absolute inset-0 from-transparent to-75%"></div>
              <Map />
            </div>
          </div>
        </div>

        {/* Support & Community Section */}
        <div className="overflow-hidden border-t bg-transparent p-6 sm:p-12 md:border-0 md:border-l">
          <div className="relative z-10">
            <span className="text-muted-foreground flex items-center gap-2">
              <BookOpen className="size-4" />
              Mentorship & Support
            </span>
            <p className="my-8 text-2xl font-semibold">
              Get guidance from seniors and industry experts. We're here to help you grow.
            </p>
          </div>
          <div aria-hidden className="flex flex-col gap-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex justify-center items-center size-5 rounded-full border">
                  <span className="size-3 rounded-full bg-primary" />
                </span>
                <span className="text-muted-foreground text-xs">Today</span>
              </div>
              <div className="rounded-[--radius] bg-white/80 backdrop-blur-sm mt-1.5 w-3/5 border p-3 text-xs">
                Hi! I need help with my React project for the hackathon.
              </div>
            </div>
            <div>
              <div className="rounded-[--radius] mb-1 ml-auto w-3/5 bg-blue-600 p-3 text-xs text-white">
                Sure! Let's schedule a mentoring session. I can help you with component architecture and state management.
              </div>
              <span className="text-muted-foreground block text-right text-xs">Just now</span>
            </div>
          </div>
        </div>

        {/* Success Rate Section */}
        <div className="col-span-full border-y p-12">
          <p className="text-center text-4xl font-semibold lg:text-7xl">100+ Members</p>
          <p className="text-center text-lg text-muted-foreground mt-4">Across Years • SAKEC ACM Community</p>
        </div>

        {/* Activity Monitoring Section */}
        <div className="relative col-span-full">
          <div className="absolute z-10 max-w-lg px-6 pr-12 pt-6 md:px-12 md:pt-12">
            <span className="text-muted-foreground flex items-center gap-2">
              <Activity className="size-4" />
              Event Participation
            </span>
            <p className="my-8 text-2xl font-semibold">
              Track our chapter's growth and activities.
              <span className="text-muted-foreground"> Building a stronger tech community together.</span>
            </p>
          </div>
          <ParticipationChart />
        </div>
      </div>
    </section>
  )
}

const map = new DottedMap({ height: 55, grid: 'diagonal' })
const points = map.getPoints()

const svgOptions = {
  backgroundColor: 'var(--color-background)',
  color: 'currentColor',
  radius: 0.15,
}

const Map = () => {
  const viewBox = `0 0 120 60`
  return (
    <svg viewBox={viewBox} style={{ background: svgOptions.backgroundColor }}>
      {points.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={svgOptions.radius}
          fill={svgOptions.color}
        />
      ))}
    </svg>
  )
}

const chartConfig = {
  workshops: {
    label: 'Workshops',
    color: '#2563eb',
  },
  events: {
    label: 'Events',
    color: '#60a5fa',
  },
} satisfies ChartConfig

const chartData = [
  { month: 'Sep 2023', workshops: 8, events: 3 },
  { month: 'Oct 2023', workshops: 12, events: 5 },
  { month: 'Nov 2023', workshops: 15, events: 4 },
  { month: 'Dec 2023', workshops: 10, events: 2 },
  { month: 'Jan 2024', workshops: 18, events: 6 },
  { month: 'Feb 2024', workshops: 22, events: 8 },
  { month: 'Mar 2024', workshops: 25, events: 7 },
  { month: 'Apr 2024', workshops: 20, events: 5 },
]

const ParticipationChart = () => {
  return (
    <ChartContainer className="h-120 aspect-auto md:h-96" config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 0,
          right: 0,
        }}
      >
        <defs>
          <linearGradient id="fillWorkshops" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-workshops)" stopOpacity={0.8} />
            <stop offset="55%" stopColor="var(--color-workshops)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillEvents" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-events)" stopOpacity={0.8} />
            <stop offset="55%" stopColor="var(--color-events)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <ChartTooltip
          active
          cursor={false}
          content={<ChartTooltipContent className="dark:bg-muted" />}
        />
        <Area
          strokeWidth={2}
          dataKey="events"
          type="stepBefore"
          fill="url(#fillEvents)"
          fillOpacity={0.1}
          stroke="var(--color-events)"
          stackId="a"
        />
        <Area
          strokeWidth={2}
          dataKey="workshops"
          type="stepBefore"
          fill="url(#fillWorkshops)"
          fillOpacity={0.1}
          stroke="var(--color-workshops)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  )
}