/** @type {import('next').NextConfig} */


const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '3000',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'your-production-domain.com',
          pathname: '/**',
        }
      ],
    },
  }
  
  export default nextConfig
  