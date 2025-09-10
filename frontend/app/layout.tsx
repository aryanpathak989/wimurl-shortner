import type React from "react"
import type { Metadata, Viewport } from "next"
import { Manrope } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Toast from '@/components/toast'
import ReactQuery from "@/lib/react-query"

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shrl - Shorten, Track, Engage",
  description: "Create short links, build forms, and design bio pages with powerful analytics.",
  keywords: [
    "URL shortener",
    "link tracker",
    "bio link tool",
    "custom short links",
    "form builder",
    "link analytics",
    "Shrl",
  ],
  applicationName: "Shrl",
  authors: [{ name: "Shrl Team", url: "https://shrl.me" }],
  creator: "Shrl",
  publisher: "Shrl",
  metadataBase: new URL("https://shrl.me"),
  alternates: { canonical: "https://shrl.me" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "https://shrl.me",
    title: "Shrl - Shorten, Track, Engage",
    description: "Create short links, build forms, and design bio pages with powerful analytics.",
    siteName: "Shrl",
    images: [
      {
        url: "https://ik.imagekit.io/2ncgakzvm/fontbolt%20(3).png?updatedAt=1757440478189",
        width: 1200,
        height: 630,
        alt: "Shrl - Shorten, Track, Engage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@shrl",
    creator: "@shrl",
    title: "Shrl - Shorten, Track, Engage",
    description: "Create short links, build forms, and design bio pages with powerful analytics.",
    images: ["https://ik.imagekit.io/2ncgakzvm/fontbolt%20(3).png?updatedAt=1757440478189"],
  },
  icons: {
    icon: "https://ik.imagekit.io/2ncgakzvm/fontbolt%20(3).png?updatedAt=1757440478189",
    apple: "https://ik.imagekit.io/2ncgakzvm/fontbolt%20(3).png?updatedAt=1757440478189",
  },
  manifest: "/site.webmanifest",
  category: "technology",
};

// ✅ Move viewport + themeColor here
export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Shrl",
              url: "https://shrl.me",
              logo: "https://ik.imagekit.io/2ncgakzvm/fontbolt%20(3).png?updatedAt=1757440478189",
              sameAs: [
                "https://twitter.com/shrl",
                "https://www.linkedin.com/company/shrl",
              ],
            }),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              url: "https://shrl.me",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://shrl.me/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: "Shrl - Shorten, Track, Engage",
              description:
                "Create short links, build forms, and design bio pages with powerful analytics.",
              brand: { "@type": "Organization", name: "Shrl" },
              offers: {
                "@type": "Offer",
                url: "https://shrl.me",
                priceCurrency: "USD",
                price: "0.00",
                availability: "https://schema.org/InStock",
              },
            }),
          }}
        />
      </head>
      <body className={`${manrope.className} overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ReactQuery>
            <Toast>{children}</Toast>
          </ReactQuery>
        </ThemeProvider>
      </body>
    </html>
  )
}
