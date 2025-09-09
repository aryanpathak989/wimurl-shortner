"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthProfile } from "@/components/ui/userAuthProfile";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link2 } from "lucide-react";

export default function PrivacyPage() {
        const { isAuthenticated, profile, firstName } = useAuthProfile()
          const navLinks = [
            { href: "#features", label: "Features" },
            { href: "#how-it-works", label: "How It Works" },
            { href: "/dashboard", label: "Dashboard" },
          ]
  return (
    <>
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="container flex h-16 items-center justify-between px-4 md:px-8">
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
        className="w-full max-w-3xl bg-muted/80 rounded-2xl p-8 shadow-lg"
      >
        <h1 className="text-4xl font-bold text-primary mb-4 text-center">Privacy Policy</h1>
        <p className="mb-6  text-center">
          Last updated: <span className="font-medium">September 1, 2025</span>
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">1. Information We Collect</h2>
          <p className="">
            We collect basic account information (such as your email address and authentication provider) to enable your login and personalize your experience. We do not access your private link content.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">2. How We Use Information</h2>
          <p className="">
            Information is used to provide and improve our services, maintain security, and communicate important updates. We never sell your personal data to third parties.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">3. Cookies & Analytics</h2>
          <p className="">
            We use minimal, privacy-friendly cookies and analytics strictly to understand platform usage and enhance performance.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">4. Data Security</h2>
          <p className="">
            We implement industry-standard security measures to protect your account and data. However, no method of internet transmission is 100% secure.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">5. Your Rights</h2>
          <p className="">
            You may request account deletion or correction of your information at any time. Contact us via support for data requests.
          </p>
        </section>
        
        <div className="text-sm mt-10 text-center text-foreground/70">
          Have questions? Check our <Link href="/terms" className="underline decoration-dotted underline-offset-4 text-primary font-medium">Terms & Conditions</Link>.
        </div>
      </motion.div>
    </div>
    </>
  );
}
