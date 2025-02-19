/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static image imports
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ximcyeotqntfzojerwei.supabase.co',
      },
    ],
  },
  // Strict mode for better development
  reactStrictMode: true,
  // Disable x-powered-by header
  poweredByHeader: false,
}

export default nextConfig 