"use client";

import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Menu,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Add,
  LocalOffer,
  MoreVert,
  Logout,
  AccountCircle,
} from "@mui/icons-material";
import { User } from "@supabase/supabase-js";

interface CardsListHeaderProps {
  user: User | null;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  setShowTagManager: (show: boolean) => void;
  userMenuAnchor: null | HTMLElement;
  handleUserMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleUserMenuClose: () => void;
  handleLogout: () => void;
  isLoggingOut: boolean;
  getUserDisplayName: string;
}

const CardsListHeader: React.FC<CardsListHeaderProps> = ({
  user,
  showAddModal,
  setShowAddModal,
  setShowTagManager,
  userMenuAnchor,
  handleUserMenuOpen,
  handleUserMenuClose,
  handleLogout,
  isLoggingOut,
  getUserDisplayName,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      {/* Modern Header */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Paper
          elevation={0}
          sx={{
            background: "rgb(244,246,247)",
            backdropFilter: "blur(20px)",
            borderRadius: 4,
            p: { xs: 1.5, sm: 2.5 },
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 1.5, sm: 0 },
              mb: { xs: 1.5, sm: 2 },
            }}
          >
            <Box>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 800,
                  background: "linear-gradient(45deg, #2c3e50, #3498db)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                  fontSize: { xs: "2rem", sm: "3rem" },
                }}
              >
                TagLater
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: { xs: 1, sm: 2 },
                alignItems: "center",
                flexWrap: "wrap",
                width: { xs: "100%", sm: "auto" },
                justifyContent: { xs: "space-between", sm: "flex-end" },
              }}
            >
              <Button
                variant="outlined"
                startIcon={<LocalOffer />}
                onClick={() => setShowTagManager(true)}
                sx={{
                  borderRadius: 3,
                  px: { xs: 2, sm: 3 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  borderColor: "#2c3e50",
                  color: "#2c3e50",
                  "&:hover": {
                    borderColor: "#3498db",
                    color: "#3498db",
                    background: "rgba(52, 152, 219, 0.1)",
                  },
                }}
              >
                <Box sx={{ display: { xs: "none", sm: "inline" } }}>
                  タグ管理
                </Box>
                <Box sx={{ display: { xs: "inline", sm: "none" } }}>タグ</Box>
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowAddModal(true)}
                sx={{
                  borderRadius: 3,
                  px: { xs: 2, sm: 3 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  background: "linear-gradient(45deg, #3498db, #2c3e50)",
                  boxShadow: "0 8px 32px rgba(52, 152, 219, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #2980b9, #34495e)",
                    boxShadow: "0 12px 40px rgba(52, 152, 219, 0.4)",
                  },
                }}
              >
                <Box sx={{ display: { xs: "none", sm: "inline" } }}>
                  新しいカードを追加
                </Box>
                <Box sx={{ display: { xs: "inline", sm: "none" } }}>追加</Box>
              </Button>
              {/* User Menu Icon */}
              <IconButton
                onClick={handleUserMenuOpen}
                size="small"
                sx={{
                  ml: { xs: 0, sm: 1 },
                  color: "#7f8c8d",
                  "&:hover": {
                    backgroundColor: "rgba(127, 140, 141, 0.3)",
                  },
                }}
              >
                <MoreVert />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            minWidth: "200px",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box
          sx={{ px: 2, py: 1, borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccountCircle sx={{ color: "#7f8c8d" }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {getUserDisplayName}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            startIcon={<Logout />}
            onClick={handleLogout}
            disabled={isLoggingOut}
            sx={{
              justifyContent: "flex-start",
              color: "#f44336",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(244, 67, 54, 0.05)",
              },
              "&:disabled": {
                color: "rgba(0, 0, 0, 0.26)",
              },
            }}
          >
            {isLoggingOut ? "ログアウト中..." : "ログアウト"}
          </Button>
        </Box>
      </Menu>
    </>
  );
};

export default CardsListHeader;
