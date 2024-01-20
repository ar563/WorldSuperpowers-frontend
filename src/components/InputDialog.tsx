import {
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  StandardTextFieldProps,
  Typography,
} from "@mui/material";
import { MouseEventHandler } from "react";
import { useFormik } from "formik";

interface InputDialogProps extends StandardTextFieldProps {
  openDialog: boolean;
  defaultValue?: string | number;
  handleSubmit: (params: string) => any;
  onClose: MouseEventHandler<HTMLButtonElement>;
  buttonText?: string;
  title?: string;
  children?: React.ReactNode;
  validationSchema: any;
}

export const InputDialog = (props: InputDialogProps) => {
  const {
    handleSubmit,
    onClose,
    openDialog,
    defaultValue,
    children,
    buttonText,
    title,
    validationSchema,
    id,
    ...otherProps
  } = props;

  const dialogId = id ?? "input";
  const formik = useFormik({
    initialValues: {
      [dialogId]: defaultValue ?? "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      handleSubmit(`${values[dialogId]}`);
      setSubmitting(false);
    },
  });

  return (
    <Dialog
      open={openDialog}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          border: "2px solid white",
          borderRadius: "20px",
        },
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "white" }}>
            {children}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            variant="outlined"
            id={dialogId}
            value={formik.values[dialogId]}
            onChange={formik.handleChange}
            error={formik.touched[dialogId] && Boolean(formik.errors[dialogId])}
            helperText={formik.touched[dialogId] && formik.errors[dialogId]}
            {...otherProps}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            {buttonText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
