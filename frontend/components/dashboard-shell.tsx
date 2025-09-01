"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { BarChart3, Link2, MessageSquare, User, Settings, LogOut, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

interface DashboardShellProps {
  children: React.ReactNode
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function DashboardShell({ children, activeTab, setActiveTab }: DashboardShellProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen bg-muted/30">
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle />
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <main className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

function DashboardSidebar({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  const { state } = useSidebar()

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      id: "links",
      label: "Links",
      icon: <Link2 className="h-5 w-5" />,
    },
    {
      id: "forum",
      label: "Forum",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      id: "bios",
      label: "Bios",
      icon: <User className="h-5 w-5" />,
    },
  ]

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-6 py-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <ChevronRight className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">Dashboard</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                isActive={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
                className="group relative overflow-hidden"
                tooltip={item.label}
              >
                {item.icon}
                <span>{item.label}</span>
                {activeTab === item.id && (
                  <motion.div
                    layoutId="sidebar-active-tab"
                    className="absolute inset-0 z-[-1] bg-primary/10 dark:bg-primary/20"
                    initial={{ borderRadius: 8 }}
                    animate={{ borderRadius: 8 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-6">
        <div className="flex flex-col gap-4">
          <Button variant="outline" size="sm" className="justify-start gap-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Button>
          <Button variant="outline" size="sm" className="justify-start gap-2 text-destructive hover:text-destructive">
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
