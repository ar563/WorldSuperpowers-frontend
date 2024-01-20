import { useCountdown } from "rooks";
import useAxios from "axios-hooks";

import { EducationField, CardDataRow } from ".";
import { constants, StudyData, Profile } from "misc";

export const EducationBoard = (props: {
  userProfile?: Profile;
  refetchProfile?: () => void;
}) => {
  const [{ data: userStudyData, loading }, refetchStudy] = useAxios<
    StudyData | string
  >({
    url: "/check_study",
    baseURL: constants.BASE_URL,
    headers: { Authorization: constants.AUTH ?? "" },
  });
  const endDate = new Date(
    typeof userStudyData === "object" ? userStudyData.finish_time : ""
  );
  endDate.setSeconds(endDate.getSeconds() + constants.SERVER_LAG);
  const count = useCountdown(endDate, {
    onEnd: () => {
      if (!userStudyData || loading) return;
      refetchStudy();
      props.refetchProfile && props.refetchProfile();
    },
  });
  const descriptions = {
    political_education:
      "Increases maximum number of members in political party.",
    economic_education: "Increases profits from working and owned workplaces.",
    military_education: "Increses damage inficted during wars.",
  };

  return (
    <>
      {constants.FIELD_OF_STUDIES.map((fieldOfStudy) => (
        <div key={fieldOfStudy}>
          <CardDataRow name={fieldOfStudy.split("_").join(" ")}>
            {props.userProfile &&
              props.userProfile[fieldOfStudy as keyof Profile]}
            /{constants.MAX_EDUCATION_LEVEL}
          </CardDataRow>
          <EducationField
            isStudying={
              typeof userStudyData === "object" &&
              userStudyData.field_of_study === fieldOfStudy
            }
            fieldOfStudy={fieldOfStudy}
            counter={
              typeof userStudyData === "object" &&
              userStudyData.field_of_study === fieldOfStudy
                ? `time left: ${new Date(
                    count * constants.MILLISECONDS_PER_SECOND
                  )
                    .toISOString()
                    .substring(
                      constants.HOURS_MINUTES_SECONDS_SUBSTRING_START,
                      constants.HOURS_MINUTES_SECONDS_SUBSTRING_END
                    )}`
                : ""
            }
            handleButtonClick={refetchStudy}
            disabled={
              props.userProfile &&
              props.userProfile[fieldOfStudy as keyof Profile] ===
                constants.MAX_EDUCATION_LEVEL
            }
          >
            {descriptions[fieldOfStudy as keyof typeof descriptions]}
          </EducationField>
        </div>
      ))}
    </>
  );
};
