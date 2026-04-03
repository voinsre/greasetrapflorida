import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.greasetrapflorida.com" }],
        destination: "https://greasetrapflorida.com/:path*",
        permanent: true, // 308
      },
    ];
  },
};

export default nextConfig;
