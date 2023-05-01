const path = require("path");
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  plugins: [require("tw-elements/dist/plugin.cjs")],
  experimental: {
    scrollRestoration: true,
  },
  images: {
    domains: ["imagedelivery.net"],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
};

module.exports = nextConfig;
