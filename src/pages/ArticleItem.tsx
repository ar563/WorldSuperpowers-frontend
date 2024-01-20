import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import useAxios from "axios-hooks";
import { Grid, Link, Typography, useTheme, useMediaQuery } from "@mui/material";
import remarkGfm from "remark-gfm";

import { Article, constants, UpvoteData } from "misc";
import { Upvote } from "components";

export const ArticleItem = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [{ data: articleData, error }, refetchArticle] = useAxios<Article>({
    url: `/article/${params.articleid}`,
    baseURL: constants.BASE_URL,
  });
  const [{ data: upvotesData }, refetchUpvotes] = useAxios<UpvoteData[]>({
    url: `/article_upvotes/${params.articleid}`,
    baseURL: constants.BASE_URL,
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const userVote = upvotesData?.find(
    (data) => data.username === constants.USERNAME
  );

  useEffect(() => {
    if (!error) return;
    navigate("/articles");
  }, [error, navigate]);

  useEffect(() => {
    refetchArticle();
    refetchUpvotes();
  }, []);

  return (
    <Grid container spacing={2} justifyContent="center">
      {articleData && (
        <Grid item xs>
          <Grid container spacing={1} direction="column" alignItems="center">
            <Grid item>
              <Typography variant="h6">{articleData.title}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">
                author:{" "}
                <Link
                  component={RouterLink}
                  to={`/profile/${articleData.username}`}
                  variant="subtitle1"
                >
                  {articleData.nickname}
                </Link>
              </Typography>
            </Grid>
            <Grid
              item
              sx={{
                maxHeight: isMobile ? "75vh" : "80vh",
                overflowY: "scroll",
                wordBreak: "break-word",
                margin: "0.1rem",
              }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {articleData.article}
              </ReactMarkdown>
            </Grid>
            <Upvote
              id={params.articleid ?? ""}
              initialCount={articleData.upvotes}
              isVoted={!!userVote?.upvote}
              upvoteId={userVote?.upvoteid ?? ""}
            />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};
