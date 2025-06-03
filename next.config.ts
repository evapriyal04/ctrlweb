import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Any other config options...

  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },
};

export default nextConfig;
