import { useContext } from "react";
import { TbSword } from "react-icons/tb";
import { BsShieldFill } from "react-icons/bs";
import {
  ListItemText,
  ListItem,
  Typography,
  Grid,
  Link,
  Divider,
} from "@mui/material";
import { AxiosRequestConfig, AxiosPromise } from "axios";
import useAxios, { RefetchOptions } from "axios-hooks";
import { useCountdown } from "rooks";
import { isPast } from "date-fns";
import { Link as RouterLink } from "react-router-dom";

import {
  WarDetails,
  War,
  UserDataContext,
  Profile,
  constants,
  Province,
} from "misc";
import { api } from "scripts";
import { ButtonWithTooltip, CardDataRow } from "components";

export const WarItem = (props: {
  war: WarDetails;
  refetch: (
    config?: AxiosRequestConfig<any> | undefined,
    options?: RefetchOptions | undefined
  ) => AxiosPromise<War[]>;
  userProfile: Profile;
}) => {
  const [{ data: disputedProvince }] = useAxios<Province>({
    url: `/province/${props.war.disputed_province}`,
    baseURL: constants.BASE_URL,
  });
  const [{ data: attackingProvince }] = useAxios<Province>({
    url: `/province/${props.war.attacking_province}`,
    baseURL: constants.BASE_URL,
  });
  const warEnd = new Date(props.war.war_end);
  warEnd.setSeconds(warEnd.getSeconds() + constants.SERVER_LAG);
  const countToWarEnd = useCountdown(warEnd, {
    onEnd: props.refetch,
  });
  const userData = useContext(UserDataContext);

  const timeLeft = new Date(countToWarEnd * constants.MILLISECONDS_PER_SECOND)
    .toISOString()
    .substring(
      constants.HOURS_MINUTES_SECONDS_SUBSTRING_START,
      constants.HOURS_MINUTES_SECONDS_SUBSTRING_END
    );
  const canFight = userData
    ? isPast(new Date(userData.userData.can_fight_from)) &&
      userData.userData.ammo >= constants.AMMO_FIGHT_COST &&
      userData.userData.grenades >= constants.GRENADES_FIGHT_COST &&
      userData.userData.riffles >= constants.ASSAULT_RIFFLES_FIGHT_MINIMUM
    : false;
  const canAttack =
    canFight && props.userProfile.province === props.war.attacking_province;
  const canDefend =
    canFight && props.userProfile.province === props.war.disputed_province;
  const tooltipText = `for assault you need to be in attacking or disputed province and have at least ${constants.AMMO_FIGHT_COST} rounds of ammunition, ${constants.GRENADES_FIGHT_COST} grenades and ${constants.ASSAULT_RIFFLES_FIGHT_MINIMUM} assault riffle`;

  const handleRefetch = () => {
    if (!userData) return;
    props.refetch();
    userData.refetchUserData();
  };
  const handleAttack = () =>
    api({
      url: `/attack/${props.war.war_id}/${props.war.attacking_province}/${props.war.disputed_province}`,
    }).then(handleRefetch);
  const handleDefend = () =>
    api({
      url: `/defend/${props.war.war_id}/${props.war.attacking_province}/${props.war.disputed_province}`,
    }).then(handleRefetch);

  return (
    <ListItem
      alignItems="flex-start"
      disablePadding
      sx={{
        border: "2px solid white",
        marginBottom: "5px",
      }}
    >
      <ListItemText
        primary={
          <>
            <CardDataRow name="disputed province">
              <Link
                component={RouterLink}
                to={`/province/${disputedProvince?.province_number}`}
                variant="subtitle1"
              >
                {disputedProvince?.province_name}
              </Link>
            </CardDataRow>
            <CardDataRow name="attacking province">
              <Link
                component={RouterLink}
                to={`/province/${attackingProvince?.province_number}`}
                variant="subtitle1"
              >
                {attackingProvince?.province_name}
              </Link>
            </CardDataRow>
            <Typography
              variant="subtitle1"
              color="text.primary"
              sx={{ display: "inline" }}
            >
              score: {props.war.score}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.primary"
              sx={{ display: "inline" }}
            >
              {" "}
              winning side:{" "}
              {props.war.score > 0 ? <TbSword /> : <BsShieldFill />}{" "}
              {props.war.score > 0
                ? props.war.attackersStateName
                : props.war.defendersStateName}{" "}
            </Typography>
          </>
        }
        secondary={
          <Grid container spacing={1}>
            <Grid item>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ display: "inline" }}
              >
                time left: {timeLeft}
              </Typography>
            </Grid>
            <ButtonWithTooltip
              title={tooltipText}
              variant="contained"
              disabled={!canAttack}
              onClick={handleAttack}
              arrow
            >
              Attack
            </ButtonWithTooltip>
            <ButtonWithTooltip
              title={tooltipText}
              variant="contained"
              disabled={!canDefend}
              onClick={handleDefend}
              arrow
            >
              Defend
            </ButtonWithTooltip>
            <Divider />
          </Grid>
        }
      />
    </ListItem>
  );
};
