import ClientThemeProvider from "./ClientThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata = {
  title: "TagLater App",
  description: "Tag management application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
