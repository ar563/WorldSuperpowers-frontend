import base64url from "base64url";
import { Link as RouterLink } from "react-router-dom";
import {
  useTheme,
  ListItem,
  Typography,
  Avatar,
  useMediaQuery,
  List,
  Box,
  Tabs,
  Tab,
  TextField,
} from "@mui/material";

import { constants } from "misc";
import { api, useChat } from "scripts";
import { Input } from ".";

export const Chat = ({ toggleChat }: { toggleChat?: () => void }) => {
  const { chat, switchToGlobal, switchToLocal } = useChat();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const languageNames = new Intl.DisplayNames(["en"], { type: "language" });

  const handleSend = (newMessageText: string) =>
    api<string>({
      url: `/post_to_chat/${
        chat.isLocal ? constants.LANGUAGE : "global"
      }/${base64url.encode(newMessageText)}`,
    });

  return (
    <Box
      sx={{
        position: "absolute",
        right: 16,
        bottom: isMobile ? 136 : 80,
        marginBottom: "5px",
        backgroundColor: "black",
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Tabs
          value
          TabIndicatorProps={{
            sx: { backgroundColor: "#2D9CDB", height: "4px" },
          }}
        >
          {[
            {
              label: "Global",
              onClick: switchToGlobal,
              isSelected: !chat.isLocal,
            },
            {
              label: languageNames.of(constants.LANGUAGE) || "",
              onClick: switchToLocal,
              isSelected: chat.isLocal,
            },
          ].map((tab) => (
            <Tab
              label={tab.label}
              onClick={tab.onClick}
              value={tab.isSelected}
              key={tab.label}
              sx={{
                margin: "0px",
                color: tab.isSelected ? "white" : "#333333",
              }}
            />
          ))}
        </Tabs>
        <Box
          sx={{
            overflowY: "scroll",
            height: isMobile ? "50vh" : "40vh",
            width: isMobile ? "80vw" : "25vw",
          }}
        >
          {chat.messages &&
            chat.messages.map((message, index) => (
              <ListItem
                key={message.message_id}
                id={`${index}`}
                alignItems="flex-start"
                disablePadding
              >
                <Avatar
                  component={RouterLink}
                  to={`/profile/${message.username}`}
                  alt={message.nickname}
                  src={`${constants.BASE_URL}/images/${message.avatar}`}
                  sx={{ cursor: "pointer" }}
                  onClick={isMobile ? toggleChat : () => {}}
                />
                <Typography variant="body1">
                  {message.nickname}: {message.message}
                </Typography>
              </ListItem>
            ))}
        </Box>
        <Input
          placeholder="Write your message here and hit ENTER"
          handleInput={handleSend}
        />
      </Box>
    </Box>
  );
};
