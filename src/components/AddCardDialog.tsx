import React, { useState } from "react";
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
} from "@mui/material";
import { createCard } from "../services/api";

interface AddCardDialogProps {
  open: boolean;
  onClose: () => void;
  onCardAdded: (card: any) => void;
}

export default function AddCardDialog({
  open,
  onClose,
  onCardAdded,
}: AddCardDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: event.target.value });
    };

  const handleSubmit = async () => {
    if (!formData.title || !formData.url) {
      setError("タイトルとURLは必須です");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cardData = {
        title: formData.title,
        url: formData.url,
        description: formData.description,
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
      };

      console.log("Sending card data:", cardData);

      // 直接fetch APIを使用してバックエンドに送信
      const response = await fetch("http://localhost:8765/api/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cardData),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Response data:", result);

      // 成功した場合、カードデータを親コンポーネントに渡す
      if (result.success) {
        onCardAdded(result.data);
        handleClose();
      } else {
        setError(
          "カードの作成に失敗しました: " + (result.message || "不明なエラー")
        );
      }
    } catch (err) {
      setError(
        "カードの作成に失敗しました: " +
          (err instanceof Error ? err.message : "不明なエラー")
      );
      console.error("Error creating card:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ title: "", url: "", description: "", tags: "" });
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>新しいカードを追加</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
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
          />

          <TextField
            fullWidth
            label="URL *"
            value={formData.url}
            onChange={handleInputChange("url")}
            margin="normal"
            variant="outlined"
            type="url"
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
          />

          <TextField
            fullWidth
            label="タグ (カンマ区切り)"
            value={formData.tags}
            onChange={handleInputChange("tags")}
            margin="normal"
            variant="outlined"
            placeholder="例: JavaScript, React, プログラミング"
          />

          {formData.tags && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="textSecondary">
                プレビュー:
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                {formData.tags.split(",").map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag.trim()}
                    size="small"
                    sx={{ mr: 0.5, mb: 0.5 }}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>キャンセル</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.title || !formData.url}
        >
          {loading ? "作成中..." : "作成"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
