/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "images.unsplash.com",
      "bizex-hariyani.s3.ap-south-1.amazonaws.com",
      "hariyani-images.s3.ap-south-1.amazonaws.com",
    ],
  },
};

module.exports = nextConfig
