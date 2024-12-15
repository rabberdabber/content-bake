/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "localhost" },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
      },
      {
        protocol: "https",
        hostname: "delivery-eu1.bfl.ai",
        port: "",
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push(
      ...[
        {
          test: /\.md$/,
          use: [
            {
              loader: "raw-loader",
            },
          ],
        },
      ]
    );
    return config;
  },
};

export default nextConfig;
