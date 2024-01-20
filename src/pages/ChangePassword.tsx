import {
  Grid,
  Paper,
  Typography,
  Button,
  CssBaseline,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import * as yup from "yup";

import { api } from "scripts";
import { mainTheme } from "themes";

const validationSchema = yup.object({
  password: yup.string().required("Password is required"),
});

export const ChangePassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const buff = Buffer.from(values.password, "utf-8");
      await api({
        url: `/password_recovery/${searchParams.get("code")}`,
        authorization: buff.toString("base64"),
      });
      setSubmitting(false);
      navigate("/log_in");
    },
  });

  return (
    <ThemeProvider theme={mainTheme}>
      <CssBaseline />
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100vh" }}
      >
        <Paper
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{ height: "30vh" }}
        >
          <Typography component="div" variant="h5" alignSelf="center">
            WorldSuperpowers
          </Typography>
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
          <Button color="primary" variant="contained" fullWidth type="submit">
            Change
          </Button>
        </Paper>
      </Grid>
    </ThemeProvider>
  );
};
