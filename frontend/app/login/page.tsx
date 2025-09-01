"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Link2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuthProfile } from "@/components/ui/userAuthProfile";
import { MobileNav } from "@/components/mobile-nav";

export default function AuthProvidersOnly() {
  const { isAuthenticated, profile, firstName } = useAuthProfile()
    const navLinks = [
      { href: "#features", label: "Features" },
      { href: "#how-it-works", label: "How It Works" },
      { href: "/dashboard", label: "Dashboard" },
    ]

  const [loading, setLoading] = useState<"google" | "microsoft" | null>(null);

  const handleGoogleSignup = async () => {
    try {
      setLoading("google");
      const response = await fetch(
        "http://localhost:4000/user/auth/google/url",
        { credentials: "include" }
      );
      const data = await response.json();
      if (!data?.url) throw new Error("No URL received from server");
      window.location.href = data.url;
    } catch (err) {
      console.error("Error during Google sign in:", err);
      setLoading(null);
    }
  };

  const handleMicrosoftSignup = async () => {
    try {
      setLoading("microsoft");
      const response = await fetch(
        "http://localhost:4000/user/auth/microsoft/url",
        { credentials: "include" }
      );
      const data = await response.json();
      if (!data?.url) throw new Error("No URL received from server");
      window.location.href = data.url;
    } catch (err) {
      console.error("Error during Microsoft sign in:", err);
      setLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="container flex h-16 items-center justify-between px-4 md:px-8">
    {/* Logo & Brand */}
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-3"
    >
      <Link2 className="h-7 w-7 text-primary" />
      <span className="text-2xl font-bold tracking-tight text-foreground">shrl.me</span>
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

      {/* Body */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Visual Side */}
        <div className="relative hidden w-full md:block md:w-1/2  bg-muted/90">
          <Image
            src="https://sustvest-web-assets.s3.ap-south-1.amazonaws.com/home-page/clip-message-sent+1.svg"
            alt="Auth visual"
            fill
            priority
            className="object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-background/10 to-background/0" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-md rounded-2xl border bg-background/80 p-6 shadow-lg backdrop-blur"
            >
              <p className="text-muted-foreground">
                Centralize, track, and share all your important links effortlessly — securely and privately
              </p>
              <div className="mt-3 text-sm text-muted-foreground/80">
              Your links, your rules. We just keep them safe and speedy.
              </div>
            </motion.div>
          </div>
        </div>

        {/* Auth Card */}
        <div className="flex w-full items-center justify-center px-4 py-8 md:w-1/2 md:p-8 h-[80vh]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-md"
          >
            <Card className="border-none shadow-xl">
              <CardHeader className="space-y-2">
                <CardTitle className="text-2xl">
                  sign up or sign in
                </CardTitle>
                <CardDescription>
                  continue with your work account to get started
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Google */}
                <Button
                  variant="outline"
                  className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl text-base"
                  onClick={handleGoogleSignup}
                  disabled={loading !== null}
                >
                  {loading === "google" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      aria-hidden="true"
                    >
                      <path
                        fill="#EA4335"
                        d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                      />
                      <path
                        fill="#34A853"
                        d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
                      />
                      <path
                        fill="#4A90E2"
                        d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
                      />
                    </svg>
                  )}
                  <span className="leading-none">continue with google</span>
                </Button>

                {/* Microsoft */}
                <Button
                  variant="outline"
                  className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl text-base bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={handleMicrosoftSignup}
                  disabled={loading !== null}
                >
                  {loading === "microsoft" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path fill="#F25022" d="M11.5 11.5H1V1h10.5v10.5z" />
                      <path fill="#7FBA00" d="M23 11.5H12.5V1H23v10.5z" />
                      <path fill="#00A4EF" d="M11.5 23H1V12.5h10.5V23z" />
                      <path fill="#FFB900" d="M23 23H12.5V12.5H23V23z" />
                    </svg>
                  )}
                  <span className="leading-none">continue with microsoft</span>
                </Button>

                {/* Lightweight hint */}
                <p className="pt-2 text-center text-xs text-muted-foreground">
                  by continuing, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="underline decoration-dotted underline-offset-4"
                  >
                    terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="underline decoration-dotted underline-offset-4"
                  >
                    privacy policy
                  </Link>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
