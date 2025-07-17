"use client";

import React, { useState, useEffect } from "react";
import {
  Card as MuiCard,
  CardContent,
  Typography,
  Alert,
  Box,
  IconButton,
  Collapse,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { Card, apiService, CreateCardData, Tag } from "@/services/api";
import { FormFields, TagSelector, FormActions } from "./AddCardForm/index";

interface AddCardFormProps {
  onCardAdded: (card: Card) => void;
  onCancel?: () => void;
}

const AddCardForm: React.FC<AddCardFormProps> = ({ onCardAdded, onCancel }) => {
  const [formData, setFormData] = useState<CreateCardData>({
    title: "",
    url: undefined,
    description: "",
    is_favorite: false,
  });
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const response = await apiService.getTags();
      if (response.success) {
        setAvailableTags(response.data);
      } else {
        setAvailableTags([]);
      }
    } catch (error) {
      console.error("Failed to load tags:", error);
      setAvailableTags([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("タイトルは必須項目です");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await apiService.createCard({
        ...formData,
        title: formData.title.trim(),
        url: formData.url?.trim() || undefined,
        description: formData.description?.trim() || undefined,
      });

      if (response.success) {
        onCardAdded(response.data);
        // フォームをリセット
        setFormData({
          title: "",
          url: undefined,
          description: "",
          is_favorite: false,
        });
        setSelectedTags([]);
      } else {
        setError(response.error || "カードの追加に失敗しました");
      }
    } catch (error) {
      console.error("Failed to create card:", error);
      setError("カードの追加中にエラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUrlParse = async () => {
    if (!formData.url?.trim()) return;

    try {
      setIsSubmitting(true);
      // 将来的にURL解析APIを実装予定
      console.log("URL解析機能は将来実装予定:", formData.url);
    } catch (error) {
      console.error("Failed to parse URL:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange =
    (field: keyof CreateCardData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]:
          field === "is_favorite"
            ? (e.target as HTMLInputElement).checked
            : e.target.value,
      }));
    };

  const handleTagChange = (newTags: Tag[]) => {
    setSelectedTags(newTags);
  };

  const isFormValid = formData.title.trim().length > 0;

  return (
    <MuiCard
      sx={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "20px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 700,
              fontSize: "1.5rem",
            }}
          >
            新しいカードを追加
          </Typography>
          {onCancel && (
            <IconButton
              onClick={onCancel}
              size="small"
              sx={{
                backgroundColor: "rgba(103, 126, 234, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(103, 126, 234, 0.2)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <Close />
            </IconButton>
          )}
        </Box>

        <Collapse in={!!error}>
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
        </Collapse>

        <FormFields
          formData={formData}
          onInputChange={handleInputChange}
          onUrlParse={handleUrlParse}
          isSubmitting={isSubmitting}
        />

        <TagSelector
          selectedTags={selectedTags}
          availableTags={availableTags}
          onTagChange={handleTagChange}
        />

        <FormActions
          onSubmit={handleSubmit}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          isFormValid={isFormValid}
        />
      </CardContent>
    </MuiCard>
  );
};

export default AddCardForm;
