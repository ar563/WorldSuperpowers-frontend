import { useState } from "react";
import { AxiosRequestConfig, AxiosPromise } from "axios";
import { RefetchOptions } from "axios-hooks";
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
  List,
} from "@mui/material";
import { VictoryPie } from "victory";

import { Law } from "misc";
import { api } from "scripts";
import { LawItem } from ".";

export const LawsList = (props: {
  laws: Law[];
  refetchLaws: (
    config?: AxiosRequestConfig<any> | undefined,
    options?: RefetchOptions | undefined
  ) => AxiosPromise<Law[]>;
  username: string;
  isParliamentMember: boolean;
}) => {
  const [dialog, setDialog] = useState({
    open: false,
    selectedOption: "",
    selectedLawName: "",
    selectedLawID: "",
  });

  const selectedLaw = props.laws.find(
    (law) => law.law_id === dialog.selectedLawID
  );
  const chartData: { x: string; y: number }[] = [];
  selectedLaw?.voted_yes?.length &&
    selectedLaw?.voted_yes?.length !== 0 &&
    chartData.push({ x: "yes", y: selectedLaw.voted_yes.length });
  selectedLaw?.voted_no &&
    selectedLaw?.voted_no?.length !== 0 &&
    chartData.push({ x: "no", y: selectedLaw.voted_no.length });
  selectedLaw?.voted_abstain &&
    selectedLaw?.voted_abstain?.length !== 0 &&
    chartData.push({ x: "abstain", y: selectedLaw.voted_abstain.length });

  const handleChange = (event: SelectChangeEvent) =>
    setDialog({ ...dialog, selectedOption: event.target.value });
  const handleClose = () => setDialog({ ...dialog, open: false });
  const handleOpen = (params: { lawName: string; lawID: string }) =>
    setDialog({
      ...dialog,
      open: true,
      selectedLawName: params.lawName,
      selectedLawID: params.lawID,
    });
  const handleVote = () => {
    if (!selectedLaw) return;
    handleClose();
    api({
      url: `/vote_on_law/${selectedLaw.law_id}/${
        selectedLaw.not_voted?.includes(props.username)
          ? "not_voted"
          : selectedLaw.voted_yes?.includes(props.username)
          ? "voted_yes"
          : selectedLaw.voted_no?.includes(props.username)
          ? "voted_no"
          : "voted_abstain"
      }/${dialog.selectedOption}`,
    }).then(() => props.refetchLaws());
  };

  return (
    <Grid item>
      <Typography variant="h6">Pending laws:</Typography>
      <List
        sx={{
          overflowY: "scroll",
          width: "25vw",
          wordBreak: "break-word",
          paddingRight: "5px",
        }}
      >
        {props.laws.map((law) => (
          <LawItem
            law={law}
            handleOpen={handleOpen}
            isParliamentMember={props.isParliamentMember}
            refetchLaws={props.refetchLaws}
            key={law.law_id}
          />
        ))}
      </List>
      <Dialog open={dialog.open} onClose={handleClose}>
        <DialogTitle>
          {dialog.selectedLawName.split("_")[0]}{" "}
          {dialog.selectedLawName.split("_")[1]}
        </DialogTitle>
        <DialogContent>
          {chartData.length > 0 && <VictoryPie data={chartData} />}
          <Select
            value={dialog.selectedOption}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="voted_yes">Yes</MenuItem>
            <MenuItem value="voted_no">No</MenuItem>
            <MenuItem value="voted_abstain">Abstain</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleVote}>
            Vote
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};
