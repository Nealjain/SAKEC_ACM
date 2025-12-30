import { useScroll, useTransform, motion, useReducedMotion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface Image {
  src: string;
  alt?: string;
}

interface ZoomParallaxProps {
  /** Array of images to be displayed in the parallax effect max 7 images */
  images: Image[];
}

export function ZoomParallax({ images }: ZoomParallaxProps) {
  const container = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  // Reduced scale values for mobile to improve performance
  const mobileScale = isMobile ? 0.6 : 1;
  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4 * mobileScale]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5 * mobileScale]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6 * mobileScale]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8 * mobileScale]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9 * mobileScale]);

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  // Disable parallax on mobile for better performance
  if (isMobile || prefersReducedMotion) {
    return (
      <div className="relative py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.slice(0, 6).map(({ src, alt }, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={src}
                  alt={alt || `Gallery image ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={container} className="relative h-[300vh]" style={{ position: 'relative' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {images.map(({ src, alt }, index) => {
          const scale = scales[index % scales.length];
          return (
            <motion.div
              key={index}
              style={{ 
                scale,
                transformOrigin: 'center center'
              }}
              transition={{
                type: "tween",
                ease: "linear",
                duration: 0
              }}
              className={`absolute top-0 flex h-full w-full items-center justify-center ${
                index === 1
                  ? '[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]'
                  : ''
              } ${
                index === 2
                  ? '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]'
                  : ''
              } ${
                index === 3
                  ? '[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]'
                  : ''
              } ${
                index === 4
                  ? '[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]'
                  : ''
              } ${
                index === 5
                  ? '[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]'
                  : ''
              } ${
                index === 6
                  ? '[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]'
                  : ''
              } `}
            >
              <div className="relative h-[25vh] w-[25vw] transform-gpu">
                <img
                  src={src}
                  alt={alt || `Parallax image ${index + 1}`}
                  className="h-full w-full object-cover rounded-lg"
                  loading="eager"
                  decoding="async"
                  style={{ 
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                    perspective: 1000
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
