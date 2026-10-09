import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "preview-chat-1e8a8569-511a-4559-a8a9-433c63658e23.space-z.ai",
  ],
};

export default nextConfig;
