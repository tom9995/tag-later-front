"use client";

import React, { useState, useEffect } from "react";
import {
  Card as MuiCard,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Alert,
  Box,
  IconButton,
  Collapse,
  Autocomplete,
  Chip,
} from "@mui/material";
import { Add, Close, Link } from "@mui/icons-material";
import { Card, apiService, CreateCardData, Tag } from "@/services/api";

interface AddCardFormProps {
  onCardAdded: (card: Card) => void;
  onCancel?: () => void;
}

const AddCardForm: React.FC<AddCardFormProps> = ({ onCardAdded, onCancel }) => {
  const [formData, setFormData] = useState<CreateCardData>({
    title: "",
    url: "",
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
        setAvailableTags([]); // エラー時は空の配列をセット
      }
    } catch (error) {
      console.error("Failed to load tags:", error);
      setAvailableTags([]); // エラー時は空の配列をセット
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
          url: "",
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
    if (!formData.url.trim()) return;

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

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {/* URL */}
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              label="URL"
              type="url"
              value={formData.url}
              onChange={handleInputChange("url")}
              placeholder="https://example.com/article"
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
            <Button
              variant="outlined"
              onClick={handleUrlParse}
              disabled={isSubmitting || !formData.url.trim()}
              startIcon={<Link />}
              sx={{
                minWidth: "120px",
                px: 3,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                color: "white",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(103, 126, 234, 0.3)",
                },
                "&:disabled": {
                  background: "rgba(0, 0, 0, 0.12)",
                  color: "rgba(0, 0, 0, 0.26)",
                },
                transition: "all 0.3s ease",
              }}
            >
              解析
            </Button>
          </Box>

          {/* Title */}
          <TextField
            fullWidth
            required
            label="タイトル"
            value={formData.title}
            onChange={handleInputChange("title")}
            placeholder="記事のタイトル"
            variant="outlined"
            sx={{
              mb: 3,
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

          {/* Description */}
          <TextField
            fullWidth
            label="説明"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleInputChange("description")}
            placeholder="記事の説明や感想"
            variant="outlined"
            sx={{
              mb: 3,
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

          {/* Options */}
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.is_favorite}
                onChange={handleInputChange("is_favorite")}
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
              mb: 3,
              "& .MuiFormControlLabel-label": {
                fontSize: "1rem",
                color: "rgba(0, 0, 0, 0.8)",
                fontWeight: 500,
              },
            }}
          />

          {/* Tags */}
          <Autocomplete
            multiple
            options={availableTags}
            getOptionLabel={(option) => option.name}
            value={selectedTags}
            onChange={(_, newValue) => setSelectedTags(newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option.id}
                  label={option.name}
                  sx={{
                    backgroundColor: option.color + "20",
                    color: option.color,
                    borderRadius: "20px",
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: option.color + "30",
                    },
                  }}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="タグ"
                placeholder="タグを選択してください"
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
            )}
            sx={{ mb: 3 }}
          />
        </Box>
      </CardContent>

      <CardActions sx={{ px: 4, pb: 4, pt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isSubmitting}
          startIcon={<Add />}
          onClick={handleSubmit}
          sx={{
            mr: onCancel ? 2 : 0,
            height: "48px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            fontSize: "1rem",
            fontWeight: 600,
            textTransform: "none",
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
          {isSubmitting ? "追加中..." : "カードを追加"}
        </Button>
        {onCancel && (
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={isSubmitting}
            sx={{
              height: "48px",
              borderRadius: "12px",
              borderColor: "rgba(103, 126, 234, 0.3)",
              color: "#667eea",
              fontSize: "1rem",
              fontWeight: 500,
              textTransform: "none",
              "&:hover": {
                borderColor: "#667eea",
                backgroundColor: "rgba(103, 126, 234, 0.05)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            キャンセル
          </Button>
        )}
      </CardActions>
    </MuiCard>
  );
};

export default AddCardForm;
