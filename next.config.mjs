// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["geist"],
  serverExternalPackages: ["@browserbasehq/stagehand", "playwright"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.fal.media",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ipfs.decentralized-content.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "arweave.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com", // Twitter profile images
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "abs.twimg.com", // Twitter media
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com", // Discord
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "scontent.xx.fbcdn.net", // Facebook
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "scontent.cdninstagram.com", // Instagram
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "instagram.fyvr4-1.fna.fbcdn.net", // Instagram
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com", // Facebook
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static-cdn.jtvnw.net", // Twitch
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "yt3.ggpht.com", // YouTube
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com", // YouTube
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // GitHub
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "example.com", // Example domain from our mock data
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com", // Fal AI image hosting (backup)
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
