import { createTheme, darkScrollbar } from "@mui/material";

import background from "images/background.png";

export const mainTheme = createTheme({
  palette: {
    primary: {
      main: "#ffffff",
    },
    secondary: {
      main: "#333333",
    },
    mode: "dark",
  },
  typography: {
    fontFamily: ["Poppins"].join(","),
    allVariants: { marginRight: "4px", marginLeft: "4px" },
    h5: {
      fontSize: "20px",
      fontWeight: 600,
    },
    h6: {
      fontSize: "15px",
      fontWeight: 600,
    },
    body1: {
      fontSize: "15px",
      fontWeight: 500,
    },
    body2: {
      fontSize: "16px",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "#202020",
          ...darkScrollbar({
            track: "transparent",
            thumb: "#616061",
            active: "#616061",
          }),
        },
        scrollbarWidth: "thin",
        scrollbarColor: "#616061 transparent",
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#616061",
          borderRadius: "8px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "#202020",
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          marginTop: "5px",
          borderColor: "white",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "white",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          margin: "0px",
        },
      },
    },
  },
});

export const formTheme = createTheme(mainTheme, {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: `url(${background}) no-repeat`,
          backgroundSize: "cover",
        },
      },
    },
  },
});
