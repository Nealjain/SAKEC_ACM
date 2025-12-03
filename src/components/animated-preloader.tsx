"use client"

import { useEffect, useState } from "react";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";

const loadingStates = [
  { text: "Initializing SAKEC ACM" },
  { text: "Loading resources" },
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

    // Auto-hide after 3 seconds
    const timer = setTimeout(() => {
      setLoading(false)
      sessionStorage.setItem('hasLoaded', 'true')
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return <MultiStepLoader loadingStates={loadingStates} loading={loading} duration={1000} loop={false} />;
};

export default AnimatedPreloader;