/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: false
  },
  api: {
    responseLimit: false,
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  }
}

module.exports = nextConfig