"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
  Collapse,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Menu,
} from "@mui/material";
import {
  Add,
  Search,
  FilterList,
  BookmarkBorder,
  Visibility,
  VisibilityOff,
  Favorite,
  Article,
  LocalOffer,
  Logout,
  AccountCircle,
  MoreVert,
  Close,
} from "@mui/icons-material";
import { Card as CardType, apiService } from "@/services/api";
import CardItem from "@/components/CardItem";
import AddCardForm from "@/components/AddCardForm";
import TagManagerDialog from "@/components/TagManagerDialog";

const CardsList: React.FC = () => {
  const { user, signOut } = useAuth();
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTagManager, setShowTagManager] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    is_read: undefined as boolean | undefined,
    is_favorite: undefined as boolean | undefined,
    sort_by: "saved_at",
    sort_order: "desc" as "asc" | "desc",
  });

  const loadCards = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getCards({
        ...filters,
        search: filters.search || undefined,
      });

      if (response.success) {
        setCards(response.data.cards);
      } else {
        setError(response.error || "カードの取得に失敗しました");
        setCards([]); // エラー時は空の配列をセット
      }
    } catch (error) {
      console.error("Failed to load cards:", error);
      setError("カードの取得中にエラーが発生しました");
      setCards([]); // エラー時は空の配列をセット
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCardAdded = (newCard: CardType) => {
    setCards((prev) => [newCard, ...prev]);
    setShowAddModal(false);
  };

  const handleCardUpdated = (updatedCard: CardType) => {
    setCards((prev) =>
      prev.map((card) => (card.id === updatedCard.id ? updatedCard : card))
    );
  };

  const handleCardDeleted = (cardId: string) => {
    setCards((prev) => prev.filter((card) => card.id !== cardId));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleFilterChange = (
    key: string,
    value: string | boolean | undefined
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
      setUserMenuAnchor(null);
    }
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const getUserDisplayName = () => {
    // XSS対策：HTMLエスケープとサニタイゼーション
    const safeName = user?.user_metadata?.name?.replace(
      /[<>&"']/g,
      (match: string) => {
        const escapeMap: { [key: string]: string } = {
          "<": "&lt;",
          ">": "&gt;",
          "&": "&amp;",
          '"': "&quot;",
          "'": "&#x27;",
        };
        return escapeMap[match];
      }
    );

    // 文字数制限（20文字まで）
    const displayName =
      safeName && safeName.trim().length > 0
        ? safeName.slice(0, 20)
        : "ユーザー";

    return displayName;
  };

  const stats = {
    total: cards.length,
    read: cards.filter((card) => card.is_read).length,
    unread: cards.filter((card) => !card.is_read).length,
    favorites: cards.filter((card) => card.is_favorite).length,
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          カードを読み込み中...
        </Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        pb: 4,
      }}
    >
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        {/* Modern Header */}
        <Box sx={{ mb: 6 }}>
          <Paper
            elevation={0}
            sx={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: 4,
              p: 4,
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    background: "linear-gradient(45deg, #667eea, #764ba2)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 1,
                  }}
                >
                  TagLater
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ fontWeight: 300 }}
                >
                  後で読む記事を美しく整理
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Button
                  variant="outlined"
                  startIcon={<LocalOffer />}
                  onClick={() => setShowTagManager(true)}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    borderColor: "#667eea",
                    color: "#667eea",
                    "&:hover": {
                      borderColor: "#764ba2",
                      color: "#764ba2",
                      background: "rgba(118, 75, 162, 0.05)",
                    },
                  }}
                >
                  タグ管理
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setShowAddModal(true)}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    background: "linear-gradient(45deg, #667eea, #764ba2)",
                    boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #5a6fd8, #6a4190)",
                      boxShadow: "0 12px 40px rgba(102, 126, 234, 0.4)",
                    },
                  }}
                >
                  新しいカード
                </Button>
                {/* User Menu Icon */}
                <IconButton
                  onClick={handleUserMenuOpen}
                  size="small"
                  sx={{
                    ml: 1,
                    color: "#667eea",
                    "&:hover": {
                      backgroundColor: "rgba(103, 126, 234, 0.1)",
                    },
                  }}
                >
                  <MoreVert />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Modern Filters */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: 4,
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              fontWeight: 600,
              color: "#333",
              mb: 3,
            }}
          >
            <FilterList sx={{ mr: 2, color: "#667eea" }} />
            フィルター & 検索
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {/* Search */}
            <TextField
              label="検索"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="タイトルや説明で検索"
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: "#667eea" }} />,
              }}
              sx={{
                minWidth: 280,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#667eea",
                },
              }}
            />

            {/* Read Status */}
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel sx={{ "&.Mui-focused": { color: "#667eea" } }}>
                読書状態
              </InputLabel>
              <Select
                value={
                  filters.is_read === undefined
                    ? ""
                    : filters.is_read.toString()
                }
                onChange={(e) =>
                  handleFilterChange(
                    "is_read",
                    e.target.value === ""
                      ? undefined
                      : e.target.value === "true"
                  )
                }
                label="読書状態"
                sx={{
                  borderRadius: 3,
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#667eea",
                  },
                }}
              >
                <MenuItem value="">すべて</MenuItem>
                <MenuItem value="false">未読</MenuItem>
                <MenuItem value="true">既読</MenuItem>
              </Select>
            </FormControl>

            {/* Favorite Status */}
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel sx={{ "&.Mui-focused": { color: "#667eea" } }}>
                お気に入り
              </InputLabel>
              <Select
                value={
                  filters.is_favorite === undefined
                    ? ""
                    : filters.is_favorite.toString()
                }
                onChange={(e) =>
                  handleFilterChange(
                    "is_favorite",
                    e.target.value === ""
                      ? undefined
                      : e.target.value === "true"
                  )
                }
                label="お気に入り"
                sx={{
                  borderRadius: 3,
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#667eea",
                  },
                }}
              >
                <MenuItem value="">すべて</MenuItem>
                <MenuItem value="true">お気に入り</MenuItem>
                <MenuItem value="false">通常</MenuItem>
              </Select>
            </FormControl>

            {/* Sort */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel sx={{ "&.Mui-focused": { color: "#667eea" } }}>
                並び順
              </InputLabel>
              <Select
                value={`${filters.sort_by}_${filters.sort_order}`}
                onChange={(e) => {
                  const [sort_by, sort_order] = e.target.value.split("_");
                  handleFilterChange("sort_by", sort_by);
                  handleFilterChange("sort_order", sort_order);
                }}
                label="並び順"
                sx={{
                  borderRadius: 3,
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#667eea",
                  },
                }}
              >
                <MenuItem value="saved_at_desc">保存日時（新しい順）</MenuItem>
                <MenuItem value="saved_at_asc">保存日時（古い順）</MenuItem>
                <MenuItem value="title_asc">タイトル（A-Z）</MenuItem>
                <MenuItem value="title_desc">タイトル（Z-A）</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Modern Stats Dashboard */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: 4,
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <Typography
            variant="h5"
            sx={{ mb: 3, fontWeight: 600, color: "#333" }}
          >
            📊 統計情報
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 3,
            }}
          >
            <Box
              sx={{
                textAlign: "center",
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {stats.total}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Article sx={{ mr: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  総カード数
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                textAlign: "center",
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                color: "white",
                boxShadow: "0 8px 32px rgba(17, 153, 142, 0.3)",
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {stats.read}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Visibility sx={{ mr: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  既読
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                textAlign: "center",
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                color: "white",
                boxShadow: "0 8px 32px rgba(79, 172, 254, 0.3)",
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {stats.unread}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <VisibilityOff sx={{ mr: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  未読
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                textAlign: "center",
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                color: "white",
                boxShadow: "0 8px 32px rgba(250, 112, 154, 0.3)",
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {stats.favorites}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Favorite sx={{ mr: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  お気に入り
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Error Message */}
      <Container maxWidth="lg">
        <Collapse in={!!error}>
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 3,
              "& .MuiAlert-icon": {
                color: "#f44336",
              },
            }}
          >
            {error}
          </Alert>
        </Collapse>

        {/* Cards Grid */}
        {cards.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: "center",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: 4,
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <BookmarkBorder
              sx={{
                fontSize: 120,
                color: "#667eea",
                mb: 3,
                opacity: 0.6,
              }}
            />
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: 600, color: "#333" }}
            >
              まだカードがありません
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 4, fontWeight: 300 }}
            >
              最初のカードを追加して、後で読みたい記事を保存しましょう！
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowAddModal(true)}
              size="large"
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                background: "linear-gradient(45deg, #667eea, #764ba2)",
                boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
                fontSize: "1.1rem",
                "&:hover": {
                  background: "linear-gradient(45deg, #5a6fd8, #6a4190)",
                  boxShadow: "0 12px 40px rgba(102, 126, 234, 0.4)",
                },
              }}
            >
              最初のカードを追加
            </Button>
          </Paper>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
              gap: 4,
              mb: 4,
            }}
          >
            {cards.map((card) => (
              <CardItem
                key={card.id}
                card={card}
                onUpdate={handleCardUpdated}
                onDelete={handleCardDeleted}
              />
            ))}
          </Box>
        )}

        {/* Modern Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "linear-gradient(45deg, #667eea, #764ba2)",
            boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
            width: 64,
            height: 64,
            "&:hover": {
              background: "linear-gradient(45deg, #5a6fd8, #6a4190)",
              boxShadow: "0 12px 40px rgba(102, 126, 234, 0.6)",
              transform: "scale(1.1)",
            },
            transition: "all 0.3s ease",
          }}
          onClick={() => setShowAddModal(true)}
        >
          <Add sx={{ fontSize: 30 }} />
        </Fab>

        {/* User Menu */}
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleUserMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              minWidth: "200px",
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box
            sx={{ px: 2, py: 1, borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AccountCircle sx={{ color: "#667eea" }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {getUserDisplayName()}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Box sx={{ p: 1 }}>
            <Button
              fullWidth
              startIcon={<Logout />}
              onClick={handleLogout}
              disabled={isLoggingOut}
              sx={{
                justifyContent: "flex-start",
                color: "#f44336",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "rgba(244, 67, 54, 0.05)",
                },
                "&:disabled": {
                  color: "rgba(0, 0, 0, 0.26)",
                },
              }}
            >
              {isLoggingOut ? "ログアウト中..." : "ログアウト"}
            </Button>
          </Box>
        </Menu>

        {/* Add Card Modal */}
        <Dialog
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "20px",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pb: 1,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              新しいカードを追加
            </Typography>
            <IconButton
              onClick={() => setShowAddModal(false)}
              sx={{
                color: "rgba(0, 0, 0, 0.5)",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                },
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <AddCardForm
              onCardAdded={handleCardAdded}
              onCancel={() => setShowAddModal(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Tag Manager Dialog */}
        <TagManagerDialog
          open={showTagManager}
          onClose={() => setShowTagManager(false)}
          onTagsUpdated={loadCards}
        />
      </Container>
    </Box>
  );
};

export default CardsList;
