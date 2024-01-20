import { ReactNode } from "react";
import { Grid, Typography } from "@mui/material";

export const CardDataRow = (props: { name?: string; children?: ReactNode }) => {
  return (
    <Grid item>
      <Grid container justifyContent="space-between">
        <Grid item>
          <Typography variant="subtitle1">{props.name}:</Typography>
        </Grid>
        <Grid item>
          <Typography variant="subtitle1">{props.children}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
