import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  /* config options here */

  // GitHub Pages用の設定
  ...(isGitHubPages && {
    output: "export",
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    distDir: "dist",
    images: {
      unoptimized: true,
    },
    // 静的エクスポート時の最適化
    experimental: {
      ppr: false,
    },
    // SPA設定
    generateEtags: false,
    poweredByHeader: false,
    // コンパイル時の最適化
    compiler: {
      removeConsole: isProd,
    },
  }),

  // GitHub Pages用のbasePath設定（リポジトリ名に合わせて調整）
  ...(isGitHubPages && {
    basePath: "/tag-later-front",
    assetPrefix: "/tag-later-front/",
  }),

  // ヘッダー設定は静的エクスポート時には無効なので条件付きで設定
  ...(!isGitHubPages && {
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: [
            {
              key: "Content-Security-Policy",
              value: [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com", // Material-UI用
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                "font-src 'self' https://fonts.gstatic.com",
                "img-src 'self' data: https: blob:",
                "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
                "frame-ancestors 'none'",
                "base-uri 'self'",
                "form-action 'self'",
              ].join("; "),
            },
            {
              key: "X-Frame-Options",
              value: "DENY",
            },
            {
              key: "X-Content-Type-Options",
              value: "nosniff",
            },
            {
              key: "Referrer-Policy",
              value: "strict-origin-when-cross-origin",
            },
            {
              key: "X-XSS-Protection",
              value: "1; mode=block",
            },
          ],
        },
      ];
    },
  }),
};

export default nextConfig;
