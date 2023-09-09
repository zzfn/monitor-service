/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  assetPrefix:
      process.env.NODE_ENV === 'production' && !process.env.VERCEL
          ? 'https://cdn.zzfzzf.com/monitor'
          : '/',
};

module.exports = nextConfig;
