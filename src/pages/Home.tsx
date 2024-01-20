import { Grid } from "@mui/material";

import { PersonalDataCard, Work, Articles } from "components";

export const Home = () => {
  return (
    <>
      <Grid container spacing={2} justifyContent="center">
        <PersonalDataCard isSelectedProfile={false} />
        <Work />
        <Articles />
      </Grid>
    </>
  );
};
