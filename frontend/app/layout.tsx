import type React from "react"
import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Toast from '@/components/toast'
import ReactQuery from "@/lib/react-query"

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Add weights you need
  variable: "--font-manrope",           // Optional: for CSS variable usage
  display: "swap",                      // Optional: improves loading
});

export const metadata: Metadata = {
  title: "Shrl - Shorten, Track, Engage",
  description: "Create short links, build forms, and design bio pages with powerful analytics",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.className} overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ReactQuery>
            <Toast>
              {children}
            </Toast>
          </ReactQuery>
        </ThemeProvider>
      </body>
    </html>
  )
}
