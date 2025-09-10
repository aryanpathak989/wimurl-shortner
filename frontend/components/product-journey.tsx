"use client"

import type React from "react"
import { ArrowRight, BarChart3, Link2, MousePointerClick, Zap } from "lucide-react"

import { FadeIn } from "@/components/animations"
import { JourneyBackground } from "@/components/journey-background"
import { AnimatedStepDemo } from "@/components/animate-step-demo"

interface TimelineItemProps {
  step: number
  title: string
  description: string
  icon: React.ReactNode
  isLast?: boolean
}

function TimelineItem({ step, title, description, icon, isLast = false }: TimelineItemProps) {
  return (
    <div className="relative">
      {/* Timeline connector */}
      {!isLast && (
        <div className="hidden md:block absolute left-7 top-12 h-full w-0.5 bg-gradient-to-b from-primary via-primary/50 to-accent md:left-1/2 md:ml-0 md:translate-x-0" />
      )}

      <FadeIn direction="up" className="grid items-center gap-8 md:grid-cols-2">
        {/* Step number and content */}
        <div
          className={`flex flex-col items-start gap-4 md:items-end md:text-right ${step % 2 === 0 ? "md:order-2" : ""}`}
        >
          <div className="flex items-center gap-4 md:flex-row-reverse">
            <div className="flex h-14 w-14 items-center justify-center rounded-full gradient-primary text-xl font-bold backdrop-blur-sm">
              {step}
            </div>
            <h3 className="text-2xl font-bold">{title}</h3>
          </div>
          <p className="text-muted-foreground">{description}</p>
          <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary backdrop-blur-sm">
            {icon}
          </div>
        </div>

        {/* Animated Demo */}
        <div className={`relative ${step % 2 === 0 ? "md:order-1" : ""}`}>
          <AnimatedStepDemo step={step} />
        </div>
      </FadeIn>
    </div>
  )
}

export function ProductJourney() {
  const timelineItems = [
    {
      step: 1,
      title: "Sign Up & Create Account",
      description: "Create your account in seconds and get access to all features with our simple onboarding process.",
      icon: <Link2 className="h-6 w-6" />,
    },
    {
      step: 2,
      title: "Shorten Your Links",
      description: "Paste your long URL and get a shortened link instantly. Customize your links with branded domains.",
      icon: <Zap className="h-6 w-6" />,
    },
    {
      step: 3,
      title: "Share Across Platforms",
      description: "Share your shortened links on social media, email, or any digital platform to drive traffic.",
      icon: <ArrowRight className="h-6 w-6" />,
    },
    {
      step: 4,
      title: "Track Performance",
      description: "Monitor clicks, geographic data, device information, and more with our comprehensive analytics.",
      icon: <BarChart3 className="h-6 w-6" />,
    },
    {
      step: 5,
      title: "Optimize Your Strategy",
      description: "Use insights from analytics to refine your approach and maximize engagement with your audience.",
      icon: <MousePointerClick className="h-6 w-6" />,
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 gradient-timeline">
      <JourneyBackground />
      <div className="container px-4 md:px-6 relative z-10">
        <FadeIn direction="up" className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg gradient-primary px-3 py-1 text-sm backdrop-blur-sm">
              How It Works
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Your Journey to Better <span className="gradient-text">Link Management</span>
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Follow these simple steps to get started and make the most of our platform
            </p>
          </div>
        </FadeIn>

        <div className="mt-16 space-y-24 md:space-y-32">
          {timelineItems.map((item, index) => (
            <TimelineItem key={item.step} {...item} isLast={index === timelineItems.length - 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
