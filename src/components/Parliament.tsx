import useAxios from "axios-hooks";
import { VictoryPie } from "victory";
import { Grid, Paper, Typography, Avatar, List } from "@mui/material";

import { useParliament } from "scripts";
import { constants, Law, State } from "misc";
import { LawsList, ElectionPanel, CreateLawDialog, ListButton } from ".";

export const Parliament = (props: {
  parliamentMembers: string[];
  partyID: string;
  username: string;
  state: State;
}) => {
  const { parliament, setParliament } = useParliament({
    parliamentMembers: props.parliamentMembers,
    partyID: props.partyID,
  });
  const [{ data: laws }, refetchLaws] = useAxios<Law[]>({
    url: `/laws/${props.state.stateid}`,
    baseURL: constants.BASE_URL,
  });

  const isParliamentMember =
    parliament?.members.filter((member) => member.username === props.username)
      .length === 1;

  return (
    <Grid item xs>
      <Paper>
        <Grid container direction="column">
          <Grid item alignSelf="center">
            <Typography variant="h4">parliament</Typography>
          </Grid>
          <Grid item sx={{ cursor: "pointer" }}>
            <Grid container alignItems="center" direction="column">
              <Grid item>
                {parliament?.membersByParty && (
                  <VictoryPie
                    colorScale="qualitative"
                    data={parliament.membersByParty}
                    events={[
                      {
                        target: "data",
                        eventHandlers: {
                          onClick: () => {
                            return [
                              {
                                target: "data",
                                mutation: (props) => {
                                  setParliament({
                                    ...parliament,
                                    selectedPartyId:
                                      props.data[props.index].partyid,
                                    selectedPartyName:
                                      props.data[props.index].x,
                                  });
                                },
                              },
                            ];
                          },
                        },
                      },
                    ]}
                  />
                )}
                {!parliament?.membersByParty && (
                  <Typography variant="h4">is empty</Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
          {isParliamentMember && <CreateLawDialog refetchLaws={refetchLaws} />}
          <ElectionPanel stateid={props.state.stateid} />
          {laws && (
            <LawsList
              laws={laws}
              refetchLaws={refetchLaws}
              username={props.username}
              isParliamentMember={isParliamentMember}
            />
          )}
          <Grid item sx={{ maxHeight: "33vh", overflowY: "scroll" }}>
            {parliament?.selectedPartyId && (
              <>
                <Typography variant="h6">
                  {parliament.selectedPartyName}:
                </Typography>
                {parliament.members.map((member) => (
                  <div key={member.username}>
                    {parliament.selectedPartyId === member.partyid && (
                      <ListButton
                        path={`/profile/${member.username}`}
                        pageName={member.nickname}
                      >
                        <Avatar
                          alt={member.nickname}
                          src={`${constants.BASE_URL}/images/${member.avatar}`}
                          sx={{ width: 50, height: 50 }}
                        />
                      </ListButton>
                    )}
                  </div>
                ))}
              </>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};
