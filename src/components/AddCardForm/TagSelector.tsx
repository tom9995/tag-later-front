import React from "react";
import { Autocomplete, TextField, Chip, Box, Typography } from "@mui/material";
import { Tag } from "@/services/api";

interface TagSelectorProps {
  selectedTags: Tag[];
  availableTags: Tag[];
  onTagChange: (newValue: Tag[]) => void;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  availableTags,
  onTagChange,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="subtitle1"
        sx={{
          mb: 2,
          color: "rgba(0, 0, 0, 0.8)",
          fontWeight: 600,
        }}
      >
        タグ
      </Typography>
      <Autocomplete
        multiple
        id="tags-filled"
        options={availableTags}
        value={selectedTags}
        onChange={(_, newValue) => onTagChange(newValue)}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Chip
                key={key}
                variant="outlined"
                label={option.name}
                {...tagProps}
                sx={{
                  backgroundColor: "rgba(103, 126, 234, 0.1)",
                  borderColor: "#667eea",
                  color: "#667eea",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "rgba(103, 126, 234, 0.2)",
                  },
                  "& .MuiChip-deleteIcon": {
                    color: "#667eea",
                    "&:hover": {
                      color: "#5a6fd8",
                    },
                  },
                }}
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="タグを選択してください"
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
            }}
          />
        )}
        sx={{
          "& .MuiAutocomplete-tag": {
            margin: "2px",
          },
        }}
      />
    </Box>
  );
};
