"use client";
import { motion } from "motion/react";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

export default function HeroHighlightDemo() {
  return (
    <HeroHighlight containerClassName="h-auto py-20 md:py-32 bg-transparent dark:bg-transparent">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="text-center"
        >
          <div className="inline-block mb-3 md:mb-4">
            <span className="text-xs md:text-sm font-semibold tracking-wider text-gray-400 uppercase">
              Why Choose ACM
            </span>
          </div>
          <div className="mb-6">
            <TypewriterEffectSmooth 
              words={[
                { text: "Your" },
                { text: "Gateway" },
                { text: "to" },
                { text: "Tech", className: "text-blue-500 dark:text-blue-500" },
                { text: "Excellence", className: "text-blue-500 dark:text-blue-500" },
              ]}
              className="justify-center"
            />
          </div>
          <p className="text-sm md:text-base lg:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
            SAKEC ACM Student Chapter is more than just a club—it's a launchpad
            for your tech career. We provide the tools, connections, and
            opportunities you need to succeed.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-black hover:bg-gray-200 group"
          >
            <Link href="/why-join">
              Learn More
              <Sparkles className="ml-2 w-4 h-4 group-hover:rotate-12 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </HeroHighlight>
  );
}
