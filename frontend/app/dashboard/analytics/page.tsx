"use client"
import Link from "next/link"
import { ArrowLeft, Link2, PieChart, Settings, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Chart, ChartTooltip, Line, Pie, XAxis, YAxis, LineChart } from "@/components/chart"

// Sample data for charts
const clicksData = [
  { name: "Jan", clicks: 400 },
  { name: "Feb", clicks: 300 },
  { name: "Mar", clicks: 600 },
  { name: "Apr", clicks: 800 },
  { name: "May", clicks: 700 },
  { name: "Jun", clicks: 900 },
  { name: "Jul", clicks: 1100 },
]

const deviceData = [
  { name: "Desktop", value: 65 },
  { name: "Mobile", value: 30 },
  { name: "Tablet", value: 5 },
]

const locationData = [
  { name: "USA", users: 800 },
  { name: "UK", users: 300 },
  { name: "Canada", users: 200 },
  { name: "Germany", users: 150 },
  { name: "France", users: 100 },
  { name: "Others", users: 250 },
]

const timeData = [
  { name: "00:00", clicks: 50 },
  { name: "04:00", clicks: 20 },
  { name: "08:00", clicks: 100 },
  { name: "12:00", clicks: 200 },
  { name: "16:00", clicks: 180 },
  { name: "20:00", clicks: 120 },
]

const COLORS = ["hsl(221, 83%, 53%)", "hsl(25, 95%, 53%)", "#8884d8", "#82ca9d", "#ffc658", "#ff8042"]

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">LinkPro</span>
          </div>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/links"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Links
            </Link>
            <Link href="/dashboard/analytics" className="text-sm font-medium text-primary">
              Analytics
            </Link>
            <Link
              href="/dashboard/forms"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Forms
            </Link>
            <Link
              href="/dashboard/bio"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Bio Links
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/dashboard/settings"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
            <Link
              href="/dashboard/profile"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 py-6">
        <div className="container">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Dashboard</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Detailed insights into your link performance</p>
            </div>
          </div>

          <Tabs defaultValue="overview" className="mt-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="links">Links</TabsTrigger>
              <TabsTrigger value="forms">Forms</TabsTrigger>
              <TabsTrigger value="bio">Bio Pages</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle>Total Clicks Over Time</CardTitle>
                    <CardDescription>Monthly click performance for all links</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Chart>
                      <AreaChart data={clicksData}>
                        <defs>
                          <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <ChartTooltip />
                        <Area
                          type="monotone"
                          dataKey="clicks"
                          stroke="hsl(221, 83%, 53%)"
                          fillOpacity={1}
                          fill="url(#colorClicks)"
                        />
                      </AreaChart>
                    </Chart>
                  </CardContent>
                </Card>
                <Card className="animate-fade-in animation-delay-200">
                  <CardHeader>
                    <CardTitle>Device Breakdown</CardTitle>
                    <CardDescription>Distribution of clicks by device type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Chart>
                      <PieChart>
                        <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip />
                      </PieChart>
                    </Chart>
                  </CardContent>
                </Card>
                <Card className="animate-fade-in animation-delay-400">
                  <CardHeader>
                    <CardTitle>Geographic Distribution</CardTitle>
                    <CardDescription>Top countries by user count</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Chart>
                      <BarChart data={locationData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip />
                        <Bar dataKey="users" fill="hsl(25, 95%, 53%)">
                          {locationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </Chart>
                  </CardContent>
                </Card>
                <Card className="animate-fade-in animation-delay-600">
                  <CardHeader>
                    <CardTitle>Time of Day Analysis</CardTitle>
                    <CardDescription>Click distribution throughout the day</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Chart>
                      <LineChart data={timeData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <ChartTooltip />
                        <Line
                          type="monotone"
                          dataKey="clicks"
                          stroke="hsl(221, 83%, 53%)"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </Chart>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="links">
              <Card>
                <CardHeader>
                  <CardTitle>Link Performance</CardTitle>
                  <CardDescription>Detailed analytics for individual links</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Select a link to view detailed analytics</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="forms">
              <Card>
                <CardHeader>
                  <CardTitle>Form Submissions</CardTitle>
                  <CardDescription>Analytics for form submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Select a form to view submission analytics</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="bio">
              <Card>
                <CardHeader>
                  <CardTitle>Bio Page Performance</CardTitle>
                  <CardDescription>Analytics for your bio pages</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Select a bio page to view detailed analytics</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
