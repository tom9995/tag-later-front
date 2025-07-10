"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Stack,
} from "@mui/material";

export default function LoginView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // ログイン処理をここに追加（例：認証API呼び出し）
    console.log("ログイン処理実行", { email, password });

    // ホームページに遷移
    router.push("/home");
  };

  const handleSignUp = () => {
    // サインアップページに遷移
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
              sx={{ mt: 2 }}
            >
              ログイン
            </Button>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={handleSignUp}
              color="secondary"
            >
              新規登録
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}
