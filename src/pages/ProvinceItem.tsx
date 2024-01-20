import { useParams, Link as RouterLink } from "react-router-dom";
import { useContext } from "react";
import { Paper, Button, Typography, Link, Grid } from "@mui/material";
import useAxios from "axios-hooks";
import { isFuture } from "date-fns";

import { Province, State, Profile, UserDataContext, constants } from "misc";
import { api } from "scripts";
import { CardDataRow, ButtonWithTooltip, CoatOfArms } from "components";

export const ProvinceItem = () => {
  const params = useParams();
  const [{ data: provinceData }] = useAxios<Province>({
    url: `/province/${params.provinceNumber}`,
    baseURL: constants.BASE_URL,
  });
  const [{ data: ownership }] = useAxios<State>({
    url: `/province_ownership/${params.provinceNumber}`,
    baseURL: constants.BASE_URL,
  });
  const userData = useContext(UserDataContext);

  const handleTravel = async () => {
    await api({ url: `/travel/${params.provinceNumber}` });
    alert("travel was successful");
    userData?.refetchProfile();
  };
  const setDamageBonusProvince = async () => {
    await api({ url: `/set_bonus_province/${params.provinceNumber}` });
    alert("province of damage bonus has been changed");
    userData?.refetchProfile();
  };
  const setCitizenship = async () => {
    await api({ url: `/set_citizenship/${params.provinceNumber}` });
    alert("province of citizenship has been changed");
    userData?.refetchProfile();
  };

  return (
    <Grid container justifyContent="center" spacing={2}>
      {provinceData && (
        <Grid item>
          <Paper>
            <Grid container alignItems="center" direction="column" spacing={1}>
              <Grid item>
                <Typography variant="h4">
                  {provinceData.province_name}
                </Typography>
              </Grid>
              <Grid item>
                <CoatOfArms {...provinceData} />
              </Grid>
              {userData &&
                userData.profile.province !==
                  parseInt(params.provinceNumber ?? "") && (
                  <ButtonWithTooltip
                    variant="contained"
                    title={`you need at least ${constants.TRAVEL_OIL_COST} oil barrels`}
                    disabled={userData.userData.oil < constants.TRAVEL_OIL_COST}
                    onClick={handleTravel}
                    arrow
                  >
                    travel
                  </ButtonWithTooltip>
                )}
              {(isFuture(constants.DAMAGE_BONUS_CHANGE_DEADLINE) ||
                !userData?.profile.damage_bonus_province) &&
                userData?.profile.damage_bonus_province !==
                  params.provinceNumber && (
                  <Grid item>
                    <Button
                      variant="contained"
                      onClick={setDamageBonusProvince}
                    >
                      get damage bonus
                    </Button>
                  </Grid>
                )}
              {(isFuture(constants.CITIZENSHIP_CHANGE_DEADLINE) ||
                userData?.profile.citizenship === 1) &&
                userData?.profile.citizenship !== params.provinceNumber && (
                  <Grid item>
                    <Button variant="contained" onClick={setCitizenship}>
                      get citizenship
                    </Button>
                  </Grid>
                )}
              <Grid container direction="column">
                <CardDataRow name="state">
                  <Link
                    component={RouterLink}
                    to={`/state/${ownership?.stateid}`}
                    variant="subtitle1"
                  >
                    {ownership?.state_name}
                  </Link>
                </CardDataRow>
                <CardDataRow name="climate">{provinceData.climate}</CardDataRow>
                {["oil", "gas", "gold", "iron"].map((resource) => (
                  <CardDataRow name={resource} key={resource}>
                    {provinceData[resource as keyof Province]}/
                    {constants.MAX_NATURAL_RESOURCES}
                  </CardDataRow>
                ))}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};
