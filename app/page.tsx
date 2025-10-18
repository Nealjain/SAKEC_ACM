import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Code2, Rocket, Trophy, Sparkles } from "lucide-react"
import HeroParallaxDemo from "@/components/hero-parallax-demo"
import StickyScrollRevealDemo from "@/components/sticky-scroll-reveal-demo"
import HeroHighlightDemo from "@/components/hero-highlight-demo"

export default function HomePage() {
  return (
    <div className="text-white relative">
      {/* Hero Parallax Section */}
      <section className="relative z-10">
        <HeroParallaxDemo />
      </section>

      {/* Features Section - Sticky Scroll */}
      <section className="snap-section py-10 md:py-20 px-4 relative z-10 min-h-screen">
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-8 md:mb-12 px-4">
            <div className="inline-block mb-3 md:mb-4">
              <span className="text-xs md:text-sm font-semibold tracking-wider text-gray-400 uppercase">
                What We Offer
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-6 text-white">
              Empowering Future Tech Leaders
            </h2>
            <p className="text-sm md:text-base lg:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Join a vibrant community of innovators, learners, and creators shaping the future of technology
            </p>
          </div>

          <StickyScrollRevealDemo />
        </div>
      </section>

      {/* Why Join Section with Hero Highlight */}
      <section className="py-10 md:py-20 relative z-10">
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <HeroHighlightDemo />
          
          <div className="mt-12 md:mt-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-4">
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 hover:border-blue-500/40 hover:bg-white/10 transition-colors">
                <Code2 className="w-6 h-6 md:w-8 md:h-8 text-blue-400 mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-bold mb-1 md:mb-2">Hands-on Projects</h3>
                <p className="text-gray-400 text-xs md:text-sm">Build real-world applications and gain practical experience</p>
              </div>

              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 hover:border-purple-500/40 hover:bg-white/10 transition-colors">
                <Rocket className="w-6 h-6 md:w-8 md:h-8 text-purple-400 mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-bold mb-1 md:mb-2">Career Growth</h3>
                <p className="text-gray-400 text-xs md:text-sm">Access internships and job opportunities from top companies</p>
              </div>

              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 hover:border-pink-500/40 hover:bg-white/10 transition-colors">
                <Trophy className="w-6 h-6 md:w-8 md:h-8 text-pink-400 mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-bold mb-1 md:mb-2">Competitions</h3>
                <p className="text-gray-400 text-xs md:text-sm">Participate in coding contests and win exciting prizes</p>
              </div>

              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 hover:border-orange-500/40 hover:bg-white/10 transition-colors">
                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-orange-400 mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-bold mb-1 md:mb-2">Innovation</h3>
                <p className="text-gray-400 text-xs md:text-sm">Turn your ideas into reality with our support and resources</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-20 px-4 pb-20 md:pb-32 relative z-10">
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]"></div>
        
        <div className="max-w-5xl mx-auto relative">
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 md:p-12 lg:p-16 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-gradient-x"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Ready to Start Your Journey?
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-8 md:mb-10 max-w-2xl mx-auto">
                Join hundreds of students who are already building their future in tech. Your journey starts here.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-black hover:bg-gray-200 text-base md:text-lg px-6 md:px-8">
                  <Link href="/contact">Join Now</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black text-base md:text-lg px-6 md:px-8">
                  <Link href="/events">View Events</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
