import { useState, useEffect } from "react";
import { io } from "socket.io-client";

import { constants } from "misc";

export const useSocket = <T>(config: { eventName: string }) => {
  const [data, setData] = useState<T>();

  useEffect(() => {
    const socket = io(constants.SOCKET_URL);
    socket.on(config.eventName, (newData: any) => {
      setData(newData);
    });
  }, [config.eventName]);

  return { data };
};
