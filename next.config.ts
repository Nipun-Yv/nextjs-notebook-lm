import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["pdf-parse"], // ✅ allows it to work in the bundled server
  output: 'standalone'
};

export default nextConfig;
