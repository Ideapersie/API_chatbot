/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    KPIT_API_KEY: process.env.KPIT_API_KEY,
    KPIT_API_BASE_URL: process.env.KPIT_API_BASE_URL,
    KPIT_MODEL_NAME: process.env.KPIT_MODEL_NAME,
  }
}

module.exports = nextConfig