import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Icon,
} from "@mui/material";

import { Trade, Craft } from ".";
import { StorageProps } from "misc";

export const StorageItem = ({
  children,
  unit,
  description,
  isWeapon,
  name,
  Icon,
}: StorageProps) => {
  return (
    <Grid item>
      <Typography component="div" variant="h5">
        <Icon /> {children} {unit}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" component="div">
        {description}
      </Typography>
      {isWeapon ? <Craft assetName={name} /> : <Trade assetName={name} />}
    </Grid>
  );
};
