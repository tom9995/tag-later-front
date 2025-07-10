import React from "react";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { Fab, Box } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        width: "100%",
        padding: 2,
      }}
    >
      <Fab
        color="inherit"
        size="large"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          backgroundColor: "#ebebeb",
          "&:hover": {
            backgroundColor: "#d5d5d5",
          },
        }}
      >
        <ControlPointIcon />
      </Fab>
    </Box>
  );
}
