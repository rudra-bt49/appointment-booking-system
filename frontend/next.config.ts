import type { NextConfig } from "next";

// Suppress the deprecation warning for url.parse() from transitive dependencies
process.noDeprecation = true;

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
