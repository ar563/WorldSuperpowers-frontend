import {
  Grid,
  Button,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

import { fetchData } from "scripts";
import {
  FormWrapper,
  LinksContainer,
  GoogleLogin,
  UsernameLoginButton,
  Disclaimer,
} from "components";
import { constants } from "misc";
import card from "images/Card_X3.png";
import cardMobile from "images/Card_X3_mobile.png";

export const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  return (
    <FormWrapper
      gridThemeProps={{
        background: `url(${isMobile ? cardMobile : card}) no-repeat`,
      }}
    >
      <Grid item alignSelf="center">
        <Typography component="div" variant="h5">
          WorldSuperpowers
        </Typography>
      </Grid>
      <Grid item>
        <UsernameLoginButton onClick={() => navigate("/account_log_in")} />
      </Grid>
      <Grid item>
        <GoogleLogin />
      </Grid>
      <Grid item>
        <Typography component="div" variant="body1" sx={{ fontSize: 8 }}>
          by logging in I agree to WorldSuperpowers <Disclaimer />
        </Typography>
      </Grid>
    </FormWrapper>
  );
};
