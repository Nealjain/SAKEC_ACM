"use client";

import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import Link from "next/link";

export default function TypewriterEffectDemo() {
  const words = [
    {
      text: "Your",
    },
    {
      text: "Gateway",
    },
    {
      text: "to",
    },
    {
      text: "Tech",
      className: "text-blue-500 dark:text-blue-500",
    },
    {
      text: "Excellence",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base mb-4">
        Empowering students through innovation and collaboration
      </p>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-8">
        <Link href="/why-join">
          <button className="w-40 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 border border-transparent text-white text-sm transition-colors">
            Join Now
          </button>
        </Link>
        <Link href="/contact">
          <button className="w-40 h-10 rounded-xl bg-white text-black border border-black hover:bg-gray-100 text-sm transition-colors">
            Contact Us
          </button>
        </Link>
      </div>
    </div>
  );
}
