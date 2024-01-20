import { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  ListItem,
} from "@mui/material";

export const ListButton = (props: {
  pageName?: string;
  path: string;
  children?: ReactNode;
  selected?: boolean;
}) => {
  const color = props.selected === false ? "#333333" : "white";

  return (
    <ListItem disablePadding>
      <ListItemButton
        component={RouterLink}
        to={props.path}
        sx={{
          margin: "0px",
          borderRight: props.selected ? "4px solid #2D9CDB" : "none",
        }}
      >
        <ListItemIcon sx={{ minWidth: "40px", color }}>
          {props.children}
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography variant="body2" color={color}>
              {props.pageName}
            </Typography>
          }
          disableTypography
        />
      </ListItemButton>
    </ListItem>
  );
};
