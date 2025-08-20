"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import {
  Home,
  Search,
  ArrowBack,
  ErrorOutline,
  Login,
} from "@mui/icons-material";

export default function NotFound() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // 認証されていないユーザーは自動的にログインページにリダイレクト
  useEffect(() => {
    if (!loading && !user) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 3000); // 3秒後にリダイレクト

      return () => clearTimeout(timer);
    }
  }, [user, loading, router]);

  const handleGoHome = () => {
    if (user) {
      router.push("/home");
    } else {
      router.push("/login");
    }
  };

  const handleGoLogin = () => {
    router.push("/login");
  };

  const handleGoBack = () => {
    router.back();
  };

  // 認証チェック中はローディング表示
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ color: "white" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "24px",
            p: { xs: 4, sm: 6 },
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Stack spacing={4} alignItems="center">
            {/* 404 アイコンと番号 */}
            <Box
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Typography
                variant={isMobile ? "h1" : "h1"}
                sx={{
                  fontSize: { xs: "4rem", sm: "6rem", md: "8rem" },
                  fontWeight: "bold",
                  color: "transparent",
                  background:
                    "linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  textShadow: "0 4px 20px rgba(255, 107, 107, 0.3)",
                }}
              >
                404
              </Typography>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: -1,
                }}
              >
                <ErrorOutline
                  sx={{
                    fontSize: { xs: "3rem", sm: "4rem", md: "5rem" },
                    color: "rgba(255, 107, 107, 0.1)",
                  }}
                />
              </Box>
            </Box>

            {/* メッセージ */}
            <Stack spacing={2} textAlign="center">
              <Typography
                variant={isMobile ? "h5" : "h4"}
                sx={{
                  fontWeight: 600,
                  color: "#2c3e50",
                  mb: 1,
                }}
              >
                ページが見つかりません
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#7f8c8d",
                  maxWidth: "500px",
                  mx: "auto",
                  lineHeight: 1.6,
                }}
              >
                お探しのページは存在しないか、移動または削除された可能性があります。
                <br />
                {!user ? (
                  <>
                    ログインして利用可能なページにアクセスしてください。
                    <br />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#e74c3c",
                        fontWeight: 500,
                        mt: 1,
                      }}
                    >
                      3秒後に自動的にログインページに移動します...
                    </Typography>
                  </>
                ) : (
                  "URLをご確認の上、再度お試しください。"
                )}
              </Typography>
            </Stack>

            {/* アクションボタン */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mt: 4 }}
            >
              {user ? (
                <>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Home />}
                    onClick={handleGoHome}
                    sx={{
                      borderRadius: "12px",
                      px: 4,
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: 600,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 30px rgba(102, 126, 234, 0.5)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    ホームに戻る
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<ArrowBack />}
                    onClick={handleGoBack}
                    sx={{
                      borderRadius: "12px",
                      px: 4,
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: 600,
                      borderColor: "#667eea",
                      color: "#667eea",
                      "&:hover": {
                        borderColor: "#5a6fd8",
                        backgroundColor: "rgba(102, 126, 234, 0.05)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    前のページに戻る
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Login />}
                    onClick={handleGoLogin}
                    sx={{
                      borderRadius: "12px",
                      px: 4,
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: 600,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 30px rgba(102, 126, 234, 0.5)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    ログインページへ
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<ArrowBack />}
                    onClick={handleGoBack}
                    sx={{
                      borderRadius: "12px",
                      px: 4,
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: 600,
                      borderColor: "#667eea",
                      color: "#667eea",
                      "&:hover": {
                        borderColor: "#5a6fd8",
                        backgroundColor: "rgba(102, 126, 234, 0.05)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    前のページに戻る
                  </Button>
                </>
              )}
            </Stack>

            {/* 装飾要素 */}
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                gap: 3,
                mt: 4,
                opacity: 0.6,
              }}
            >
              {[Search, Home, ErrorOutline].map((Icon, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: `float 3s ease-in-out infinite ${index * 0.5}s`,
                    "@keyframes float": {
                      "0%, 100%": {
                        transform: "translateY(0px)",
                      },
                      "50%": {
                        transform: "translateY(-10px)",
                      },
                    },
                  }}
                >
                  <Icon sx={{ color: "white", fontSize: "1.5rem" }} />
                </Box>
              ))}
            </Box>
          </Stack>
        </Paper>

        {/* 背景装飾 */}
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            zIndex: -1,
            overflow: "hidden",
          }}
        >
          {[...Array(6)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: "absolute",
                width: { xs: "60px", sm: "100px" },
                height: { xs: "60px", sm: "100px" },
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${
                  i % 2 === 0
                    ? "rgba(255, 107, 107, 0.1)"
                    : "rgba(78, 205, 196, 0.1)"
                })`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `drift 10s ease-in-out infinite ${i * 2}s`,
                "@keyframes drift": {
                  "0%, 100%": {
                    transform: "translate(0, 0) rotate(0deg)",
                  },
                  "33%": {
                    transform: "translate(-30px, -30px) rotate(120deg)",
                  },
                  "66%": {
                    transform: "translate(30px, -30px) rotate(240deg)",
                  },
                },
              }}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
