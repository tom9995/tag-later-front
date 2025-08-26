"use client";

import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { Search, FilterList, ExpandMore } from "@mui/icons-material";

interface Filters {
  search: string;
  is_read: boolean | undefined;
  is_favorite: boolean | undefined;
  sort_by: string;
  sort_order: "asc" | "desc";
}

interface CardsListFiltersProps {
  searchTerm: string;
  searchLoading: boolean;
  filters: Filters;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterChange: (key: string, value: string | boolean | undefined) => void;
}

const CardsListFilters: React.FC<CardsListFiltersProps> = ({
  searchTerm,
  searchLoading,
  filters,
  onSearchChange,
  onFilterChange,
}) => {
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
          <FilterList sx={{ color: "#7f8c8d", fontSize: { xs: 20, sm: 24 } }} />
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
            onChange={onSearchChange}
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
                onFilterChange(
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
                onFilterChange(
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
                const value = e.target.value;
                // 最後の_で分割して、sort_byとsort_orderを正しく取得
                const lastUnderscoreIndex = value.lastIndexOf("_");
                const sort_by = value.substring(0, lastUnderscoreIndex);
                const sort_order = value.substring(lastUnderscoreIndex + 1);
                onFilterChange("sort_by", sort_by);
                onFilterChange("sort_order", sort_order);
              }}
              label="並び順"
              sx={{
                borderRadius: 3,
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#7f8c8d",
                },
              }}
            >
              <MenuItem value="created_at_desc">保存日時（新しい順）</MenuItem>
              <MenuItem value="created_at_asc">保存日時（古い順）</MenuItem>
              <MenuItem value="title_asc">タイトル（A-Z）</MenuItem>
              <MenuItem value="title_desc">タイトル（Z-A）</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default CardsListFilters;
