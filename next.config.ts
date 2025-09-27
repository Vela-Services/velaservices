import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",  // Essentiel pour Netlify functions (build en standalone mode)
  images: { unoptimized: true },  // Évite bugs si images
};

export default nextConfig;