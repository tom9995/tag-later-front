"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Stack,
  Alert,
} from "@mui/material";

export default function LoginView() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const success = await login(email, password);

      if (success) {
        router.push("/home");
      } else {
        setError("ログインに失敗しました");
      }
    } catch (err) {
      setError("ログイン処理中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          justifyContent: "center",
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: "100%", maxWidth: 400 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            ログイン
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={3}>
            <TextField
              fullWidth
              type="email"
              label="メールアドレス"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <TextField
              fullWidth
              type="password"
              label="パスワード"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleLogin}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? "ログイン中..." : "ログイン"}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={handleSignUp}
              color="secondary"
              disabled={loading}
            >
              新規登録
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}
