// next.config.mjs

import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["geist"],
  images: {
    domains: [
      "i.imgur.com",
      "ipfs.decentralized-content.com",
      "pbs.twimg.com", // Twitter profile images
      "abs.twimg.com", // Twitter media
      "cdn.discordapp.com", // Discord
      "scontent.xx.fbcdn.net", // Facebook
      "scontent.cdninstagram.com", // Instagram
      "instagram.fyvr4-1.fna.fbcdn.net", // Instagram
      "platform-lookaside.fbsbx.com", // Facebook
      "static-cdn.jtvnw.net", // Twitch
      "yt3.ggpht.com", // YouTube
      "i.ytimg.com", // YouTube
      "avatars.githubusercontent.com", // GitHub
      "example.com", // Example domain from our mock data
      "arweave.net", // Arweave
      "storage.googleapis.com", // Fal AI image hosting (backup)
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.fal.media',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
