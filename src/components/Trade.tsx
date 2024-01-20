import { useState, useContext, ChangeEvent, MouseEvent } from "react";
import { Grid, Typography, Button, TextField, Popover } from "@mui/material";

import { useSocket, api } from "scripts";
import { Market, UserDataContext } from "misc";

export const Trade = (props: { assetName: string }) => {
  const { data: markets } = useSocket<Market[]>({ eventName: "markets" });
  const [trade, setTrade] = useState<{
    items: string;
    anchorEl: HTMLButtonElement | null;
    popoverText: string;
  }>({ items: "0", anchorEl: null, popoverText: "" });
  const userData = useContext(UserDataContext);
  const market = markets?.filter(
    (market) => market.asset_name === props.assetName
  )[0];
  const items = parseInt(trade.items);
  const cost =
    market && trade.items !== ""
      ? Math.round((market.cash / market.asset) * items)
      : 0;

  const handleClose = () => setTrade({ ...trade, anchorEl: null });
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setTrade({ ...trade, items: event.target.value });
  const handleBuy = async (event: MouseEvent<HTMLButtonElement>) => {
    const isSell = items < 0;
    const itemsInPositiveNumber = Math.abs(items);
    if (!userData || !items) return;
    setTrade({ ...trade, items: "0" });
    const canTrade = isSell
      ? itemsInPositiveNumber <=
        userData.userData[props.assetName as keyof typeof userData.userData]
      : items <= userData.userData.interstellardobra;
    if (!canTrade) {
      setTrade({
        ...trade,
        anchorEl: event.currentTarget,
        popoverText: isSell
          ? "not enough resource"
          : "not enough Interstellar Dobra",
      });
      return;
    }
    const response = await api<string>({
      url: `/${isSell ? "sell" : "buy"}/${props.assetName}/${
        isSell ? itemsInPositiveNumber : trade.items
      }`,
    });
    response && userData.refetchUserData();
  };

  return (
    <>
      <Typography>
        {items < 0
          ? `You'll get ${Math.abs(cost)} $ISD`
          : `You'll need ${cost} $ISD`}
      </Typography>
      <Grid container alignItems="center">
        <TextField
          id="outlined-number"
          type="number"
          value={trade.items}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Grid item>
          <Button
            variant="contained"
            onClick={handleBuy}
            sx={{ margin: "4px" }}
          >
            Trade
          </Button>
        </Grid>
      </Grid>
      <Popover
        id={!!trade.anchorEl ? `popover-${props.assetName}` : undefined}
        open={!!trade.anchorEl}
        anchorEl={trade.anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 2 }}>{trade.popoverText}</Typography>
      </Popover>
    </>
  );
};
