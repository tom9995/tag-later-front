"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Fab,
  Collapse,
  Alert,
  CircularProgress,
  Dialog,
  DialogContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Add, BookmarkBorder } from "@mui/icons-material";
import { Card as CardType, apiService } from "@/services/api";
import CardItem from "@/components/CardItem";
import AddCardForm from "@/components/AddCardForm";
import TagManager from "@/components/TagManagerDialog";
import CardsListHeader from "@/components/CardsListHeader";
import CardsListStats from "@/components/CardsListStats";
import CardsListFilters from "@/components/CardsListFilters";

const CardsList: React.FC = () => {
  const { user, signOut } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [cards, setCards] = useState<CardType[]>([]);
  const [allCards, setAllCards] = useState<CardType[]>([]); // 全体の統計用
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTagManager, setShowTagManager] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    is_read: false as boolean | undefined, // デフォルトで未読のみを表示
    is_favorite: undefined as boolean | undefined,
    sort_by: "created_at",
    sort_order: "desc" as "asc" | "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");

  // デバウンス用のuseEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm }));
    }, 500); // 500ms待機

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadAllCards = useCallback(async () => {
    try {
      const response = await apiService.getCards({
        limit: 10000,
      });

      if (response.success) {
        setAllCards(response.data.cards);
      }
    } catch (error) {
      console.error("Failed to load all cards for stats:", error);
    }
  }, []);

  const loadCards = useCallback(
    async (isSearch = false, page = 1, append = false) => {
      try {
        if (isSearch) {
          setSearchLoading(true);
        } else if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const response = await apiService.getCards({
          ...filters,
          search: filters.search || undefined,
          page: page,
          limit: 10,
        });

        if (response.success) {
          const { cards: newCards, pagination } = response.data;

          if (append) {
            setCards((prevCards) => {
              // 既存のカードIDのセットを作成
              const existingIds = new Set(prevCards.map((card) => card.id));
              // 重複を除いた新しいカードのみを追加
              const uniqueNewCards = newCards.filter(
                (card) => !existingIds.has(card.id)
              );
              return [...prevCards, ...uniqueNewCards];
            });
          } else {
            setCards(newCards);
            setCurrentPage(1);
          }

          setHasMorePages(pagination.current_page < pagination.total_pages);
        } else {
          setError(response.error || "カードの取得に失敗しました");
          if (!append) {
            setCards([]);
          }
        }
      } catch (error) {
        console.error("Failed to load cards:", error);
        setError("カード取得中にエラーが発生しました");
        if (!append) {
          setCards([]);
        }
      } finally {
        if (isSearch) {
          setSearchLoading(false);
        } else if (append) {
          setLoadingMore(false);
        } else {
          setLoading(false);
        }
      }
    },
    [filters]
  );

  useEffect(() => {
    const isInitialLoad = loading;
    setCurrentPage(1);
    setHasMorePages(true);
    loadCards(!isInitialLoad, 1, false);
    if (isInitialLoad) {
      loadAllCards(); // 初回読み込み時のみ全体統計を取得
    }
  }, [filters, loadCards, loadAllCards, loading]);

  const handleCardAdded = useCallback((newCard: CardType) => {
    setCards((prev) => [newCard, ...prev]);
    setAllCards((prev) => [newCard, ...prev]); // 全体統計も更新
    setShowAddModal(false);
  }, []);

  const loadMoreCards = useCallback(() => {
    if (!loadingMore && hasMorePages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadCards(false, nextPage, true);
    }
  }, [loadingMore, hasMorePages, currentPage, loadCards]);

  // スクロールイベントハンドラー（スロットリング付き）
  useEffect(() => {
    let isScrolling = false;

    const handleScroll = () => {
      if (isScrolling) return;

      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000 // 1000px手前で読み込み開始
      ) {
        isScrolling = true;
        loadMoreCards();

        // 1秒後にスクロール制御を解除
        setTimeout(() => {
          isScrolling = false;
        }, 1000);
      }
    };

    const throttledHandleScroll = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", throttledHandleScroll);
    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, [loadMoreCards]);

  const handleCardUpdated = useCallback(
    (updatedCard: CardType) => {
      setCards((prev) => {
        const shouldShowCard =
          (filters.is_read === undefined ||
            filters.is_read === updatedCard.is_read) &&
          (filters.is_favorite === undefined ||
            filters.is_favorite === updatedCard.is_favorite);

        if (shouldShowCard) {
          return prev.map((card) =>
            card.id === updatedCard.id ? updatedCard : card
          );
        } else {
          return prev.filter((card) => card.id !== updatedCard.id);
        }
      });

      // 全体統計も更新
      setAllCards((prev) =>
        prev.map((card) => (card.id === updatedCard.id ? updatedCard : card))
      );
    },
    [filters.is_read, filters.is_favorite]
  );

  const handleCardDeleted = useCallback((cardId: string) => {
    setCards((prev) => prev.filter((card) => card.id !== cardId));
    setAllCards((prev) => prev.filter((card) => card.id !== cardId)); // 全体統計も更新
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleFilterChange = useCallback(
    (key: string, value: string | boolean | undefined) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to logout:", error);
      // ログアウトエラーを無視
    } finally {
      setIsLoggingOut(false);
      setUserMenuAnchor(null);
    }
  }, [signOut]);

  const handleUserMenuOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setUserMenuAnchor(event.currentTarget);
    },
    []
  );

  const handleUserMenuClose = useCallback(() => {
    setUserMenuAnchor(null);
  }, []);

  const getUserDisplayName = useMemo(() => {
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

    const displayName =
      safeName && safeName.trim().length > 0
        ? safeName.slice(0, 20)
        : "ユーザー";

    return displayName;
  }, [user?.user_metadata?.name]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%)",
        pb: 4,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{ pt: { xs: 1, sm: 2 }, px: { xs: 1, sm: 3 } }}
      >
        <CardsListHeader
          user={user}
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          setShowTagManager={setShowTagManager}
          userMenuAnchor={userMenuAnchor}
          handleUserMenuOpen={handleUserMenuOpen}
          handleUserMenuClose={handleUserMenuClose}
          handleLogout={handleLogout}
          isLoggingOut={isLoggingOut}
          getUserDisplayName={getUserDisplayName}
        />

        <CardsListStats allCards={allCards} />

        <CardsListFilters
          searchTerm={searchTerm}
          searchLoading={searchLoading}
          filters={filters}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
        />

        {/* Error Message */}
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
        {loading || searchLoading ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(auto-fill, minmax(350px, 1fr))",
                md: "repeat(auto-fill, minmax(380px, 1fr))",
              },
              gap: { xs: 3, sm: 4 },
              mb: 4,
            }}
          >
            {Array.from({ length: searchLoading ? 3 : 6 }, (_, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  background: "rgba(52, 73, 94, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "20px",
                  p: 3,
                  height: "300px",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  overflow: "hidden",
                  animation: `pulse 1.5s ease-in-out infinite ${index * 0.2}s`,
                  "@keyframes pulse": {
                    "0%, 100%": {
                      opacity: 1,
                    },
                    "50%": {
                      opacity: 0.7,
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "160px",
                    backgroundColor: "rgba(127, 140, 141, 0.3)",
                    borderRadius: "12px",
                    mb: 2,
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
                      animation: "shimmer 2s infinite",
                    },
                    "@keyframes shimmer": {
                      "0%": { left: "-100%" },
                      "100%": { left: "100%" },
                    },
                  }}
                />

                <Box
                  sx={{
                    width: "80%",
                    height: "20px",
                    backgroundColor: "rgba(127, 140, 141, 0.3)",
                    borderRadius: "10px",
                    mb: 1,
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
                      animation: "shimmer 2s infinite 0.5s",
                    },
                  }}
                />

                <Box
                  sx={{
                    width: "60%",
                    height: "14px",
                    backgroundColor: "rgba(127, 140, 141, 0.2)",
                    borderRadius: "7px",
                    mb: 2,
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
                      animation: "shimmer 2s infinite 1s",
                    },
                  }}
                />

                <Box
                  sx={{
                    mt: "auto",
                    display: "flex",
                    gap: 1,
                    justifyContent: "space-between",
                  }}
                >
                  {Array.from({ length: 3 }, (_, btnIndex) => (
                    <Box
                      key={btnIndex}
                      sx={{
                        width: "32px",
                        height: "32px",
                        backgroundColor: "rgba(127, 140, 141, 0.15)",
                        borderRadius: "50%",
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: "-100%",
                          width: "100%",
                          height: "100%",
                          background:
                            "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
                          animation: `shimmer 2s infinite ${
                            1.5 + btnIndex * 0.2
                          }s`,
                        },
                      }}
                    />
                  ))}
                  <Box
                    sx={{
                      width: "80px",
                      height: "32px",
                      backgroundColor: "rgba(127, 140, 141, 0.15)",
                      borderRadius: "16px",
                      position: "relative",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "100%",
                        height: "100%",
                        background:
                          "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
                        animation: "shimmer 2s infinite 2.1s",
                      },
                    }}
                  />
                </Box>
              </Paper>
            ))}
          </Box>
        ) : cards.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: "center",
              background: "rgba(52, 73, 94, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: 4,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "white",
            }}
          >
            <BookmarkBorder
              sx={{
                fontSize: 120,
                color: "#fdffffff",
                mb: 3,
                opacity: 0.6,
              }}
            />
            {/* 検索やフィルターが適用されているかチェック */}
            {searchTerm.trim() !== "" ||
            filters.search !== "" ||
            filters.is_read !== false ||
            filters.is_favorite !== undefined ? (
              <>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ fontWeight: 600, color: "#fdffffff" }}
                >
                  検索結果: 0件
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ mb: 4, fontWeight: 300, color: "#fdffffff" }}
                >
                  条件に一致するカードが見つかりませんでした。
                  <br />
                  検索キーワードやフィルター条件を変更してみてください。
                </Typography>
              </>
            ) : (
              <>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ fontWeight: 600, color: "#fdffffff" }}
                >
                  まだカードがありません
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ mb: 4, fontWeight: 300, color: "#fdffffff" }}
                >
                  最初のカードを追加して、後で読みたい記事を保存・整理しましょう！
                  <br />
                  タグ機能で記事を分類できます。
                </Typography>
              </>
            )}
            {/* カードが全くない場合のみ追加ボタンを表示 */}
            {!(
              searchTerm.trim() !== "" ||
              filters.search !== "" ||
              filters.is_read !== false ||
              filters.is_favorite !== undefined
            ) && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowAddModal(true)}
                size="large"
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  background: "linear-gradient(45deg, #7f8c8d, #34495e)",
                  boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
                  fontSize: "1.1rem",
                  "&:hover": {
                    background: "linear-gradient(45deg, #95a5a6, #2c3e50)",
                    boxShadow: "0 12px 40px rgba(127, 140, 141, 0.4)",
                  },
                }}
              >
                最初のカードを追加
              </Button>
            )}
          </Paper>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(auto-fill, minmax(350px, 1fr))",
                md: "repeat(auto-fill, minmax(380px, 1fr))",
              },
              gap: { xs: 3, sm: 4 },
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

        {/* 追加読み込み中の表示 */}
        {loadingMore && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 4,
              mb: 4,
            }}
          >
            <CircularProgress
              size={40}
              sx={{
                color: "#7f8c8d",
              }}
            />
            <Typography
              variant="body2"
              sx={{
                ml: 2,
                color: "text.secondary",
              }}
            >
              さらに読み込み中...
            </Typography>
          </Box>
        )}

        {/* Modern Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed",
            bottom: { xs: 16, sm: 24 },
            right: { xs: 16, sm: 24 },
            background: "linear-gradient(45deg, #7f8c8d, #34495e)",
            boxShadow: "0 8px 32px rgba(127, 140, 141, 0.4)",
            width: { xs: 56, sm: 64 },
            height: { xs: 56, sm: 64 },
            "&:hover": {
              background: "linear-gradient(45deg, #95a5a6, #2c3e50)",
              boxShadow: "0 12px 40px rgba(127, 140, 141, 0.6)",
              transform: "scale(1.1)",
            },
            transition: "all 0.3s ease",
          }}
          onClick={() => setShowAddModal(true)}
        >
          <Add sx={{ fontSize: { xs: 24, sm: 30 } }} />
        </Fab>

        {/* Add Card Modal */}
        <Dialog
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
          PaperProps={{
            sx: {
              borderRadius: { xs: 0, sm: "20px" },
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              m: { xs: 0, sm: 2 },
              maxHeight: { xs: "100vh", sm: "90vh" },
            },
          }}
        >
          <DialogContent sx={{ p: 0 }}>
            <AddCardForm
              onCardAdded={handleCardAdded}
              onCancel={() => setShowAddModal(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Tag Manager Dialog */}
        <TagManager
          open={showTagManager}
          onClose={() => setShowTagManager(false)}
          onTagsUpdated={loadCards}
        />
      </Container>
    </Box>
  );
};

export default CardsList;
