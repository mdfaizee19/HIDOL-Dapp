/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                crypto: false, // Also ignore crypto if it creeps in
            };
        }
        return config;
    },
}

module.exports = nextConfig
