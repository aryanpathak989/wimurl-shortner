"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  ChevronRight,
  ArrowUpRight,

  ArrowDownRight,
  ArrowRight,
  Zap,
  Link,
  MousePointerClick,

  UserCheck2,

  MousePointer2,
  Activity,
} from "lucide-react"


import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { D3Sparkline } from "@/components/d3sparkle"
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  TooltipProps,
  AreaChart,
  CartesianGrid,
  Area
} from 'recharts';

import Loader from "@/components/ui/Loader"

import {LinkProAnalyticsResponse} from '../../types/dashboard'
import { useQuery } from "@tanstack/react-query"
import {fetchOverviewData} from '../../api/overviewData'
import { useRouter } from "next/navigation"

import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { SelectValue } from "@radix-ui/react-select"
import Error from '@/components/ui/Error'
import NoActivity from "@/components/ui/noActivity"
import DeviceBreakdownZeroState from "@/components/ui/noActivity"


dayjs.extend(relativeTime);

export default function OverviewContent() {
  const router = useRouter()

  const [overviewData,setOverviewData] = useState<LinkProAnalyticsResponse>()
  const {data:overviewApiData,isSuccess:isOverviewSuccess,isLoading:isOverviewLoading,refetch:retchOverviewData,isError} = useQuery({
    queryKey:["overviewData"],
    queryFn: () => fetchOverviewData({
      filter:filterSelected
    })
  })
  const [filterSelected,setFilterSelected] = useState<string>("7days")

  useEffect(()=>{
    if(isOverviewSuccess){
      setOverviewData(overviewApiData)   
    }
  },[overviewApiData,isOverviewSuccess])


  useEffect(()=>{
    console.log("Done")
  retchOverviewData()
  },[filterSelected])

  if(isOverviewLoading) return <Loader/>
  if(isError) return <Error/>



  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }

    const handleCopyLink = (data:string) => {
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_API_URL}/${data}`)
  }

  function getFilterLabel(filter: string): string {
  switch (filter) {
    case '14days':
      return '14 days';
    case '1month':
      return '1 month';
    case '3months':
      return '3 months';
    case '6months':
      return '6 months';
    case '1year':
      return '1 year';
    default:
      return '7 days'
  }
}

  return (
    <div className="space-y-6 w-full">
              <div className="relative overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900/50 border p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold tracking-tight uppercase text-slate-900 dark:text-slate-100 mb-2">
                  Hi {localStorage.getItem("firstName")}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
Lets see what your links are doing in past {getFilterLabel(filterSelected)}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">

            </div>
          </div>

          {/* Subtle decorative elements */}
          <div className="absolute top-4 right-4 opacity-5 dark:opacity-10">
            <Zap className="h-24 w-24" />
          </div>
        </div>

      <div className="flex items-start justify-end w-full">

        {/* Right Side Dropdown */}
        <Select defaultValue="7days" onValueChange={(value) =>{setFilterSelected(value)} }>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="14days">Last 14 Days</SelectItem>
            <SelectItem value="1month">Last 1 Month</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last 1 Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <motion.div
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        animate="show"
      >

          <motion.div variants={item}>
            <Card className="overflow-hidden border-l-4 border-l-blue-500 ">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Total Links</CardTitle>
                {<Link className="h-5 w-5 text-primary" />}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewData?.totalLinks}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <span className={
                    overviewData?.change?.totalLinks !== undefined
                      ? Number(overviewData.change.totalLinks) > 0
                        ? "text-green-500"
                        : Number(overviewData.change.totalLinks) < 0
                          ? "text-red-500"
                          : ""
                      : ""
                  }>
                    {overviewData?.change?.totalLinks? overviewData.change.totalLinks + "%" : "--"}
                  </span>
                  {
                    overviewData?.change?.totalLinks !== undefined
                      ? Number(overviewData.change.totalLinks) > 0
                        ? <ArrowUpRight className="h-3 w-3 text-green-500" />
                        : Number(overviewData.change.totalLinks) < 0
                          ? <ArrowDownRight className="h-3 w-3 text-red-500"/>
                          : ""
                      : ""
                  }
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="overflow-hidden  border-l-4 border-l-emerald-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Total Clicks</CardTitle>
                {<MousePointerClick className="h-5 w-5 text-emerald-500" />}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewData?.totalClicks}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <span className={
                    overviewData?.change?.totalClicks !== undefined
                      ? Number(overviewData.change.totalClicks) > 0
                        ? "text-green-500"
                        : Number(overviewData.change.totalClicks) < 0
                          ? "text-red-500"
                          : ""
                      : ""
                  }>
                    {overviewData?.change?.totalClicks? overviewData.change.totalClicks + "%" : "--"}
                  </span>
                  {
                    overviewData?.change?.totalClicks !== undefined
                      ? Number(overviewData.change.totalClicks) > 0
                        ? <ArrowUpRight className="h-3 w-3 text-green-500" />
                        : Number(overviewData.change.totalClicks) < 0
                          ? <ArrowDownRight className="h-3 w-3 text-red-500"/>
                          : ""
                      : ""
                  }
                </p>
              </CardContent>
            </Card>
          </motion.div>

                    <motion.div variants={item}>
            <Card className="overflow-hidden border-l-4 border-l-amber-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Unique Users</CardTitle>
                {<UserCheck2 className="h-5 w-5 text-amber-500" />}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewData?.activeUser}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <span className={
                    overviewData?.change?.activeUser !== undefined
                      ? Number(overviewData.change.activeUser) > 0
                        ? "text-green-500"
                        : Number(overviewData.change.activeUser) < 0
                          ? "text-red-500"
                          : ""
                      : ""
                  }>
                    {overviewData?.change?.activeUser ? overviewData.change.activeUser + "%" : "--"}
                  </span>
                  {
                    overviewData?.change?.activeUser !== undefined
                      ? Number(overviewData.change.activeUser) > 0
                        ? <ArrowUpRight className="h-3 w-3 text-green-500" />
                        : Number(overviewData.change.activeUser) < 0
                          ? <ArrowDownRight className="h-3 w-3 text-red-500"/>
                          : ""
                      : ""
                  }
                </p>
              </CardContent>
            </Card>
          </motion.div>

                    <motion.div variants={item}>
            <Card className="overflow-hidden border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Average Click</CardTitle>
                {<MousePointer2 className="h-5 w-5 text-purple-500" />}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewData?.ctr}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <span className={
  overviewData?.ctrLabel !== undefined
    ? overviewData.ctrLabel === "Bad"
      ? "text-red-500"
      : overviewData.ctrLabel === "Average"
        ? "text-yellow-500"
        : overviewData.ctrLabel === "Good"
          ? "text-blue-500"
          : overviewData.ctrLabel === "Excellent"
            ? "text-green-500"
            : ""
    : ""
}>
                    {overviewData?.ctrLabel !== undefined ? overviewData.ctrLabel : "-- "}
                  </span>
                  {
  overviewData?.ctrLabel === "Excellent" ? (
    <ArrowUpRight className="h-3 w-3 text-green-500" />
  ) : overviewData?.ctrLabel === "Good" ? (
    <ArrowUpRight className="h-3 w-3 text-green-400" />
  ) : overviewData?.ctrLabel === "Average" ? (
    <ArrowRight className="h-3 w-3 text-yellow-500" />
  ) : overviewData?.ctrLabel === "Bad" ? (
    <ArrowDownRight className="h-3 w-3 text-red-500" />
  ) : null
}
                </p>
              </CardContent>
            </Card>
          </motion.div>          
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Clicks</CardTitle>
            <CardDescription>Your link performance over the past week</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {overviewData?.weeklyClicks && overviewData.weeklyClicks.length > 0 ? (
<ResponsiveContainer width="100%" height={300}>
  <AreaChart
    data={
      overviewData?.weeklyClicks?.map((item) => {
        const formattedDate = new Date(item.date).toLocaleDateString('en-US', { weekday: 'long' });
        return {
          formattedDate,
          clicks: item.clicks,
        };
      }) || []
    }
    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
  >
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
    <YAxis
      axisLine={false}
      tickLine={false}
      tick={{ fontSize: 12, fill: "#6b7280" }}
    />
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
          );
        }
        return null;
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
</ResponsiveContainer>):
(
  <NoActivity/>
)}

          </CardContent>
        </Card>

        <div>
          {overviewData?.deviceBreakdown && overviewData.deviceBreakdown[0].count == 0 && overviewData.deviceBreakdown[1].count == 0 && overviewData.deviceBreakdown[2].count == 0 ? <DeviceBreakdownZeroState/>:<><CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>Traffic sources by device</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {overviewData?.deviceBreakdown &&
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={
                    overviewData?.deviceBreakdown?.map((item) => ({
                      name: item.device,
                      value: item.count
                    })) || []
                  }
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell key="cell-0" fill="hsl(221, 83%, 53%)" />
                  <Cell key="cell-1" fill="hsl(25, 95%, 53%)" />
                  <Cell key="cell-2" fill="hsl(262, 83%, 58%)" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
}
          </CardContent>
          <CardFooter className="flex justify-between items-center pt-0">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-xs">Dekstop</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(25, 95%, 53%)" }} />
              <span className="text-xs">Mobile</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(262, 83%, 58%)" }} />
              <span className="text-xs">Tablet</span>
            </div>
          </CardFooter>
          </>
}
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1">

        <Card className="lg:col-span-2">
          { overviewData?.urls?.length ?? 0 > 0 ?  <>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Recent Links</CardTitle>
              <CardDescription>Your most recent link activity</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={()=>{router.push("/dashboard/links")}}>
              View All
            </Button>
          </CardHeader>
          <CardContent>

            {overviewData?.urls && overviewData.urls.length > 0  && (
            <div className="space-y-4 mb-10 md:pb-0">
              {(overviewData?.urls?.length ?? 0) > 0 && overviewData?.urls?.map((link,index) => (
                <div key={link.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="font-medium">{link.name}</p>
                    <p className="text-sm text-muted-foreground">shrl.me/{link.shortUrl}</p>
                  </div>
                  <div className="flex gap-6">
                    <div className="hidden md:block"><D3Sparkline id={index.toString()} data={Array.isArray(link.chartData) ? link.chartData.map((item: { clicks: number }) => item.clicks) : []} /></div>
                                      <div className="flex items-center gap-4">
                    <div className="text-right md:pr-4">
                      <p className="font-medium">{link.clicks}</p>
                      <p className="text-xs hidden md:block">clicks</p>
                    </div>
                  </div>
                  </div>
                </div>
              ))}
            </div>)}
          </CardContent>
          </>:
              <div className="bg-card border border-border rounded-xl p-6 flex flex-col min-h-[200px] w-full mx-auto">
      <div className="flex flex-row items-center justify-between mb-2">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Recent Links</h3>
          <p className="text-muted-foreground text-sm">Your most recent link activity</p>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center text-center p-5 w-full">
          <div className="mb-4 rounded-full bg-primary/10 p-4">
            <Activity className="h-10 w-10 text-primary" />
          </div>
          <h4 className="text-lg font-semibold text-card-foreground mb-1">No Activity Recorded</h4>
          <p className="text-muted-foreground text-sm max-w-md">
            There is no recent activity to display at this time. Share your links to begin tracking engagement and view detailed analytics here.
          </p>
        </div>
      </div>
    </div>
}
        </Card>
      </div>
    </div>
  )
}

