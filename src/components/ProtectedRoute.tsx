"use client";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CircularProgress, Box } from "@mui/material";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // 開発時はログイン状態を無効化
  // 環境変数で制御（推奨）
  const skipAuth = process.env.NEXT_PUBLIC_SKIP_AUTH === 'true';
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // 認証をスキップする条件
  const shouldSkipAuth = isDevelopment && skipAuth;
  
  console.log('Auth Debug:', { 
    NODE_ENV: process.env.NODE_ENV,
    SKIP_AUTH: process.env.NEXT_PUBLIC_SKIP_AUTH,
    shouldSkipAuth,
    isAuthenticated 
  });

  useEffect(() => {
    // 認証スキップでない場合のみ認証チェック
    if (!shouldSkipAuth && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router, shouldSkipAuth]);

  // 認証スキップでない場合のみローディング表示
  if (!shouldSkipAuth && !isAuthenticated) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
