import {
  IconButton,
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import { Menu, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const AppBar = ({
  handleDrawerToggle,
  drawerWidth,
}: {
  handleDrawerToggle?: () => void;
  drawerWidth: number;
}) => {
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  return (
    <MuiAppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bottom: 0,
        top: "auto",
        background: "black",
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <Menu />
        </IconButton>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">
          WorldSuperpowers
        </Typography>
        <IconButton color="inherit" edge="end" onClick={handleBack}>
          <ArrowBack />
        </IconButton>
      </Toolbar>
    </MuiAppBar>
  );
};
