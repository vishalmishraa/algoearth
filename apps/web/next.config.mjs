/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true
    },
    eslint: {
        ignoreDuringBuilds: true
    },
    env: {
        MOUNT_PATH: process.env.MOUNT_PATH,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        JWT_SECRET: process.env.JWT_SECRET,
        DATABASE_URL: process.env.DATABASE_URL,
        REDIS_URL: process.env.REDIS_URL,
        JUDGE0_URI: process.env.JUDGE0_URI
    }
};

export default nextConfig;