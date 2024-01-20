import { useNavigate } from "react-router-dom";
import {
  Divider,
  ListItemText,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  Grid,
  Paper,
  Avatar,
  IconButton,
  List,
} from "@mui/material";
import { Close, Add } from "@mui/icons-material";
import { useParams } from "react-router-dom";

import { constants, Profile } from "misc";
import { usePartyMembers, api } from "scripts";

export const PartyMembersList = (props: { withRequests?: boolean }) => {
  const params = useParams();
  const { membersList, refetch } = usePartyMembers({
    selectedPartyID: params.partyid,
    withRequests: props.withRequests,
  });
  const navigate = useNavigate();

  const handleMemberClick = (partyMember: Profile) => () =>
    navigate(`/profile/${partyMember.username}`);
  const handleKickMember = (username: string) => async () => {
    const response = await api<string>({
      url: `/kick_from_party/${username}`,
    });
    if (!response) return;
    refetch.partyMembers();
  };
  const acceptMembershipRequest = (username: string) => async () => {
    const response = await api<string>({
      url: `/accept_membership_request/${username}`,
    });
    if (!response) return;
    refetch.all();
  };
  const rejectMembershipRequest = (username: string) => async () => {
    const response = await api<string>({
      url: `/cancel_membership_request/${username}`,
    });
    if (!response) return;
    refetch.invitedUsers();
  };

  return (
    <Grid item>
      {membersList && (
        <Paper>
          <List
            sx={{
              height: "87.5vh",
              overflowY: "scroll",
              overflowX: "hidden",
            }}
          >
            {membersList.map((member) => (
              <div key={member.username}>
                <ListItem
                  alignItems="flex-start"
                  disablePadding
                  secondaryAction={
                    props.withRequests &&
                    constants.USERNAME !== member.username &&
                    (member.partyid === "non-partisan" ? (
                      <>
                        <IconButton
                          onClick={acceptMembershipRequest(member.username)}
                          edge="end"
                        >
                          <Add />
                        </IconButton>
                        <IconButton
                          onClick={rejectMembershipRequest(member.username)}
                          edge="end"
                        >
                          <Close />
                        </IconButton>
                      </>
                    ) : (
                      <IconButton
                        onClick={handleKickMember(member.username)}
                        edge="end"
                      >
                        <Close />
                      </IconButton>
                    ))
                  }
                >
                  <ListItemButton onClick={handleMemberClick(member)}>
                    <ListItemAvatar>
                      <Avatar
                        alt={member.username}
                        src={`${constants.BASE_URL}/images/${member.avatar}`}
                        onClick={handleMemberClick(member)}
                        sx={{ width: 50, height: 50, cursor: "pointer" }}
                      />
                    </ListItemAvatar>
                    <ListItemText primary={member.nickname} />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        </Paper>
      )}
    </Grid>
  );
};
