/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Make sure this is exposed to the client
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: 'pk.eyJ1IjoibW9oYW5zaGFybWEwMDAwNyIsImEiOiJjbWE2Y2U5OGEwbWR3MmtzZ3hyczQxdWQzIn0.uFhP71t33Jh1bRPn1U55Bg',
  },
  webpack: (config) => {
    // Fixes npm packages that depend on `fs` module
    config.resolve.fallback = { fs: false };
    return config;
  },
}

module.exports = nextConfig
