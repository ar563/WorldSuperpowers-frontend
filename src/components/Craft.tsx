import { useState, useContext, ChangeEvent, MouseEvent } from "react";
import { Grid, Typography, Button, TextField, Popover } from "@mui/material";

import { api } from "scripts";
import { UserDataContext, constants, AssetName } from "misc";

export const Craft = (props: { assetName: AssetName }) => {
  const [craft, setCraft] = useState<{
    ammount: string;
    anchorEl: HTMLButtonElement | null;
  }>({ ammount: "0", anchorEl: null });
  const userData = useContext(UserDataContext);
  const open = craft.anchorEl !== null;
  const id = open ? `popover-${props.assetName}` : undefined;
  const cost =
    craft.ammount === ""
      ? 0
      : constants.CRAFT_COST[
          props.assetName as keyof typeof constants.CRAFT_COST
        ] * parseInt(craft.ammount);

  const handleClose = () => setCraft({ ...craft, anchorEl: null });
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = parseInt(event.target.value);
    newValue < 0 || setCraft({ ...craft, ammount: event.target.value });
  };
  const handleCraft = async (event: MouseEvent<HTMLButtonElement>) => {
    if (!craft.ammount || !userData) return;
    setCraft({ ...craft, ammount: "0" });
    if (cost > userData.userData.iron) {
      setCraft({ ...craft, anchorEl: event.currentTarget });
      return;
    }
    const response = await api<string>({
      url: `/craft/${props.assetName}/${craft.ammount}`,
    });
    response && userData.refetchUserData();
  };

  return (
    <>
      <Typography>You'll need {cost} iron</Typography>
      <Grid container alignItems="center">
        <Grid item>
          <TextField
            id="outlined-number"
            label="Number"
            type="number"
            value={craft.ammount}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={handleCraft}
            sx={{ margin: "4px" }}
          >
            Craft
          </Button>
        </Grid>
      </Grid>
      <Popover
        id={id}
        open={open}
        anchorEl={craft.anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 2 }}>not enough iron</Typography>
      </Popover>
    </>
  );
};
