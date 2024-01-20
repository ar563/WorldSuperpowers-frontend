import { Link } from "@mui/material";

import { constants } from "misc";

export const Disclaimer = () => {
  return (
    <>
      <Link href={`${constants.BASE_URL}/docs/rules.txt`} target="_blank">
        game rules
      </Link>{" "}
      and{" "}
      <Link
        href={`${constants.BASE_URL}/docs/privacy_policy.txt`}
        target="_blank"
      >
        privacy policy
      </Link>
    </>
  );
};
