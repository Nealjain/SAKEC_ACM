"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "motion/react";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";

// TO ADD YOUR PHOTOS: Edit the 'products' array in components/hero-parallax-demo.tsx
// Each product needs: title, link (URL), and thumbnail (image URL)

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const [isMobile, setIsMobile] = React.useState(false);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };
  
  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, isMobile ? 500 : 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, isMobile ? -500 : -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [isMobile ? -300 : -700, isMobile ? 200 : 500]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="h-[300vh] py-6 md:py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      {/* Solid background overlay to hide terminal effect */}
      <div className="absolute inset-0 bg-black z-0"></div>
      
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className="relative z-10"
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-4 md:space-x-20 mb-6 md:mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-6 md:mb-20 space-x-4 md:space-x-20">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-4 md:space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="container mx-auto relative py-6 md:py-40 px-4 w-full left-0 top-0 z-20">
      <h1 className="text-4xl md:text-7xl font-bold text-white mb-3 md:mb-6">
        SAKEC ACM <br /> Student Chapter
      </h1>
      <div className="max-w-2xl text-base md:text-lg text-neutral-200">
        <div className="flex flex-wrap items-center gap-2">
          <span>Empowering students through</span>
          <LayoutTextFlip
            text=""
            words={["Technology", "Innovation", "Collaboration", "Learning"]}
            duration={2500}
          />
        </div>
        <p className="mt-2 md:mt-3 text-sm md:text-base text-neutral-300 leading-relaxed">
          Building tomorrow's tech leaders with hands-on experience and community-driven growth
        </p>
      </div>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-48 w-40 md:h-96 md:w-[30rem] relative shrink-0"
    >
      <a
        href={product.link}
        className="block group-hover/product:shadow-2xl"
      >
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-center absolute h-full w-full inset-0 rounded-lg md:rounded-xl"
          alt={product.title}
        />
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none rounded-lg md:rounded-xl"></div>
      <h2 className="absolute bottom-2 left-2 md:bottom-4 md:left-4 opacity-0 group-hover/product:opacity-100 text-white text-xs md:text-base">
        {product.title}
      </h2>
    </motion.div>
  );
};
