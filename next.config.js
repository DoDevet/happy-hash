/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  experimental: {
    scrollRestoration: true,
  },
  images: {
    domains: ["imagedelivery.net"],
  },
};

module.exports = nextConfig;
