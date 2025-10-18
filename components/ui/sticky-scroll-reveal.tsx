"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.1", "end 0.5"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  const linearGradients = [
    "linear-gradient(to bottom right, #06b6d4, #10b981)",
    "linear-gradient(to bottom right, #ec4899, #6366f1)",
    "linear-gradient(to bottom right, #f97316, #eab308)",
    "linear-gradient(to bottom right, #8b5cf6, #ec4899)",
  ];
  const [backgroundGradient, setBackgroundGradient] = useState(
    linearGradients[0]
  );

  useEffect(() => {
    setBackgroundGradient(linearGradients[activeCard % linearGradients.length]);
  }, [activeCard]);

  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  return (
    <div
      ref={ref}
      className="relative flex flex-col lg:flex-row gap-6 lg:gap-20 py-0 lg:py-10"
    >
      {/* Desktop Only - Scrolling text content */}
      <div className="hidden lg:block lg:w-1/2 space-y-32">
        {content.map((item, index) => (
          <div key={item.title + index} className="space-y-6">
            <motion.h2
              animate={{
                opacity: activeCard === index ? 1 : 0.3,
              }}
              transition={{ duration: 0.3 }}
              className="text-5xl font-bold text-white"
            >
              {item.title}
            </motion.h2>
            <motion.p
              animate={{
                opacity: activeCard === index ? 1 : 0.3,
              }}
              transition={{ duration: 0.3 }}
              className="text-xl text-slate-300 leading-relaxed"
            >
              {item.description}
            </motion.p>
          </div>
        ))}
      </div>

      {/* Desktop Only - Sticky visual card */}
      <div className="hidden lg:block lg:w-1/2">
        <div className="sticky top-32">
          <motion.div
            style={{ background: backgroundGradient }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={cn(
              "h-[500px] w-full overflow-hidden rounded-3xl shadow-2xl",
              contentClassName
            )}
          >
            {content[activeCard].content ?? null}
          </motion.div>
        </div>
      </div>

      {/* Mobile view - show all cards */}
      <div className="lg:hidden w-full space-y-8">
        {content.map((item, index) => (
          <div
            key={`mobile-${index}`}
            style={{
              background: linearGradients[index % linearGradients.length],
            }}
            className="h-[350px] w-full overflow-hidden rounded-3xl shadow-2xl"
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
};
