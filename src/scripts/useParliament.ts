import { useState, useEffect } from "react";

import { getArrayOfData, api } from "../scripts";
import { Profile, Party } from "../misc";

export const useParliament = (params: {
  parliamentMembers: string[];
  partyID: string;
}) => {
  const [parliament, setParliament] = useState<{
    membersByParty: { x: string; y: number; partyid: string }[];
    members: Profile[];
    selectedPartyId?: string;
    selectedPartyName?: string;
  }>();

  useEffect(() => {
    (async () => {
      let partiesMembership:
        | { x: string; y: number; partyid: string }[]
        | null = null;
      const profiles = await getArrayOfData<Profile>({
        params: params.parliamentMembers.map(
          (parliamentMember) => `/profile/${parliamentMember}`
        ),
      });
      profiles?.forEach(async (profile, index) => {
        const partyOfParliamentarian =
          profile.partyid === "non-partisan"
            ? { party_name: "non-partisan", partyid: "non-partisan" }
            : await api<Party>({ url: `/party/${profile.partyid}` });
        if (!partyOfParliamentarian) return;
        if (!partiesMembership) {
          partiesMembership = [
            {
              x: partyOfParliamentarian.party_name,
              y: 1,
              partyid: partyOfParliamentarian.partyid,
            },
          ];
        } else {
          partiesMembership = partiesMembership.map((party) =>
            party.partyid === partyOfParliamentarian.partyid
              ? {
                  x: partyOfParliamentarian.party_name,
                  y: party.y + 1,
                  partyid: partyOfParliamentarian.partyid,
                }
              : party
          );
        }
        profiles.length - 1 === index &&
          setParliament({
            members: profiles,
            membersByParty: partiesMembership,
          });
      });
    })();
  }, [params.parliamentMembers, params.partyID]);

  return { parliament, setParliament };
};
