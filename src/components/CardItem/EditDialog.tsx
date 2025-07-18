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
  Chip,
  Autocomplete,
  Typography,
} from "@mui/material";
import { Card, Tag, apiService } from "@/services/api";

interface EditDialogProps {
  open: boolean;
  card: Card;
  onClose: () => void;
  onSave: (title: string, description: string, tags?: Tag[]) => void;
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
  const [selectedTags, setSelectedTags] = useState<Tag[]>(card.tags || []);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const response = await apiService.getTags();
      if (response.success) {
        setAvailableTags(response.data);
      }
    } catch (error) {
      console.error("Failed to load tags:", error);
    }
  };

  useEffect(() => {
    if (open) {
      setEditTitle(card.title);
      setEditDescription(card.description || "");
      setSelectedTags(card.tags || []);
    }
  }, [open, card.title, card.description, card.tags]);

  const handleSave = () => {
    onSave(editTitle.trim(), editDescription.trim(), selectedTags);
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
      sx={{ zIndex: 1300 }} // DeleteDialogより低いz-indexを設定
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
          background: "linear-gradient(135deg, #7f8c8d 0%, #34495e 100%)",
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
                    borderColor: "#7f8c8d",
                    borderWidth: "2px",
                  },
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(0, 0, 0, 0.7)",
                "&.Mui-focused": {
                  color: "#7f8c8d",
                },
              },
            }}
          />

          {/* タグ選択 */}
          <Box sx={{ mb: 3 }}>
            <Autocomplete
              multiple
              value={selectedTags}
              onChange={(_, newValue) => setSelectedTags(newValue)}
              options={availableTags}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: option.color,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: option.color, fontWeight: 500 }}
                  >
                    {option.name}
                  </Typography>
                </Box>
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...chipProps } = getTagProps({ index });
                  return (
                    <Chip
                      key={key}
                      label={option.name}
                      {...chipProps}
                      sx={{
                        backgroundColor: option.color + "20",
                        color: option.color,
                        "& .MuiChip-deleteIcon": {
                          color: option.color,
                        },
                      }}
                    />
                  );
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="タグ"
                  placeholder="タグを選択してください"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "12px",
                      "&.Mui-focused": {
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#7f8c8d",
                          borderWidth: "2px",
                        },
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#7f8c8d",
                    },
                  }}
                />
              )}
            />
          </Box>

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
                    borderColor: "#7f8c8d",
                    borderWidth: "2px",
                  },
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(0, 0, 0, 0.7)",
                "&.Mui-focused": {
                  color: "#7f8c8d",
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
          disabled={
            isUpdating ||
            (!(editTitle ? editTitle.trim() : "") &&
              !(card ? card.url?.trim() : ""))
          }
          variant="contained"
          sx={{
            borderRadius: "12px",
            px: 4,
            background: "linear-gradient(135deg, #7f8c8d 0%, #34495e 100%)",
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
