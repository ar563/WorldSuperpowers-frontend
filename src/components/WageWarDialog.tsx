import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  MenuItem,
  Select,
  SelectChangeEvent,
  Grid,
  Typography,
} from "@mui/material";
import useAxios, { RefetchOptions } from "axios-hooks";
import { AxiosRequestConfig, AxiosPromise } from "axios";

import { getArrayOfData, api } from "scripts";
import { State, constants, Province, War } from "misc";

export const WageWarDialog = (props: {
  attackingState: State;
  refetch: (
    config?: AxiosRequestConfig<any> | undefined,
    options?: RefetchOptions | undefined
  ) => AxiosPromise<War[]>;
}) => {
  const [{ data: provinces }] = useAxios<Province[]>({
    url: "/provinces",
    baseURL: constants.BASE_URL,
  });
  const [dialog, setDialog] = useState({
    open: false,
    selectedAttackingProvince: 2,
    selectedDisputedProvince: 3,
    attackingStateProvinces: [""],
  });
  const borderProvinces = provinces?.filter((province) =>
    province.borders?.includes(dialog.selectedAttackingProvince)
  );

  const handleClose = () => setDialog({ ...dialog, open: false });
  const handleOpen = () => setDialog({ ...dialog, open: true });
  const handleWageWar = () => {
    handleClose();
    api({
      url: `/wage_war/${dialog.selectedAttackingProvince}/${dialog.selectedDisputedProvince}`,
    })
      .then(() => props.refetch())
      .catch(handleOpen);
  };
  const handleAttackingProvinceChange = (event: SelectChangeEvent) =>
    setDialog({
      ...dialog,
      selectedAttackingProvince: parseInt(event.target.value),
    });
  const handleDisputedProvinceChange = (event: SelectChangeEvent) =>
    setDialog({
      ...dialog,
      selectedDisputedProvince: parseInt(event.target.value),
    });

  useEffect(() => {
    (async () => {
      const attackingStateProvinces = await getArrayOfData<Province>({
        params: props.attackingState.provinces.map(
          (province) => `/province/${province}`
        ),
      });
      if (!attackingStateProvinces) return;
      setDialog((dialog) => {
        return {
          ...dialog,
          attackingStateProvinces: attackingStateProvinces.map(
            (attackingStateProvince) => attackingStateProvince.province_name
          ),
        };
      });
    })();
  }, [props.attackingState]);

  return (
    <Grid item alignSelf="center">
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{ marginTop: "4px" }}
      >
        Wage war
      </Button>
      <Dialog open={dialog.open} onClose={handleClose}>
        <DialogTitle>wage war</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1">attacking province:</Typography>
          <Select
            value={`${dialog.selectedAttackingProvince}`}
            onChange={handleAttackingProvinceChange}
            fullWidth
          >
            {props.attackingState.provinces.map((province, index) => (
              <MenuItem value={province}>
                {dialog.attackingStateProvinces[index]}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="subtitle1">disputed province:</Typography>
          <Select
            value={`${dialog.selectedDisputedProvince}`}
            onChange={handleDisputedProvinceChange}
            fullWidth
          >
            {borderProvinces?.map((province) => (
              <MenuItem value={province.province_number}>
                {province.province_name}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleWageWar}>
            wage war
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};
