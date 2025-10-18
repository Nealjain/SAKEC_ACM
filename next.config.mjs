/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only enable static export for production builds
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  
  // Add trailing slash for better Apache compatibility
  trailingSlash: true,
  
  // Enable React strict mode for better performance
  reactStrictMode: true,
  
  // Optimize page transitions
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
}

export default nextConfig
