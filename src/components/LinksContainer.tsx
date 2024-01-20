import { Grid, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import UAParser from "ua-parser-js";

import { LinkProperties } from "misc";

export const LinksContainer = ({
  children,
}: {
  children: LinkProperties[];
}) => {
  const parser = new UAParser();

  return (
    <Grid item>
      <Grid container spacing={1}>
        {children.map((link) => (
          <Grid item key={link.url}>
            <Link
              to={link.url}
              component={RouterLink}
              variant={
                parser.getEngine().name === "Gecko" ? "caption" : "body2"
              }
            >
              {link.text}
            </Link>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};
