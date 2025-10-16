"use client"

import { useRef, useEffect } from "react";

interface TerminalBackgroundProps {
  opacity?: number;
  scale?: number;
  digitSize?: number;
  timeScale?: number;
  noiseAmp?: number;
  brightness?: number;
  scanlineIntensity?: number;
  curvature?: number;
  tint?: string;
  className?: string;
}

const TerminalBackground = ({
  opacity = 1.0, // Increased from 0.7 to 1.0 for better visibility
  scale = 1.5,
  digitSize = 2,
  timeScale = 0.5,
  noiseAmp = 1,
  brightness = 0.8, // Increased from 0.6 to 0.8
  scanlineIntensity = 0.5,
  curvature = 0.1,
  tint = '#4a00b4', // Purple tint to match ACM theme
  className = '',
}: TerminalBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Faulty Terminal effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
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
      scale,
      digitSize,
      timeScale,
      noiseAmp,
      brightness,
      scanlineIntensity,
      curvature,
      tint,
    };

    // Characters for the terminal effect
    const chars = "01";
    
    // Animation variables
    let time = 0;
    let animationFrameId: number;
    let lastFrameTime = 0;
    const targetFPS = 30; // Reduced from 60 to 30 FPS for better performance
    const frameInterval = 1000 / targetFPS;

    // Draw function
    const draw = (currentTime: number) => {
      const deltaTime = currentTime - lastFrameTime;
      
      // Throttle to target FPS
      if (deltaTime < frameInterval) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }
      
      lastFrameTime = currentTime - (deltaTime % frameInterval);
      
      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Set text properties
      ctx.font = `${settings.digitSize * 10}px monospace`;
      
      // Grid size - increased for fewer characters
      const gridSize = 20 * settings.scale; // Increased from 15 to 20
      const cols = Math.ceil(canvas.width / gridSize);
      const rows = Math.ceil(canvas.height / gridSize);
      
      // Draw characters - reduced density
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          // Skip some characters for better performance
          if (Math.random() > 0.7) continue;
          
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
      
      // Scanlines effect - simplified
      if (settings.scanlineIntensity > 0) {
        ctx.globalAlpha = settings.scanlineIntensity * 0.3;
        for (let i = 0; i < canvas.height; i += 4) { // Increased from 2 to 4
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
    animationFrameId = requestAnimationFrame(draw);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [scale, digitSize, timeScale, noiseAmp, brightness, scanlineIntensity, curvature, tint]);

  return (
    <>
      {/* Faulty Terminal background */}
      <canvas 
        ref={canvasRef} 
        className={`fixed inset-0 z-[-1] ${className}`}
        style={{ opacity }} 
      />

      {/* Overlay gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20 animate-gradient-x z-[-1]" />
      <div className="fixed inset-0 bg-gradient-to-tr from-black/50 via-transparent to-black/50 z-[-1]" />
    </>
  );
};

export default TerminalBackground;