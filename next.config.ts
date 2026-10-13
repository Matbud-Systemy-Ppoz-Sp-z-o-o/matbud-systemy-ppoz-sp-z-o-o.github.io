import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import { KNOWN_LOCALES, getActiveLocales, getDefaultLocale } from "./scripts/active-locales.js";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    qualities: [25, 30, 35, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'matbud-systemy-ppoz-sp-z-o-o.github.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'matbud.net',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    scrollRestoration: true,
    optimizeCss: true,
  },
  compress: true,
  poweredByHeader: false,
  compiler: {
    removeConsole: true,
  },
};

export default function config(phase: string): NextConfig {
  if (phase !== PHASE_DEVELOPMENT_SERVER) return nextConfig;

  // In production, inactive locales are redirect pages written by scripts/generate-locale-redirects.js
  // (static export can't do server redirects). Mirror them in `next dev` so /en/... behaves the same.
  const activeLocales = getActiveLocales();
  const defaultLocale = getDefaultLocale();
  const inactiveLocales = KNOWN_LOCALES.filter((l: string) => !activeLocales.includes(l));

  return {
    ...nextConfig,
    async redirects() {
      return inactiveLocales.flatMap((locale: string) => [
        { source: `/${locale}`, destination: `/${defaultLocale}/`, permanent: true },
        { source: `/${locale}/:path*`, destination: `/${defaultLocale}/:path*`, permanent: true },
      ]);
    },
  };
}
