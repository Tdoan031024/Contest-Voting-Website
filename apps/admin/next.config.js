/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@huitfest/shared'],
  basePath: '/admin',
};

module.exports = nextConfig;
