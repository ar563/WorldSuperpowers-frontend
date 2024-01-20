import { useContext } from "react";
import {
  Grid,
  Paper,
  Typography,
  Avatar,
  Switch,
  Link,
  GridSize,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { AxiosRequestConfig, AxiosPromise } from "axios";
import useAxios, { RefetchOptions } from "axios-hooks";

import { PartiesList, CardDataRow, PartyActions } from ".";
import { constants, Party, UserDataContext, Province } from "misc";
import { api } from "scripts";

export const PartyItem = (props: {
  partyID?: string;
  province: number;
  xs?: boolean | GridSize;
}) => {
  const [{ data: party }, refetchParty] = useAxios<Party>(
    {
      url: `/party/${props.partyID}`,
      baseURL: constants.BASE_URL,
    },
    { manual: props.partyID === "non-partisan" }
  );
  const [{ data: partiesInProvince }, refetchPartiesInProvince] = useAxios<
    Party[]
  >({
    url: `/parties_by_province/${props.province}`,
    baseURL: constants.BASE_URL,
  });
  const [{ data: partyProvince }] = useAxios<Province>({
    url: `/province/${props.province}`,
    baseURL: constants.BASE_URL,
  });
  const userData = useContext(UserDataContext);
  const isLeader = party?.leader_username === userData?.profile.username;

  const handleInvitationSwitch = async () => {
    const response = await api<string>({
      url: `/invitation_only/${!party?.invitation_only}`,
    });
    if (!response) return;
    refetchParty();
  };
  const refetchAll = () => {
    userData?.refetchProfile();
    refetchPartiesInProvince();
    refetchParty();
  };

  return (
    <Grid item xs={props.xs ?? true}>
      {props.partyID === "non-partisan" && (
        <PartiesList
          province={props.province}
          partiesInProvince={partiesInProvince}
          refetch={refetchAll}
        />
      )}
      {party && props.partyID !== "non-partisan" && (
        <Paper>
          <Grid container alignItems="center" direction="column" spacing={1}>
            <Grid item>
              <Typography variant="h4">party</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4">{party.party_name}</Typography>
            </Grid>
            <Grid item>
              <Avatar
                alt={party.party_name}
                src={`${constants.BASE_URL}/images/${party.logo}`}
                sx={{ width: 200, height: 200 }}
                variant="square"
              />
            </Grid>
            <PartyActions
              isPartyMember={userData?.profile.partyid === props.partyID}
              party={party}
              refetch={{
                partiesInProvince: refetchPartiesInProvince,
                party: refetchParty,
                all: refetchAll,
              }}
              isLeader={isLeader}
            />
          </Grid>
          <Grid container direction="column">
            <CardDataRow name="Invitation only">
              {isLeader ? (
                <Switch
                  checked={party.invitation_only}
                  onClick={handleInvitationSwitch}
                />
              ) : party.invitation_only ? (
                "yes"
              ) : (
                "no"
              )}
            </CardDataRow>
            <CardDataRow name="Leader">
              <Link
                component={RouterLink}
                to={`/profile/${party.leader_username}`}
                variant="subtitle1"
              >
                {party.leader_username}
              </Link>
            </CardDataRow>
            <CardDataRow name="Members">
              <Link
                component={RouterLink}
                to={`/party/${props.partyID}/members${
                  party.max_members > party.current_members && isLeader
                    ? "_and_requests"
                    : ""
                }`}
                variant="subtitle1"
              >
                {party.current_members}/{party.max_members}
              </Link>
            </CardDataRow>
            <CardDataRow name="Location">
              <Link
                component={RouterLink}
                to={`/province/${partyProvince?.province_number}`}
                variant="subtitle1"
              >
                {partyProvince?.province_name}
              </Link>
            </CardDataRow>
          </Grid>
        </Paper>
      )}
    </Grid>
  );
};
