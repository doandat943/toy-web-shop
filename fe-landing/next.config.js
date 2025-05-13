/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: process.env.BASE_BACKEND_URL
            },
            {
                protocol: 'https',
                hostname: '**' // Cho phép tất cả các domain HTTPS
            },
            {
                protocol: 'http',
                hostname: '**' // Cho phép tất cả các domain HTTP (chỉ sử dụng trong môi trường dev)
            }
        ]
    }
};

module.exports = nextConfig;
