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
  DialogContent,
  IconButton,
  Menu,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  useTheme,
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
  ExpandMore,
  BarChart,
} from "@mui/icons-material";
import { Card as CardType, apiService } from "@/services/api";
import CardItem from "@/components/CardItem";
import AddCardForm from "@/components/AddCardForm";
import TagManager from "@/components/TagManagerDialog";

const CardsList: React.FC = () => {
  const { user, signOut } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [cards, setCards] = useState<CardType[]>([]);
  const [allCards, setAllCards] = useState<CardType[]>([]); // 全体の統計用
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTagManager, setShowTagManager] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    is_read: false as boolean | undefined, // デフォルトで未読のみを表示
    is_favorite: undefined as boolean | undefined,
    sort_by: "saved_at",
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

  const loadAllCards = async () => {
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
  };

  const loadCards = async (isSearch = false) => {
    try {
      if (isSearch) {
        setSearchLoading(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await apiService.getCards({
        ...filters,
        search: filters.search || undefined,
      });

      if (response.success) {
        setCards(response.data.cards);
      } else {
        setError(response.error || "カードの取得に失敗しました");
        setCards([]);
      }
    } catch (error) {
      console.error("Failed to load cards:", error);
      setError("カード取得中にエラーが発生しました");
      setCards([]);
    } finally {
      if (isSearch) {
        setSearchLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const isInitialLoad = loading;
    loadCards(!isInitialLoad);
    if (isInitialLoad) {
      loadAllCards(); // 初回読み込み時のみ全体統計を取得
    }
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCardAdded = (newCard: CardType) => {
    setCards((prev) => [newCard, ...prev]);
    setAllCards((prev) => [newCard, ...prev]); // 全体統計も更新
    setShowAddModal(false);
  };

  const handleCardUpdated = (updatedCard: CardType) => {
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
  };

  const handleCardDeleted = (cardId: string) => {
    setCards((prev) => prev.filter((card) => card.id !== cardId));
    setAllCards((prev) => prev.filter((card) => card.id !== cardId)); // 全体統計も更新
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
      console.error("Failed to logout:", error);
      // ログアウトエラーを無視
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

    const displayName =
      safeName && safeName.trim().length > 0
        ? safeName.slice(0, 20)
        : "ユーザー";

    return displayName;
  };

  const stats = {
    total: allCards.length,
    read: allCards.filter((card) => card.is_read).length,
    unread: allCards.filter((card) => !card.is_read).length,
    favorites: allCards.filter((card) => card.is_favorite).length,
  };

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
        {/* Modern Header */}
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <Paper
            elevation={0}
            sx={{
              background: "rgb(244,246,247)",
              backdropFilter: "blur(20px)",
              borderRadius: 4,
              p: { xs: 1.5, sm: 2.5 },
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "white",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 1.5, sm: 0 },
                mb: { xs: 1.5, sm: 2 },
              }}
            >
              <Box>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    background: "linear-gradient(45deg, #2c3e50, #3498db)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 1,
                    fontSize: { xs: "2rem", sm: "3rem" },
                  }}
                >
                  TagLater
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: { xs: 1, sm: 2 },
                  alignItems: "center",
                  flexWrap: "wrap",
                  width: { xs: "100%", sm: "auto" },
                  justifyContent: { xs: "space-between", sm: "flex-end" },
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<LocalOffer />}
                  onClick={() => setShowTagManager(true)}
                  sx={{
                    borderRadius: 3,
                    px: { xs: 2, sm: 3 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    borderColor: "#2c3e50",
                    color: "#2c3e50",
                    "&:hover": {
                      borderColor: "#3498db",
                      color: "#3498db",
                      background: "rgba(52, 152, 219, 0.1)",
                    },
                  }}
                >
                  <Box sx={{ display: { xs: "none", sm: "inline" } }}>
                    タグ管理
                  </Box>
                  <Box sx={{ display: { xs: "inline", sm: "none" } }}>タグ</Box>
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setShowAddModal(true)}
                  sx={{
                    borderRadius: 3,
                    px: { xs: 2, sm: 3 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    background: "linear-gradient(45deg, #3498db, #2c3e50)",
                    boxShadow: "0 8px 32px rgba(52, 152, 219, 0.3)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #2980b9, #34495e)",
                      boxShadow: "0 12px 40px rgba(52, 152, 219, 0.4)",
                    },
                  }}
                >
                  <Box sx={{ display: { xs: "none", sm: "inline" } }}>
                    新しいカードを追加
                  </Box>
                  <Box sx={{ display: { xs: "inline", sm: "none" } }}>追加</Box>
                </Button>
                {/* User Menu Icon */}
                <IconButton
                  onClick={handleUserMenuOpen}
                  size="small"
                  sx={{
                    ml: { xs: 0, sm: 1 },
                    color: "#7f8c8d",
                    "&:hover": {
                      backgroundColor: "rgba(127, 140, 141, 0.3)",
                    },
                  }}
                >
                  <MoreVert />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Modern Stats Dashboard */}
        <Accordion
          elevation={0}
          sx={{
            mb: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "16px !important",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            "&:before": {
              display: "none",
            },
            "& .MuiAccordionSummary-root": {
              borderRadius: "16px",
              "&.Mui-expanded": {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              },
            },
            "& .MuiAccordionDetails-root": {
              borderBottomLeftRadius: "16px",
              borderBottomRightRadius: "16px",
            },
          }}
        >
          <AccordionSummary
            expandIcon={
              <ExpandMore
                sx={{
                  color: "#7f8c8d",
                  fontSize: { xs: 20, sm: 24 },
                }}
              />
            }
            sx={{
              p: { xs: 2, sm: 3 },
              "& .MuiAccordionSummary-content": {
                margin: "8px 0",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <BarChart
                sx={{ color: "#7f8c8d", fontSize: { xs: 20, sm: 24 } }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#333",
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                }}
              >
                統計情報
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: { xs: 2, sm: 3 },
              }}
            >
              <Box
                sx={{
                  textAlign: "center",
                  p: 3,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #7f8c8d 0%, #34495e 100%)",
                  color: "white",
                  boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    fontSize: { xs: "1.5rem", sm: "3rem" },
                  }}
                >
                  {stats.total}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 0, sm: 1 },
                  }}
                >
                  <Article
                    sx={{ mr: { xs: 0, sm: 1 }, fontSize: { xs: 16, sm: 24 } }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      fontSize: { xs: "0.75rem", sm: "1rem" },
                      textAlign: "center",
                    }}
                  >
                    総カード数
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  textAlign: "center",
                  p: 3,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                  color: "white",
                  boxShadow: "0 8px 32px rgba(17, 153, 142, 0.3)",
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    fontSize: { xs: "1.5rem", sm: "3rem" },
                  }}
                >
                  {stats.read}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 0, sm: 1 },
                  }}
                >
                  <Visibility
                    sx={{ mr: { xs: 0, sm: 1 }, fontSize: { xs: 16, sm: 24 } }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      fontSize: { xs: "0.75rem", sm: "1rem" },
                      textAlign: "center",
                    }}
                  >
                    既読
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  textAlign: "center",
                  p: 3,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  color: "white",
                  boxShadow: "0 8px 32px rgba(79, 172, 254, 0.3)",
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    fontSize: { xs: "1.5rem", sm: "3rem" },
                  }}
                >
                  {stats.unread}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 0, sm: 1 },
                  }}
                >
                  <VisibilityOff
                    sx={{ mr: { xs: 0, sm: 1 }, fontSize: { xs: 16, sm: 24 } }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      fontSize: { xs: "0.75rem", sm: "1rem" },
                      textAlign: "center",
                    }}
                  >
                    未読
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  textAlign: "center",
                  p: 3,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                  color: "white",
                  boxShadow: "0 8px 32px rgba(250, 112, 154, 0.3)",
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    fontSize: { xs: "1.5rem", sm: "3rem" },
                  }}
                >
                  {stats.favorites}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 0, sm: 1 },
                  }}
                >
                  <Favorite
                    sx={{ mr: { xs: 0, sm: 1 }, fontSize: { xs: 16, sm: 24 } }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      fontSize: { xs: "0.75rem", sm: "1rem" },
                      textAlign: "center",
                    }}
                  >
                    お気に入り
                  </Typography>
                </Box>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Modern Filters */}
        <Accordion
          elevation={0}
          sx={{
            mb: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "16px !important",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            "&:before": {
              display: "none",
            },
            "& .MuiAccordionSummary-root": {
              borderRadius: "16px",
              "&.Mui-expanded": {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              },
            },
            "& .MuiAccordionDetails-root": {
              borderBottomLeftRadius: "16px",
              borderBottomRightRadius: "16px",
            },
          }}
        >
          <AccordionSummary
            expandIcon={
              <ExpandMore
                sx={{
                  color: "#7f8c8d",
                  fontSize: { xs: 20, sm: 24 },
                }}
              />
            }
            sx={{
              p: { xs: 2, sm: 3 },
              "& .MuiAccordionSummary-content": {
                margin: "8px 0",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <FilterList
                sx={{ color: "#7f8c8d", fontSize: { xs: 20, sm: 24 } }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#333",
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                }}
              >
                フィルター & 検索
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
            <Box
              sx={{
                display: "flex",
                gap: { xs: 2, sm: 3 },
                flexWrap: "wrap",
                alignItems: "center",
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              {/* Search */}
              <TextField
                label="検索"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="検索"
                InputProps={{
                  startAdornment: searchLoading ? (
                    <CircularProgress
                      size={20}
                      sx={{
                        mr: 1,
                        color: "#7f8c8d",
                        animation: "pulse 1.5s ease-in-out infinite",
                        "@keyframes pulse": {
                          "0%, 100%": {
                            opacity: 1,
                          },
                          "50%": {
                            opacity: 0.6,
                          },
                        },
                      }}
                    />
                  ) : (
                    <Search sx={{ mr: 1, color: "#7f8c8d" }} />
                  ),
                }}
                sx={{
                  width: { xs: "100%", sm: 280 },
                  minWidth: { xs: "100%", sm: 280 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    "&.Mui-focused fieldset": {
                      borderColor: "#7f8c8d",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#7f8c8d",
                  },
                }}
              />

              {/* Read Status */}
              <FormControl
                sx={{
                  width: { xs: "100%", sm: 160 },
                  minWidth: { xs: "100%", sm: 160 },
                }}
              >
                <InputLabel sx={{ "&.Mui-focused": { color: "#7f8c8d" } }}>
                  状態
                </InputLabel>
                <Select
                  value={
                    filters.is_read === undefined
                      ? "all"
                      : filters.is_read.toString()
                  }
                  onChange={(e) =>
                    handleFilterChange(
                      "is_read",
                      e.target.value === "all"
                        ? undefined
                        : e.target.value === "true"
                    )
                  }
                  label="状態"
                  sx={{
                    borderRadius: 3,
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7f8c8d",
                    },
                  }}
                >
                  <MenuItem value="all">すべて</MenuItem>
                  <MenuItem value="false">未読</MenuItem>
                  <MenuItem value="true">既読</MenuItem>
                </Select>
              </FormControl>

              {/* Favorite Status */}
              <FormControl
                sx={{
                  width: { xs: "100%", sm: 160 },
                  minWidth: { xs: "100%", sm: 160 },
                }}
              >
                <InputLabel sx={{ "&.Mui-focused": { color: "#7f8c8d" } }}>
                  お気に入り
                </InputLabel>
                <Select
                  value={
                    filters.is_favorite === undefined
                      ? "all"
                      : filters.is_favorite.toString()
                  }
                  onChange={(e) =>
                    handleFilterChange(
                      "is_favorite",
                      e.target.value === "all"
                        ? undefined
                        : e.target.value === "true"
                    )
                  }
                  label="お気に入り"
                  sx={{
                    borderRadius: 3,
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7f8c8d",
                    },
                  }}
                >
                  <MenuItem value="all">すべて</MenuItem>
                  <MenuItem value="true">お気に入り</MenuItem>
                  <MenuItem value="false">通常</MenuItem>
                </Select>
              </FormControl>

              {/* Sort */}
              <FormControl
                sx={{
                  width: { xs: "100%", sm: 200 },
                  minWidth: { xs: "100%", sm: 200 },
                }}
              >
                <InputLabel sx={{ "&.Mui-focused": { color: "#7f8c8d" } }}>
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
                      borderColor: "#7f8c8d",
                    },
                  }}
                >
                  <MenuItem value="saved_at_desc">
                    保存日時（新しい順）
                  </MenuItem>
                  <MenuItem value="saved_at_asc">保存日時（古い順）</MenuItem>
                  <MenuItem value="title_asc">タイトル（A-Z）</MenuItem>
                  <MenuItem value="title_desc">タイトル（Z-A）</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </AccordionDetails>
        </Accordion>

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
                color: "#7f8c8d",
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
              最初のカードを追加して、後で読みたい記事を保存・整理しましょう！
              <br />
              タグ機能で記事を分類できます。
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
              <AccountCircle sx={{ color: "#7f8c8d" }} />
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
