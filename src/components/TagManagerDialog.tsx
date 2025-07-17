"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from "@mui/material";
import { Tag, apiService } from "@/services/api";
import { TagList, TagEditor } from "./TagManagerDialog/index";

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

  useEffect(() => {
    if (open) {
      loadTags();
    }
  }, [open]);

  const loadTags = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getTags();
      if (response.success) {
        setTags(response.data);
      } else {
        setError(response.error || "タグの読み込みに失敗しました");
      }
    } catch (error) {
      console.error("Failed to load tags:", error);
      setError("タグの読み込み中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNewTag = async () => {
    if (!newTag.name.trim()) return;

    setError(null);
    try {
      const response = await apiService.createTag({
        name: newTag.name.trim(),
        color: newTag.color,
      });

      if (response.success) {
        setTags((prev) => [...prev, response.data]);
        setNewTag({ name: "", color: "#2196f3" });
        onTagsUpdated?.();
      } else {
        setError(response.error || "タグの作成に失敗しました");
      }
    } catch (error) {
      console.error("Failed to create tag:", error);
      setError("タグの作成中にエラーが発生しました");
    }
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTag({ ...tag });
    setError(null);
  };

  const handleUpdateTag = async () => {
    if (!editingTag || !editingTag.name.trim()) return;

    setError(null);
    try {
      const response = await apiService.updateTag(editingTag.id, {
        name: editingTag.name.trim(),
        color: editingTag.color,
      });

      if (response.success) {
        setTags((prev) =>
          prev.map((tag) => (tag.id === editingTag.id ? response.data : tag))
        );
        setEditingTag(null);
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
    if (!window.confirm("このタグを削除しますか？")) return;

    setError(null);
    try {
      const response = await apiService.deleteTag(tagId);
      if (response.success) {
        setTags((prev) => prev.filter((tag) => tag.id !== tagId));
        onTagsUpdated?.();
      } else {
        setError(response.error || "タグの削除に失敗しました");
      }
    } catch (error) {
      console.error("Failed to delete tag:", error);
      setError("タグの削除中にエラーが発生しました");
    }
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    setError(null);
  };

  const handleNewTagChange = (field: "name" | "color", value: string) => {
    setNewTag((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditingTagChange = (field: "name" | "color", value: string) => {
    if (editingTag) {
      setEditingTag((prev) => ({ ...prev!, [field]: value }));
    }
  };

  const handleClose = () => {
    setEditingTag(null);
    setError(null);
    setNewTag({ name: "", color: "#2196f3" });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>タグ管理</DialogTitle>

      <DialogContent>
        <TagList
          tags={tags}
          loading={loading}
          onEditTag={handleEditTag}
          onDeleteTag={handleDeleteTag}
        />

        {tags.length > 0 && <Divider sx={{ my: 3 }} />}

        <TagEditor
          editingTag={editingTag}
          newTag={newTag}
          error={error}
          onNewTagChange={handleNewTagChange}
          onSaveNewTag={handleSaveNewTag}
          onUpdateTag={handleUpdateTag}
          onCancelEdit={handleCancelEdit}
          onEditingTagChange={handleEditingTagChange}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>閉じる</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TagManager;
