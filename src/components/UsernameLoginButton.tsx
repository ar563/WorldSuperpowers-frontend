import { createButton } from "react-social-login-buttons";
import { Person } from "@mui/icons-material";

const config = {
  text: "Account Login",
  icon: Person,
  style: { background: "white", color: "black", width: 200 },
};

export const UsernameLoginButton = createButton(config);
