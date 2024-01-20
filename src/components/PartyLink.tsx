import { Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import useAxios from "axios-hooks";

import { constants, Party } from "misc";

export const PartyLink = (props: { partyID: string }) => {
  const [{ data: party }] = useAxios<Party>(
    {
      url: `/party/${props.partyID}`,
      baseURL: constants.BASE_URL,
    },
    { manual: props.partyID === "non-partisan" }
  );

  return (
    <>
      {props.partyID === "non-partisan" && (
        <Typography variant="subtitle1">non-partisan</Typography>
      )}
      {props.partyID !== "non-partisan" && party && (
        <Link
          component={RouterLink}
          to={`/party/${props.partyID}`}
          variant="subtitle1"
        >
          {party.party_name}
        </Link>
      )}
    </>
  );
};
