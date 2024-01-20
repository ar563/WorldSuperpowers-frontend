import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import useAxios from "axios-hooks";

import { StateItem } from "components";
import { constants, State } from "misc";

export const SelectedState = () => {
  const params = useParams();
  const [{ data: state }, refetchState] = useAxios<State>({
    url: `/state/${params.selectedState}`,
    baseURL: constants.BASE_URL,
  });

  return (
    <Grid container justifyContent="center" spacing={2}>
      {state && constants.USERNAME && (
        <StateItem
          selectedState={state}
          username={constants.USERNAME}
          refetchState={refetchState}
          xs={false}
        />
      )}
    </Grid>
  );
};
