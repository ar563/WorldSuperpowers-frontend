import {
  Grid,
  Button,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Link,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useFormik } from "formik";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import * as yup from "yup";
import { useState, useRef } from "react";

import { api } from "scripts";
import { FormWrapper, LinksContainer, Disclaimer } from "components";
import { constants } from "misc";
import card from "images/Card_X2.png";
import cardMobile from "images/Card_X2_mobile.png";

const validationSchema = yup.object({
  username: yup
    .string()
    .required("Username is required")
    .max(
      constants.MAX_USERNAME_LENGTH,
      `Username is too long, it may contain a maximum of ${constants.MAX_USERNAME_LENGTH} characters`
    )
    .matches(
      /[a-zA-Z0-9]+$/,
      "Username should contain only letters and numbers"
    ),
  password: yup.string().required("Password is required"),
  email: yup.string().required("E-mail is required").email("Incorrect e-mail"),
});

export const Signup = () => {
  const [token, setToken] = useState<string>();
  const captchaRef = useRef<HCaptcha>(null);
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      email: "",
      consent: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (!token) {
        captchaRef.current?.execute();
        return;
      }
      const buffCredentials = Buffer.from(
        `${values.username}:${values.password}:${values.email}:${token}`,
        "utf-8"
      );
      const response = await api<string>({
        url: "/register",
        authorization: buffCredentials.toString("base64"),
      });
      if (!response) return;
      setSubmitting(false);
      alert("check your email for verification link");
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
        <Typography component="div" variant="h5" alignSelf="center">
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
        <TextField
          fullWidth
          id="email"
          name="email"
          label="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
      </Grid>
      <Grid item>
        <FormControlLabel
          control={
            <Checkbox
              id="consent"
              checked={formik.values.consent}
              onChange={formik.handleChange}
              color="primary"
              required
            />
          }
          label={
            <Typography maxWidth={isMobile ? "60vw" : "15vw"}>
              I agree to WorldSuperpowers <Disclaimer />
            </Typography>
          }
        />
      </Grid>
      <Grid item>
        <HCaptcha
          sitekey={constants.HCAPTCHA_SITE_KEY}
          onVerify={setToken}
          ref={captchaRef}
        />
      </Grid>
      <Grid item>
        <Button color="primary" variant="contained" type="submit">
          Sign up
        </Button>
      </Grid>
      <LinksContainer>
        {[
          { url: "/password_recovery", text: "Forgot password?" },
          { url: "/log_in", text: "Log in" },
        ]}
      </LinksContainer>
    </FormWrapper>
  );
};
