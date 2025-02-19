/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ximcyeotqntfzojerwei.supabase.co',
      }
    ],
    domains: ['localhost'],
  },
  reactStrictMode: true,
  swcMinify: true,
}

export default nextConfig 