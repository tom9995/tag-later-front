import ClientThemeProvider from "./ClientThemeProvider";

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
        <ClientThemeProvider>{children}</ClientThemeProvider>
      </body>
    </html>
  );
}
