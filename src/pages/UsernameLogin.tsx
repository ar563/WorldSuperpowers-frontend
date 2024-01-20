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
import { AxiosError } from "axios";

import { fetchData } from "scripts";
import { FormWrapper, LinksContainer } from "components";
import { constants } from "misc";
import card from "images/Card_X3.png";
import cardMobile from "images/Card_X3_mobile.png";

const validationSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

export const UsernameLogin = () => {
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const buff = Buffer.from(
        `${values.username}:${values.password}`,
        "utf-8"
      );
      const base64 = buff.toString("base64");
      try {
        const response = await fetchData<string>({
          url: `/login`,
          authorization: base64,
          method: "get",
        });
        if (!response?.data) return;
        localStorage.setItem("username", values.username);
        localStorage.setItem("auth", response.data);
        setSubmitting(false);
        window.location.href = "/";
      } catch (error) {
        console.error(error);
        if (error instanceof AxiosError) {
          error.response?.status === constants.FORBIDDEN_ERROR_CODE &&
            alert("Wrong password!");
        }
      }
    },
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <FormWrapper
      onSubmit={formik.handleSubmit}
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
        <TextField
          fullWidth
          id="username"
          name="username"
          label="Username"
          value={formik.values.username}
          onChange={formik.handleChange}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />
      </Grid>
      <Grid item>
        <TextField
          fullWidth
          id="password"
          name="password"
          label="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
      </Grid>
      <Grid item>
        <Button color="primary" variant="contained" type="submit">
          Login
        </Button>
      </Grid>
      <LinksContainer>
        {[
          { url: "/password_recovery", text: "Forgot password?" },
          { url: "/sign_up", text: "Sign Up" },
        ]}
      </LinksContainer>
    </FormWrapper>
  );
};
