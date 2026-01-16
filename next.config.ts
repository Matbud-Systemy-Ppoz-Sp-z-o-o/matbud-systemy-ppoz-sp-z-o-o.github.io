import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    qualities: [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
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
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
      
      const webpack = require('webpack');
      if (!config.plugins) {
        config.plugins = [];
      }
      
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^core-js\/modules\/es\.(array\.(at|flat|flat-map)|object\.(from-entries|has-own)|string\.(trim-end|trim-start))$/,
        })
      );
      
      config.resolve.alias = {
        ...config.resolve.alias,
        'core-js/modules/es.array.at': false,
        'core-js/modules/es.array.flat': false,
        'core-js/modules/es.array.flat-map': false,
        'core-js/modules/es.object.from-entries': false,
        'core-js/modules/es.object.has-own': false,
        'core-js/modules/es.string.trim-end': false,
        'core-js/modules/es.string.trim-start': false,
      };
      if (!dev) {
        config.target = ['web', 'es2022'];
        config.optimization = {
          ...config.optimization,
          moduleIds: 'deterministic',
          runtimeChunk: 'single',
          usedExports: true,
          sideEffects: false,
          splitChunks: {
            chunks: 'all',
            maxInitialRequests: 3,
            minSize: 20000,
            maxSize: 244000,
            cacheGroups: {
              default: false,
              vendors: false,
              react: {
                name: 'react',
                test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                priority: 20,
                chunks: 'all',
                minSize: 20000,
                reuseExistingChunk: true,
              },
              radix: {
                name: 'radix',
                test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
                priority: 15,
                chunks: 'async',
                enforce: true,
                reuseExistingChunk: true,
              },
              markdown: {
                name: 'markdown',
                test: /[\\/]node_modules[\\/](react-markdown|remark|rehype)[\\/]/,
                priority: 10,
                chunks: 'async',
                reuseExistingChunk: true,
              },
              form: {
                name: 'form',
                test: /[\\/]node_modules[\\/](react-hook-form|zod|@hookform)[\\/]/,
                priority: 10,
                chunks: 'async',
                reuseExistingChunk: true,
              },
              lucide: {
                name: 'lucide',
                test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
                priority: 5,
                chunks: 'async',
                reuseExistingChunk: true,
              },
            },
          },
        };
      }
    }
    return config;
  },
};

export default nextConfig;
