"use client";
import { motion } from "motion/react";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles } from "lucide-react";

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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-4xl leading-relaxed lg:leading-snug mx-auto mb-6">
            Your Gateway to{" "}
            <Highlight className="text-white dark:text-white">
              Tech Excellence
            </Highlight>
          </h2>
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
