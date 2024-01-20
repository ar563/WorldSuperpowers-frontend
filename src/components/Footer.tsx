import { Typography } from "@mui/material";

export const Footer = () => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        backgroundColor: "transparent",
        padding: "10px",
      }}
    >
      <Typography variant="caption" align="center">
        Icons made by{" "}
        <a
          href="https://game-icons.net/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "white" }}
        >
          game-icons.net
        </a>{" "}
        licensed under{" "}
        <a
          href="https://creativecommons.org/licenses/by/3.0/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "white" }}
        >
          CC BY 3.0
        </a>
      </Typography>
    </div>
  );
};
