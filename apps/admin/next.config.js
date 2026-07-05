/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@huitfest/shared'],
  basePath: '/admin',
  productionBrowserSourceMaps: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    webpackBuildWorker: false,
  },
  async rewrites() {
    const isProd = process.env.NODE_ENV === 'production';
    const defaultApi = isProd ? 'https://startup.huitmedia.edu.vn' : 'http://localhost:5000';
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.ADMIN_API_URL || defaultApi}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
