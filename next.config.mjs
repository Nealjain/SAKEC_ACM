/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dhxzkzdlsszwuqjkicnv.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  
  // Enable React strict mode for better performance
  reactStrictMode: true,
  
  // Optimize page transitions
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
}

export default nextConfig
