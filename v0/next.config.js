/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '5mb',
        },
    },
    async rewrites() {
        return {
            fallback: [
                {
                    source: '/api/:path*',
                    destination: 'http://127.0.0.1:8001/api/:path*',
                },
            ],
        };
    },
}

module.exports = nextConfig
