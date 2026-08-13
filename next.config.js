/** @type {import('next').NextConfig} */
const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const formattedBasePath = rawBasePath ? (rawBasePath.startsWith('/') ? rawBasePath : `/${rawBasePath}`) : undefined;

const nextConfig = {
  reactStrictMode: true,
  ...(formattedBasePath && {
    basePath: formattedBasePath,
    assetPrefix: formattedBasePath,
  }),
};

export default nextConfig;
