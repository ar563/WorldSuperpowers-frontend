import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { api } from "scripts";

export const Verify = () => {
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (!params.code) return;
    (async () => {
      await api({ url: `/verify_email/${params.code}` });
      navigate("/log_in");
    })();
  }, [navigate, params]);
  return <></>;
};
