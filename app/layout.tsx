import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Source_Sans_3 } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import AppLayout from "@/components/AppLayout"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair-display",
  weight: ["400", "700"],
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "SafeRoad SA - Making South African Roads Safer",
  description:
    "Report road hazards, request infrastructure improvements, and stay informed about traffic safety in your community.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* PWA-specific meta tags */}
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/pwa-192x192.png" />

        {/* Standard meta tags for SEO and sharing */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>SafeRoad SA</title>
        <meta name="description" content="Making South African Roads Safer Together." />
      </head>
      <body className={`font-sans ${playfairDisplay.variable} ${sourceSans.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppLayout>
            <Suspense fallback={null}>{children}</Suspense>
          </AppLayout>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
