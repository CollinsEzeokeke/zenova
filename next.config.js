/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['assets.example.com', 'images.unsplash.com', 'cdn.zenova.io'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  serverExternalPackages: [ '@mastra/*'],
};

module.exports = nextConfig; 