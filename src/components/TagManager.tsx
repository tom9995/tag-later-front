'use client';

import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Palette,
} from '@mui/icons-material';
import { Tag, apiService } from '@/services/api';

interface TagManagerProps {
  open: boolean;
  onClose: () => void;
  onTagsUpdated?: () => void;
}

const TagManager: React.FC<TagManagerProps> = ({ open, onClose, onTagsUpdated }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [newTag, setNewTag] = useState({ name: '', color: '#2196f3' });

  const predefinedColors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7',
    '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
    '#009688', '#4caf50', '#8bc34a', '#cddc39',
    '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
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
        setError(response.error || 'タグの取得に失敗しました');
      }
    } catch (error) {
      console.error('Failed to load tags:', error);
      setError('タグの取得中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async () => {
    if (!newTag.name.trim()) {
      setError('タグ名を入力してください');
      return;
    }

    try {
      const response = await apiService.createTag({
        name: newTag.name.trim(),
        color: newTag.color,
      });

      if (response.success) {
        setTags(prev => [...prev, response.data]);
        setNewTag({ name: '', color: '#2196f3' });
        setError(null);
        onTagsUpdated?.();
      } else {
        setError(response.error || 'タグの作成に失敗しました');
      }
    } catch (error) {
      console.error('Failed to create tag:', error);
      setError('タグの作成中にエラーが発生しました');
    }
  };

  const handleUpdateTag = async (tag: Tag) => {
    if (!tag.name.trim()) {
      setError('タグ名を入力してください');
      return;
    }

    try {
      const response = await apiService.updateTag(tag.id, {
        name: tag.name.trim(),
        color: tag.color,
      });

      if (response.success) {
        setTags(prev => prev.map(t => t.id === tag.id ? response.data : t));
        setEditingTag(null);
        setError(null);
        onTagsUpdated?.();
      } else {
        setError(response.error || 'タグの更新に失敗しました');
      }
    } catch (error) {
      console.error('Failed to update tag:', error);
      setError('タグの更新中にエラーが発生しました');
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (!window.confirm('このタグを削除しますか？関連するカードからも削除されます。')) {
      return;
    }

    try {
      const response = await apiService.deleteTag(tagId);
      if (response.success) {
        setTags(prev => prev.filter(t => t.id !== tagId));
        setError(null);
        onTagsUpdated?.();
      } else {
        setError(response.error || 'タグの削除に失敗しました');
      }
    } catch (error) {
      console.error('Failed to delete tag:', error);
      setError('タグの削除中にエラーが発生しました');
    }
  };

  const handleClose = () => {
    setEditingTag(null);
    setNewTag({ name: '', color: '#2196f3' });
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>タグ管理</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* 新しいタグの作成 */}
        <Box sx={{ mb: 3, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            新しいタグを作成
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              label="タグ名"
              value={newTag.name}
              onChange={(e) => setNewTag(prev => ({ ...prev, name: e.target.value }))}
              placeholder="例: JavaScript"
              sx={{ minWidth: 200 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Palette fontSize="small" />
              <input
                type="color"
                value={newTag.color}
                onChange={(e) => setNewTag(prev => ({ ...prev, color: e.target.value }))}
                style={{ width: 40, height: 40, border: 'none', borderRadius: 4 }}
              />
              <Chip
                label={newTag.name || 'プレビュー'}
                size="small"
                sx={{ backgroundColor: newTag.color + '20', color: newTag.color }}
              />
            </Box>
            <Button
              variant="contained"
              onClick={handleCreateTag}
              startIcon={<Add />}
              disabled={!newTag.name.trim()}
            >
              作成
            </Button>
          </Box>

          {/* カラーパレット */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              色を選択:
            </Typography>
            <Stack direction="row" spacing={0.5} flexWrap="wrap">
              {predefinedColors.map(color => (
                <Box
                  key={color}
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: color,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    border: newTag.color === color ? '2px solid #000' : '1px solid #ccc',
                    mb: 0.5,
                  }}
                  onClick={() => setNewTag(prev => ({ ...prev, color }))}
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
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : tags.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            まだタグがありません
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tags.map(tag => (
              <Box
                key={tag.id}
                sx={{
                  p: 1,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minWidth: 250,
                }}
              >
                  {editingTag?.id === tag.id ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
                      <TextField
                        size="small"
                        value={editingTag.name}
                        onChange={(e) => setEditingTag(prev => prev ? { ...prev, name: e.target.value } : null)}
                        sx={{ flexGrow: 1 }}
                      />
                      <input
                        type="color"
                        value={editingTag.color}
                        onChange={(e) => setEditingTag(prev => prev ? { ...prev, color: e.target.value } : null)}
                        style={{ width: 30, height: 30, border: 'none', borderRadius: 4 }}
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
                          backgroundColor: tag.color + '20',
                          color: tag.color,
                          flexGrow: 1,
                          justifyContent: 'flex-start',
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
        </Box>
      </DialogContent>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>閉じる</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TagManager;
