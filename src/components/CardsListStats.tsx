"use client";

import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ExpandMore,
  BarChart,
  Article,
  Visibility,
  VisibilityOff,
  Favorite,
} from "@mui/icons-material";
import { Card as CardType } from "@/services/api";

interface CardsListStatsProps {
  allCards: CardType[];
}

interface Stats {
  total: number;
  read: number;
  unread: number;
  favorites: number;
}

const CardsListStats: React.FC<CardsListStatsProps> = ({ allCards }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const stats: Stats = {
    total: allCards.length,
    read: allCards.filter((card) => card.is_read).length,
    unread: allCards.filter((card) => !card.is_read).length,
    favorites: allCards.filter((card) => card.is_favorite).length,
  };

  return (
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
          <BarChart sx={{ color: "#7f8c8d", fontSize: { xs: 20, sm: 24 } }} />
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
          {/* 総カード数 */}
          <Box
            sx={{
              textAlign: "center",
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #7f8c8d 0%, #34495e 100%)",
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

          {/* 既読 */}
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

          {/* 未読 */}
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

          {/* お気に入り */}
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
  );
};

export default CardsListStats;
