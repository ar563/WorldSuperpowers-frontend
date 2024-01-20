import { useMediaQuery, useTheme, Box, Tabs, Tab } from "@mui/material";
import { useEffect, useState } from "react";
import useAxios from "axios-hooks";
import { isSameDay } from "date-fns";
import { useNavigate } from "react-router-dom";

import { constants, Article } from "misc";
import { ArticlesList } from "components";

export const Articles = () => {
  const [selectedLocalArticlesOnMobile, setSelectedLocalArticlesOnMobile] =
    useState(true);
  const [{ data }, refetchArticles] = useAxios<Article[]>({
    url: `/articles/${constants.LANGUAGE}`,
    baseURL: constants.BASE_URL,
  });
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const languageNames = new Intl.DisplayNames(["en"], { type: "language" });
  const sortByUpvotes = (articleA: Article, articleB: Article) =>
    articleB.upvotes - articleA.upvotes;
  const articles = {
    local: data
      ?.filter(
        (articleData) =>
          articleData.islocal &&
          isSameDay(new Date(articleData.time), new Date())
      )
      .sort(sortByUpvotes),
    global: data
      ?.filter(
        (articleData) =>
          !articleData.islocal &&
          isSameDay(new Date(articleData.time), new Date())
      )
      .sort(sortByUpvotes),
  };

  const switchToGlobal = () => setSelectedLocalArticlesOnMobile(false);
  const switchToLocal = () => setSelectedLocalArticlesOnMobile(true);

  useEffect(() => {
    refetchArticles();
  }, []);

  return (
    <>
      {isMobile && (
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
          <Tabs
            value
            TabIndicatorProps={{
              sx: { backgroundColor: "#2D9CDB", height: "4px" },
            }}
          >
            {[
              {
                value: !selectedLocalArticlesOnMobile,
                label: "Global",
                onClick: switchToGlobal,
              },
              {
                value: selectedLocalArticlesOnMobile,
                label: languageNames.of(constants.LANGUAGE) || "",
                onClick: switchToLocal,
              },
            ].map((tabProps) => (
              <Tab {...tabProps} />
            ))}
          </Tabs>
        </Box>
      )}
      {articles.local &&
        ((isMobile && selectedLocalArticlesOnMobile) || !isMobile) && (
          <ArticlesList
            articles={articles.local}
            subheader={
              isMobile
                ? "write article"
                : `${languageNames.of(constants.LANGUAGE)} articles`
            }
            handleAddClick={() => navigate("/article_editor/local")}
            refetchArticles={refetchArticles}
          />
        )}
      {articles.global &&
        ((isMobile && !selectedLocalArticlesOnMobile) || !isMobile) && (
          <ArticlesList
            articles={articles.global}
            subheader={isMobile ? "write article" : "global articles"}
            handleAddClick={() => navigate("/article_editor")}
            refetchArticles={refetchArticles}
          />
        )}
    </>
  );
};
