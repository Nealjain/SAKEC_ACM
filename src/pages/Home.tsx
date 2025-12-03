import { Code2, Rocket, Trophy, Sparkles } from "lucide-react"
import StickyScrollRevealDemo from "@/components/sticky-scroll-reveal-demo"
import HeroHighlightDemo from "@/components/hero-highlight-demo"
import ContainerScrollDemo from "@/components/container-scroll-demo"
import { GoogleGeminiHero } from "@/components/google-gemini-hero"

export default function Home() {
  return (
    <div className="text-gray-900 relative">
      {/* Hero Section with Google Gemini Effect */}
      <GoogleGeminiHero />

      {/* Features Section - Sticky Scroll */}
      <section className="relative z-20 pt-40 pb-2 md:py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]"></div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-4 md:mb-12">
            <div className="inline-block mb-2 md:mb-4">
              <span className="text-xs md:text-sm font-semibold tracking-wider text-gray-400 uppercase">
                What We Offer
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-6 text-gray-900 px-4">
              Empowering Future Tech Leaders
            </h2>
            <p className="text-xs md:text-base lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Join a vibrant community of innovators, learners, and creators shaping the future of technology
            </p>
          </div>

          <StickyScrollRevealDemo />
        </div>
      </section>

      {/* Why Join Section with Hero Highlight */}
      <section className="py-4 md:py-20 relative z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]"></div>

        <div className="container mx-auto relative">
          <HeroHighlightDemo />

          <div className="mt-6 md:mt-16 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              <div className="backdrop-blur-xl bg-white/40 border border-black/5 rounded-xl md:rounded-2xl p-4 md:p-6 hover:border-blue-500/40 hover:bg-white/60 transition-colors shadow-sm">
                <Code2 className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-bold mb-1 md:mb-2 text-gray-900">Hands-on Projects</h3>
                <p className="text-gray-600 text-xs md:text-sm">Build real-world applications and gain practical experience</p>
              </div>

              <div className="backdrop-blur-xl bg-white/40 border border-black/5 rounded-xl md:rounded-2xl p-4 md:p-6 hover:border-purple-500/40 hover:bg-white/60 transition-colors shadow-sm">
                <Rocket className="w-6 h-6 md:w-8 md:h-8 text-purple-600 mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-bold mb-1 md:mb-2 text-gray-900">Career Growth</h3>
                <p className="text-gray-600 text-xs md:text-sm">Access internships and job opportunities from top companies</p>
              </div>

              <div className="backdrop-blur-xl bg-white/40 border border-black/5 rounded-xl md:rounded-2xl p-4 md:p-6 hover:border-pink-500/40 hover:bg-white/60 transition-colors shadow-sm">
                <Trophy className="w-6 h-6 md:w-8 md:h-8 text-pink-600 mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-bold mb-1 md:mb-2 text-gray-900">Competitions</h3>
                <p className="text-gray-600 text-xs md:text-sm">Participate in coding contests and win exciting prizes</p>
              </div>

              <div className="backdrop-blur-xl bg-white/40 border border-black/5 rounded-xl md:rounded-2xl p-4 md:p-6 hover:border-orange-500/40 hover:bg-white/60 transition-colors shadow-sm">
                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-orange-600 mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-bold mb-1 md:mb-2 text-gray-900">Innovation</h3>
                <p className="text-gray-600 text-xs md:text-sm">Turn your ideas into reality with our support and resources</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Container Scroll */}
      <section className="relative z-10">
        <ContainerScrollDemo />
      </section>
    </div>
  )
}
