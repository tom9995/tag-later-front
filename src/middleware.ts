import { NextRequest, NextResponse } from "next/server";

// 認証が不要な公開パス
const publicPaths = ["/login", "/signup"];

// 認証が必要な保護されたパス
const protectedPaths = ["/home", "/about", "/cards"];

// 既知の有効なパス（認証状態に関係なくアクセス可能）
const validPaths = [...publicPaths, ...protectedPaths, "/", "/not-found"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 静的ファイルやAPIルートは処理をスキップ
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // ルートパス（"/"）の場合は認証チェックして適切にリダイレクト
  if (pathname === "/") {
    return NextResponse.next(); // page.tsxで処理
  }

  // 有効なパスかどうかチェック
  const isValidPath = validPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  // 存在しないパスの場合は404ページへ
  if (!isValidPath) {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * すべてのリクエストにマッチするが、以下は除外:
     * - api routes (api/)
     * - _next/static (静的ファイル)
     * - _next/image (画像最適化ファイル)
     * - favicon.ico (ファビコン)
     * - 拡張子を持つファイル
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};
