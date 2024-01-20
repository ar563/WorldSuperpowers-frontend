import { useState, useEffect } from "react";
import useAxios from "axios-hooks";

import { constants, Profile, State, War, WarDetails } from "misc";
import { getArrayOfData } from ".";

export const useWars = () => {
  const [{ data: userProfile }, refetchProfile] = useAxios<Profile>(
    {
      url: `/profile/${constants.USERNAME}`,
      baseURL: constants.BASE_URL,
    },
    { manual: !Boolean(constants.USERNAME) }
  );
  const [{ data: state }, refetchState] = useAxios<State>(
    {
      url: `/province_ownership/${userProfile?.province}`,
      baseURL: constants.BASE_URL,
    },
    { manual: !Boolean(userProfile) }
  );
  const [{ data: warsData }, refetchWars] = useAxios<War[]>(
    {
      url: `/wars/${state?.stateid}`,
      baseURL: constants.BASE_URL,
    },
    { manual: !Boolean(state) }
  );
  const [wars, setWars] = useState<WarDetails[]>();

  useEffect(() => {
    if (!warsData) return;
    (async () => {
      const attackersData = await getArrayOfData<State>({
        params: warsData.map(
          (warData) => `/state/${warData.attackers_stateid}`
        ),
      });
      const defendersData = await getArrayOfData<State>({
        params: warsData.map(
          (warData) => `/state/${warData.defenders_stateid}`
        ),
      });
      if (!attackersData || !defendersData) return;
      setWars(
        warsData.map((warData, index) => ({
          ...warData,
          defendersStateName: defendersData[index].state_name,
          attackersStateName: attackersData[index].state_name,
        }))
      );
    })();
  }, [warsData]);

  return {
    wars,
    refetch: {
      wars: refetchWars,
      state: refetchState,
      profile: refetchProfile,
    },
    userProfile,
    state,
  };
};
