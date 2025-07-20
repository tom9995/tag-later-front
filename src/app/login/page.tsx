"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import NextLink from "next/link";

export default function LoginPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください");
      return;
    }

    setLoading(true);
    setError("");

    const { error } = await signIn(email, password);

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        setError("メールアドレスまたはパスワードが正しくありません");
      } else if (error.message.includes("Email not confirmed")) {
        setError(
          "メールアドレスの確認が完了していません。確認メールをご確認ください"
        );
      } else {
        setError("ログインに失敗しました。もう一度お試しください");
      }
    }

    setLoading(false);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (user) {
    return null; // リダイレクト中
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "url(data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E) repeat",
          zIndex: 0,
        },
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          position: "relative",
          zIndex: 1,
          px: { xs: 2, sm: 3, md: 0 },
        }}
      >
        <Paper
          elevation={10}
          sx={{
            padding: { xs: 3, sm: 4, md: 5 },
            width: "100%",
            maxWidth: { xs: "100%", sm: 480, md: 500 },
            margin: "0 auto",
            borderRadius: { xs: 3, sm: 4, md: 5 },
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: {
              xs: "0 4px 20px rgba(0, 0, 0, 0.15)",
              sm: "0 8px 32px rgba(0, 0, 0, 0.1)",
              md: "0 12px 40px rgba(0, 0, 0, 0.15)",
            },
            transition: "all 0.3s ease",
          }}
        >
          <Box sx={{ textAlign: "center", mb: { xs: 3, sm: 4 } }}>
            <LoginIcon
              sx={{
                fontSize: { xs: 40, sm: 48, md: 56 },
                color: "#3498db",
                mb: { xs: 1, sm: 2 },
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.75rem", sm: "2.125rem", md: "2.5rem" },
                background: "linear-gradient(45deg, #2c3e50, #3498db)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: { xs: 1, sm: 2 },
              }}
            >
              TagLater
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                fontWeight: 500,
                fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
              }}
            >
              ログイン
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                backgroundColor: "rgba(244, 67, 54, 0.1)",
                border: "1px solid rgba(244, 67, 54, 0.2)",
                borderRadius: "12px",
                "& .MuiAlert-icon": {
                  color: "#f44336",
                },
              }}
            >
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: { xs: 1, sm: 2 } }}
          >
            <TextField
              fullWidth
              required
              type="email"
              label="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              variant="outlined"
              margin="normal"
              autoComplete="email"
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: { xs: 1.5, sm: 2 },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "12px",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(52, 152, 219, 0.5)",
                    },
                  },
                  "&.Mui-focused": {
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3498db",
                      borderWidth: "2px",
                    },
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(0, 0, 0, 0.7)",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  "&.Mui-focused": {
                    color: "#3498db",
                  },
                },
              }}
            />

            <TextField
              fullWidth
              required
              type={showPassword ? "text" : "password"}
              label="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              variant="outlined"
              margin="normal"
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      disabled={loading}
                      size={isMobile ? "small" : "medium"}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: { xs: 1.5, sm: 2 },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "12px",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(52, 152, 219, 0.5)",
                    },
                  },
                  "&.Mui-focused": {
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3498db",
                      borderWidth: "2px",
                    },
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(0, 0, 0, 0.7)",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  "&.Mui-focused": {
                    color: "#3498db",
                  },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: { xs: 2.5, sm: 3 },
                mb: 2,
                py: { xs: 1.2, sm: 1.5 },
                borderRadius: "12px",
                background: "linear-gradient(45deg, #3498db, #2c3e50)",
                textTransform: "none",
                fontSize: { xs: "0.9rem", sm: "1rem" },
                fontWeight: 600,
                boxShadow: "0 4px 20px rgba(52, 152, 219, 0.3)",
                "&:hover": {
                  background: "linear-gradient(45deg, #2980b9, #34495e)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 25px rgba(52, 152, 219, 0.4)",
                },
                "&:disabled": {
                  background: "rgba(0, 0, 0, 0.12)",
                  color: "rgba(0, 0, 0, 0.26)",
                  transform: "none",
                  boxShadow: "none",
                },
                transition: "all 0.3s ease",
              }}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <LoginIcon />
                )
              }
            >
              {loading ? "ログイン中..." : "ログイン"}
            </Button>

            <Box sx={{ textAlign: "center", mt: { xs: 1.5, sm: 2 } }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
              >
                アカウントをお持ちでない方は{" "}
                <Link
                  component={NextLink}
                  href="/signup"
                  sx={{
                    color: "#3498db",
                    textDecoration: "none",
                    fontWeight: 600,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  新規登録
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
