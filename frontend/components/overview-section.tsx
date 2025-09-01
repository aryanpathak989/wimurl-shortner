"use client"

import { BarChart3, Link2, MessageSquare, User, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function OverviewSection() {
  const stats = [
    {
      title: "Total Links",
      value: "24",
      change: "+12%",
      icon: <Link2 className="h-4 w-4 text-primary" />,
    },
    {
      title: "Forum Posts",
      value: "8",
      change: "+3%",
      icon: <MessageSquare className="h-4 w-4 text-primary" />,
    },
    {
      title: "Bio Links",
      value: "3",
      change: "New",
      icon: <User className="h-4 w-4 text-primary" />,
    },
    {
      title: "Total Clicks",
      value: "1,024",
      change: "+18%",
      icon: <BarChart3 className="h-4 w-4 text-primary" />,
    },
  ]

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s an overview of your activity.</p>
      </div>

      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {stats.map((stat, i) => (
          <motion.div key={i} variants={item}>
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <span className={stat.change.includes("+") ? "text-green-500" : ""}>{stat.change}</span>
                  {stat.change.includes("+") && <ArrowUpRight className="h-3 w-3" />}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your activity over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-md">
            <p className="text-sm text-muted-foreground">Activity chart will appear here</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Link2 className="mr-2 h-4 w-4" />
              Create New Link
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="mr-2 h-4 w-4" />
              New Forum Post
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              Update Bio Links
            </Button>
          </CardContent>
          <CardFooter>
            <Button className="w-full">View All Actions</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
