import Footer from "@/components/footer";
import Header from "@/components/header";
import { Stack, Box } from "@mui/material";
import React from "react";

export default function Home() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header title="ホームページへようこそ" />

      <Box sx={{ flex: 1, padding: 2 }}>
        <p>ボディーを実装</p>
      </Box>

      <Footer />
    </Box>
  );
}
