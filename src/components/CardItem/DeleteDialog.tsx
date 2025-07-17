"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { Card } from "@/services/api";

interface DeleteDialogProps {
  open: boolean;
  card: Card;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  card,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: "20px" },
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          m: { xs: 0, sm: 2 },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          color: "#f44336",
          fontWeight: 700,
          fontSize: { xs: "1.25rem", sm: "1.5rem" },
          py: { xs: 2, sm: 3 },
        }}
      >
        <Delete sx={{ fontSize: { xs: 24, sm: 28 } }} />
        カードを削除
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
            以下のカードを削除してもよろしいですか？
          </Typography>
          <Box
            sx={{
              p: 2,
              backgroundColor: "rgba(244, 67, 54, 0.05)",
              borderRadius: "12px",
              border: "1px solid rgba(244, 67, 54, 0.1)",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: "#333",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                lineHeight: 1.3,
              }}
            >
              {card.title}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            color="error"
            sx={{ mt: 2, fontWeight: 500 }}
          >
            ⚠️ この操作は取り消すことができません。
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: { xs: 2, sm: 3 }, gap: 1 }}>
        <Button
          onClick={handleClose}
          disabled={isDeleting}
          sx={{
            borderRadius: "12px",
            px: 3,
            color: "rgba(0, 0, 0, 0.6)",
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          キャンセル
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isDeleting}
          variant="contained"
          color="error"
          startIcon={<Delete />}
          sx={{
            borderRadius: "12px",
            px: 4,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 4px 20px rgba(244, 67, 54, 0.3)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 6px 25px rgba(244, 67, 54, 0.4)",
            },
            "&:disabled": {
              background: "rgba(0, 0, 0, 0.12)",
              color: "rgba(0, 0, 0, 0.26)",
              transform: "none",
              boxShadow: "none",
            },
            transition: "all 0.3s ease",
          }}
        >
          {isDeleting ? "削除中..." : "削除"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
