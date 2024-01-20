import {
  Paper,
  Grid,
  TextField,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { Send } from "@mui/icons-material";
import { Editor } from "react-draft-wysiwyg";
import "../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { useEditor } from "scripts";

export const ArticleEditor = () => {
  const params = useParams();
  const {
    editorState,
    handleArticleChange,
    handlePostArticle,
    handleTitleChange,
  } = useEditor({ isLocal: !!params.is_local });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid
      container
      component="form"
      spacing={2}
      direction="column"
      justifyContent="center"
      sx={{ marginTop: 1 }}
      onSubmit={handlePostArticle}
    >
      <Grid
        item
        sx={{
          display: "flex",
          justifyContent: "center",
          alignSelf: "flex-start",
        }}
      >
        <TextField
          label="title"
          variant="outlined"
          value={editorState.title}
          onChange={handleTitleChange}
          required
        />
        <IconButton type="submit">
          <Send />
        </IconButton>
      </Grid>
      <Grid item component={Paper}>
        <Editor
          editorState={editorState.editor()}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={handleArticleChange}
          editorStyle={{
            height: isMobile ? "52vh" : "75vh",
            padding: "0.1rem",
            border: "2px solid white",
            maxWidth: isMobile ? "98vw" : "84vw",
          }}
        />
      </Grid>
    </Grid>
  );
};
