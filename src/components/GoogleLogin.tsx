import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { GoogleLoginButton } from "react-social-login-buttons";

import { UserData } from "misc";
import { api } from "scripts";
import { initializeApp } from "firebase/app";

interface JwtToken {
  jwt: string;
}

const firebaseConfigMobile = {
  apiKey: "your_api_key",
  authDomain: "your_auth_domain",
  projectId: "your_project_id",
  appId: "your_app_id",
};

const firebaseConfigPC = {
  apiKey: "your_api_key",
  authDomain: "your_auth_domain",
  projectId: "your_project_id",
  storageBucket: "your_storage_bucket",
  messagingSenderId: "your_messaging_sender_id",
  appId: "your_app_id",
};

const handleAuth = async ({ jwt }: JwtToken) => {
  const userData = await api<UserData>({
    url: "/user_data",
    authorization: jwt,
  });
  if (!userData) return;
  localStorage.setItem("auth", jwt);
  localStorage.setItem("username", userData.username);
  window.location.href = "/";
};

export const GoogleLogin = () => {
  useEffect(() => {
    initializeApp(
      Capacitor.isNativePlatform() ? firebaseConfigMobile : firebaseConfigPC
    );
  }, []);

  async function logIn() {
    await FirebaseAuthentication.signInWithGoogle();

    const { token } = await FirebaseAuthentication.getIdToken();
    const response = await api.post<JwtToken>({
      url: `/login/google/${
        Capacitor.isNativePlatform() ? "mobile" : "pc"
      }/verify_google_token`,
      isAuthorizationRequired: false,
      data: { token: token },
    });

    if (!response?.data) return;
    handleAuth(response.data);
  }

  return (
    <GoogleLoginButton type="button" onClick={logIn} style={{ width: 200 }}>
      Google Login
    </GoogleLoginButton>
  );
};
