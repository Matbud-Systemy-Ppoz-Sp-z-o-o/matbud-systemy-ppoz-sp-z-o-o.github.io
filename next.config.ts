import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'matbud-systemy-ppoz-sp-z-o-o.github.io',
        pathname: '/**',
      },
    ],
  },
  // Add this to ensure proper handling of public assets
  experimental: {
    scrollRestoration: true,
  },
};

export default nextConfig;
