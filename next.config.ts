import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",  // Essentiel pour Netlify functions (build en standalone mode)
  images: { unoptimized: true },  // Évite bugs si images
  
  // SEO and performance optimizations
  experimental: {
    optimizePackageImports: ['react-icons', 'lucide-react']
  },
  
  // Headers for better SEO
  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
    ];
  },
};

export default nextConfig;