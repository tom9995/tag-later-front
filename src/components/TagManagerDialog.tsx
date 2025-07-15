"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Chip,
  Typography,
  Alert,
  IconButton,
  Stack,
  CircularProgress,
} from "@mui/material";
import { Add, Edit, Delete, Save, Cancel, Palette } from "@mui/icons-material";
import { Tag, apiService } from "@/services/api";

interface TagManagerProps {
  open: boolean;
  onClose: () => void;
  onTagsUpdated?: () => void;
}

const TagManager: React.FC<TagManagerProps> = ({
  open,
  onClose,
  onTagsUpdated,
}) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [newTag, setNewTag] = useState({ name: "", color: "#2196f3" });

  const predefinedColors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
  ];

  useEffect(() => {
    if (open) {
      loadTags();
    }
  }, [open]);

  const loadTags = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getTags();
      if (response.success) {
        setTags(response.data);
      } else {
        setError(response.error || "タグの取得に失敗しました");
        setTags([]); // エラー時は空の配列をセット
      }
    } catch (error) {
      console.error("Failed to load tags:", error);
      setError("タグの取得中にエラーが発生しました");
      setTags([]); // エラー時は空の配列をセット
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async () => {
    if (!newTag.name.trim()) {
      setError("タグ名を入力してください");
      return;
    }

    try {
      const response = await apiService.createTag({
        name: newTag.name.trim(),
        color: newTag.color,
      });

      if (response.success) {
        setTags((prev) => [...prev, response.data]);
        setNewTag({ name: "", color: "#2196f3" });
        setError(null);
        onTagsUpdated?.();
      } else {
        setError(response.error || "タグの作成に失敗しました");
      }
    } catch (error) {
      console.error("Failed to create tag:", error);
      setError("タグの作成中にエラーが発生しました");
    }
  };

  const handleUpdateTag = async (tag: Tag) => {
    if (!tag.name.trim()) {
      setError("タグ名を入力してください");
      return;
    }

    try {
      const response = await apiService.updateTag(tag.id, {
        name: tag.name.trim(),
        color: tag.color,
      });

      if (response.success) {
        setTags((prev) =>
          prev.map((t) => (t.id === tag.id ? response.data : t))
        );
        setEditingTag(null);
        setError(null);
        onTagsUpdated?.();
      } else {
        setError(response.error || "タグの更新に失敗しました");
      }
    } catch (error) {
      console.error("Failed to update tag:", error);
      setError("タグの更新中にエラーが発生しました");
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (
      !window.confirm(
        "このタグを削除しますか？関連するカードからも削除されます。"
      )
    ) {
      return;
    }

    try {
      const response = await apiService.deleteTag(tagId);
      if (response.success) {
        setTags((prev) => prev.filter((t) => t.id !== tagId));
        setError(null);
        onTagsUpdated?.();
      } else {
        setError(response.error || "タグの削除に失敗しました");
      }
    } catch (error) {
      console.error("Failed to delete tag:", error);
      setError("タグの削除中にエラーが発生しました");
    }
  };

  const handleClose = () => {
    setEditingTag(null);
    setNewTag({ name: "", color: "#2196f3" });
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
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
        タグ管理
      </DialogTitle>
      <DialogContent sx={{ px: 3, pb: 2 }}>
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

        {/* 新しいタグの作成 */}
        <Box
          sx={{
            mb: 4,
            p: 3,
            background: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: "rgba(0, 0, 0, 0.8)",
              mb: 2,
            }}
          >
            新しいタグを作成
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <TextField
              label="タグ名"
              value={newTag.name}
              onChange={(e) =>
                setNewTag((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="例: JavaScript"
              sx={{
                minWidth: 200,
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Palette fontSize="small" sx={{ color: "rgba(0, 0, 0, 0.6)" }} />
              <input
                type="color"
                value={newTag.color}
                onChange={(e) =>
                  setNewTag((prev) => ({ ...prev, color: e.target.value }))
                }
                style={{
                  width: 40,
                  height: 40,
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              />
              <Chip
                label={newTag.name || "プレビュー"}
                size="small"
                sx={{
                  backgroundColor: newTag.color + "20",
                  color: newTag.color,
                  borderRadius: "16px",
                  fontWeight: 500,
                }}
              />
            </Box>
            <Button
              variant="contained"
              onClick={handleCreateTag}
              disabled={!newTag.name.trim() || loading}
              startIcon={<Add />}
              sx={{
                borderRadius: "12px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                fontWeight: 600,
                textTransform: "none",
                px: 3,
                boxShadow: "0 4px 15px rgba(103, 126, 234, 0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(103, 126, 234, 0.4)",
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
              タグを作成
            </Button>
          </Box>

          {/* カラーパレット */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              色を選択:
            </Typography>
            <Stack direction="row" spacing={0.5} flexWrap="wrap">
              {predefinedColors.map((color) => (
                <Box
                  key={color}
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: color,
                    borderRadius: "50%",
                    cursor: "pointer",
                    border:
                      newTag.color === color
                        ? "2px solid #000"
                        : "1px solid #ccc",
                    mb: 0.5,
                  }}
                  onClick={() => setNewTag((prev) => ({ ...prev, color }))}
                />
              ))}
            </Stack>
          </Box>
        </Box>

        {/* 既存のタグ一覧 */}
        <Typography variant="h6" gutterBottom>
          既存のタグ ({tags.length})
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : tags.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ py: 4, textAlign: "center" }}
          >
            まだタグがありません
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {tags.map((tag) => (
              <Box
                key={tag.id}
                sx={{
                  p: 1,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  minWidth: 250,
                }}
              >
                {editingTag?.id === tag.id ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexGrow: 1,
                    }}
                  >
                    <TextField
                      size="small"
                      value={editingTag.name}
                      onChange={(e) =>
                        setEditingTag((prev) =>
                          prev ? { ...prev, name: e.target.value } : null
                        )
                      }
                      sx={{ flexGrow: 1 }}
                    />
                    <input
                      type="color"
                      value={editingTag.color}
                      onChange={(e) =>
                        setEditingTag((prev) =>
                          prev ? { ...prev, color: e.target.value } : null
                        )
                      }
                      style={{
                        width: 30,
                        height: 30,
                        border: "none",
                        borderRadius: 4,
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleUpdateTag(editingTag)}
                      color="primary"
                    >
                      <Save />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setEditingTag(null)}
                    >
                      <Cancel />
                    </IconButton>
                  </Box>
                ) : (
                  <>
                    <Chip
                      label={tag.name}
                      size="small"
                      sx={{
                        backgroundColor: tag.color + "20",
                        color: tag.color,
                        flexGrow: 1,
                        justifyContent: "flex-start",
                      }}
                    />
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => setEditingTag(tag)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteTag(tag.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </>
                )}
              </Box>
            ))}
          </Box>
        )}
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
            px: 4,
            "&:hover": {
              borderColor: "#667eea",
              backgroundColor: "rgba(103, 126, 234, 0.05)",
              transform: "translateY(-2px)",
            },
            transition: "all 0.3s ease",
          }}
        >
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TagManager;
