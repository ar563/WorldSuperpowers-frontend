import { IconButton, Typography, Tooltip, Grid } from "@mui/material";
import { ThumbUp } from "@mui/icons-material";

import { useUpvote } from "scripts";

export const Upvote = ({
  id,
  initialCount,
  isVoted,
  upvoteId,
}: {
  id: string;
  initialCount: number;
  isVoted: boolean;
  upvoteId: string;
}) => {
  const { hasVoted, handleClick, count } = useUpvote({
    id,
    initialCount,
    isVoted,
    upvoteId,
  });

  return (
    <Grid container alignItems="center" margin={1}>
      <Typography
        component={Grid}
        variant="body2"
      >{`${count} upvotes`}</Typography>
      <Tooltip
        title={hasVoted ? "Already upvoted" : "Upvote"}
        sx={{ alignSelf: "center" }}
      >
        <IconButton
          component={Grid}
          onClick={handleClick}
          color={hasVoted ? "primary" : "secondary"}
        >
          <ThumbUp />
        </IconButton>
      </Tooltip>
    </Grid>
  );
};
