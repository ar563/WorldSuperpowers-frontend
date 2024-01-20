import { useMediaQuery, useTheme } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Layout, PersonalDataCard, Work, Articles } from "components";
import {
  Home,
  Profile,
  Storage,
  Explore,
  Settings,
  UsernameLogin,
  Politics,
  PartyMembersList,
  Signup,
  PasswordRecovery,
  ChangePassword,
  Verify,
  ProvinceItem,
  SelectedState,
  ArticleItem,
  Wars,
  ArticleEditor,
  Login,
} from "pages";
import "react-devtools";

export const App = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              isMobile ? (
                <PersonalDataCard isSelectedProfile={false} />
              ) : (
                <Home />
              )
            }
          />
          <Route path="work" element={isMobile ? <Work /> : <Home />} />
          <Route path="articles" element={isMobile ? <Articles /> : <Home />} />
          <Route path="profile/:username" element={<Profile />} />
          <Route path="province/:provinceNumber" element={<ProvinceItem />} />
          <Route path="state/:selectedState" element={<SelectedState />} />
          <Route path="storage" element={<Storage />} />
          <Route path="explore" element={<Explore />} />
          <Route path="settings" element={<Settings />} />
          <Route path="politics" element={<Politics />} />
          <Route path="party/:partyid" element={<Politics />} />
          <Route path="party/:partyid/members" element={<PartyMembersList />} />
          <Route
            path="party/:partyid/members_and_requests"
            element={<PartyMembersList withRequests />}
          />
          <Route path="article/:articleid" element={<ArticleItem />} />
          <Route path="article_editor/:is_local" element={<ArticleEditor />} />
          <Route path="article_editor" element={<ArticleEditor />} />
          <Route path="wars" element={<Wars />} />
        </Route>
        <Route path="log_in" element={<Login />} />
        <Route path="account_log_in" element={<UsernameLogin />} />
        <Route path="sign_up" element={<Signup />} />
        <Route path="password_recovery" element={<PasswordRecovery />} />
        <Route path="change_password" element={<ChangePassword />} />
        <Route path="verify/:code" element={<Verify />} />
      </Routes>
    </BrowserRouter>
  );
};
