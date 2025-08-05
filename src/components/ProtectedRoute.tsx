"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";
import { CircularProgress, Box } from "@mui/material";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const navigateToLogin = useCallback(() => {
    router.push("/login");
  }, [router]);

  useEffect(() => {
    if (!loading && !user) {
      navigateToLogin();
    }
  }, [user, loading, navigateToLogin]);

  if (loading) {
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

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
