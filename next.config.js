/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['image.yes24.com', 'images.unsplash.com'],
  },
};

module.exports = nextConfig;
