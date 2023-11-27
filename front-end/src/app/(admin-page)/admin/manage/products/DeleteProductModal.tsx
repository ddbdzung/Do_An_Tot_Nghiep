import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper, { PaperProps } from "@mui/material/Paper";
import Draggable from "react-draggable";
import { useAppDispatch } from "@/redux/hooks";
import { adminDeleteProductAsync } from "@/redux/features/adminSlice";
import { useRouter } from "next/navigation";

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export default function DraggableDialog(props: {
  title: string;
  content: string;
  confirmText: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string;
  productName: string;
}) {
  const router = useRouter();
  const { open, setOpen, confirmText, productName } = props;
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setOpen(false);
  };
  const handleConfirm = () => {
    dispatch(adminDeleteProductAsync({ id: props.id }));
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          {props.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props.content} {productName}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>{confirmText}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
