"use client";

import {
  Button,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

type HeaderProps = {
  title: string;
  searchFileButton?: boolean;
  filterButton?: boolean;
};

export default function Header({ title }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    setLogoutDialog(true);
    handleMenuClose();
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
      setLogoutDialog(false);
    }
  };

  const handleLogoutCancel = () => {
    setLogoutDialog(false);
  };

  const getUserDisplayName = () => {
    return user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name
      .split(" ")
      .map((word: string) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <Stack
        direction="column"
        justifyContent="space-between"
        sx={{
          padding: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          borderRadius: "0 0 24px 24px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(90deg, #ffffff 0%, #f0f8ff 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {title}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" sx={{ gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                cursor: "pointer",
                padding: "8px 16px",
                borderRadius: "20px",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.2)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
                },
              }}
              onClick={handleMenuOpen}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  background:
                    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              >
                {getUserInitials()}
              </Avatar>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "0.95rem",
                }}
              >
                {getUserDisplayName()}
              </Typography>
              <AccountCircleIcon sx={{ opacity: 0.7 }} />
            </Box>
          </Stack>
        </Stack>
        <Stack sx={{ mt: 2 }}>
          <Paper
            component="form"
            sx={{
              p: "8px 16px",
              display: "flex",
              alignItems: "center",
              width: "100%",
              borderRadius: "20px",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "rgba(255, 255, 255, 1)",
                boxShadow: "0 6px 25px rgba(0, 0, 0, 0.15)",
              },
              "&:focus-within": {
                background: "rgba(255, 255, 255, 1)",
                boxShadow: "0 6px 25px rgba(103, 126, 234, 0.2)",
                border: "1px solid rgba(103, 126, 234, 0.3)",
              },
            }}
          >
            <InputBase
              sx={{
                ml: 1,
                flex: 1,
                fontSize: "1rem",
                "& input::placeholder": {
                  color: "rgba(0, 0, 0, 0.5)",
                  opacity: 1,
                },
              }}
              placeholder="カードを検索..."
              inputProps={{ "aria-label": "search cards" }}
            />
            <IconButton
              type="button"
              sx={{
                p: "8px",
                color: "#667eea",
                "&:hover": {
                  background: "rgba(103, 126, 234, 0.1)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease",
              }}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
          </Paper>
        </Stack>
      </Stack>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
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
        <MenuItem
          onClick={handleLogoutClick}
          sx={{
            padding: "12px 20px",
            color: "#f44336",
            fontSize: "0.95rem",
            fontWeight: 500,
            "&:hover": {
              background: "rgba(244, 67, 54, 0.1)",
            },
          }}
        >
          <LogoutIcon sx={{ mr: 2, fontSize: "1.2rem" }} />
          ログアウト
        </MenuItem>
      </Menu>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialog}
        onClose={handleLogoutCancel}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#333",
            textAlign: "center",
          }}
        >
          ログアウトの確認
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              fontSize: "1rem",
              color: "rgba(0, 0, 0, 0.7)",
              textAlign: "center",
            }}
          >
            本当にログアウトしますか？
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px 24px" }}>
          <Button
            onClick={handleLogoutCancel}
            disabled={isLoggingOut}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 500,
              color: "rgba(0, 0, 0, 0.6)",
              "&:hover": {
                background: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            disabled={isLoggingOut}
            variant="contained"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 500,
              background: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #d32f2f 0%, #c62828 100%)",
              },
              "&:disabled": {
                background: "rgba(0, 0, 0, 0.12)",
              },
            }}
          >
            {isLoggingOut ? "ログアウト中..." : "ログアウト"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
