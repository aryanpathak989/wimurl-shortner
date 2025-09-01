"use client"

import type * as React from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/lib/utils"

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactElement  // ResponsiveContainer expects a single ReactElement
  className?: string
}

export function Chart({ children, className, ...props }: ChartProps) {
  return (
    <div className={cn("h-[350px] w-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

interface ChartTooltipProps extends React.ComponentProps<typeof Tooltip> {
  className?: string
}

export function ChartTooltip({ className, ...props }: ChartTooltipProps) {
  return (
    <Tooltip
      cursor={false}
      content={({ active, payload }) => {
        if (active && payload && payload.length) {
          return (
            <div className="rounded-lg border bg-background p-2 shadow-sm">
              <div className="grid grid-cols-2 gap-2">
                {payload.map((data, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">{data.name}</span>
                    <span className="font-bold text-foreground">{data.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        }

        return null
      }}
      {...props}
    />
  )
}

export {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
}
