"use client";

import React, { useState } from "react";
import {
  Card as MuiCard,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  Avatar,
  CardActions,
  IconButton,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Visibility,
  VisibilityOff,
  Edit,
  Delete,
  OpenInNew,
  Person,
  CalendarToday,
} from "@mui/icons-material";
import { Card, apiService, UpdateCardData, Tag } from "@/services/api";
import EditDialog from "./CardItem/EditDialog";

interface CardItemProps {
  card: Card;
  onUpdate: (updatedCard: Card) => void;
  onDelete: (cardId: string) => void;
}

const CardItem: React.FC<CardItemProps> = ({ card, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleToggleFavorite = async () => {
    setIsUpdating(true);
    try {
      const updateData: UpdateCardData = {
        is_favorite: !card.is_favorite,
      };

      const response = await apiService.updateCard(card.id, updateData);
      if (response.success) {
        onUpdate(response.data);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleRead = async () => {
    setIsUpdating(true);
    try {
      const updateData: UpdateCardData = {
        is_read: !card.is_read,
      };

      const response = await apiService.updateCard(card.id, updateData);
      if (response.success) {
        onUpdate(response.data);
      }
    } catch (error) {
      console.error("Failed to toggle read:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowDeleteDialog(false); // 編集モーダルを開く際に削除ダイアログを閉じる
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async (
    title: string,
    description: string,
    tags?: Tag[]
  ) => {
    setIsUpdating(true);
    try {
      const updateData: UpdateCardData = {
        title,
        description: description || undefined,
        tag_ids: tags?.map((tag) => tag.id) || [],
      };

      const response = await apiService.updateCard(card.id, updateData);
      if (response.success) {
        onUpdate(response.data);
        setIsEditing(false);
        setShowDeleteDialog(false); // 編集完了時に削除ダイアログが開いていれば閉じる
      }
    } catch (error) {
      console.error("Failed to save edit:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDelete = () => {
    setShowDeleteDialog(true);
    setIsEditing(false); // 削除ダイアログを開く際に編集モーダルを閉じる
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await apiService.deleteCard(card.id);
      if (response.success) {
        onDelete(card.id);
        setShowDeleteDialog(false);
      }
    } catch (error) {
      console.error("Failed to delete card:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Box sx={{ position: "relative" }}>
        <MuiCard
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "20px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: isUpdating || isDeleting ? "none" : "translateY(-4px)",
              boxShadow:
                isUpdating || isDeleting
                  ? "0 8px 32px rgba(0, 0, 0, 0.1)"
                  : "0 12px 40px rgba(0, 0, 0, 0.15)",
            },
            opacity: isUpdating || isDeleting ? 0.7 : 1,
          }}
        >
          {/* Card Content */}
          <CardContent sx={{ p: 3, pb: 0 }}>
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

            {/* Status Indicators & Tags */}
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
              {/* Tags */}
              {card.tags && card.tags.length > 0 && (
                <>
                  {card.tags.slice(0, 3).map((tag) => (
                    <Chip
                      key={tag.id}
                      label={tag.name}
                      size="small"
                      sx={{
                        backgroundColor: tag.color + "15",
                        color: tag.color,
                        borderRadius: "12px",
                        fontWeight: 500,
                        fontSize: "0.7rem",
                        height: "24px",
                        border: `1px solid ${tag.color}30`,
                        "&:hover": {
                          backgroundColor: tag.color + "25",
                          borderColor: tag.color + "50",
                        },
                      }}
                    />
                  ))}
                  {card.tags.length > 3 && (
                    <Chip
                      label={`+${card.tags.length - 3}`}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(127, 140, 141, 0.1)",
                        color: "#7f8c8d",
                        borderRadius: "12px",
                        fontWeight: 500,
                        fontSize: "0.7rem",
                        height: "24px",
                        border: "1px solid rgba(127, 140, 141, 0.3)",
                      }}
                    />
                  )}
                </>
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
                color: "#2c3e50",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                mb: 2,
              }}
            >
              {card.title || card.url || "タイトルなし"}
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

            {/* Meta Information */}
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2 }}
            >
              {/* Author */}
              {card.author && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Person
                    sx={{ fontSize: 16, color: "rgba(44, 62, 80, 0.6)" }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {card.author}
                  </Typography>
                </Box>
              )}

              {/* Site Name */}
              {card.site_name && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {card.favicon_url ? (
                    <Avatar
                      src={card.favicon_url}
                      sx={{ width: 16, height: 16 }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        backgroundColor: "rgba(44, 62, 80, 0.1)",
                      }}
                    />
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {card.site_name}
                  </Typography>
                </Box>
              )}

              {/* Saved Date */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarToday
                  sx={{ fontSize: 16, color: "rgba(44, 62, 80, 0.6)" }}
                />
                <Typography variant="caption" color="text.secondary">
                  保存日: {formatDate(card.saved_at)}
                </Typography>
              </Box>
            </Box>
          </CardContent>

          {/* Card Actions */}
          <CardActions
            sx={{
              p: 3,
              pt: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: "auto",
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={handleToggleFavorite}
                disabled={isUpdating}
                size="small"
                sx={{
                  color: card.is_favorite ? "#ff6b6b" : "rgba(44, 62, 80, 0.6)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 107, 107, 0.1)",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                {card.is_favorite ? <Favorite /> : <FavoriteBorder />}
              </IconButton>

              <IconButton
                onClick={handleToggleRead}
                disabled={isUpdating}
                size="small"
                sx={{
                  color: card.is_read ? "#4caf50" : "rgba(44, 62, 80, 0.6)",
                  "&:hover": {
                    backgroundColor: "rgba(76, 175, 80, 0.1)",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                {card.is_read ? <Visibility /> : <VisibilityOff />}
              </IconButton>

              <IconButton
                onClick={handleEdit}
                disabled={isUpdating}
                size="small"
                sx={{
                  color: "rgba(44, 62, 80, 0.6)",
                  "&:hover": {
                    backgroundColor: "rgba(103, 126, 234, 0.1)",
                    color: "#677eea",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <Edit />
              </IconButton>

              <IconButton
                onClick={confirmDelete}
                disabled={isUpdating}
                size="small"
                sx={{
                  color: "rgba(44, 62, 80, 0.6)",
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
            </Box>

            {card.url && (
              <Button
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="small"
                startIcon={<OpenInNew />}
                sx={{
                  borderColor: "rgba(44, 62, 80, 0.3)",
                  color: "rgba(44, 62, 80, 0.8)",
                  fontSize: "0.75rem",
                  borderRadius: "12px",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "rgba(44, 62, 80, 0.6)",
                    backgroundColor: "rgba(44, 62, 80, 0.05)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                リンクを開く
              </Button>
            )}
          </CardActions>
        </MuiCard>

        {(isUpdating || isDeleting) && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(4px)",
              borderRadius: "20px",
              zIndex: 1,
            }}
          >
            <CircularProgress
              size={48}
              sx={{
                color: isDeleting ? "#f44336" : "#7f8c8d",
              }}
            />
          </Box>
        )}
      </Box>

      <EditDialog
        open={isEditing}
        card={card}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
        isUpdating={isUpdating}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        sx={{ zIndex: 1400 }} // EditDialogより高いz-indexを設定
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : "20px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            pt: 4,
            pb: 2,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 700,
            fontSize: "1.5rem",
          }}
        >
          カードを削除しますか？
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", px: 4, py: 2 }}>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            「{card.title || card.url || "タイトルなし"}」を削除します。
            <br />
            この操作は取り消せません。
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            gap: 2,
            px: 4,
            pb: 4,
          }}
        >
          <Button
            onClick={handleCloseDeleteDialog}
            variant="outlined"
            disabled={isDeleting}
            sx={{
              borderRadius: "12px",
              px: 3,
              borderColor: "#7f8c8d",
              color: "#7f8c8d",
              "&:hover": {
                borderColor: "#95a5a6",
                backgroundColor: "rgba(127, 140, 141, 0.1)",
              },
            }}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            disabled={isDeleting}
            sx={{
              borderRadius: "12px",
              px: 3,
              background: "linear-gradient(45deg, #ff6b6b, #ff5252)",
              boxShadow: "0 4px 20px rgba(255, 107, 107, 0.3)",
              "&:hover": {
                background: "linear-gradient(45deg, #ff5252, #f44336)",
                boxShadow: "0 6px 25px rgba(255, 107, 107, 0.4)",
              },
              "&:disabled": {
                background: "rgba(0, 0, 0, 0.12)",
                color: "rgba(0, 0, 0, 0.26)",
              },
            }}
            startIcon={
              isDeleting ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Delete />
              )
            }
          >
            {isDeleting ? "削除中..." : "削除"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CardItem;
