"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Card } from "@/services/api";

interface EditDialogProps {
  open: boolean;
  card: Card;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
  isUpdating: boolean;
}

const EditDialog: React.FC<EditDialogProps> = ({
  open,
  card,
  onClose,
  onSave,
  isUpdating,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [editTitle, setEditTitle] = useState(card.title);
  const [editDescription, setEditDescription] = useState(
    card.description || ""
  );

  useEffect(() => {
    if (open) {
      setEditTitle(card.title);
      setEditDescription(card.description || "");
    }
  }, [open, card.title, card.description]);

  const handleSave = () => {
    onSave(editTitle.trim(), editDescription.trim());
  };

  const handleClose = () => {
    if (!isUpdating) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
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
          maxHeight: { xs: "100vh", sm: "90vh" },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: { xs: "1.25rem", sm: "1.5rem" },
          py: { xs: 2, sm: 3 },
        }}
      >
        カードを編集
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
          <TextField
            fullWidth
            label="タイトル"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={isUpdating}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "12px",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(103, 126, 234, 0.5)",
                  },
                },
                "&.Mui-focused": {
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#667eea",
                    borderWidth: "2px",
                  },
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(0, 0, 0, 0.7)",
                "&.Mui-focused": {
                  color: "#667eea",
                },
              },
            }}
          />
          <TextField
            fullWidth
            label="説明"
            multiline
            rows={4}
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            disabled={isUpdating}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "12px",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(103, 126, 234, 0.5)",
                  },
                },
                "&.Mui-focused": {
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#667eea",
                    borderWidth: "2px",
                  },
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(0, 0, 0, 0.7)",
                "&.Mui-focused": {
                  color: "#667eea",
                },
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: { xs: 2, sm: 3 }, gap: 1 }}>
        <Button
          onClick={handleClose}
          disabled={isUpdating}
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
          onClick={handleSave}
          disabled={isUpdating || !editTitle.trim()}
          variant="contained"
          sx={{
            borderRadius: "12px",
            px: 4,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 4px 20px rgba(103, 126, 234, 0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 25px rgba(103, 126, 234, 0.4)",
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
          {isUpdating ? "保存中..." : "保存"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
