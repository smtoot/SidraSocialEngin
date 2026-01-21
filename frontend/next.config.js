/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // RTL Support
  async rewrites() {
    return [
      {
        source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
        destination: '/$1',
      },
    ];
  },
  // API Configuration
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Disable Turbopack to avoid character encoding issues
  turbopack: {
    enabled: false,
  },
};

module.exports = nextConfig;