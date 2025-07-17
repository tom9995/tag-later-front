import React from "react";
import { Button, Box } from "@mui/material";
import { Add, Close } from "@mui/icons-material";

interface FormActionsProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
  isSubmitting: boolean;
  isFormValid: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onSubmit,
  onCancel,
  isSubmitting,
  isFormValid,
}) => {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        display: "flex",
        gap: 2,
        justifyContent: "flex-end",
        mt: 4,
      }}
    >
      {onCancel && (
        <Button
          variant="outlined"
          onClick={onCancel}
          startIcon={<Close />}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: "12px",
            borderColor: "rgba(103, 126, 234, 0.3)",
            color: "#667eea",
            "&:hover": {
              borderColor: "#667eea",
              backgroundColor: "rgba(103, 126, 234, 0.1)",
              transform: "translateY(-2px)",
            },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          キャンセル
        </Button>
      )}
      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting || !isFormValid}
        startIcon={<Add />}
        sx={{
          px: 4,
          py: 1.5,
          borderRadius: "12px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
          "&:hover": {
            background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
            transform: "translateY(-2px)",
            boxShadow: "0 8px 25px rgba(102, 126, 234, 0.6)",
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
        {isSubmitting ? "追加中..." : "カードを追加"}
      </Button>
    </Box>
  );
};
