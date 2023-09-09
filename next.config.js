/** @type {import('next').NextConfig} */
const nextConfig = {
  generateBuildId: async () => {
    console.log('DRONE_COMMIT',process.env.DRONE_COMMIT)
    return process.env.DRONE_COMMIT;
  },
};

module.exports = nextConfig;
