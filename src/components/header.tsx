import { Button, IconButton, InputBase, Paper, Stack } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
import Divider from "@mui/material/Divider";
import React from "react";
import { Fullscreen } from "@mui/icons-material";

type HeaderProps = {
  title: string;
  searchFileButton?: boolean;
  filterButton?: boolean;
};

export default function Header({ title }: HeaderProps) {
  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      sx={{ padding: 2, backgroundColor: "#ebebeb" }}
    >
      <Stack>
        <h1>{title}</h1>
      </Stack>
      <Stack>
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search"
            inputProps={{ "aria-label": "search" }}
          />
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Stack>
    </Stack>
  );
}
