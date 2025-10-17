/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for cPanel deployment
  output: 'export',
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // Required for static export
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
