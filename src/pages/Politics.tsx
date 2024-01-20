import { useContext } from "react";
import { Grid } from "@mui/material";
import useAxios from "axios-hooks";
import { useParams } from "react-router-dom";

import { PartyItem, Parliament, StateItem } from "components";
import { constants, UserDataContext, State } from "misc";

export const Politics = () => {
  const params = useParams();
  const userData = useContext(UserDataContext);
  const [{ data: state }, refetchState] = useAxios<State>(
    {
      url: `/province_ownership/${userData?.profile?.province}`,
      baseURL: constants.BASE_URL,
    },
    { manual: !Boolean(userData?.profile?.province) }
  );

  const partyID = params.partyid ?? userData?.profile?.partyid;

  return (
    <Grid container spacing={2} justifyContent="center">
      {userData?.profile && (
        <PartyItem
          province={userData.profile.province}
          partyID={partyID}
          xs={!params.partyid}
        />
      )}
      {state && !params.partyid && partyID && userData?.profile?.username && (
        <Parliament
          parliamentMembers={state.members_of_parliament ?? [""]}
          partyID={partyID}
          username={userData.profile.username}
          state={state}
        />
      )}
      {state && userData?.profile?.username && !params.partyid && (
        <StateItem
          selectedState={state}
          refetchState={refetchState}
          username={userData.profile.username}
        />
      )}
    </Grid>
  );
};
