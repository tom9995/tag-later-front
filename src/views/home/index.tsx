"use client";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Stack, Box, Button } from "@mui/material";
import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import Body from "./components/body";

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header title="TagLater" userName={user?.name ?? ""} />
      <Body />

      <Footer />
    </Box>
  );
}
