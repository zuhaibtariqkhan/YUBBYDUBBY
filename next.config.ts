import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'shop.yubbydubby.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

