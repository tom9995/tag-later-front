import {
  Button,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
import Divider from "@mui/material/Divider";
import React from "react";
import { Fullscreen } from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

type HeaderProps = {
  title: string;
  userName: string;
  searchFileButton?: boolean;
  filterButton?: boolean;
};

export default function Header({ title, userName }: HeaderProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      sx={{ padding: 2, backgroundColor: "#ebebeb" }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack>
          <h1>{title}</h1>
        </Stack>
        <Stack direction="row" alignItems="center" sx={{ gap: 2 }}>
          <Typography>{userName}</Typography>
          <Button variant="outlined" onClick={handleLogout}>
            ログアウト
          </Button>
        </Stack>
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
