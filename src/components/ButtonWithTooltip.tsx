import { Button, Tooltip, Grid } from "@mui/material";

import { ButtonWithtooltipProps } from "misc";

export const ButtonWithTooltip = (props: ButtonWithtooltipProps) => {
  const { title, arrow, children, ...otherProps } = props;

  return (
    <>
      {title && (
        <Tooltip title={title} arrow={arrow}>
          <Grid item>
            <Button {...otherProps}>{children}</Button>
          </Grid>
        </Tooltip>
      )}
    </>
  );
};
