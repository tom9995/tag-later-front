"use client";

import React, { useState } from "react";
import {
  Card as MuiCard,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Button,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Avatar,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Visibility,
  VisibilityOff,
  Edit,
  Delete,
  OpenInNew,
  Schedule,
  Person,
  CalendarToday,
} from "@mui/icons-material";
import { Card, apiService, UpdateCardData } from "@/services/api";

interface CardItemProps {
  card: Card;
  onUpdate: (updatedCard: Card) => void;
  onDelete: (cardId: string) => void;
}

const CardItem: React.FC<CardItemProps> = ({ card, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [editDescription, setEditDescription] = useState(
    card.description || ""
  );

  const handleToggleRead = async () => {
    try {
      if (!card.is_read) {
        const response = await apiService.markAsRead(card.id);
        if (response.success) {
          onUpdate(response.data);
        }
      } else {
        // 既読を未読に戻す
        const response = await apiService.updateCard(card.id, {
          is_read: false,
        });
        if (response.success) {
          onUpdate(response.data);
        }
      }
    } catch (error) {
      console.error("Failed to toggle read status:", error);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const response = await apiService.toggleFavorite(
        card.id,
        !card.is_favorite
      );
      if (response.success) {
        onUpdate(response.data);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const updateData: UpdateCardData = {
        title: editTitle,
        description: editDescription || undefined,
      };

      const response = await apiService.updateCard(card.id, updateData);
      if (response.success) {
        onUpdate(response.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update card:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("このカードを削除しますか？")) {
      try {
        const response = await apiService.deleteCard(card.id);
        if (response.success) {
          onDelete(card.id);
        }
      } catch (error) {
        console.error("Failed to delete card:", error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ja-JP");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(card.title);
    setEditDescription(card.description || "");
  };

  return (
    <>
      <MuiCard
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 4,
          overflow: "hidden",
          transition: "all 0.3s ease-in-out",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        {/* Modern Thumbnail */}
        {card.thumbnail_url && (
          <Box sx={{ position: "relative", overflow: "hidden" }}>
            <CardMedia
              component="img"
              height="200"
              image={card.thumbnail_url}
              alt={card.title}
              sx={{
                objectFit: "cover",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                display: "flex",
                gap: 1,
              }}
            >
              <Chip
                size="small"
                label={card.is_read ? "既読" : "未読"}
                sx={{
                  backgroundColor: card.is_read
                    ? "rgba(76, 175, 80, 0.9)"
                    : "rgba(255, 152, 0, 0.9)",
                  color: "white",
                  fontWeight: 600,
                  backdropFilter: "blur(10px)",
                }}
              />
              <IconButton
                size="small"
                onClick={handleToggleFavorite}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  color: card.is_favorite ? "#f44336" : "#666",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 1)",
                    transform: "scale(1.1)",
                  },
                }}
              >
                {card.is_favorite ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            </Box>
          </Box>
        )}

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          {/* Modern Header */}
          {!card.thumbnail_url && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {card.favicon_url && (
                  <Avatar
                    src={card.favicon_url}
                    sx={{ width: 20, height: 20 }}
                  />
                )}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  {card.site_name || "Web"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Chip
                  size="small"
                  label={card.is_read ? "既読" : "未読"}
                  sx={{
                    backgroundColor: card.is_read
                      ? "rgba(76, 175, 80, 0.1)"
                      : "rgba(255, 152, 0, 0.1)",
                    color: card.is_read ? "#4caf50" : "#ff9800",
                    fontWeight: 600,
                    border: `1px solid ${card.is_read ? "#4caf50" : "#ff9800"}`,
                  }}
                />
                <IconButton
                  size="small"
                  onClick={handleToggleFavorite}
                  sx={{
                    color: card.is_favorite ? "#f44336" : "#666",
                    "&:hover": {
                      backgroundColor: card.is_favorite
                        ? "rgba(244, 67, 54, 0.1)"
                        : "rgba(0, 0, 0, 0.05)",
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  {card.is_favorite ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              </Box>
            </Box>
          )}

          {card.thumbnail_url && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              {card.favicon_url && (
                <Avatar src={card.favicon_url} sx={{ width: 20, height: 20 }} />
              )}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {card.site_name || "Web"}
              </Typography>
            </Box>
          )}

          {/* Modern Title */}
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              fontWeight: 600,
              lineHeight: 1.3,
              mb: 2,
              color: "#333",
            }}
          >
            <Box
              component="a"
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "flex-start",
                gap: 1,
                "&:hover": {
                  color: "#667eea",
                  "& .link-icon": {
                    transform: "translate(4px, -4px)",
                    color: "#667eea",
                  },
                },
                transition: "color 0.2s ease",
              }}
            >
              <span style={{ flex: 1 }}>{card.title}</span>
              <OpenInNew
                className="link-icon"
                sx={{
                  fontSize: 18,
                  color: "#999",
                  transition: "all 0.2s ease",
                  flexShrink: 0,
                  mt: 0.2,
                }}
              />
            </Box>
          </Typography>

          {/* Modern Description */}
          {card.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                mb: 3,
                lineHeight: 1.5,
                fontSize: "0.95rem",
              }}
            >
              {card.description}
            </Typography>
          )}

          {/* Modern Tags */}
          {card.tags && card.tags.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ flexWrap: "wrap", gap: 1 }}
              >
                {card.tags.slice(0, 3).map((tag) => (
                  <Chip
                    key={tag.id}
                    label={tag.name}
                    size="small"
                    sx={{
                      backgroundColor: tag.color + "15",
                      color: tag.color,
                      border: `1px solid ${tag.color}30`,
                      fontWeight: 500,
                      "&:hover": {
                        backgroundColor: tag.color + "25",
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  />
                ))}
                {card.tags.length > 3 && (
                  <Chip
                    label={`+${card.tags.length - 3}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      color: "#666",
                      borderColor: "#ddd",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  />
                )}
              </Stack>
            </Box>
          )}

          {/* Modern Meta Info */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {card.author && (
              <Tooltip title={`作者: ${card.author}`}>
                <Chip
                  icon={<Person />}
                  label={card.author}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: "#e0e0e0",
                    color: "#666",
                    "&:hover": {
                      borderColor: "#667eea",
                      color: "#667eea",
                    },
                  }}
                />
              </Tooltip>
            )}
            {card.reading_time && (
              <Tooltip title={`読了時間: ${card.reading_time}分`}>
                <Chip
                  icon={<Schedule />}
                  label={`${card.reading_time}分`}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: "#e0e0e0",
                    color: "#666",
                    "&:hover": {
                      borderColor: "#667eea",
                      color: "#667eea",
                    },
                  }}
                />
              </Tooltip>
            )}
            <Tooltip title={`保存日時: ${formatDate(card.saved_at)}`}>
              <Chip
                icon={<CalendarToday />}
                label={new Date(card.saved_at).toLocaleDateString("ja-JP")}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: "#e0e0e0",
                  color: "#666",
                  "&:hover": {
                    borderColor: "#667eea",
                    color: "#667eea",
                  },
                }}
              />
            </Tooltip>
          </Box>
        </CardContent>

        {/* Modern Action Buttons */}
        <CardActions
          sx={{
            justifyContent: "space-between",
            px: 3,
            pb: 3,
            pt: 0,
            background: "rgba(248, 249, 250, 0.5)",
          }}
        >
          <Button
            startIcon={card.is_read ? <VisibilityOff /> : <Visibility />}
            onClick={handleToggleRead}
            size="small"
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              borderColor: card.is_read ? "#4caf50" : "#ff9800",
              color: card.is_read ? "#4caf50" : "#ff9800",
              "&:hover": {
                borderColor: card.is_read ? "#388e3c" : "#f57c00",
                backgroundColor: card.is_read
                  ? "rgba(76, 175, 80, 0.05)"
                  : "rgba(255, 152, 0, 0.05)",
              },
            }}
          >
            {card.is_read ? "未読に戻す" : "既読にする"}
          </Button>
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => setIsEditing(true)}
              sx={{
                color: "#667eea",
                backgroundColor: "rgba(102, 126, 234, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(102, 126, 234, 0.2)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <Edit />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleDelete}
              sx={{
                color: "#f44336",
                backgroundColor: "rgba(244, 67, 54, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(244, 67, 54, 0.2)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <Delete />
            </IconButton>
          </Box>
        </CardActions>
      </MuiCard>

      {/* 編集ダイアログ */}
      <Dialog
        open={isEditing}
        onClose={handleCancelEdit}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>カードを編集</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="タイトル"
            fullWidth
            variant="outlined"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="説明"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit}>キャンセル</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CardItem;
