"use client"
import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import TypingEffect from "@/components/typing-effect";
import Image from "next/image";

const ParallaxHero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Transform values for parallax effect
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  // Faulty Terminal effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Terminal effect settings
    const settings = {
      scale: 1.5,
      digitSize: 2,
      timeScale: 0.5,
      noiseAmp: 1,
      brightness: 0.6,
      scanlineIntensity: 0.5,
      curvature: 0.1,
      tint: '#4a00b4', // Purple tint to match ACM theme
    };

    // Characters for the terminal effect
    const chars = "01";
    
    // Animation variables
    let time = 0;
    let animationFrameId: number;

    // Draw function
    const draw = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Set text properties
      ctx.font = `${settings.digitSize * 10}px monospace`;
      
      // Grid size
      const gridSize = 15 * settings.scale;
      const cols = Math.ceil(canvas.width / gridSize);
      const rows = Math.ceil(canvas.height / gridSize);
      
      // Draw characters
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          // Random character
          const charIndex = Math.floor(Math.random() * chars.length);
          const char = chars[charIndex];
          
          // Position with noise
          const x = i * gridSize + Math.sin(time * 0.1 + i * 0.2) * settings.noiseAmp;
          const y = j * gridSize + Math.cos(time * 0.1 + j * 0.2) * settings.noiseAmp;
          
          // Opacity based on position and time
          const opacity = (Math.sin(time * 0.2 + i * 0.1 + j * 0.1) + 1) * 0.5 * settings.brightness;
          
          // Apply tint
          ctx.fillStyle = settings.tint;
          ctx.globalAlpha = opacity;
          
          // Draw character
          ctx.fillText(char, x, y);
        }
      }
      
      // Scanlines effect
      if (settings.scanlineIntensity > 0) {
        ctx.globalAlpha = settings.scanlineIntensity * 0.3;
        for (let i = 0; i < canvas.height; i += 2) {
          ctx.fillStyle = '#000';
          ctx.fillRect(0, i, canvas.width, 1);
        }
      }
      
      // Update time
      time += 0.1 * settings.timeScale;
      
      // Loop animation
      animationFrameId = requestAnimationFrame(draw);
    };
    
    // Start animation
    draw();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-[150vh] flex items-center justify-center overflow-hidden"
    >
      {/* Faulty Terminal background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0"
        style={{ opacity: 0.7 }} // Adjust opacity as needed
      />

      {/* Overlay gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20 animate-gradient-x z-20" />
      <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-black/50 z-20" />

      {/* Content */}
      <motion.div
        style={{ y: textY }}
        className="relative z-30 max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      >
        {/* Left side - Text content */}
        <div className="text-center lg:text-left">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(147,51,234,0.6)] filter brightness-110 [text-shadow:0_0_30px_rgba(99,102,241,0.4),0_0_60px_rgba(147,51,234,0.3)]">
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

        {/* Right side - Images */}
        <div className="relative h-[900px] w-full hidden lg:block">
          <motion.div
            className="absolute top-0 right-0 w-[500px] h-[400px] rounded-lg overflow-hidden shadow-xl"
            style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
          >
            <Image
              src="/hackathon-innovation-challenge.png"
              alt="Hackathon"
              fill
              className="object-cover"
            />
          </motion.div>
          <motion.div
            className="absolute bottom-0 left-0 w-[500px] h-[400px] rounded-lg overflow-hidden shadow-xl"
            style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]) }}
          >
            <Image
              src="/cybersecurity-lecture.png"
              alt="Cybersecurity"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-teal-500/10 to-green-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
    </section>
  );
};

export default ParallaxHero;