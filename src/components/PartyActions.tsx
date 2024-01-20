import { useState, useContext } from "react";
import { Button, Grid, Typography } from "@mui/material";
import useAxios, { RefetchOptions } from "axios-hooks";
import { AxiosRequestConfig, AxiosPromise } from "axios";
import base64url from "base64url";
import * as yup from "yup";

import { api } from "scripts";
import { SingleFileAutoSubmit, InputDialog } from ".";
import { constants, Profile, Party, UserDataContext } from "misc";

const partyNameValidationSchema = yup.object({
  new_party_name: yup
    .string()
    .required("Party name is required")
    .max(
      constants.MAX_PARTY_NAME_LENGTH,
      `Party name is too long, it may contain a maximum of ${constants.MAX_PARTY_NAME_LENGTH} characters`
    ),
});

export const PartyActions = (props: {
  isPartyMember: boolean;
  party: Party;
  refetch: {
    partiesInProvince: (
      config?: AxiosRequestConfig<any> | undefined,
      options?: RefetchOptions | undefined
    ) => AxiosPromise<Party[]>;
    party: (
      config?: AxiosRequestConfig<any> | undefined,
      options?: RefetchOptions | undefined
    ) => AxiosPromise<Party>;
    all: () => void;
  };
  isLeader: boolean;
}) => {
  const [partyDialogState, setPartyDialogState] = useState({ open: false });
  const [{ data: invitedUsers }, refetchInvitedUsers] = useAxios<string[]>(
    {
      url: `/invitations/${props.party.partyid}`,
      baseURL: constants.BASE_URL,
    },
    { manual: props.isLeader || props.isPartyMember }
  );
  const userData = useContext(UserDataContext);
  const isInvitedUser =
    invitedUsers?.includes(userData?.profile.username ?? "") ?? false;

  const handleLeaveParty = async () => {
    const response = await api<string>({
      url: `/leave_party/${userData?.profile.partyid}`,
    });
    if (!response) return;
    props.refetch.all();
  };
  const handleClick = async () => {
    const response = await api<string>({
      url: `/${
        isInvitedUser
          ? "cancel_join_request"
          : `${
              props.party.invitation_only ? "ask_to_join_party" : "join_party"
            }`
      }/${props.party.partyid}`,
    });
    if (!response) return;
    props.refetch.party();
    userData?.refetchProfile();
    if (!props.party.invitation_only) return;
    refetchInvitedUsers();
  };
  const handleOpen = () =>
    setPartyDialogState({ ...partyDialogState, open: true });
  const handleClose = () =>
    setPartyDialogState({ ...partyDialogState, open: false });
  const handleChangePartyName = (newStateName: string) =>
    api({ url: `/set_party_name/${base64url.encode(newStateName)}` }).then(() =>
      props.refetch.all()
    );

  return (
    <>
      {userData?.profile.partyid !== "non-partisan" && props.isPartyMember && (
        <>
          <Grid item>
            <Button variant="contained" onClick={handleLeaveParty}>
              Leave party
            </Button>
          </Grid>
          {props.isLeader && (
            <>
              <Grid item>
                <SingleFileAutoSubmit
                  uploadParams="/upload_party_logo"
                  onUpload={props.refetch.all}
                  text="Party logo successfully changed!"
                  inputContent="Drop the file that will be new party logo"
                />
              </Grid>
              <Grid item alignSelf="center">
                <Button variant="contained" onClick={handleOpen}>
                  Change name
                </Button>
              </Grid>
              <InputDialog
                id="new_party_name"
                validationSchema={partyNameValidationSchema}
                onClose={handleClose}
                handleSubmit={handleChangePartyName}
                openDialog={partyDialogState.open}
                type="text"
                buttonText="change"
              >
                <Typography variant="subtitle1">
                  Set new name for your party
                </Typography>
              </InputDialog>
            </>
          )}
        </>
      )}
      {userData?.profile.partyid === "non-partisan" && (
        <Grid item>
          <Button variant="contained" onClick={handleClick}>
            {isInvitedUser ? "cancel request" : "join party"}
          </Button>
        </Grid>
      )}
    </>
  );
};
