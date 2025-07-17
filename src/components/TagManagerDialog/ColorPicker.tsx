import React from "react";
import { Box, Paper } from "@mui/material";

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

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
  "#795548",
  "#9e9e9e",
  "#607d8b",
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorChange,
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(32px, 1fr))",
          gap: 1,
          maxWidth: "400px",
        }}
      >
        {predefinedColors.map((color) => (
          <Paper
            key={color}
            elevation={selectedColor === color ? 3 : 1}
            sx={{
              width: 32,
              height: 32,
              backgroundColor: color,
              cursor: "pointer",
              border: selectedColor === color ? "3px solid #333" : "none",
              borderRadius: "8px",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "scale(1.1)",
                elevation: 3,
              },
            }}
            onClick={() => onColorChange(color)}
          />
        ))}
      </Box>
    </Box>
  );
};
