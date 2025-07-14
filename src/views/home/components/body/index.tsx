"use client";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AddCardDialog from "../../../../components/AddCardDialog";
import EditCardDialog from "../../../../components/EditCardDialog";
import { Card } from "../../../../services/api";

export default function Body() {
  const [bookmarks, setBookmarks] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      console.log('Loading bookmarks from API...');
      const response = await fetch('http://localhost:8765/api/cards');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('API response:', result);
      
      if (result.success && result.data) {
        setBookmarks(result.data);
        console.log('Cards loaded:', result.data);
      } else {
        console.error('Failed to load cards:', result.message);
        setError("ブックマークの取得に失敗しました");
      }
    } catch (err) {
      setError("ブックマークの取得に失敗しました");
      console.error("Error loading bookmarks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUrl = (url: string) => {
    window.open(url, "_blank");
  };

  const handleCardAdded = (newCard: any) => {
    setBookmarks(prev => [newCard, ...prev]);
  };

  const handleCardUpdated = (updatedCard: any) => {
    setBookmarks(prev => 
      prev.map(card => card.id === updatedCard.id ? updatedCard : card)
    );
  };

  const handleDeleteCard = async () => {
    if (!selectedCard) return;

    try {
      const response = await fetch(`http://localhost:8765/api/cards/${selectedCard.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setBookmarks(prev => prev.filter(card => card.id !== selectedCard.id));
      setDeleteDialogOpen(false);
      setSelectedCard(null);
    } catch (err) {
      setError("カードの削除に失敗しました");
      console.error("Error deleting card:", err);
    }
  };

  const openEditDialog = (card: Card) => {
    setSelectedCard(card);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (card: Card) => {
    setSelectedCard(card);
    setDeleteDialogOpen(true);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 2, position: 'relative' }}>
      {loading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && bookmarks.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          ブックマークがありません。新しいカードを追加してみましょう！
        </Alert>
      )}

      {!loading && bookmarks.length > 0 && (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: 3 
        }}>
          {bookmarks.map((bookmark) => (
            <Card
              key={bookmark.id}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                "&:hover": {
                  boxShadow: 3,
                },
              }}
            >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      mb: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {bookmark.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {bookmark.description || "No description"}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {bookmark.url}
                  </Typography>

                  {bookmark.tags && bookmark.tags.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      {bookmark.tags.map((tag: string, index: number) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}
                </CardContent>

                <CardActions
                  sx={{ justifyContent: "space-between", px: 2, pb: 2 }}
                >
                  <Button
                    size="small"
                    startIcon={<OpenInNewIcon />}
                    onClick={() => handleOpenUrl(bookmark.url)}
                    variant="contained"
                    color="primary"
                  >
                    開く
                  </Button>

                  <Box>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => openEditDialog(bookmark)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => openDeleteDialog(bookmark)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}

      {/* 追加ボタン */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => {
          console.log('Add button clicked!');
          setAddDialogOpen(true);
        }}
      >
        <AddIcon />
      </Fab>

      {/* ダイアログ */}
      <AddCardDialog
        open={addDialogOpen}
        onClose={() => {
          console.log('Closing add dialog');
          setAddDialogOpen(false);
        }}
        onCardAdded={handleCardAdded}
      />

      <EditCardDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onCardUpdated={handleCardUpdated}
        card={selectedCard!}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>カードを削除</DialogTitle>
        <DialogContent>
          <Typography>
            「{selectedCard?.title}」を削除しますか？この操作は取り消せません。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            キャンセル
          </Button>
          <Button onClick={handleDeleteCard} color="error">
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
