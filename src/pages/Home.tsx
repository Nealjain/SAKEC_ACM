import StickyScrollRevealDemo from "@/components/sticky-scroll-reveal-demo"
import HeroHighlightDemo from "@/components/hero-highlight-demo"
import ContainerScrollDemo from "@/components/container-scroll-demo"
import { GoogleGeminiHero } from "@/components/google-gemini-hero"
import { Feature } from "@/components/ui/feature-section-with-bento-grid"
import NewsletterSubscribe from "@/components/NewsletterSubscribe"

export default function Home() {
  return (
    <div className="text-gray-900 relative">
      {/* Hero Section with Google Gemini Effect */}
      <GoogleGeminiHero />

      {/* Features Section - Bento Grid */}
      <section className="relative z-20 pt-20 md:pt-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]"></div>
        
        <div className="relative">
          <Feature />
        </div>
      </section>

      {/* Sticky Scroll Section */}
      <section className="relative z-20 py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]"></div>

        <div className="container mx-auto px-4 relative">
          <StickyScrollRevealDemo />
        </div>
      </section>

      {/* Why Join Section with Hero Highlight */}
      <section className="py-4 md:py-20 relative z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]"></div>

        <div className="container mx-auto relative">
          <HeroHighlightDemo />
        </div>
      </section>

      {/* CTA Section with Container Scroll */}
      <section className="relative z-10">
        <ContainerScrollDemo />
      </section>

      {/* Newsletter Section */}
      <section className="relative z-20 py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]"></div>
        
        <div className="container mx-auto px-4 relative">
          <NewsletterSubscribe />
        </div>
      </section>
    </div>
  )
}
