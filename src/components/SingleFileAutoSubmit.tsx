import Dropzone, { IDropzoneProps } from "react-dropzone-uploader";
import "react-dropzone-uploader/dist/styles.css";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { constants } from "misc";

export const SingleFileAutoSubmit = (props: {
  uploadParams?: string;
  onUpload?: () => void;
  text?: string;
  inputContent?: string;
}) => {
  const [dialog, setDialog] = useState({ open: false, text: "", title: "" });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClick = () => setDialog({ ...dialog, open: false });
  const getUploadParams: IDropzoneProps["getUploadParams"] = () => {
    return {
      url: `${constants.BASE_URL}${props.uploadParams}`,
      headers: { Authorization: constants.AUTH ?? "" },
    };
  };
  const handleChangeStatus: IDropzoneProps["onChangeStatus"] = (
    { meta, remove },
    status
  ) => {
    if (status === "headers_received") {
      setDialog({
        ...dialog,
        title: "Success!",
        text: props.text ? props.text : "",
        open: true,
      });
      remove();
      !props.onUpload || props.onUpload();
    } else if (status === "aborted") {
      setDialog({ ...dialog, title: "ERROR!", text: "ERROR!", open: true });
    }
  };

  return (
    <>
      <Dropzone
        getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        maxFiles={1}
        multiple={false}
        canCancel={false}
        inputContent={props.inputContent}
        accept="image/png,image/jpeg"
        styles={{
          dropzone: {
            width: isMobile ? 350 : 400,
            height: isMobile ? 100 : 200,
            overflow: "hidden",
            border: "2px solid white",
          },
          dropzoneActive: { borderColor: "green" },
          inputLabel: {
            fontFamily: ["Poppins"].join(","),
            color: "white",
            textAlign: "center",
          },
        }}
      />
      <Dialog open={dialog.open}>
        <DialogTitle>{dialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialog.text}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClick}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
