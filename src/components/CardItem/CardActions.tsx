"use client";

import React from "react";
import {
  CardActions as MuiCardActions,
  Button,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Visibility,
  VisibilityOff,
  Edit,
  Delete,
  OpenInNew,
} from "@mui/icons-material";
import { Card } from "@/services/api";

interface CardActionsProps {
  card: Card;
  onToggleFavorite: () => void;
  onToggleRead: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isUpdating: boolean;
}

const CardActions: React.FC<CardActionsProps> = ({
  card,
  onToggleFavorite,
  onToggleRead,
  onEdit,
  onDelete,
  isUpdating,
}) => {
  return (
    <MuiCardActions
      sx={{
        p: 3,
        pt: 0,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 1,
      }}
    >
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Tooltip
          title={card.is_favorite ? "お気に入りから削除" : "お気に入りに追加"}
        >
          <IconButton
            onClick={onToggleFavorite}
            disabled={isUpdating}
            sx={{
              color: card.is_favorite ? "#ff6b6b" : "rgba(0, 0, 0, 0.6)",
              "&:hover": {
                backgroundColor: card.is_favorite
                  ? "rgba(255, 107, 107, 0.1)"
                  : "rgba(0, 0, 0, 0.04)",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease",
            }}
          >
            {card.is_favorite ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Tooltip>

        <Tooltip title={card.is_read ? "未読にする" : "既読にする"}>
          <IconButton
            onClick={onToggleRead}
            disabled={isUpdating}
            sx={{
              color: card.is_read ? "#4caf50" : "rgba(0, 0, 0, 0.6)",
              "&:hover": {
                backgroundColor: card.is_read
                  ? "rgba(76, 175, 80, 0.1)"
                  : "rgba(0, 0, 0, 0.04)",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease",
            }}
          >
            {card.is_read ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </Tooltip>

        <Tooltip title="編集">
          <IconButton
            onClick={onEdit}
            disabled={isUpdating}
            sx={{
              color: "rgba(0, 0, 0, 0.6)",
              "&:hover": {
                backgroundColor: "rgba(103, 126, 234, 0.1)",
                color: "#667eea",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <Edit />
          </IconButton>
        </Tooltip>

        <Tooltip title="削除">
          <IconButton
            onClick={onDelete}
            disabled={isUpdating}
            sx={{
              color: "rgba(0, 0, 0, 0.6)",
              "&:hover": {
                backgroundColor: "rgba(244, 67, 54, 0.1)",
                color: "#f44336",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>

      {card.url && (
        <Button
          variant="outlined"
          startIcon={<OpenInNew />}
          onClick={() => window.open(card.url, "_blank")}
          sx={{
            borderRadius: 3,
            px: 3,
            borderColor: "#667eea",
            color: "#667eea",
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              borderColor: "#764ba2",
              color: "#764ba2",
              backgroundColor: "rgba(118, 75, 162, 0.05)",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(103, 126, 234, 0.2)",
            },
            transition: "all 0.3s ease",
          }}
        >
          記事を開く
        </Button>
      )}
    </MuiCardActions>
  );
};

export default CardActions;
