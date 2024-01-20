import { useState } from "react";
import {
  ThemeProvider,
  Box,
  Drawer,
  Typography,
  List,
  Avatar,
  CssBaseline,
  useMediaQuery,
  useTheme,
  Button,
  Grid,
  ClickAwayListener,
} from "@mui/material";
import { Outlet } from "react-router-dom";
import {
  Home,
  Explore,
  People,
  Newspaper,
  Logout,
  Settings,
  Work,
  ReportProblem,
} from "@mui/icons-material";
import useAxios from "axios-hooks";
import { useNavigate, useLocation } from "react-router-dom";

import { ListButton, StorageIcon, ChatButton, AppBar } from ".";
import { mainTheme } from "themes";
import { constants, UserData, UserDataContext, Profile } from "misc";
import texture from "images/texture.avif";

export const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [{ data: userData, error: userDataError }, refetchUserData] =
    useAxios<UserData>({
      url: "/user_data",
      baseURL: constants.BASE_URL,
      headers: { Authorization: constants.AUTH ?? "" },
    });
  const [{ data: profile }, refetchProfile] = useAxios<Profile>({
    url: `/profile/${constants.USERNAME}`,
    baseURL: constants.BASE_URL,
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const drawerWidth = 253;
  const pages = [
    {
      pageName: "Home",
      path: "/",
      Icon: Home,
    },
    {
      pageName: "Explore",
      path: "/explore",
      Icon: Explore,
    },
    {
      pageName: "Storage",
      path: "/storage",
      Icon: StorageIcon,
    },
    {
      pageName: "Politics",
      path: "/politics",
      Icon: People,
    },
    {
      pageName: "Settings",
      path: "/settings",
      Icon: Settings,
    },
    {
      pageName: "Wars",
      path: "/wars",
      Icon: ReportProblem,
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/log_in";
  };
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  if (isMobile) {
    pages.splice(1, 0, {
      pageName: "Work",
      path: "/work",
      Icon: Work,
    });
    pages.splice(2, 0, {
      pageName: "Articles",
      path: "/articles",
      Icon: Newspaper,
    });
  }

  if (userDataError) {
    handleLogout();
    return <p>Error!</p>;
  }

  return (
    <ThemeProvider theme={mainTheme}>
      {isMobile && (
        <AppBar
          handleDrawerToggle={handleDrawerToggle}
          drawerWidth={drawerWidth}
        />
      )}
      <CssBaseline />
      {userData && profile && (
        <Box sx={{ display: "flex" }}>
          <Drawer
            open={mobileOpen}
            variant={isMobile ? "temporary" : "permanent"}
            ModalProps={{
              keepMounted: isMobile,
            }}
            anchor="left"
            sx={{
              width: drawerWidth,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                maxHeight: "none",
                boxSizing: "border-box",
                background: "black",
                border: "none",
              },
            }}
            onBlur={handleDrawerToggle}
          >
            <Avatar
              alt={profile.nickname}
              src={`${constants.BASE_URL}/images/${profile.avatar}`}
              sx={{
                width: 75,
                height: 75,
                marginTop: isMobile ? "10px" : "42px",
                marginBottom: isMobile ? "7px" : "29px",
                alignSelf: "center",
              }}
            />
            <Typography variant="h5" sx={{ textAlign: "center" }}>
              {profile.nickname}
            </Typography>
            <List
              sx={{
                marginLeft: "33px",
                marginTop: isMobile ? "14px" : "55px",
              }}
            >
              {pages.map(({ Icon, path, ...otherProps }) => (
                <ListButton
                  selected={path === location.pathname}
                  path={path}
                  key={path}
                  {...otherProps}
                >
                  <Icon />
                </ListButton>
              ))}
            </List>
            <Grid
              container
              direction="column"
              alignContent="center"
              justifyContent="center"
              sx={{
                background: `url(${texture}), #2F80ED`,
                width: "171px",
                height: "161px",
                border: "1px solid #F2F2F2",
                marginLeft: "49px",
                marginTop: isMobile ? "16px" : "63px",
                borderRadius: "20px",
                backgroundSize: "cover",
              }}
            >
              <Typography variant="h6">My balance</Typography>
              <Typography
                variant="body1"
                justifySelf="center"
                sx={{ marginTop: "15px" }}
              >
                {userData.interstellardobra} $ISD
              </Typography>
            </Grid>
            <Button
              startIcon={<Logout />}
              sx={{
                position: "absolute",
                color: "#EB5757",
                bottom: isMobile ? "5px" : "20px",
                left: "49px",
                margin: "0px",
              }}
              onClick={handleLogout}
            >
              <Typography variant="body2">logout</Typography>
            </Button>
          </Drawer>
          <Box
            component="main"
            sx={{
              position: isMobile ? "fixed" : "static",
              flexGrow: 1,
              p: isMobile || location.pathname === "/explore" ? 0 : 3,
              bottom: isMobile ? 56 : "auto",
              top: isMobile ? 0 : "auto",
              width: "100%",
              "& .MuiPaper-root": {
                borderRadius: "20px",
              },
              overflowY: isMobile ? "scroll" : "visible",
              overflowX: isMobile ? "hidden" : "visible",
            }}
          >
            <UserDataContext.Provider
              value={{
                userData,
                profile,
                refetchUserData,
                refetchProfile,
              }}
            >
              <Outlet />
            </UserDataContext.Provider>
          </Box>
        </Box>
      )}
      <ChatButton />
    </ThemeProvider>
  );
};
