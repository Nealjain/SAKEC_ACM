import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import AnimatedPreloader from "@/components/animated-preloader"
import FaultyTerminal from "@/components/faulty-terminal"
import LenisScroll from "@/components/lenis-scroll"
import ScrollToTop from "@/components/scroll-to-top"

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="bg-black text-white" suppressHydrationWarning>
        <div className="fixed inset-0 z-0 pointer-events-none">
          <FaultyTerminal
            scale={1.2}
            gridMul={[2, 1]}
            digitSize={1.8}
            timeScale={0.5}
            pause={false}
            scanlineIntensity={0.3}
            glitchAmount={0.5}
            flickerAmount={0.3}
            noiseAmp={0.8}
            chromaticAberration={0}
            dither={0}
            curvature={0}
            tint="#8b5cf6"
            mouseReact={true}
            mouseStrength={0.8}
            pageLoadAnimation={true}
            brightness={0.5}
          />
        </div>
        <AnimatedPreloader />
        <ScrollToTop />
        <Navigation />
        <LenisScroll>
          <div className="relative z-10">
            <main className="min-h-screen pointer-events-auto">{children}</main>
            <Footer />
          </div>
        </LenisScroll>
      </body>
    </html>
  )
}
