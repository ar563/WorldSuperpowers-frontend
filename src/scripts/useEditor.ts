import { useNavigate } from "react-router-dom";
import { useState, ChangeEvent, useEffect } from "react";
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  RawDraftContentState,
} from "draft-js";
import { draftToMarkdown } from "markdown-draft-js";

import { api } from "scripts";
import { constants } from "misc";

export const useEditor = ({ isLocal }: { isLocal: boolean }) => {
  const savedState = localStorage.getItem("article editor state");
  const savedStateParsed: {
    editor: RawDraftContentState;
    title: string;
  } | null = savedState && JSON.parse(savedState);
  const [editorState, setEditorState] = useState({
    editor: () => {
      if (savedStateParsed) {
        return EditorState.createWithContent(
          convertFromRaw(savedStateParsed.editor)
        );
      }
      return EditorState.createEmpty();
    },
    title: savedStateParsed?.title,
  });
  const navigate = useNavigate();

  const handleArticleChange = (value: EditorState) =>
    setEditorState({ ...editorState, editor: () => value });
  const handlePostArticle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const rawContentState = convertToRaw(
      editorState.editor().getCurrentContent()
    );
    const markdownString = draftToMarkdown(rawContentState);
    await api.post({
      url: "/post_article",
      data: {
        locale: isLocal ? constants.LANGUAGE : "global",
        title: editorState.title,
        article: markdownString,
      },
    });
    localStorage.removeItem("article editor state");
    navigate("/articles");
  };
  const handleTitleChange = (
    newTitle: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) =>
    setEditorState({
      ...editorState,
      title: newTitle.target.value,
    });

  useEffect(() => {
    localStorage.setItem(
      "article editor state",
      JSON.stringify({
        editor: convertToRaw(editorState.editor().getCurrentContent()),
        title: editorState.title,
      })
    );
  }, [editorState]);

  return {
    editorState,
    handleArticleChange,
    handlePostArticle,
    handleTitleChange,
  };
};
