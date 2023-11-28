/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "klzoutquzrmwwgifgzno.supabase.co",
      },
    ],
  }, 
}

module.exports = nextConfig
