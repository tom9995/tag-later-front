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

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    // サインアップ処理をここに追加
    console.log("サインアップ処理実行", { username, email, password });

    // ログインページに戻る
    router.push("/login");
  };

  const handleBackToLogin = () => {
    router.push("/login");
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
            新規登録
          </Typography>

          <Stack spacing={3}>
            <TextField
              fullWidth
              type="text"
              label="ユーザー名"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

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
              onClick={handleSignUp}
              sx={{ mt: 2 }}
              color="success"
            >
              登録
            </Button>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={handleBackToLogin}
              color="inherit"
            >
              ログインに戻る
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}
