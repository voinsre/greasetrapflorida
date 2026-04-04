import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.greasetrapflorida.com" }],
        destination: "https://greasetrapflorida.com/:path*",
        permanent: true,
      },
      // Guides moved to compliance category
      {
        source: "/guides/chapter-62-705-compliance-guide",
        destination: "/compliance/chapter-62-705-guide",
        permanent: true,
      },
      {
        source: "/guides/florida-grease-waste-service-manifest",
        destination: "/compliance/grease-waste-manifest",
        permanent: true,
      },
      {
        source: "/guides/florida-fog-fines-penalties",
        destination: "/compliance/fines-and-penalties",
        permanent: true,
      },
      // Wrong slug variations found in rendered HTML
      {
        source: "/compliance/penalties-and-fines",
        destination: "/compliance/fines-and-penalties",
        permanent: true,
      },
      {
        source: "/guides/how-to-verify-grease-hauler-dep-licensed",
        destination: "/guides/verify-grease-hauler-dep-licensed",
        permanent: true,
      },
      {
        source: "/guides/grease-trap-sizing-florida-restaurants",
        destination: "/guides/grease-trap-sizing-guide-florida",
        permanent: true,
      },
      {
        source: "/guides/grease-trap-maintenance-tips-between-cleanings",
        destination: "/guides/grease-trap-maintenance-tips",
        permanent: true,
      },
      {
        source: "/guides/used-cooking-oil-recycling-vs-grease-trap-waste",
        destination: "/guides/used-cooking-oil-vs-grease-trap-waste",
        permanent: true,
      },
      // Counties with < 2 businesses (no pages) redirect to county index
      {
        source: "/county/clay",
        destination: "/county",
        permanent: false,
      },
      {
        source: "/county/hernando",
        destination: "/county",
        permanent: false,
      },
      {
        source: "/county/nassau",
        destination: "/county",
        permanent: false,
      },
      {
        source: "/county/santa-rosa",
        destination: "/county",
        permanent: false,
      },
      {
        source: "/county/st-lucie",
        destination: "/county",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
