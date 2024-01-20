import { Grid } from "@mui/material";

import { PersonalDataCard } from "components";

export const Profile = () => {
  return (
    <Grid container justifyContent="center" spacing={2}>
      <PersonalDataCard isSelectedProfile={true} />
    </Grid>
  );
};
