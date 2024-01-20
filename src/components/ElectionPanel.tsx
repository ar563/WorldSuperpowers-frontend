import { useState, useEffect, useContext } from "react";
import useAxios from "axios-hooks";
import { useCountdown } from "rooks";
import { isFuture, isPast } from "date-fns";
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
} from "@mui/material";
import { VictoryPie } from "victory";

import { constants, Election, Party, UserDataContext } from "misc";
import { CardDataRow } from ".";
import { getArrayOfData, api } from "scripts";

export const ElectionPanel = (props: { stateid: string }) => {
  const [{ data: election, loading }, refetchElection] = useAxios<Election>({
    url: `/election/${props.stateid}`,
    baseURL: constants.BASE_URL,
  });
  const [dialog, setDialog] = useState<{
    open: boolean;
    selectedOption: string;
    electionParties?: Party[];
    chartData?: {
      x: string;
      y: number;
      partyid: string;
    }[];
  }>({
    open: false,
    selectedOption: "",
  });
  const userData = useContext(UserDataContext);

  const votingEnd = election ? new Date(election.voting_end) : new Date();
  const votingStart = election ? new Date(election.voting_start) : new Date();
  votingEnd.setSeconds(votingEnd.getSeconds() + constants.SERVER_LAG);
  votingStart.setSeconds(votingStart.getSeconds() + constants.SERVER_LAG);
  const isElectionTime = isFuture(votingEnd) && isPast(votingStart);
  const handleCountEnd = () => {
    if (!election || loading || isElectionTime) return;
    refetchElection();
  };
  const countToElectionEnd = useCountdown(votingEnd, { onEnd: handleCountEnd });
  const countToElectionStart = useCountdown(votingStart, {
    onEnd: handleCountEnd,
  });

  const handleVote = () => {
    handleClose();
    api({
      url: `/vote/${dialog.selectedOption}`,
    }).then(() => refetchElection());
  };
  const handleOpen = () => setDialog({ ...dialog, open: true });
  const handleClose = () => setDialog({ ...dialog, open: false });
  const handleChange = (event: SelectChangeEvent) =>
    setDialog({ ...dialog, selectedOption: event.target.value });

  useEffect(() => {
    (async () => {
      if (!election) return;
      const partyData = await getArrayOfData<Party>({
        params: election.partyid.map((partyid) => `/party/${partyid}`),
      });
      if (!partyData) return;
      const mapChartData = (partyid: string, index: number) => ({
        x:
          partyData.find((party) => party.partyid === partyid)?.party_name ||
          "",
        y: election.vote_count ? election.vote_count[index] : 0,
        partyid: partyid,
      });
      setDialog((dialog) => ({
        ...dialog,
        electionParties: partyData,
        chartData: election.partyid.map(mapChartData),
      }));
    })();
  }, [election]);

  return (
    <>
      {isElectionTime &&
        userData?.profile.citizenship === userData?.profile.province && (
          <Grid item alignSelf="center">
            <Button variant="contained" onClick={handleOpen}>
              Vote
            </Button>
          </Grid>
        )}
      <CardDataRow
        name={
          isElectionTime
            ? "time left to election end"
            : "time left to next election"
        }
      >
        {`${new Date(
          isElectionTime
            ? countToElectionEnd * constants.MILLISECONDS_PER_SECOND
            : countToElectionStart * constants.MILLISECONDS_PER_SECOND
        )
          .toISOString()
          .substring(
            constants.HOURS_MINUTES_SECONDS_SUBSTRING_START,
            constants.HOURS_MINUTES_SECONDS_SUBSTRING_END
          )}`}
      </CardDataRow>
      <Dialog open={dialog.open} onClose={handleClose}>
        <DialogTitle>Vote for a party</DialogTitle>
        <DialogContent>
          {dialog.chartData &&
            election &&
            election.vote_count &&
            election.vote_count.length > 0 && (
              <VictoryPie data={dialog.chartData} colorScale="qualitative" />
            )}
          <Select
            value={dialog.selectedOption}
            onChange={handleChange}
            fullWidth
          >
            {election &&
              election.partyid.map((partyid, index) => (
                <MenuItem value={partyid} key={partyid}>
                  {dialog.electionParties
                    ? dialog.electionParties[index].party_name
                    : ""}
                </MenuItem>
              ))}
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
    </>
  );
};
