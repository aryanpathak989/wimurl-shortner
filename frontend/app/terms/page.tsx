"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link2 } from "lucide-react";
import { useAuthProfile } from "@/components/ui/userAuthProfile";

export default function TermsPage() {
      const { isAuthenticated, profile, firstName } = useAuthProfile()
        const navLinks = [
          { href: "#features", label: "Features" },
          { href: "#how-it-works", label: "How It Works" },
          { href: "/dashboard", label: "Dashboard" },
        ]

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="flex h-16 items-center justify-between px-4 md:px-8">
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
    <div className="flex min-h-screen flex-col items-center bg-background px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-3xl bg-muted/80  rounded-2xl p-8 shadow-lg"
      >
        <h1 className="text-4xl font-bold text-primary mb-4 text-center">Terms & Conditions</h1>
        <p className="mb-6 text-center">
          Last updated: <span className="font-medium">September 1, 2025</span>
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">1. Acceptance of Terms</h2>
          <p className="">
            By accessing or using shrl.me, you agree to abide by these terms and all applicable laws. If you do not accept these terms, please do not use the website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">2. User Responsibilities</h2>
          <p className="">
            You are responsible for safeguarding your account and links. Do not misuse the platform, perform unlawful activities, or violate others’ rights when using our service.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">3. Modification of Terms</h2>
          <p className="">
            We may update these terms at any time. We will notify users of significant changes by updating the date at the top and through app notifications.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">4. Intellectual Property</h2>
          <p className="">
            All content, code, and design elements of shrl.me are owned or licensed by us. You may not duplicate, distribute, or create derivative works without written permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">5. Limitation of Liability</h2>
          <p className="">
            We strive for a reliable service but do not guarantee error-free operation. shrl.me is provided &quot;as is&quot; and we disclaim liability for damages resulting from your use of the site.
          </p>
        </section>
        
        <div className="text-sm mt-10 text-center text-foreground/70">
          Questions? Read our <Link href="/privacy" className="underline decoration-dotted underline-offset-4 text-primary font-medium">Privacy Policy</Link>.
        </div>
      </motion.div>
    </div>
  </>);
}
