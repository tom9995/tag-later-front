import React from "react";
import {
  Box,
  Chip,
  IconButton,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { Tag } from "@/services/api";

interface TagListProps {
  tags: Tag[];
  loading: boolean;
  onEditTag: (tag: Tag) => void;
  onDeleteTag: (tagId: string) => void;
}

export const TagList: React.FC<TagListProps> = ({
  tags,
  loading,
  onEditTag,
  onDeleteTag,
}) => {
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (tags.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          タグがありません
        </Typography>
        <Typography variant="body2" color="text.secondary">
          新しいタグを追加してください
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>
        既存のタグ
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          flexWrap: "wrap",
          gap: 1,
          maxHeight: "300px",
          overflowY: "auto",
        }}
      >
        {tags.map((tag) => (
          <Chip
            key={tag.id}
            label={tag.name}
            sx={{
              backgroundColor: tag.color + "20",
              borderColor: tag.color,
              color: tag.color,
              border: "1px solid",
              fontWeight: 500,
              "& .MuiChip-deleteIcon": {
                color: tag.color,
                "&:hover": {
                  color: tag.color,
                  opacity: 0.7,
                },
              },
            }}
            onDelete={() => onDeleteTag(tag.id)}
            deleteIcon={
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditTag(tag);
                  }}
                  sx={{
                    width: 20,
                    height: 20,
                    color: tag.color,
                    "&:hover": {
                      backgroundColor: tag.color + "20",
                    },
                  }}
                >
                  <Edit sx={{ fontSize: 14 }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTag(tag.id);
                  }}
                  sx={{
                    width: 20,
                    height: 20,
                    color: tag.color,
                    "&:hover": {
                      backgroundColor: "#f4433620",
                      color: "#f44336",
                    },
                  }}
                >
                  <Delete sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            }
          />
        ))}
      </Stack>
    </Box>
  );
};
