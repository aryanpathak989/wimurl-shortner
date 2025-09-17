"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Loader, Zap } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/animations"
import { useMutation } from "@tanstack/react-query"
import { createFreeLink } from "@/api/linkData"
import { toast } from "react-toastify"
import LinkCreateModal from "./modal/LinkCreateModal"

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
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null);

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


const createLink = useMutation({
  mutationFn: (payload: { originalUrl: string }) => {
    return createFreeLink(payload);
  },
  onSuccess: (data) => {
    setShortUrl(data?.data?.shortUrl);
    setModalOpen(true);
  },
  onError: () => {
    toast.error("Something went wrong. Please try again later!");
  },
});

  const handleShorten = async () => {
    if (!longUrl) return;
    createLink.mutate({ originalUrl: longUrl })
  };

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

          <FadeIn direction="up" delay={0.3} className="w-full max-w-2xl">
            <div className="relative">
              <div className="flex items-center rounded-xl bg-muted/80 backdrop-blur-sm border border-border p-4 shadow-md">
                <input
                  ref={inputRef}
                  type="url"
                  className="flex-1 px-3 py-1.5 rounded focus:outline-none border-0 bg-transparent text-base text-foreground placeholder:text-muted-foreground"
                  placeholder="Paste your long URL here"
                  value={longUrl}
                  onChange={e => setLongUrl(e.target.value)}
                  autoFocus
                />
                <Button
                  size="lg"
                  className="ml-4 bg-primary hover:bg-primary/90 text-primary-foreground hidden md:flex gap-2"
                  onClick={handleShorten}
                >
                  Shorter Url
                  {
                    createLink.isPending? <Loader className="text-white h-4 w-4"/>: <ArrowRight className= "h-4 w-4 text-primary-foreground/80"/>
                  }
                </Button>
              </div>
              <Button
                size="lg"
                className="ml-4 bg-primary hover:bg-primary/90 text-primary-foreground md:hidden mt-4"
                onClick={handleShorten}
              >
                Shorter Url
                {
                    createLink.isPending? <Loader className="text-white h-4 w-4"/>: <ArrowRight className= "h-4 w-4 text-primary-foreground/80"/>
                  }
              </Button>

              <div className="mt-2 text-xs text-center text-emerald-600 px-2">
                Free – No credit card required. <br />
              </div>
            </div>
          </FadeIn>


{
  modalOpen && <LinkCreateModal setLinkCreatedModule={setModalOpen} shortCode={shortUrl} />
}

          {/* Trust indicators */}
          <FadeIn direction="up" delay={0.5}>
            <div className="flex flex-col items-center gap-4 pt-8">
              <p className="text-sm text-muted-foreground">Sign up to view link analytics for free!</p>
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
