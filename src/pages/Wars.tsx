import { Grid, Paper, List, Typography } from "@mui/material";
import { BsPeaceFill } from "react-icons/bs";
import { useCountdown } from "rooks";
import { useContext } from "react";

import { useWars } from "scripts";
import { WarItem, WageWarDialog } from "components";
import { UserDataContext, constants } from "misc";

export const Wars = () => {
  const { wars, refetch, userProfile, state } = useWars();
  const userData = useContext(UserDataContext);
  const cooldownEnd = userData
    ? new Date(userData.userData.can_fight_from)
    : new Date();
  const countToCooldownEnd = useCountdown(cooldownEnd);
  const cooldown = new Date(
    countToCooldownEnd * constants.MILLISECONDS_PER_SECOND
  )
    .toISOString()
    .substring(
      constants.MINUTES_SECONDS_SUBSTRING_START,
      constants.MINUTES_SECONDS_SUBSTRING_END
    );

  return (
    <Grid container justifyContent="center" spacing={2}>
      <Paper sx={{ marginTop: 5 }}>
        {state && userProfile?.username === state.leader && (
          <Grid container justifyContent="center" spacing={2}>
            <WageWarDialog attackingState={state} refetch={refetch.wars} />
          </Grid>
        )}
        {!wars && (
          <Typography
            variant="h4"
            sx={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <BsPeaceFill /> Peace
          </Typography>
        )}
        {wars && userProfile && (
          <Grid container alignItems="center" direction="column">
            <Grid item>
              <Typography variant="h4">Ongoing wars</Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">
                {cooldown === "00:00" ? "" : `Cooldown: ${cooldown}`}
              </Typography>
            </Grid>
            <Grid item>
              <List
                sx={{
                  overflowY: "scroll",
                  wordBreak: "break-word",
                  paddingRight: "5px",
                  maxHeight: "88vh",
                }}
              >
                {wars.map((war) => (
                  <WarItem
                    war={war}
                    refetch={refetch.wars}
                    userProfile={userProfile}
                    key={war.war_id}
                  />
                ))}
              </List>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Grid>
  );
};
