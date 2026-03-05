/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
    output: "export",
    basePath: "/ai-chat-ui",
    assetPrefix: "/ai-chat-ui/",
}

export default nextConfig
