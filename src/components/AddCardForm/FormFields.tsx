import React from "react";
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material";
import { Link } from "@mui/icons-material";
import { CreateCardData } from "@/services/api";

interface FormFieldsProps {
  formData: CreateCardData;
  onInputChange: (
    field: keyof CreateCardData
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onUrlParse: () => void;
  isSubmitting: boolean;
}

export const FormFields: React.FC<FormFieldsProps> = ({
  formData,
  onInputChange,
  onUrlParse,
  isSubmitting,
}) => {
  return (
    <>
      {/* URL */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="URL"
          type="url"
          value={formData.url || ""}
          onChange={onInputChange("url")}
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
          onClick={onUrlParse}
          disabled={isSubmitting || !formData.url?.trim()}
          startIcon={<Link />}
          sx={{
            minWidth: "120px",
            px: 3,
            borderRadius: "12px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            color: "white",
            "&:hover": {
              background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
            },
            "&:disabled": {
              background: "rgba(0, 0, 0, 0.12)",
              color: "rgba(0, 0, 0, 0.26)",
              transform: "none",
              boxShadow: "none",
            },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          解析
        </Button>
      </Box>

      {/* タイトル */}
      <TextField
        fullWidth
        label="タイトル"
        required
        value={formData.title}
        onChange={onInputChange("title")}
        placeholder="記事やページのタイトルを入力してください"
        margin="normal"
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

      {/* 説明 */}
      <TextField
        fullWidth
        label="説明"
        multiline
        rows={4}
        value={formData.description || ""}
        onChange={onInputChange("description")}
        placeholder="このカードの説明やメモを入力してください"
        margin="normal"
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

      {/* お気に入り */}
      <FormControlLabel
        control={
          <Checkbox
            checked={formData.is_favorite}
            onChange={onInputChange("is_favorite")}
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
            color: "rgba(0, 0, 0, 0.8)",
            fontWeight: 500,
          },
        }}
      />
    </>
  );
};
