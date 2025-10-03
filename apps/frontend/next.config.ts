import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "rvminio.ilhamdean.cloud",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "rvfe.ilhamdean.cloud",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "minio.ilhamdean.cloud",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "rentverse.ilhamdean.cloud",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
