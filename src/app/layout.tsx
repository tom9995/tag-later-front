"use client";

import ClientThemeProvider from "./ClientThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";

// 静的エクスポート用のメタデータはクライアントサイドでは無効
// export const metadata = {
//   title: "TagLater App",
//   description: "Tag management application",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // クライアントサイドでのメタデータ設定
  if (typeof document !== "undefined") {
    document.title = "TagLater App";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Tag management application");
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Tag management application";
      document.head.appendChild(meta);
    }
  }

  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <ClientThemeProvider>{children}</ClientThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
