import { useCountdown } from "rooks";
import { AxiosRequestConfig, AxiosPromise } from "axios";
import { RefetchOptions } from "axios-hooks";
import {
  ListItemText,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";

import { Law, constants } from "misc";

export const LawItem = (props: {
  law: Law;
  handleOpen: (params: { lawName: string; lawID: string }) => void;
  isParliamentMember: boolean;
  refetchLaws: (
    config?: AxiosRequestConfig<any> | undefined,
    options?: RefetchOptions | undefined
  ) => AxiosPromise<Law[]>;
}) => {
  const votingEnd = new Date(props.law.voting_end);
  votingEnd.setSeconds(votingEnd.getSeconds() + constants.SERVER_LAG);
  const count = useCountdown(votingEnd, { onEnd: props.refetchLaws });
  const text = `${new Date(count * constants.MILLISECONDS_PER_SECOND)
    .toISOString()
    .substring(
      constants.HOURS_MINUTES_SECONDS_SUBSTRING_START,
      constants.HOURS_MINUTES_SECONDS_SUBSTRING_END
    )}`;

  return (
    <ListItem alignItems="flex-start" disablePadding>
      {props.isParliamentMember && (
        <ListItemButton
          onClick={() =>
            props.handleOpen({
              lawName: props.law.law,
              lawID: props.law.law_id,
            })
          }
        >
          <ListItemText
            primary={
              <Typography
                variant="subtitle1"
                color="text.primary"
                sx={{ display: "inline" }}
              >
                {props.law.law.split("_")[0]} {props.law.law.split("_")[1]}
              </Typography>
            }
            secondary={
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ display: "inline" }}
              >
                {" "}
                {text}
              </Typography>
            }
          />
        </ListItemButton>
      )}
      {!props.isParliamentMember && (
        <ListItemText
          primary={
            <Typography
              variant="subtitle1"
              color="text.primary"
              sx={{ display: "inline" }}
            >
              {props.law.law.split("_")[0]} {props.law.law.split("_")[1]}
            </Typography>
          }
          secondary={
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ display: "inline" }}
            >
              {" "}
              {text}
            </Typography>
          }
        />
      )}
    </ListItem>
  );
};
