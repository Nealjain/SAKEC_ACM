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
  const mobileScale = isMobile ? 0.5 : 1;
  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4 * mobileScale]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5 * mobileScale]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6 * mobileScale]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8 * mobileScale]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9 * mobileScale]);

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  return (
    <div ref={container} className="relative h-[200vh] md:h-[300vh]" style={{ position: 'relative' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {images.map(({ src, alt }, index) => {
          const scale = prefersReducedMotion ? undefined : scales[index % scales.length];
          return (
            <motion.div
              key={index}
              style={{
                scale: prefersReducedMotion ? 1 : scale,
                transformOrigin: 'center center'
              }}
              transition={{
                type: "tween",
                ease: "linear",
                duration: 0
              }}
              className={`absolute top-0 flex h-full w-full items-center justify-center ${index === 1
                  ? '[&>div]:!-top-[20vh] md:[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] md:[&>div]:!h-[30vh] [&>div]:!w-[40vw] md:[&>div]:!w-[35vw]'
                  : ''
                } ${index === 2
                  ? '[&>div]:!-top-[5vh] md:[&>div]:!-top-[10vh] [&>div]:!-left-[15vw] md:[&>div]:!-left-[25vw] [&>div]:!h-[35vh] md:[&>div]:!h-[45vh] [&>div]:!w-[25vw] md:[&>div]:!w-[20vw]'
                  : ''
                } ${index === 3
                  ? '[&>div]:!left-[20vw] md:[&>div]:!left-[27.5vw] [&>div]:!h-[20vh] md:[&>div]:!h-[25vh] [&>div]:!w-[30vw] md:[&>div]:!w-[25vw]'
                  : ''
                } ${index === 4
                  ? '[&>div]:!top-[20vh] md:[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[20vh] md:[&>div]:!h-[25vh] [&>div]:!w-[25vw] md:[&>div]:!w-[20vw]'
                  : ''
                } ${index === 5
                  ? '[&>div]:!top-[20vh] md:[&>div]:!top-[27.5vh] [&>div]:!-left-[15vw] md:[&>div]:!-left-[22.5vw] [&>div]:!h-[20vh] md:[&>div]:!h-[25vh] [&>div]:!w-[35vw] md:[&>div]:!w-[30vw]'
                  : ''
                } ${index === 6
                  ? '[&>div]:!top-[15vh] md:[&>div]:!top-[22.5vh] [&>div]:!left-[22vw] md:[&>div]:!left-[25vw] [&>div]:!h-[12vh] md:[&>div]:!h-[15vh] [&>div]:!w-[20vw] md:[&>div]:!w-[15vw]'
                  : ''
                } `}
            >
              <div className="relative h-[22vh] w-[30vw] md:h-[25vh] md:w-[25vw] transform-gpu">
                <img
                  src={src}
                  alt={alt || `Parallax image ${index + 1}`}
                  className="h-full w-full object-cover rounded-md md:rounded-lg"
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  style={{
                    willChange: isMobile ? 'auto' : 'transform',
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
