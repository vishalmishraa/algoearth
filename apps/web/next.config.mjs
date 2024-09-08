/** @type {import('next').NextConfig} */


import dotenv from "dotenv";
import path from "path";
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true
    },
    eslint: {
        ignoreDuringBuilds: true
    },
    env: dotenv.config({
        path: path.resolve('./config/.env') 
    }).parsed || {}
};

export default nextConfig;