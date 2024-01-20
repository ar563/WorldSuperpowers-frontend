import { useState, useContext } from "react";
import {
  Typography,
  Button,
  Box,
  Card,
  Grid,
  CardContent,
  CardActions,
} from "@mui/material";
import useAxios from "axios-hooks";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import base64url from "base64url";
import { AxiosRequestConfig, AxiosPromise } from "axios";
import { RefetchOptions } from "axios-hooks";
import * as yup from "yup";
import UAParser from "ua-parser-js";

import { Mine, constants, BuildingType, Profile } from "misc";
import { InputDialog, ButtonWithTooltip, CardDataRow } from ".";
import { api } from "scripts";

interface MineCardProps extends Mine {
  workplaceID: string;
  handleWork: (building: { type: string; ID: string }) => Promise<void>;
  handleOpen: (change: { valueName: string; ID: string }) => void;
  mineType: BuildingType;
}

export const MineCard = ({
  building_id,
  mine_name,
  owner_username,
  max_workers,
  profit_multiplier,
  owner_profit_share,
  workplaceID,
  handleWork,
  handleOpen,
  mineType,
}: MineCardProps) => {
  const [{ data: ownerProfile }] = useAxios<Profile>({
    url: `/profile/${owner_username}`,
    baseURL: constants.BASE_URL,
  });

  return (
    <>
      <CardContent>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          {mine_name}
        </Typography>
        <CardDataRow name="owner">{ownerProfile?.nickname}</CardDataRow>
        <CardDataRow name="max workers">{max_workers}</CardDataRow>
        <CardDataRow name="profit multiplier">{profit_multiplier}</CardDataRow>
        <CardDataRow name="wage">
          {constants.MAX_WAGE - owner_profit_share}%
        </CardDataRow>
      </CardContent>
      <CardActions>
        <Grid container>
          <Button
            variant="contained"
            component={Grid}
            disabled={workplaceID === building_id}
            onClick={() =>
              handleWork({
                type: mineType,
                ID: building_id,
              })
            }
          >
            Work
          </Button>
          {owner_username === constants.USERNAME ? (
            <>
              <Button
                variant="contained"
                component={Grid}
                onClick={() =>
                  handleOpen({
                    valueName: "change_factory_name",
                    ID: building_id,
                  })
                }
              >
                Edit name
              </Button>
              <Button
                variant="contained"
                component={Grid}
                onClick={() =>
                  handleOpen({
                    valueName: "change_factory_share",
                    ID: building_id,
                  })
                }
              >
                Change profit share
              </Button>
            </>
          ) : null}
        </Grid>
      </CardActions>
    </>
  );
};
