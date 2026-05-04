import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {protocol: 'https', hostname: 'david.travel'},
      {protocol: 'http', hostname: 'david.travel'},
    ],
  },
}

export default nextConfig
