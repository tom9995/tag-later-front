import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Chip,
  Typography,
  Alert,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Card, apiService, UpdateCardData } from "@/services/api";

interface EditCardDialogProps {
  open: boolean;
  onClose: () => void;
  onCardUpdated: (card: Card) => void;
  card: Card;
}

export default function EditCardDialog({
  open,
  onClose,
  onCardUpdated,
  card,
}: EditCardDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    tags: "",
    is_read: false,
    is_favorite: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (card) {
      setFormData({
        title: card.title || "",
        url: card.url || "",
        description: card.description || "",
        tags: card.tags
          ? card.tags.map((tag: any) => tag.name || tag).join(", ")
          : "",
        is_read: card.is_read || false,
        is_favorite: card.is_favorite || false,
      });
    }
  }, [card]);

  const handleInputChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: event.target.value });
    };

  const handleCheckboxChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: event.target.checked });
    };

  const handleSubmit = async () => {
    if (!formData.title || !formData.url) {
      setError("タイトルとURLは必須です");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updateData: UpdateCardData = {
        title: formData.title,
        url: formData.url,
        description: formData.description,
        is_read: formData.is_read,
        is_favorite: formData.is_favorite,
      };

      const response = await apiService.updateCard(card.id, updateData);

      if (response.success) {
        onCardUpdated(response.data);
        handleClose();
      } else {
        setError(response.error || "カードの更新に失敗しました");
      }
    } catch (err) {
      setError("カードの更新に失敗しました");
      console.error("Error updating card:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: 700,
          fontSize: "1.5rem",
          pb: 1,
        }}
      >
        カードを編集
      </DialogTitle>
      <DialogContent sx={{ px: 3, pb: 2 }}>
        <Box sx={{ pt: 2 }}>
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                backgroundColor: "rgba(244, 67, 54, 0.1)",
                border: "1px solid rgba(244, 67, 54, 0.2)",
                borderRadius: "12px",
                "& .MuiAlert-icon": {
                  color: "#f44336",
                },
              }}
            >
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="タイトル *"
            value={formData.title}
            onChange={handleInputChange("title")}
            margin="normal"
            variant="outlined"
            sx={{
              mb: 2,
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
            label="URL *"
            value={formData.url}
            onChange={handleInputChange("url")}
            margin="normal"
            variant="outlined"
            type="url"
            sx={{
              mb: 2,
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
            value={formData.description}
            onChange={handleInputChange("description")}
            margin="normal"
            variant="outlined"
            multiline
            rows={3}
            sx={{
              mb: 2,
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
            label="タグ (カンマ区切り)"
            value={formData.tags}
            onChange={handleInputChange("tags")}
            margin="normal"
            variant="outlined"
            placeholder="例: JavaScript, React, プログラミング"
            sx={{
              mb: 2,
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

          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.is_read}
                  onChange={handleCheckboxChange("is_read")}
                  sx={{
                    color: "rgba(103, 126, 234, 0.6)",
                    "&.Mui-checked": {
                      color: "#667eea",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(103, 126, 234, 0.1)",
                    },
                  }}
                />
              }
              label="既読にする"
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "1rem",
                  color: "rgba(0, 0, 0, 0.8)",
                  fontWeight: 500,
                },
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.is_favorite}
                  onChange={handleCheckboxChange("is_favorite")}
                  sx={{
                    color: "rgba(103, 126, 234, 0.6)",
                    "&.Mui-checked": {
                      color: "#667eea",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(103, 126, 234, 0.1)",
                    },
                  }}
                />
              }
              label="お気に入りに追加"
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "1rem",
                  color: "rgba(0, 0, 0, 0.8)",
                  fontWeight: 500,
                },
              }}
            />
          </Box>

          {formData.tags && (
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(0, 0, 0, 0.6)",
                  fontWeight: 500,
                }}
              >
                タグプレビュー:
              </Typography>
              <Box sx={{ mt: 1 }}>
                {formData.tags.split(",").map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag.trim()}
                    size="small"
                    sx={{
                      mr: 1,
                      mb: 1,
                      backgroundColor: "rgba(103, 126, 234, 0.1)",
                      color: "#667eea",
                      borderRadius: "16px",
                      fontWeight: 500,
                      "&:hover": {
                        backgroundColor: "rgba(103, 126, 234, 0.2)",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
        <Button
          onClick={handleClose}
          sx={{
            borderRadius: "12px",
            borderColor: "rgba(103, 126, 234, 0.3)",
            color: "#667eea",
            fontSize: "1rem",
            fontWeight: 500,
            textTransform: "none",
            px: 3,
            "&:hover": {
              borderColor: "#667eea",
              backgroundColor: "rgba(103, 126, 234, 0.05)",
            },
            transition: "all 0.3s ease",
          }}
        >
          キャンセル
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.title || !formData.url}
          sx={{
            borderRadius: "12px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            fontSize: "1rem",
            fontWeight: 600,
            textTransform: "none",
            px: 4,
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
          {loading ? "更新中..." : "更新"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
