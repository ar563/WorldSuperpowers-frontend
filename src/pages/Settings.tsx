import { Grid, Paper, Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import base64url from "base64url";

import { api } from "scripts";

const validationSchema = yup.object({
  email: yup.string().email("Incorrect e-mail").required("Email is required"),
});

export const Settings = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) =>
      api({ url: `/change_email/${base64url.encode(values.email)}` }).then(
        () => {
          alert("Check your mail for verification link.");
          setSubmitting(false);
        }
      ),
  });

  return (
    <Grid container spacing={2} justifyContent="center">
      <Paper
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          padding: "2.5vh",
          margin: "1vh",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          height: "18vh",
        }}
      >
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <Button
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          sx={{ margin: "0px" }}
        >
          Save changes
        </Button>
      </Paper>
    </Grid>
  );
};
