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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import base64url from "base64url";
import { AxiosRequestConfig, AxiosPromise } from "axios";
import { RefetchOptions } from "axios-hooks";
import * as yup from "yup";
import UAParser from "ua-parser-js";

import { Mine, constants, BuildingType, UserDataContext } from "misc";
import { InputDialog, ButtonWithTooltip, MineCard } from ".";
import { api } from "scripts";

export const Mines = (props: {
  mineType: BuildingType;
  handleOpen: (building: { type: BuildingType }) => void;
  mines: Mine[] | undefined;
  workplaceID?: string;
  refetch: {
    workplace: (
      config?: AxiosRequestConfig<any> | undefined,
      options?: RefetchOptions | undefined
    ) => AxiosPromise<any>;
    mines: (
      config?: AxiosRequestConfig<any> | undefined,
      options?: RefetchOptions | undefined
    ) => AxiosPromise<any>;
  };
}) => {
  const [minesState, setMinesState] = useState({
    isDialogOpen: false,
    changedValue: "",
    mineID: "",
  });
  const userData = useContext(UserDataContext);
  const isChangingName = minesState.changedValue === "change_factory_name";
  const title = props.mineType.split("_").join(" ").slice(0, -1);
  const selectedMine = props.mines?.find(
    (mine) => mine.building_id === minesState.mineID
  );

  const inputDialogId = selectedMine
    ? `${selectedMine.building_id}-${
        isChangingName
          ? selectedMine.mine_name
          : selectedMine.owner_profit_share
      }`
    : "";
  const mineNameValidationSchema = yup.object({
    [inputDialogId]: yup
      .string()
      .required("Mine name is required")
      .max(
        constants.MAX_MINE_NAME_LENGTH,
        `Mine name is too long, it may contain a maximum of ${constants.MAX_MINE_NAME_LENGTH} characters`
      ),
  });
  const mineProfitShareValidationSchema = yup.object({
    [inputDialogId]: yup
      .number()
      .required("profit share is required")
      .min(
        constants.MIN_WAGE,
        "profit share must be greater than or equal to 0"
      )
      .max(
        constants.MAX_WAGE,
        "profit share must be less than or equal to 100"
      ),
  });

  const handleClose = () =>
    setMinesState({ ...minesState, isDialogOpen: false });
  const handleSubmit = async (newValue: string) => {
    handleClose();
    const response = await api<string>({
      url: `/${minesState.changedValue}/${props.mineType}/${
        minesState.mineID
      }/${
        isChangingName
          ? base64url.encode(newValue)
          : constants.MAX_WAGE - parseInt(newValue)
      }`,
    });
    if (!response) {
      setMinesState({
        ...minesState,
        isDialogOpen: true,
      });
      return;
    }
    props.refetch.mines();
  };
  const handleOpen = (change: { valueName: string; ID: string }) =>
    setMinesState({
      ...minesState,
      isDialogOpen: true,
      changedValue: change.valueName,
      mineID: change.ID,
    });
  const handleWork = async (building: { type: string; ID: string }) => {
    const response = await api<string>({
      url: `/${
        props.workplaceID === building.ID
          ? "stop_working"
          : `work/${building.type}/${building.ID}`
      }`,
    });
    if (!response) return;
    props.refetch.workplace();
  };

  return (
    <>
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <Typography variant="h4" textAlign="center" sx={{ margin: "4px" }}>
            {title}s
          </Typography>
        </Grid>
        <Grid item>
          {userData && (
            <ButtonWithTooltip
              variant="contained"
              title={`you need at least ${
                constants.BUILD_COST[props.mineType]
              } gold`}
              disabled={
                constants.BUILD_COST[props.mineType] > userData.userData.gold
              }
              onClick={() => props.handleOpen({ type: props.mineType })}
              arrow
            >
              Build new {title}
            </ButtonWithTooltip>
          )}
        </Grid>
      </Grid>
      {props.mines?.map((mine) => (
        <div key={mine.building_id}>
          {props.workplaceID && (
            <MineCard
              workplaceID={props.workplaceID}
              handleOpen={handleOpen}
              handleWork={handleWork}
              mineType={props.mineType}
              {...mine}
            />
          )}
        </div>
      ))}
      {selectedMine && (
        <InputDialog
          id={inputDialogId}
          validationSchema={
            isChangingName
              ? mineNameValidationSchema
              : mineProfitShareValidationSchema
          }
          defaultValue={
            isChangingName
              ? ""
              : constants.MAX_WAGE - selectedMine.owner_profit_share
          }
          type={isChangingName ? "text" : "number"}
          onClose={handleClose}
          openDialog={minesState.isDialogOpen}
          handleSubmit={handleSubmit}
          buttonText="Apply changes"
        >
          {`Please, enter new ${
            isChangingName ? "name" : "wage"
          } of your ${title}.`}
        </InputDialog>
      )}
    </>
  );
};
