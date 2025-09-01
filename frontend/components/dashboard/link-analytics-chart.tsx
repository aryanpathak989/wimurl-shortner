"use client"

import { useMemo } from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { format, parseISO } from "date-fns"

interface LinkAnalyticsChartProps {
  data: {
    performance: Array<{ date: string; count: number }>
    averageClicks: number
    peakClicks: number
  }
  period: string
}
export function LinkAnalyticsChart({ data, period }: LinkAnalyticsChartProps) {
  // Map API data to the shape your chart expects
  const formattedData = useMemo(() => {
    return data.performance.map((item) => ({
      date: item.date,
      clicks: item.count, // rename count to clicks for chart dataKey
      formattedDate: format(parseISO(item.date), getDateFormat(period)),
    }))
  }, [data, period])

  // Use the averageClicks and peakClicks from the API directly
  const avgClicks = Math.round(data.averageClicks)
  const maxClicks = data.peakClicks

  function getDateFormat(period: string) {
    switch (period) {
      case "7days":
      case "14days":
        return "MMM dd"
      case "1month":
        return "MMM dd"
      case "3months":
      case "6months":
        return "MMM yyyy"
      case "1year":
        return "MMM yyyy"
      default:
        return "MMM dd"
    }
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-muted-foreground">Average: </span>
            <span className="font-bold text-lg">{avgClicks} clicks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-muted-foreground">Peak: </span>
            <span className="font-bold text-lg">{maxClicks} clicks</span>
          </div>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="formattedDate"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              interval="preserveStartEnd"
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-white shadow-lg p-4 ring-1 ring-black/5 dark:bg-slate-800 dark:border-slate-700">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="text-xs uppercase text-muted-foreground font-medium">Date</span>
                          <span className="font-bold text-foreground text-sm">{label}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs uppercase text-muted-foreground font-medium">Clicks</span>
                          <span className="font-bold text-foreground text-lg">{payload[0].value}</span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="clicks"
              stroke="#6366f1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorClicks)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
