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
