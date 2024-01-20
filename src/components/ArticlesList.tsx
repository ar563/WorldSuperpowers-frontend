import { Link as RouterLink } from "react-router-dom";
import {
  Grid,
  useTheme,
  List,
  ListItemText,
  ListSubheader,
  useMediaQuery,
  IconButton,
  Typography,
  ListItemButton,
  ListItem,
} from "@mui/material";
import { AxiosRequestConfig, AxiosPromise } from "axios";
import { RefetchOptions } from "axios-hooks";
import AddIcon from "@mui/icons-material/Add";
import { Remove } from "@mui/icons-material";

import { Article, constants } from "misc";
import { fetchData } from "scripts";

export const ArticlesList = ({
  articles,
  subheader,
  handleAddClick,
  refetchArticles,
}: {
  articles: Article[];
  subheader: string;
  handleAddClick?: () => void;
  refetchArticles: (
    config?: AxiosRequestConfig<any> | undefined,
    options?: RefetchOptions | undefined
  ) => AxiosPromise<Article[]>;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleRemoveArticle = ({ id }: { id: string }) =>
    fetchData({ method: "delete", url: "/delete_article", data: { id } })
      .then(() => refetchArticles())
      .catch((error) => console.error(error));

  return (
    <Grid item xs>
      <List
        subheader={
          <ListSubheader sx={{ backgroundColor: "#202020" }}>
            <Grid container alignItems="center">
              <Grid item>
                <Typography variant="h6" sx={{ color: "#ffffff" }}>
                  {subheader}
                </Typography>
              </Grid>
              <Grid item>
                <IconButton onClick={handleAddClick}>
                  <AddIcon />
                </IconButton>
              </Grid>
            </Grid>
          </ListSubheader>
        }
        sx={{
          overflowY: "scroll",
          wordBreak: "break-word",
          paddingRight: "5px",
          maxHeight: isMobile ? "80vh" : "90vh",
        }}
      >
        {articles.map((article) => (
          <ListItem
            alignItems="flex-start"
            disablePadding
            key={article.articleid}
          >
            <ListItemButton
              component={RouterLink}
              to={`/article/${article.articleid}`}
            >
              <ListItemText
                primary={
                  <Typography
                    variant="h6"
                    color="text.primary"
                    sx={{ display: "inline" }}
                  >{`${article.title} `}</Typography>
                }
                secondary={
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ display: "inline" }}
                  >
                    author: {article.nickname}
                  </Typography>
                }
              />
            </ListItemButton>
            {constants.USERNAME === article.username && (
              <IconButton
                onClick={() => handleRemoveArticle({ id: article.articleid })}
                sx={{ alignSelf: "center" }}
              >
                <Remove />
              </IconButton>
            )}
          </ListItem>
        ))}
      </List>
    </Grid>
  );
};
