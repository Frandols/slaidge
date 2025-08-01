/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ['@workspace/ui'],
	images: {
		remotePatterns: [new URL('https://lh3.googleusercontent.com/a/**')],
	},
	cacheMaxMemorySize: 0,
}

export default nextConfig
