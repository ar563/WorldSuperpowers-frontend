import { useContext } from "react";
import {
  useMediaQuery,
  useTheme,
  Typography,
  Avatar,
  Link,
  Grid,
} from "@mui/material";
import useAxios from "axios-hooks";
import { Link as RouterLink, useParams } from "react-router-dom";

import { constants, Profile, Province, UserDataContext } from "misc";
import {
  SingleFileAutoSubmit,
  PartyLink,
  CardDataRow,
  EducationBoard,
  Donate,
} from ".";

export const PersonalDataCard = (props: { isSelectedProfile: boolean }) => {
  const params = useParams();
  const username = props.isSelectedProfile
    ? params.username
    : constants.USERNAME;
  const userData = useContext(UserDataContext);
  const [{ data: profile }] = useAxios<Profile>(
    {
      url: `/profile/${params.username}`,
      baseURL: constants.BASE_URL,
    },
    { manual: !Boolean(params.username) }
  );
  const userProfile = props.isSelectedProfile ? profile : userData?.profile;
  const [{ data: locationData }] = useAxios<Province>(
    {
      url: `/province/${userProfile?.province}`,
      baseURL: constants.BASE_URL,
    },
    { manual: !Boolean(userProfile?.province) }
  );
  const [{ data: citizenshipData }] = useAxios<Province>(
    {
      url: `/province/${userProfile?.citizenship}`,
      baseURL: constants.BASE_URL,
    },
    { manual: !Boolean(userProfile?.citizenship) }
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid item xs={!props.isSelectedProfile}>
      {userProfile && (
        <>
          <Grid container alignItems="center" direction="column">
            <Grid item>
              <Typography variant="h4">{userProfile.nickname}</Typography>
            </Grid>
            <Grid item>
              <Avatar
                alt={userProfile.nickname}
                src={`${constants.BASE_URL}/images/${userProfile.avatar}`}
                sx={
                  isMobile
                    ? { width: 100, height: 100 }
                    : { width: 175, height: 175 }
                }
              />
            </Grid>
            <Grid item>
              {props.isSelectedProfile ? (
                <Donate username={username} />
              ) : (
                <SingleFileAutoSubmit
                  uploadParams="/upload_avatar"
                  onUpload={userData?.refetchProfile}
                  text="Avatar successfully changed!"
                  inputContent={
                    isMobile
                      ? "Click here to choose new avatar"
                      : "Drop the file that will be your new avatar"
                  }
                />
              )}
            </Grid>
          </Grid>
          <Grid container direction="column">
            <CardDataRow name="party">
              <PartyLink partyID={userProfile.partyid} />
            </CardDataRow>
            <CardDataRow name="location">
              <Link
                component={RouterLink}
                to={`/province/${locationData?.province_number}`}
                variant="subtitle1"
              >
                {locationData?.province_name}
              </Link>
            </CardDataRow>
            <CardDataRow name="citizenship">
              <Link
                component={RouterLink}
                to={`/province/${citizenshipData?.province_number}`}
                variant="subtitle1"
              >
                {citizenshipData?.province_name}
              </Link>
            </CardDataRow>
            {props.isSelectedProfile ? (
              <>
                {constants.FIELD_OF_STUDIES.map((fieldOfStudy) => (
                  <CardDataRow name={fieldOfStudy.split("_").join(" ")}>
                    {userProfile[fieldOfStudy as keyof Profile]}/
                    {constants.MAX_EDUCATION_LEVEL}
                  </CardDataRow>
                ))}
              </>
            ) : (
              <EducationBoard
                userProfile={userProfile}
                refetchProfile={userData?.refetchProfile}
              />
            )}
          </Grid>
        </>
      )}
    </Grid>
  );
};
