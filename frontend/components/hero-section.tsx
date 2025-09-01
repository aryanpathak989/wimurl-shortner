"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight, Zap } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/animations"

const demoUrls = [
  "https://www.example-very-long-url.com/products/category/item",
  "https://docs.google.com/spreadsheets/d/1234567890abcdef/edit",
  "https://github.com/username/repository-name/blob/main/src",
  "https://www.amazon.com/product-name-with-many-words/dp",
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLxyz123",
  "https://medium.com/@author/this-is-a-very-long-article-title",
]

const shortUrls = [
  "shrl.me/abc123",
  "shrl.me/xyz789",
  "shrl.me/def456",
  "shrl.me/ghi012",
  "shrl.me/jkl345",
  "shrl.me/mno678",
]

export function HeroSection() {
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [showResult, setShowResult] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)

  // Handle mouse movement for the background effect with immediate response
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setMousePosition({ x, y })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  useEffect(() => {
    const currentUrl = demoUrls[currentUrlIndex]
    const currentShortUrl = shortUrls[currentUrlIndex]

    let timeout: NodeJS.Timeout

    if (isTyping && !isDeleting) {
      // Typing the long URL
      if (displayText.length < currentUrl.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentUrl.slice(0, displayText.length + 1))
        }, 50)
      } else {
        // Finished typing, show result after a pause
        timeout = setTimeout(() => {
          setShowResult(true)
          setIsTyping(false)
        }, 1000)
      }
    } else if (showResult && !isDeleting) {
      // Show the shortened result
      timeout = setTimeout(() => {
        setIsDeleting(true)
        setShowResult(false)
      }, 2000)
    } else if (isDeleting) {
      // Delete the text
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, 30)
      } else {
        // Move to next URL
        setCurrentUrlIndex((prev) => (prev + 1) % demoUrls.length)
        setIsDeleting(false)
        setIsTyping(true)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayText, currentUrlIndex, isTyping, showResult, isDeleting])

  return (
    <section
      ref={heroRef}
      className="relative w-full flex items-center justify-center min-h-[calc(100vh-4rem)] overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background to-background/80" />

      {/* Grid Pattern */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Mouse-following gradient with immediate response */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0) 70%)",
          transform: "translate(-50%, -50%)",
          transition: "none", // Removed transition for immediate response
        }}
      />

      <div className="container relative px-4 md:px-6 z-10">
        <div className="flex flex-col items-center space-y-8 text-center">
          {/* Badge */}
          <FadeIn direction="up">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary ring-1 ring-primary/20">
              <Zap className="mr-2 h-4 w-4" />
              Professional Link Management
            </div>
          </FadeIn>

          {/* Main Heading */}
          <FadeIn direction="up" delay={0.1}>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Shorten, Track & Optimize
              <br />
              <span className="text-primary">Your Links</span>
            </h1>
          </FadeIn>

          {/* Subtitle */}
          <FadeIn direction="up" delay={0.2}>
            <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Transform long URLs into powerful, trackable short links with comprehensive analytics, custom domains, and
              enterprise-grade performance monitoring.
            </p>
          </FadeIn>

          {/* Demo Input */}
          <FadeIn direction="up" delay={0.3} className="w-full max-w-2xl">
            <div className="relative">
              <div className="flex items-center rounded-xl bg-muted/80 backdrop-blur-sm border border-border p-4 shadow-md">
                <div className="flex-1 min-h-[24px] relative overflow-hidden">
                  <div className="text-left text-sm sm:text-base truncate">
                    {!showResult ? (
                      <div className="text-muted-foreground truncate">
                        {displayText}
                        <span className="animate-pulse">|</span>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between"
                      >
                        <div className="text-left">
                          <div className="text-xs text-muted-foreground mb-1">Shortened to:</div>
                          <div className="text-primary font-medium">{shortUrls[currentUrlIndex]}</div>
                        </div>
                        <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm">
                          <span className="mr-2">✓</span>
                          <span className="hidden sm:inline">Ready to share</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
                <Button size="sm" className="ml-4 bg-primary hover:bg-primary/90 text-primary-foreground" disabled>
                  Shorten
                </Button>
              </div>

              {/* Floating stats */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -right-4 -top-4 hidden lg:block"
              >
                <div className="rounded-lg bg-card/80 backdrop-blur-sm border border-border p-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live Demo</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </FadeIn>

          {/* Action Buttons */}
          <FadeIn direction="up" delay={0.4}>
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-medium"
                  asChild
                >
                  <Link href="/login">
                    <Zap className="mr-2 h-5 w-5" />
                    Start Free
                    <span className="ml-2 text-xs opacity-75">v1.0</span>
                  </Link>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border text-foreground hover:bg-muted px-8 py-3 text-lg font-medium"
                  asChild
                >
                  <Link href="#features">
                    Learn More
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </FadeIn>

          {/* Trust indicators */}
          <FadeIn direction="up" delay={0.5}>
            <div className="flex flex-col items-center gap-4 pt-8">
              <p className="text-sm text-muted-foreground">Trusted by professionals worldwide</p>
              <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-sm">99.9% Uptime</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm">Enterprise Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <span className="text-sm">Real-time Analytics</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
