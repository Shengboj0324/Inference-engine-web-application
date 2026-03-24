import type { NextConfig } from 'next'
import path from 'path'

const config: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  trailingSlash: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
}

export default config

