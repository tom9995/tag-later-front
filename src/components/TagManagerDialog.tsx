import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Box,
  Typography,
  Chip,
  Alert,
} from "@mui/material";
import { Edit, Delete, Close } from "@mui/icons-material";
import { Tag, apiService } from "@/services/api";

interface TagManagerDialogProps {
  open: boolean;
  onClose: () => void;
  onTagsUpdated: () => void;
}

const TagManagerDialog: React.FC<TagManagerDialogProps> = ({
  open,
  onClose,
  onTagsUpdated,
}) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#3498db");
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      loadTags();
    }
  }, [open]);

  const loadTags = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTags();
      if (response.success) {
        setTags(response.data);
      } else {
        setError("タグの読み込みに失敗しました");
      }
    } catch (error) {
      console.error("Failed to load tags:", error);
      setError("タグの読み込み中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.createTag({
        name: newTagName.trim(),
        color: newTagColor,
      });

      if (response.success) {
        setTags([...tags, response.data]);
        setNewTagName("");
        setNewTagColor("#3498db");
        onTagsUpdated();
      } else {
        setError(response.error || "タグの作成に失敗しました");
      }
    } catch (error) {
      console.error("Failed to create tag:", error);
      setError("タグの作成中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTag = async () => {
    if (!editingTag) return;

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.updateTag(editingTag.id, {
        name: editingTag.name,
        color: editingTag.color,
      });

      if (response.success) {
        setTags(
          tags.map((tag) => (tag.id === editingTag.id ? response.data : tag))
        );
        setEditingTag(null);
        onTagsUpdated();
      } else {
        setError(response.error || "タグの更新に失敗しました");
      }
    } catch (error) {
      console.error("Failed to update tag:", error);
      setError("タグの更新中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (!confirm("このタグを削除しますか？")) return;

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.deleteTag(tagId);

      if (response.success) {
        setTags(tags.filter((tag) => tag.id !== tagId));
        onTagsUpdated();
      } else {
        setError(response.error || "タグの削除に失敗しました");
      }
    } catch (error) {
      console.error("Failed to delete tag:", error);
      setError("タグの削除中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const colorOptions = [
    "#3498db",
    "#e74c3c",
    "#2ecc71",
    "#f39c12",
    "#9b59b6",
    "#1abc9c",
    "#34495e",
    "#e67e22",
    "#95a5a6",
    "#f1c40f",
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "20px",
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #95a5a6 0%, #bdc3c7 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: 700,
          fontSize: "1.5rem",
        }}
      >
        タグ管理
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* 新しいタグの作成 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "#2c3e50" }}>
            新しいタグを追加
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="タグ名"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              disabled={loading}
            />
            <Button
              variant="contained"
              onClick={handleCreateTag}
              disabled={loading || !newTagName.trim()}
              sx={{
                minWidth: "100px",
                backgroundColor: "#3498db",
                "&:hover": { backgroundColor: "#2980b9" },
              }}
            >
              追加
            </Button>
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {colorOptions.map((color) => (
              <Box
                key={color}
                onClick={() => setNewTagColor(color)}
                sx={{
                  width: 24,
                  height: 24,
                  backgroundColor: color,
                  borderRadius: "50%",
                  cursor: "pointer",
                  border:
                    newTagColor === color
                      ? "3px solid #2c3e50"
                      : "2px solid #ecf0f1",
                  transition: "all 0.2s ease",
                }}
              />
            ))}
          </Box>
        </Box>

        {/* 既存のタグ一覧 */}
        <Typography variant="h6" sx={{ mb: 2, color: "#2c3e50" }}>
          既存のタグ
        </Typography>
        <List sx={{ maxHeight: "300px", overflow: "auto" }}>
          {tags.map((tag) => (
            <ListItem
              key={tag.id}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "12px",
                mb: 1,
                border: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              {editingTag?.id === tag.id ? (
                <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                  <TextField
                    value={editingTag.name}
                    onChange={(e) =>
                      setEditingTag({ ...editingTag, name: e.target.value })
                    }
                    size="small"
                  />
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {colorOptions.map((color) => (
                      <Box
                        key={color}
                        onClick={() => setEditingTag({ ...editingTag, color })}
                        sx={{
                          width: 20,
                          height: 20,
                          backgroundColor: color,
                          borderRadius: "50%",
                          cursor: "pointer",
                          border:
                            editingTag.color === color
                              ? "2px solid #2c3e50"
                              : "1px solid #ecf0f1",
                        }}
                      />
                    ))}
                  </Box>
                  <Button onClick={handleUpdateTag} size="small">
                    保存
                  </Button>
                  <Button onClick={() => setEditingTag(null)} size="small">
                    キャンセル
                  </Button>
                </Box>
              ) : (
                <>
                  <ListItemText
                    primary={
                      <Chip
                        label={tag.name}
                        size="small"
                        sx={{
                          backgroundColor: tag.color,
                          color: "#fff",
                          fontWeight: 500,
                        }}
                      />
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => setEditingTag(tag)}
                      size="small"
                      disabled={loading}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteTag(tag.id)}
                      size="small"
                      disabled={loading}
                      sx={{ color: "#e74c3c" }}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </>
              )}
            </ListItem>
          ))}
        </List>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#95a5a6",
            color: "#95a5a6",
            "&:hover": {
              borderColor: "#7f8c8d",
              backgroundColor: "rgba(127, 140, 141, 0.1)",
            },
          }}
        >
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TagManagerDialog;
