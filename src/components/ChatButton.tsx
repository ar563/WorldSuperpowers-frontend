import { useState, useRef } from "react";
import { Fab, useMediaQuery, useTheme } from "@mui/material";
import { Chat as ChatIcon } from "@mui/icons-material";
import { useOutsideClick } from "rooks";

import { Chat } from "components/Chat";

export const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useOutsideClick(ref, () => setIsOpen(false));

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <div ref={ref}>
      <Fab
        sx={{
          position: "fixed",
          bottom: isMobile ? 72 : 16,
          right: 16,
          backgroundColor: "black",
          color: "white",
          "&:hover": {
            backgroundColor: "#616061",
          },
        }}
        onClick={toggleChat}
      >
        <ChatIcon />
      </Fab>
      {isOpen && <Chat toggleChat={toggleChat} />}
    </div>
  );
};
