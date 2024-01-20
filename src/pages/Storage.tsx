import { useContext } from "react";
import { Grid, useTheme, useMediaQuery } from "@mui/material";
import {
  GiOilDrum,
  GiGoldBar,
  GiMeltingMetal,
  GiAk47,
  GiAmmoBox,
  GiGrenade,
} from "react-icons/gi";
import { MdPropaneTank } from "react-icons/md";

import { StorageItem } from "components";
import { UserDataContext, StorageProps } from "misc";

export const Storage = () => {
  const userData = useContext(UserDataContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const resources: StorageProps[] = [
    { name: "oil", Icon: GiOilDrum, isWeapon: false, unit: "barrels" },
    { name: "gold", Icon: GiGoldBar, isWeapon: false, unit: "oZ" },
    { name: "gas", Icon: MdPropaneTank, isWeapon: false, unit: "m3" },
    { name: "iron", Icon: GiMeltingMetal, isWeapon: false, unit: "kg" },
    {
      name: "riffles",
      Icon: GiAk47,
      isWeapon: true,
    },
    {
      name: "ammo",
      Icon: GiAmmoBox,
      isWeapon: true,
    },
    {
      name: "grenades",
      Icon: GiGrenade,
      isWeapon: true,
    },
  ];

  return (
    <Grid container spacing={1} justifyContent="center">
      {resources.map((resource) => (
        <StorageItem key={resource.name} {...resource}>
          {resource.name}: {userData?.userData[resource.name]}
        </StorageItem>
      ))}
    </Grid>
  );
};
