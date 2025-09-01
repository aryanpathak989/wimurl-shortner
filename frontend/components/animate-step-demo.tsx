"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Link2, Share2, BarChart3, MousePointerClick, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface AnimatedStepDemoProps {
  step: number
}

export function AnimatedStepDemo({ step }: AnimatedStepDemoProps) {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setCurrentPhase((prev) => {
        const maxPhases = getMaxPhases(step)
        return (prev + 1) % maxPhases
      })
      setTimeout(() => setIsAnimating(false), 500)
    }, 3000)

    return () => clearInterval(interval)
  }, [step])

  const getMaxPhases = (step: number) => {
    switch (step) {
      case 1:
        return 3 // Sign up flow
      case 2:
        return 4 // Link shortening
      case 3:
        return 3 // Sharing
      case 4:
        return 3 // Analytics
      case 5:
        return 3 // Optimization
      default:
        return 3
    }
  }

  const renderStepDemo = () => {
    switch (step) {
      case 1:
        return <SignUpDemo phase={currentPhase} isAnimating={isAnimating} />
      case 2:
        return <LinkShorteningDemo phase={currentPhase} isAnimating={isAnimating} />
      case 3:
        return <SharingDemo phase={currentPhase} isAnimating={isAnimating} />
      case 4:
        return <AnalyticsDemo phase={currentPhase} isAnimating={isAnimating} />
      case 5:
        return <OptimizationDemo phase={currentPhase} isAnimating={isAnimating} />
      default:
        return null
    }
  }

  return (
    <div className="relative w-full h-[400px] bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />
      <div className="relative h-full flex items-center justify-center p-8">{renderStepDemo()}</div>
    </div>
  )
}

function SignUpDemo({ phase, isAnimating }: { phase: number; isAnimating: boolean }) {
  return (
    <div className="w-full max-w-sm space-y-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Create Account</h3>
      </motion.div>

      <AnimatePresence mode="wait">
        {phase === 0 && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            <Input placeholder="Enter your email" className="w-full" />
            <Input placeholder="Create password" type="password" className="w-full" />
            <Button className="w-full">Sign Up</Button>
          </motion.div>
        )}

        {phase === 1 && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center py-8"
          >
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Creating your account...</p>
          </motion.div>
        )}

        {phase === 2 && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="font-medium text-emerald-600 dark:text-emerald-400">Account Created!</p>
            <p className="text-sm text-muted-foreground mt-1">Welcome to shrl.me</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function LinkShorteningDemo({ phase, isAnimating }: { phase: number; isAnimating: boolean }) {
  const [inputText, setInputText] = useState("")
  const [shortUrl, setShortUrl] = useState("")

  useEffect(() => {
    if (phase === 0) {
      setInputText("")
      setShortUrl("")
    } else if (phase === 1) {
      // Typing animation
      const longUrl = "https://www.example-very-long-url.com/products/category/item"
      let i = 0
      const typeInterval = setInterval(() => {
        if (i < longUrl.length) {
          setInputText(longUrl.slice(0, i + 1))
          i++
        } else {
          clearInterval(typeInterval)
        }
      }, 50)
      return () => clearInterval(typeInterval)
    } else if (phase === 2) {
      setShortUrl("shrl.me/abc123")
    }
  }, [phase])

  return (
    <div className="w-full max-w-md space-y-6">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Link2 className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Shorten Your URL</h3>
      </motion.div>

      <div className="space-y-4">
        <div className="relative">
          <Input value={inputText} placeholder="Paste your long URL here..." className="w-full pr-20" readOnly />
          <Button size="sm" className="absolute right-1 top-1 bottom-1" disabled={phase < 2}>
            Shorten
          </Button>
        </div>

        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Shortened URL:</p>
                  <p className="font-medium text-primary">{shortUrl}</p>
                </div>
                <Button size="sm" variant="outline">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {phase === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-2">
              <Check className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Ready to share!</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function SharingDemo({ phase, isAnimating }: { phase: number; isAnimating: boolean }) {
  const platforms = [
    { name: "Twitter", icon: "🐦", color: "bg-blue-500" },
    { name: "Facebook", icon: "📘", color: "bg-blue-600" },
    { name: "LinkedIn", icon: "💼", color: "bg-blue-700" },
  ]

  return (
    <div className="w-full max-w-md space-y-6">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Share2 className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Share Across Platforms</h3>
      </motion.div>

      <Card className="p-4">
        <CardContent className="p-0 space-y-3">
          <div className="text-sm text-muted-foreground">Your shortened link:</div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium text-primary">shrl.me/abc123</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Share on:</p>
            {platforms.map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: phase >= index ? 1 : 0.3,
                  x: 0,
                  scale: phase === index ? 1.05 : 1,
                }}
                transition={{ delay: index * 0.2 }}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  phase >= index ? "bg-background" : "bg-muted/50"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${platform.color}`}>
                  <span className="text-sm">{platform.icon}</span>
                </div>
                <span className="font-medium">{platform.name}</span>
                {phase >= index && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                    <Check className="w-4 h-4 text-emerald-500" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AnalyticsDemo({ phase, isAnimating }: { phase: number; isAnimating: boolean }) {
  const stats = [
    { label: "Total Clicks", value: phase >= 1 ? "1,247" : "0", icon: MousePointerClick },
    { label: "Countries", value: phase >= 2 ? "23" : "0", icon: "🌍" },
    { label: "Devices", value: phase >= 2 ? "Mobile 65%" : "0%", icon: "📱" },
  ]

  return (
    <div className="w-full max-w-md space-y-6">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Track Performance</h3>
      </motion.div>

      <Card className="p-4">
        <CardContent className="p-0 space-y-4">
          <div className="text-sm text-muted-foreground">Analytics Dashboard</div>

          <div className="grid grid-cols-1 gap-3">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: phase >= index ? 1 : 0.3,
                  y: 0,
                  scale: phase === index ? 1.02 : 1,
                }}
                transition={{ delay: index * 0.3 }}
                className={`p-3 rounded-lg border transition-all ${phase >= index ? "bg-background" : "bg-muted/50"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {typeof stat.icon === "string" ? (
                      <span className="text-lg">{stat.icon}</span>
                    ) : (
                      <stat.icon className="w-4 h-4 text-primary" />
                    )}
                    <span className="text-sm font-medium">{stat.label}</span>
                  </div>
                  <motion.span
                    key={stat.value}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="font-bold text-primary"
                  >
                    {stat.value}
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </div>

          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg"
            >
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">📈 +18% increase this week</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function OptimizationDemo({ phase, isAnimating }: { phase: number; isAnimating: boolean }) {
  const insights = [
    { text: "Peak traffic: 2-4 PM", action: "Schedule posts" },
    { text: "Mobile users: 65%", action: "Optimize for mobile" },
    { text: "Top source: Social media", action: "Increase social presence" },
  ]

  return (
    <div className="w-full max-w-md space-y-6">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🎯</span>
        </div>
        <h3 className="text-lg font-semibold">Optimize Strategy</h3>
      </motion.div>

      <Card className="p-4">
        <CardContent className="p-0 space-y-4">
          <div className="text-sm text-muted-foreground">AI-Powered Insights</div>

          <div className="space-y-3">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: phase >= index ? 1 : 0.3,
                  x: 0,
                }}
                transition={{ delay: index * 0.4 }}
                className={`p-3 rounded-lg border transition-all ${phase >= index ? "bg-background" : "bg-muted/50"}`}
              >
                <div className="space-y-2">
                  <p className="text-sm font-medium">{insight.text}</p>
                  {phase >= index && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Button size="sm" variant="outline" className="text-xs">
                        {insight.action}
                      </Button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-3 bg-primary/10 rounded-lg text-center"
            >
              <p className="text-sm font-medium text-primary">🚀 Strategy optimized for maximum engagement</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
