/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
  webpack: (config, { isServer }) => {
    // Exclude binary files from being processed
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
      exclude: /node_modules/,
    });

    return config;
  },
};

export default nextConfig; 