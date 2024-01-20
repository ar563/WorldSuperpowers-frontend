import {
  Grid,
  Typography,
  Button,
  TextField,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import base64url from "base64url";
import { useFormik } from "formik";
import * as yup from "yup";

import { api } from "scripts";
import { LinksContainer, FormWrapper } from "components";
import card from "images/Card_X3.png";
import cardMobile from "images/Card_X3_mobile.png";
import "./index.css";

const validationSchema = yup.object({
  email: yup.string().required("E-mail is required").email("Incorrect e-mail"),
});

export const PasswordRecovery = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      await api({ url: `/recovery_code/${base64url.encode(values.email)}` });
      setSubmitting(false);
      alert("Check your email for recovery code.");
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
        <Button color="primary" variant="contained" type="submit">
          Recover
        </Button>
      </Grid>
      <LinksContainer>
        {[
          { url: "/log_in", text: "Log in" },
          { url: "/sign_up", text: "Sign Up" },
        ]}
      </LinksContainer>
    </FormWrapper>
  );
};
