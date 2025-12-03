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
    const targetFPS = 24; // Reduced to 24 FPS for smoother, more cinematic feel
    const frameInterval = 1000 / targetFPS;

    // Create persistent character grid for smooth transitions
    const gridSize = 25 * settings.scale;
    const cols = Math.ceil(canvas.width / gridSize);
    const rows = Math.ceil(canvas.height / gridSize);
    
    // Store character states for smooth transitions
    const charGrid: { char: string; opacity: number; targetOpacity: number; phase: number }[][] = [];
    for (let i = 0; i < cols; i++) {
      charGrid[i] = [];
      for (let j = 0; j < rows; j++) {
        charGrid[i][j] = {
          char: chars[Math.floor(Math.random() * chars.length)],
          opacity: Math.random() * 0.3,
          targetOpacity: Math.random() * 0.8,
          phase: Math.random() * Math.PI * 2
        };
      }
    }

    // Draw function
    const draw = (currentTime: number) => {
      const deltaTime = currentTime - lastFrameTime;
      
      // Throttle to target FPS
      if (deltaTime < frameInterval) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }
      
      lastFrameTime = currentTime - (deltaTime % frameInterval);
      
      // Clear canvas with fade effect for smoother transitions
      ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Set text properties
      ctx.font = `${settings.digitSize * 10}px monospace`;
      
      // Draw characters with smooth transitions
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const cell = charGrid[i][j];
          
          // Smooth opacity transition
          const opacityDiff = cell.targetOpacity - cell.opacity;
          cell.opacity += opacityDiff * 0.05; // Smooth interpolation
          
          // Occasionally change target opacity for variation
          if (Math.random() < 0.01) {
            cell.targetOpacity = Math.random() * 0.8 * settings.brightness;
          }
          
          // Occasionally change character for subtle variation
          if (Math.random() < 0.005) {
            cell.char = chars[Math.floor(Math.random() * chars.length)];
          }
          
          // Position with very subtle wave motion
          const x = i * gridSize + Math.sin(time * 0.05 + cell.phase) * settings.noiseAmp * 0.5;
          const y = j * gridSize + Math.cos(time * 0.05 + cell.phase + Math.PI / 4) * settings.noiseAmp * 0.5;
          
          // Apply tint with smooth opacity
          ctx.fillStyle = settings.tint;
          ctx.globalAlpha = Math.max(0, Math.min(1, cell.opacity));
          
          // Draw character
          ctx.fillText(cell.char, x, y);
        }
      }
      
      // Scanlines effect - very subtle
      if (settings.scanlineIntensity > 0) {
        ctx.globalAlpha = settings.scanlineIntensity * 0.2;
        for (let i = 0; i < canvas.height; i += 5) {
          ctx.fillStyle = '#000';
          ctx.fillRect(0, i, canvas.width, 1);
        }
      }
      
      // Update time slowly for smooth motion
      time += 0.05 * settings.timeScale;
      
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