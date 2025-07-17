"use client";

import React from "react";
import {
  CardContent as MuiCardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  Avatar,
  Stack,
} from "@mui/material";
import { Schedule, Person, CalendarToday } from "@mui/icons-material";
import { Card } from "@/services/api";

interface CardContentProps {
  card: Card;
}

const CardContent: React.FC<CardContentProps> = ({ card }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getReadingTimeText = (minutes?: number) => {
    if (!minutes) return "読了時間未設定";
    if (minutes < 1) return "1分未満";
    return `約${minutes}分`;
  };

  return (
    <MuiCardContent sx={{ p: 3, pb: 0 }}>
      {/* Thumbnail */}
      {card.thumbnail_url && (
        <CardMedia
          component="img"
          height="200"
          image={card.thumbnail_url}
          alt={card.title}
          sx={{
            borderRadius: 2,
            mb: 3,
            objectFit: "cover",
            backgroundColor: "rgba(0, 0, 0, 0.02)",
          }}
        />
      )}

      {/* Status Indicators */}
      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
        <Chip
          label={card.is_read ? "既読" : "未読"}
          size="small"
          sx={{
            backgroundColor: card.is_read
              ? "rgba(76, 175, 80, 0.1)"
              : "rgba(255, 152, 0, 0.1)",
            color: card.is_read ? "#4caf50" : "#ff9800",
            fontWeight: 500,
            borderRadius: "12px",
          }}
        />
        {card.is_favorite && (
          <Chip
            label="お気に入り"
            size="small"
            sx={{
              backgroundColor: "rgba(255, 107, 107, 0.1)",
              color: "#ff6b6b",
              fontWeight: 500,
              borderRadius: "12px",
            }}
          />
        )}
      </Box>

      {/* Title */}
      <Typography
        variant="h6"
        component="h3"
        gutterBottom
        sx={{
          fontWeight: 600,
          lineHeight: 1.3,
          color: "#333",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          mb: 2,
        }}
      >
        {card.title}
      </Typography>

      {/* Description */}
      {card.description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 3,
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {card.description}
        </Typography>
      )}

      {/* Tags */}
      {card.tags && card.tags.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            {card.tags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                size="small"
                sx={{
                  backgroundColor: tag.color + "20",
                  color: tag.color,
                  borderRadius: "16px",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                  "&:hover": {
                    backgroundColor: tag.color + "30",
                  },
                }}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Meta Information */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2 }}>
        {/* Reading Time */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Schedule sx={{ fontSize: 16, color: "rgba(0, 0, 0, 0.6)" }} />
          <Typography variant="caption" color="text.secondary">
            {getReadingTimeText(card.reading_time)}
          </Typography>
        </Box>

        {/* Author */}
        {card.author && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Person sx={{ fontSize: 16, color: "rgba(0, 0, 0, 0.6)" }} />
            <Typography variant="caption" color="text.secondary">
              {card.author}
            </Typography>
          </Box>
        )}

        {/* Site Name */}
        {card.site_name && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {card.favicon_url ? (
              <Avatar src={card.favicon_url} sx={{ width: 16, height: 16 }} />
            ) : (
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                }}
              />
            )}
            <Typography variant="caption" color="text.secondary">
              {card.site_name}
            </Typography>
          </Box>
        )}

        {/* Published Date */}
        {card.published_at && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarToday sx={{ fontSize: 16, color: "rgba(0, 0, 0, 0.6)" }} />
            <Typography variant="caption" color="text.secondary">
              {formatDate(card.published_at)}
            </Typography>
          </Box>
        )}

        {/* Saved Date */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CalendarToday sx={{ fontSize: 16, color: "rgba(0, 0, 0, 0.6)" }} />
          <Typography variant="caption" color="text.secondary">
            保存日: {formatDate(card.saved_at)}
          </Typography>
        </Box>
      </Box>
    </MuiCardContent>
  );
};

export default CardContent;
