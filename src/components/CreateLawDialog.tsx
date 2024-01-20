import { useState } from "react";
import { AxiosRequestConfig, AxiosPromise } from "axios";
import { RefetchOptions } from "axios-hooks";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  MenuItem,
  Select,
  SelectChangeEvent,
  Grid,
} from "@mui/material";

import { api } from "scripts";
import { Law } from "misc";

export const CreateLawDialog = (props: {
  refetchLaws: (
    config?: AxiosRequestConfig<any> | undefined,
    options?: RefetchOptions | undefined
  ) => AxiosPromise<Law[]>;
}) => {
  const [dialog, setDialog] = useState({
    open: false,
    selectedOption: "",
  });

  const handleClose = () => setDialog({ ...dialog, open: false });
  const handleOpen = () => setDialog({ ...dialog, open: true });
  const handleCreateLaw = () => {
    handleClose();
    api({
      url: `/create_law/${dialog.selectedOption}`,
    })
      .then(() => props.refetchLaws())
      .catch(handleOpen);
  };
  const handleChange = (event: SelectChangeEvent) =>
    setDialog({ ...dialog, selectedOption: event.target.value });

  return (
    <Grid item alignSelf="center">
      <Button variant="contained" onClick={handleOpen}>
        Create law
      </Button>
      <Dialog open={dialog.open} onClose={handleClose}>
        <DialogTitle>create law</DialogTitle>
        <DialogContent>
          <Select
            value={dialog.selectedOption}
            onChange={handleChange}
            fullWidth
          >
            {[
              "proclaim_leadership",
              "proclaim_dictatorship",
              "overthrow_leader",
            ].map((menuItemValue) => (
              <MenuItem value={menuItemValue} key={menuItemValue}>
                {menuItemValue.split("_").join(" ")}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleCreateLaw}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};
