"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Monitor, Smartphone, Tablet } from "lucide-react"
import { useEffect, useState } from "react";

interface DeviceBreakdownChartProps {
  data: {
    mobile: { count: number; percentage: number };
    desktop: { count: number; percentage: number };
    tablet: { count: number; percentage: number };
  };
}

type DeviceDataItem = {
  name: "Mobile" | "Desktop" | "Tablet";
  value: number;
  color: string;
};

const deviceIcons = {
  Mobile: Smartphone,
  Desktop: Monitor,
  Tablet: Tablet,
}

export function DeviceBreakdownChart({data:apiData}: DeviceBreakdownChartProps) {
  const [data,setData] = useState<DeviceDataItem[]>( [{ name: "Mobile", value: 0, color: "#6366f1" }])

  useEffect(()=>{
    const newdata: DeviceDataItem[] = [
    { name: "Mobile", value: apiData.mobile.percentage, color: "#6366f1" },
    { name: "Desktop", value: apiData.desktop.percentage, color: "#10b981" },
    { name: "Tablet", value: apiData.tablet.percentage, color: "#f59e0b" },
  ];

  setData(newdata)
  },[apiData])

  const total = (data ?? []).reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-8">
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={70} outerRadius={120} paddingAngle={4} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="rounded-lg border bg-white shadow-lg p-4 ring-1 ring-black/5 dark:bg-slate-800 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: data.color }} />
                        <span className="font-bold text-lg">{data.name}</span>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span className="font-bold text-2xl text-foreground">{data.value}%</span> (
                        {Math.round((data.value / 100) * total)} clicks)
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {data.map((device) => {
          const Icon = deviceIcons[device.name as keyof typeof deviceIcons]
          return (
            <div
              key={device.name}
              className="relative overflow-hidden rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:bg-slate-800 dark:border-slate-700"
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-lg"
                  style={{ backgroundColor: device.color + "20" }}
                >
                  <Icon className="h-6 w-6" style={{ color: device.color }} />
                </div>
                <div>
                  <div className="font-bold text-xl">{device.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {device.value}% ({Math.round((device.value / 100) * total)} clicks)
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
