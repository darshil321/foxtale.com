/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});
const nextConfig = {
  eslint: {
    // Disabling on production builds because we're running checks on PRs via GitHub Actions.
    ignoreDuringBuilds: true
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'foxtale.in',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'people.pic1.co',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'app-uploads-cdn.fera.ai',
        pathname: '**'
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/collections/99-store',
        permanent: true
      },
      {
        source: '/password',
        destination: '/',
        permanent: true
      }
    ];
  }
};

module.exports = process.env.ANALYZE === 'true' ? withBundleAnalyzer(nextConfig) : nextConfig;
