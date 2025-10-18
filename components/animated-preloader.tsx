"use client"

import { useEffect, useState } from "react";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";

const loadingStates = [
  { text: "Initializing SAKEC ACM" },
  { text: "Loading community resources" },
  { text: "Preparing tech events" },
  { text: "Setting up workshops" },
  { text: "Connecting with mentors" },
  { text: "Building your future" },
  { text: "Welcome to SAKEC ACM!" },
];

const AnimatedPreloader = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only show preloader on initial page load, not on navigation
    const hasLoaded = sessionStorage.getItem('hasLoaded')
    
    if (hasLoaded) {
      setLoading(false)
      return
    }

    // Auto-hide after all steps complete (7 steps * 800ms = 5.6 seconds)
    const timer = setTimeout(() => {
      setLoading(false)
      sessionStorage.setItem('hasLoaded', 'true')
    }, 6000)

    return () => clearTimeout(timer)
  }, [])

  return <MultiStepLoader loadingStates={loadingStates} loading={loading} duration={800} loop={false} />;
};

export default AnimatedPreloader;