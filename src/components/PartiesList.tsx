import { useState } from "react";
import base64url from "base64url";
import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  Divider,
  ListItemText,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Grid,
  Paper,
  Avatar,
  Typography,
  List,
} from "@mui/material";
import { AxiosRequestConfig, AxiosPromise } from "axios";
import { RefetchOptions } from "axios-hooks";
import * as yup from "yup";

import { InputDialog } from ".";
import { constants, Party, CreatePartyResponse } from "misc";
import { api } from "scripts";

const partyNameValidationSchema = yup.object({
  party_name: yup
    .string()
    .required("Party name is required")
    .max(
      constants.MAX_PARTY_NAME_LENGTH,
      `Party name is too long, it may contain a maximum of ${constants.MAX_PARTY_NAME_LENGTH} characters`
    ),
});

export const PartiesList = (props: {
  province: number;
  partiesInProvince?: Party[];
  refetch: () => void;
}) => {
  const [dialog, setDialog] = useState({
    open: false,
  });

  const handlePartyCreation = async (partyName: string) => {
    setDialog({ ...dialog, open: false });
    const response = await api<CreatePartyResponse>({
      url: `/create_party/${base64url.encode(partyName)}`,
    });
    if (!response) {
      setDialog({
        ...dialog,
        open: true,
      });
      return;
    }
    props.refetch();
  };
  const handleOpen = () => setDialog({ ...dialog, open: true });
  const handleClose = () => setDialog({ ...dialog, open: false });

  return (
    <Paper sx={{ maxHeight: "88vh" }}>
      <Typography variant="h6">Here you can create your own party:</Typography>
      <Button variant="contained" onClick={handleOpen}>
        Create party
      </Button>
      <Typography variant="h6">or join existing one:</Typography>
      <Grid container justifyContent="space-between">
        {["Party name", "Members", "Leader"].map((columnName) => (
          <Grid item>
            <Typography variant="h6">{columnName}:</Typography>
          </Grid>
        ))}
      </Grid>
      <List sx={{ maxHeight: "72vh", overflowY: "scroll" }}>
        {props.partiesInProvince?.map((partyInProvince) => (
          <div key={partyInProvince.partyid}>
            <Divider />
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to={`/party/${partyInProvince.partyid}`}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={partyInProvince.party_name}
                    src={`${constants.BASE_URL}/images/${partyInProvince.logo}`}
                    sx={{ width: 50, height: 50 }}
                  />
                </ListItemAvatar>
                <ListItemText primary={partyInProvince.party_name} />
                <ListItemText
                  secondary={
                    <Typography
                      variant="subtitle1"
                      color="text.primary"
                      sx={{ display: "inline" }}
                    >
                      {`${partyInProvince.current_members}/${partyInProvince.max_members}`}
                    </Typography>
                  }
                />
                <Typography variant="subtitle1">
                  {partyInProvince.leader_username}
                </Typography>
              </ListItemButton>
            </ListItem>
          </div>
        ))}
      </List>
      <InputDialog
        id="party_name"
        onClose={handleClose}
        openDialog={dialog.open}
        handleSubmit={handlePartyCreation}
        validationSchema={partyNameValidationSchema}
        buttonText="Create Party"
      >
        Please, enter name of your new party. You will pay 5 ounces of gold.
      </InputDialog>
    </Paper>
  );
};
