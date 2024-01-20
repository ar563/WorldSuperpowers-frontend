import { useState, useEffect } from "react";
import useAxios from "axios-hooks";

import { constants, Profile } from "misc";
import { getArrayOfData } from ".";

export const usePartyMembers = (params: {
  selectedPartyID?: string;
  withRequests?: boolean;
}) => {
  const [
    {
      data: partyMembers,
      loading: loadingPartyMembers,
      error: partyMembersError,
    },
    refetchPartyMembers,
  ] = useAxios<Profile[]>({
    url: `/party_members/${params.selectedPartyID}`,
    baseURL: constants.BASE_URL,
  });
  const [
    {
      data: invitedUsers,
      loading: loadingInvitedUsers,
      error: invitedUsersError,
    },
    refetchInvitedUsers,
  ] = useAxios<string[]>(
    {
      url: `/invitations/${params.selectedPartyID}`,
      baseURL: constants.BASE_URL,
    },
    { manual: !params.withRequests }
  );
  const [membersList, setMembersList] = useState<Profile[]>();

  const addInvitedUsers = async (
    invitedUsers: string[],
    partyMembers: Profile[]
  ) => {
    const profiles = await getArrayOfData<Profile>({
      params: invitedUsers.map((invitedUser) => `/profile/${invitedUser}`),
    });
    if (!profiles) return;
    setMembersList([
      ...partyMembers,
      ...profiles.filter((profile) => profile.partyid === "non-partisan"),
    ]);
  };

  useEffect(() => {
    if (!params.withRequests || !partyMembers || !invitedUsers) {
      setMembersList(partyMembers);
      return;
    }
    addInvitedUsers(invitedUsers, partyMembers);
  }, [partyMembers, invitedUsers, params.withRequests]);

  return {
    membersList,
    loadingMembers: loadingPartyMembers || loadingInvitedUsers,
    error:
      partyMembersError || invitedUsersError
        ? { partyMembersError, invitedUsersError }
        : null,
    refetch: {
      partyMembers: refetchPartyMembers,
      invitedUsers: refetchInvitedUsers,
      all: () => {
        refetchPartyMembers();
        refetchInvitedUsers();
      },
    },
  };
};
