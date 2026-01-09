/** @type {import('next').NextConfig} */


import dotenv from "dotenv";
import path from "path";

// Load environment variables
const env = dotenv.config({
    path: path.resolve('./config/.env') 
}).parsed || {};

// Remove NODE_ENV from env config as it's not allowed by Next.js
const { NODE_ENV, ...allowedEnv } = env;

const nextConfig = {
    typescript: {
        ignoreBuildErrors: true
    },
    eslint: {
        ignoreDuringBuilds: true
    },
    env: allowedEnv
};

export default nextConfig;