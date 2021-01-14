import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import WarningTwoToneIcon from "@material-ui/icons/WarningTwoTone";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  messageSubTitle: {
    color: "#c58478",
  },
}));

export default function MessageBox({
  open,
  handleMessageBoxClose,
  handleMessageBoxYes,
  messageTitle,
  messageSubTitle,
}) {
  const classes = useStyles();
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleMessageBoxClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Grid container>
            <Grid item>
              <WarningTwoToneIcon
                style={{ fontSize: 40, marginRight: "8px", color: "#fffb00" }}
              />
            </Grid>
            <Grid item>{messageTitle}</Grid>
          </Grid>
        </DialogTitle>

        <DialogContent>
          <DialogContentText
            className={classes.messageSubTitle}
            id="alert-dialog-description"
          >
            {messageSubTitle}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMessageBoxClose} color="primary" autofocus>
            Neen
          </Button>
          <Button onClick={handleMessageBoxYes} color="secondary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
