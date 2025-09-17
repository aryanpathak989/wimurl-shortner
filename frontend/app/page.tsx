"use client"
import Link from "next/link"
import Image from "next/image"
import {
  Activity,
  ArrowRight,
  BadgePercent,
  BarChart3,
  BrainCircuit,
  ExternalLink,
  FileText,
  Globe2,
  Layers,
  Link2,
  MousePointerClick,
  QrCode,
  Smartphone,
  Tag,
  TrainTrack,
} from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { FadeIn, StaggerContainer } from "@/components/animations"
import { MobileNav } from "@/components/mobile-nav"
import { ProductJourney } from "@/components/product-journey"
import { HeroSection } from "@/components/hero-section"
import { useAuthProfile } from "@/components/ui/userAuthProfile"



export default function LandingPage() {

const { isAuthenticated, profile, firstName } = useAuthProfile()
  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "/dashboard", label: "Dashboard" },
  ]

  return (
    <div className="flex min-h-screen flex-col">

<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className=" flex h-16 items-center justify-between px-4 md:px-8">
    {/* Logo & Brand */}
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="flex items-center gap-3"
  >
    <img
      src="https://ik.imagekit.io/2ncgakzvm/fontbolt%20(3).png?updatedAt=1757440478189"
      alt="shrl.me logo"
      className="h-8 object-contain"
    />
  </motion.div>


    {/* Main navigation */}
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="hidden md:flex gap-8 lg:gap-10"
    >
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </motion.nav>

    {/* Actions */}
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-1 md:gap-4"
    >
      <div className="hidden md:block">
        <ThemeToggle />
      </div>

      {/* User Profile or Auth */}
      {isAuthenticated ? (
        <div className="hidden md:flex items-center">
          {profile ? (
            <img
              src={profile}
              alt="Profile"
              className="h-9 w-9 rounded-full object-cover border border-gray-300"
            />
          ) : (
            <div className="h-9 w-9 rounded-full flex items-center justify-center bg-primary/20 text-lg font-bold text-primary uppercase">
              {firstName ? firstName[0] : "U"}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <Link
              href="/login"
              className="text-base font-normal text-muted-foreground hover:text-foreground transition-colors px-3"
            >
              Log in
            </Link>
          </div>
          <div className="hidden md:block">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button asChild>
                <Link href="/signup">Sign up free</Link>
              </Button>
            </motion.div>
          </div>
        </>
      )}

      <MobileNav links={navLinks} />
    </motion.div>
  </div>
</header>

      <main className="flex-1">
        {/* New Hero Section */}
        <HeroSection />

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="px-4 md:px-6">
            <FadeIn direction="up" className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg gradient-primary px-3 py-1 text-sm">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Everything you need in one place
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides powerful tools to help you manage your links, forms, and bio pages with detailed
                  analytics.
                </p>
              </div>
            </FadeIn>
            <StaggerContainer className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <motion.div className="flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm gradient-card-hover hover-lift">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Link2 className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Link Shortening</h3>
                  <p className="text-muted-foreground">
                    Shorten URLs and track performance metrics like clicks, location, device type, and UTM parameters.
                  </p>
                </div>
              </motion.div>
                            <motion.div className="flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm gradient-card-hover hover-lift">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Tag className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Branded Links</h3>
                  <p className="text-muted-foreground">
                    Create custom branded short links to boost trust, improve recognition, and strengthen marketing impact.
                  </p>
                </div>
              </motion.div>
                            <motion.div className="flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm gradient-card-hover hover-lift">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">UTM Tracking</h3>
                  <p className="text-muted-foreground">
                    Add UTM parameters and track campaign sources, mediums, and performance to optimize marketing efforts
                  </p>
                </div>
              </motion.div>
                            <motion.div className="flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm gradient-card-hover hover-lift">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Globe2 className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Geographical Insight</h3>
                  <p className="text-muted-foreground">
                    Gain geographic insights to analyze location-based engagement and improve regional targeting for better conversions
                  </p>
                </div>
              </motion.div>
<motion.div className="flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm gradient-card-hover hover-lift">
  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
    <QrCode className="h-6 w-6 text-primary" />
  </div>
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <h3 className="text-xl font-bold">Qr code</h3>
    </div>
    <p className="text-muted-foreground">
      Effortlessly create custom, ready-to-scan QR codes tailored to your brand, featuring your logo along with  detail analytics
    </p>
  </div>
</motion.div>

              <motion.div className="flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm gradient-card-hover hover-lift">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
<div className="flex items-center gap-2">
      <h3 className="text-xl font-bold">Link-in-Bio</h3>
      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
        Coming soon
      </span>
    </div>
                  <p className="text-muted-foreground">
                    Create a single bio landing page that contains multiple links and content for your social media profiles.
                  </p>
                </div>
              </motion.div>
            </StaggerContainer>
          </div>
        </section>

        {/* Product Journey Timeline Section */}
        <section id="how-it-works">
          <ProductJourney />
        </section>
<section className="w-full py-12 md:py-24 lg:py-32">
  <div className="px-4 md:px-6">
    <FadeIn
      direction="up"
      className="flex flex-col items-center justify-center space-y-4 text-center"
    >
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
          <span className="gradient-text">Powerful Analytics</span>
        </h2>
        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Gain valuable insights into your audience with our comprehensive analytics dashboard.
        </p>
      </div>
    </FadeIn>

    {/* Centered Section */}
    <div className="mx-auto flex max-w-3xl justify-center py-12">
      <FadeIn direction="up" className="w-full justify-center">
        <ul className="grid gap-8">
          <motion.li
            className="flex items-start gap-4"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <MousePointerClick className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-medium">Total Clicks</h4>
              <p className="text-sm text-muted-foreground">
                Track the total number of clicks on your shortened links over time.
              </p>
            </div>
          </motion.li>

          <motion.li
            className="flex items-start gap-4"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-medium">Geographic Insights</h4>
              <p className="text-sm text-muted-foreground">
                See where your audience is located with country and region-based analytics.
              </p>
            </div>
          </motion.li>

          <motion.li
            className="flex items-start gap-4"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Smartphone className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-medium">Device Breakdown</h4>
              <p className="text-sm text-muted-foreground">
                Understand which devices your audience uses to access your content.
              </p>
            </div>
          </motion.li>

          <motion.li
            className="flex items-start gap-4"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <ExternalLink className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-medium">UTM Parameter Tracking</h4>
              <p className="text-sm text-muted-foreground">
                Track campaign performance with detailed UTM parameter analytics.
              </p>
            </div>
          </motion.li>
        </ul>
      </FadeIn>
    </div>
  </div>
</section>


        <section className="w-full py-12 md:py-16 bg-muted/30">
          <div className="px-4 md:px-6">
            <FadeIn direction="up" className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tighter md:text-3xl/tight">Free Forever</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-lg">
                  shrl.me is completely free to use. No hidden fees, no
                  premium tiers – just powerful link management for everyone.
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="pt-4">
                  <Button size="lg" className="gradient-primary" asChild>
                    <Link href="/login">
                      Get Started Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background">
        <div className="flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            <p className="text-sm leading-loose text-muted-foreground md:text-left">
              &copy; {new Date().getFullYear()} Shrl.me. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
