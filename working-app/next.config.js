/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  port: 3004,
  // Fix syntax error
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Disable problematic features
  swcMinify: false,
  experimental: {
    esmExternals: false,
    serverComponentsExternalPackages: false,
    optimizePackageImports: false,
    optimizeCss: false,
    appDir: false,
    defaultLocale: false,
    async: false,
    serverActions: false,
  },
  async rewrites() {
    return [
      {
        source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
        destination: '/$1',
      },
    ];
  },
};

module.exports = nextConfig;