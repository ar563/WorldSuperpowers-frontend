import { ReactNode } from "react";
import { Grid, Button, Typography } from "@mui/material";

import { api } from "scripts";

export const EducationField = (props: {
  disabled?: boolean;
  isStudying?: boolean;
  fieldOfStudy?: string;
  counter?: string;
  handleButtonClick: () => void;
  children?: ReactNode;
}) => {
  const handleClick = async () => {
    const response = await api<string>({
      url: `/${props.isStudying ? "delete_study" : "study"}/${
        props.isStudying ? "" : props.fieldOfStudy
      }`,
    });
    if (!response) return;
    props.handleButtonClick();
  };

  return (
    <Grid item>
      <Typography variant="subtitle1">{props.children}</Typography>
      <Grid container>
        <Button
          variant="contained"
          disabled={props.disabled}
          onClick={handleClick}
        >
          {props.isStudying ? "Stop studying" : "Start studying"}
        </Button>
        <Typography variant="subtitle1">{props.counter}</Typography>
      </Grid>
    </Grid>
  );
};
