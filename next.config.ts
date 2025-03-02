import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["localhost"], // Allow images from your backend server
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**", // Allow all HTTP domains
      },
      {
        protocol: "https",
        hostname: "**", // Allow all HTTPS domains
      },
    ],
  },
};

export default nextConfig;
