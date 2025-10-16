import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import Preloader from "@/components/preloader"
import TerminalBackground from "@/components/terminal-background"

export const metadata: Metadata = {
  title: "SAKEC ACM Student Chapter",
  description: "Official website of SAKEC ACM Student Chapter - Empowering students through technology and innovation",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="bg-black text-white">
        <TerminalBackground />
        <Preloader />
        <div className="relative z-[1]">
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
