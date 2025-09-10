"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Link2, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuthProfile } from "./ui/userAuthProfile"
import { logout } from "@/api/user"
import toast from "./toast"

interface MobileNavProps {
  links: {
    href: string
    label: string
  }[]
}

export function MobileNav({ links }: MobileNavProps) {
  const { isAuthenticated, profile, firstName } = useAuthProfile()
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()

  // Close the mobile nav when route changes
  React.useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent scrolling when mobile nav is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  return (
    <div className="md:hidden bg-muted mr-3">
      <Button
        className="relative z-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>


      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed top-0 right-0 z-40 w-full bg-muted p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
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
            <div className="flex h-full flex-col mt-6">
              <nav className="mt-8 flex flex-col gap-6">
                {links.map((link) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 1 }}
                    transition={{ delay: 0.1 }}
                    className="border-b border-border pb-2"
                  >
                    <Link
                      href={link.href}
                      className={`text-lg font-medium ${
                        pathname === link.href ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              {
                !isAuthenticated ?
                  <div className="mt-8 flex flex-col gap-4">
                  <Button asChild  className="w-full">
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button asChild className="w-full gradient-primary">
                    <Link href="/login">Sign up free</Link>
                  </Button>
                  {/* <p className="text-xs text-center text-muted-foreground mt-2">
                    Free forever – supported by relevant ads
                  </p> */}
                                </div>
                  :
                  <>
                                      <Button asChild className="w-full gradient-primary mt-6" onClick={()=>{
                                        try{
                                          logout()
                                          window.location.reload()
                                        }
                                        catch(err){
                                          console.log(err)
                                        }
                                      }}>
                    <span>Logout</span>
                  </Button>
                  </>

              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
