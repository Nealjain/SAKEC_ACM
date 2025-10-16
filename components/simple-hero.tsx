import Link from "next/link";
import { Button } from "@/components/ui/button";
import TypingEffect from "@/components/typing-effect";
import CarouselContainer from "@/components/carousel-container";

export const SimpleHero = () => {

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-60 items-center">
        {/* Left side - Text content */}
        <div className="text-center lg:text-left lg:pl-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent">
              SAKEC ACM
            </span>
            <span className="block text-gray-400 text-3xl md:text-4xl mt-2">
              Student Chapter
            </span>
          </h1>

          <TypingEffect />

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-gray-200"
            >
              <Link href="/events">Explore Events</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-black bg-transparent"
            >
              <Link href="/why-join">Join Us</Link>
            </Button>
          </div>
        </div>

        {/* Right side - Carousel */}
        <div className="relative h-[800px] w-full hidden lg:block">
          <CarouselContainer />
        </div>
      </div>
    </section>
  );
};