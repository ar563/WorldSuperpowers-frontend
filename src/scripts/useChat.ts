import { useEffect, useState } from "react";
import { isSameDay } from "date-fns";

import { ChatMessage, constants } from "misc";
import { useSocket } from ".";

export const useChat = () => {
  const [chatState, setChatState] = useState({ isLocal: true });
  const { data } = useSocket<ChatMessage[]>({
    eventName: "chat_global",
  });
  const chat = chatState.isLocal
    ? data?.filter(
        (message) =>
          message.locale === constants.LANGUAGE &&
          message.islocal &&
          isSameDay(new Date(message.time), new Date())
      )
    : data?.filter(
        (message) =>
          !message.islocal && isSameDay(new Date(message.time), new Date())
      );

  const switchToGlobal = () =>
    setChatState({
      ...chatState,
      isLocal: false,
    });
  const switchToLocal = () =>
    setChatState({
      ...chatState,
      isLocal: true,
    });

  useEffect(() => {
    if (!chat) return;
    document.getElementById(`${chat.length - 1}`)?.scrollIntoView();
  }, [chat]);

  return {
    chat: { messages: chat, isLocal: chatState.isLocal },
    setChat: setChatState,
    switchToGlobal,
    switchToLocal,
  };
};
