import React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
} from "@mui/material";
import { Add, Save, Cancel } from "@mui/icons-material";
import { Tag } from "@/services/api";
import { ColorPicker } from "./ColorPicker";

interface TagEditorProps {
  editingTag: Tag | null;
  newTag: { name: string; color: string };
  error: string | null;
  onNewTagChange: (field: "name" | "color", value: string) => void;
  onSaveNewTag: () => void;
  onUpdateTag: () => void;
  onCancelEdit: () => void;
  onEditingTagChange: (field: "name" | "color", value: string) => void;
}

export const TagEditor: React.FC<TagEditorProps> = ({
  editingTag,
  newTag,
  error,
  onNewTagChange,
  onSaveNewTag,
  onUpdateTag,
  onCancelEdit,
  onEditingTagChange,
}) => {
  return (
    <Box>
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            backgroundColor: "rgba(244, 67, 54, 0.1)",
            border: "1px solid rgba(244, 67, 54, 0.2)",
            borderRadius: "8px",
          }}
        >
          {error}
        </Alert>
      )}

      {editingTag ? (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>
            タグを編集
          </Typography>
          <TextField
            fullWidth
            label="タグ名"
            value={editingTag.name}
            onChange={(e) => onEditingTagChange("name", e.target.value)}
            sx={{ mb: 2 }}
          />
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, color: "text.secondary" }}
          >
            カラー
          </Typography>
          <ColorPicker
            selectedColor={editingTag.color}
            onColorChange={(color) => onEditingTagChange("color", color)}
          />
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={onUpdateTag}
              sx={{
                background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #45a049 0%, #3d8b40 100%)",
                },
              }}
            >
              保存
            </Button>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={onCancelEdit}
            >
              キャンセル
            </Button>
          </Stack>
        </Box>
      ) : (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>
            新しいタグを追加
          </Typography>
          <TextField
            fullWidth
            label="タグ名"
            value={newTag.name}
            onChange={(e) => onNewTagChange("name", e.target.value)}
            sx={{ mb: 2 }}
            placeholder="タグ名を入力してください"
          />
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, color: "text.secondary" }}
          >
            カラー
          </Typography>
          <ColorPicker
            selectedColor={newTag.color}
            onColorChange={(color) => onNewTagChange("color", color)}
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onSaveNewTag}
            disabled={!newTag.name.trim()}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
              },
              "&:disabled": {
                background: "rgba(0, 0, 0, 0.12)",
                color: "rgba(0, 0, 0, 0.26)",
              },
            }}
          >
            追加
          </Button>
        </Box>
      )}
    </Box>
  );
};
