import { ReactNode, FormEventHandler } from "react";
import {
  Grid,
  CssBaseline,
  ThemeProvider,
  useTheme,
  SxProps,
  useMediaQuery,
  Theme,
} from "@mui/material";

import { formTheme } from "themes";
import { Footer } from "components";

export const FormWrapper = ({
  onSubmit,
  children,
  gridThemeProps,
}: {
  onSubmit?: FormEventHandler<HTMLFormElement>;
  children?: ReactNode;
  gridThemeProps?: SxProps<Theme>;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <ThemeProvider theme={formTheme}>
      <CssBaseline />
      <Grid
        component="form"
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        height="100%"
        rowSpacing={2}
        sx={{
          ...gridThemeProps,
          padding: "4px",
          backgroundPosition: "center",
          marginTop: isMobile ? "0.5vh" : "",
          height: "100vh",
          width: "100vw",
        }}
        onSubmit={onSubmit}
      >
        {children}
      </Grid>
      <Footer />
    </ThemeProvider>
  );
};
