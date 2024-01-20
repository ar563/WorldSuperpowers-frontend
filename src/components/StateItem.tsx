import { useState } from "react";
import {
  Paper,
  Typography,
  Avatar,
  Button,
  Grid,
  GridSize,
} from "@mui/material";
import { AxiosRequestConfig, AxiosPromise } from "axios";
import { RefetchOptions } from "axios-hooks";
import base64url from "base64url";
import * as yup from "yup";

import { constants, State } from "misc";
import { api } from "scripts";
import { SingleFileAutoSubmit, CardDataRow, InputDialog } from ".";

const stateNameValidationSchema = yup.object({
  state_name: yup
    .string()
    .required("Mine name is required")
    .max(
      constants.MAX_STATE_NAME_LENGTH,
      `Mine name is too long, it may contain a maximum of ${constants.MAX_STATE_NAME_LENGTH} characters`
    ),
});

export const StateItem = (props: {
  selectedState: State;
  username: string;
  refetchState: (
    config?: AxiosRequestConfig<any> | undefined,
    options?: RefetchOptions | undefined
  ) => AxiosPromise<State>;
  xs?: boolean | GridSize;
}) => {
  const [nameDialogState, setNameDialogState] = useState({ open: false });

  const handleOpen = () =>
    setNameDialogState({ ...nameDialogState, open: true });
  const handleClose = () =>
    setNameDialogState({ ...nameDialogState, open: false });
  const handleChangeName = (newStateName: string) =>
    api({ url: `/set_state_name/${base64url.encode(newStateName)}` }).then(() =>
      props.refetchState()
    );

  return (
    <Grid item xs={props.xs ?? true}>
      <Paper>
        <Grid container alignItems="center" direction="column" spacing={1}>
          <Grid item>
            <Typography variant="h4">state</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4">
              {props.selectedState.state_name}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              alt={props.selectedState.state_name}
              src={`${constants.BASE_URL}/images/${props.selectedState.coat_of_arms}`}
              sx={{ width: 175, height: 175 }}
              variant="rounded"
            />
          </Grid>
          {props.selectedState.leader === props.username && (
            <>
              <Grid item>
                <SingleFileAutoSubmit
                  uploadParams="/upload_coat_of_arms"
                  onUpload={props.refetchState}
                  text="Coat of arms successfully changed!"
                  inputContent="Drop the file that will be new coat of arms"
                />
              </Grid>
              <Grid item alignSelf="center">
                <Button variant="contained" onClick={handleOpen}>
                  Change name
                </Button>
              </Grid>
              <InputDialog
                id="state_name"
                validationSchema={stateNameValidationSchema}
                onClose={handleClose}
                handleSubmit={handleChangeName}
                openDialog={nameDialogState.open}
                type="text"
                buttonText="change"
              >
                <Typography variant="subtitle1">
                  Set new name for your state
                </Typography>
              </InputDialog>
            </>
          )}
        </Grid>
        <Grid container direction="column">
          <CardDataRow name="leader">
            {props.selectedState.leader ?? "lack of leadership"}
          </CardDataRow>
          <CardDataRow name="political system">
            {props.selectedState.political_system}
          </CardDataRow>
          <CardDataRow name="creation date">
            {`${props.selectedState.creation_date.slice(
              constants.DATE_SUBSTRING_START,
              constants.DATE_SUBSTRING_END
            )} ${props.selectedState.creation_date.slice(
              constants.HOURS_MINUTES_SECONDS_SUBSTRING_START,
              constants.HOURS_MINUTES_SECONDS_SUBSTRING_END
            )}`}
          </CardDataRow>
        </Grid>
      </Paper>
    </Grid>
  );
};
