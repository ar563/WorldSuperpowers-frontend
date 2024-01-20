import { useState, useContext, SyntheticEvent, ChangeEvent } from "react";
import { Button, Grid, Snackbar, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { api } from "scripts";
import { UserDataContext } from "misc";

export const Donate = (props: { username?: string | null }) => {
  const [donation, setDonation] = useState({
    snackbarText: "",
    isSnackbarOpen: false,
    cash: 0,
  });
  const userData = useContext(UserDataContext);

  const handleChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const newAmmountOfCash = parseInt(event.target.value);
    newAmmountOfCash < 0 ||
      setDonation({ ...donation, cash: newAmmountOfCash });
  };
  const handleClick = async () => {
    const response = await api<string>({
      url: `/send_money/${props.username}/${donation.cash}`,
    });
    if (!response) return;
    userData?.refetchUserData();
    setDonation({
      ...donation,
      cash: 0,
      snackbarText: "Success",
      isSnackbarOpen: true,
    });
  };
  const handleClose = (event: SyntheticEvent | Event, reason?: string) =>
    reason !== "clickaway" &&
    setDonation({ ...donation, isSnackbarOpen: false });

  return (
    <Grid item sx={{ display: "flex", alignItems: "center" }} margin={1}>
      <TextField
        type="number"
        value={donation.cash}
        onChange={handleChange}
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
      />
      <Button variant="contained" onClick={handleClick}>
        donate
      </Button>
      <Snackbar
        open={donation.isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        message={donation.snackbarText}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Grid>
  );
};
