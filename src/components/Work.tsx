import { List, Paper, Grid, useMediaQuery, useTheme } from "@mui/material";
import { useState, useContext } from "react";
import useAxios from "axios-hooks";
import base64url from "base64url";
import * as yup from "yup";

import { Mines, InputDialog } from ".";
import {
  constants,
  UserDataContext,
  Workplace,
  BuildingType,
  Profile,
} from "misc";
import { api, useMines } from "scripts";

export const Work = () => {
  const [dialog, setDialog] = useState<{
    open: boolean;
    buildingType: BuildingType;
  }>({
    open: false,
    buildingType: "gold_mines",
  });
  const [{ data: profile }] = useAxios<Profile>({
    url: `/profile/${constants.USERNAME}`,
    baseURL: constants.BASE_URL,
  });
  const { mines, refetchMines } = useMines({
    province: profile?.province,
  });
  const userData = useContext(UserDataContext);
  const [{ data: workplace }, refetchWorkplace] = useAxios<Workplace | string>({
    url: "/check_employment",
    baseURL: constants.BASE_URL,
    headers: { Authorization: constants.AUTH ?? "" },
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const workplaceID =
    typeof workplace === "object" ? workplace?.building_id : undefined;
  const mineNameValidationSchema = yup.object({
    [dialog.buildingType]: yup
      .string()
      .required("Mine name is required")
      .max(
        constants.MAX_STATE_NAME_LENGTH,
        `Mine name is too long, it may contain a maximum of ${constants.MAX_STATE_NAME_LENGTH} characters`
      ),
  });

  const handleOpen = (building: { type: BuildingType }) =>
    setDialog({ ...dialog, buildingType: building.type, open: true });
  const handleClose = () => setDialog({ ...dialog, open: false });
  const handleBuild = async (mineName: string) => {
    if (!userData) return;
    const response = await api<string>({
      url: `/create/${dialog.buildingType}/${base64url.encode(mineName)}`,
    });
    if (!response) return;
    setDialog({ ...dialog, open: false });
    userData.refetchUserData();
    const refetch = {
      gold_mines: refetchMines.goldMines,
      gas_plants: refetchMines.gasPlants,
      oil_fields: refetchMines.oilFields,
      iron_mines: refetchMines.ironMines,
    };
    refetch[dialog.buildingType]();
  };

  return (
    <Grid item xs>
      {mines && (
        <Grid sx={{ height: isMobile ? "92vh" : "95vh", overflowY: "scroll" }}>
          <Mines
            mineType="gold_mines"
            mines={mines.goldMines}
            handleOpen={handleOpen}
            workplaceID={workplaceID}
            refetch={{
              workplace: refetchWorkplace,
              mines: refetchMines.goldMines,
            }}
          />
          <Mines
            mineType="gas_plants"
            mines={mines.gasPlants}
            handleOpen={handleOpen}
            workplaceID={workplaceID}
            refetch={{
              workplace: refetchWorkplace,
              mines: refetchMines.gasPlants,
            }}
          />
          <Mines
            mineType="oil_fields"
            mines={mines.oilFields}
            handleOpen={handleOpen}
            workplaceID={workplaceID}
            refetch={{
              workplace: refetchWorkplace,
              mines: refetchMines.oilFields,
            }}
          />
          <Mines
            mineType="iron_mines"
            mines={mines.ironMines}
            handleOpen={handleOpen}
            workplaceID={workplaceID}
            refetch={{
              workplace: refetchWorkplace,
              mines: refetchMines.ironMines,
            }}
          />
        </Grid>
      )}
      {["gold_mines", "oil_fields", "gas_plants", "iron_mines"].map(
        (buildingType) => (
          <InputDialog
            id={buildingType}
            onClose={handleClose}
            openDialog={
              dialog.buildingType === buildingType ? dialog.open : false
            }
            handleSubmit={handleBuild}
            buttonText="build"
            validationSchema={mineNameValidationSchema}
            key={buildingType}
          >
            Please, enter name of your new{" "}
            {dialog.buildingType.split("_").join(" ").slice(0, -1)}. You will
            pay {`${constants.BUILD_COST[dialog.buildingType]} `}
            ounces of gold.
          </InputDialog>
        )
      )}
    </Grid>
  );
};
