import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import KeyboardVoiceIcon from "@material-ui/icons/KeyboardVoice";
import IconButton from "@material-ui/core/IconButton";

// Config styles
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

const Buttonsken = () => {
  const classes = useStyles();
  return (
    <div>
      <Button variant="contained" color="primary">
        Hello
      </Button>
      <Button variant="contained" color="secondary">
        Secondary
      </Button>
      <Button variant="outlined" color="secondary">
        Outlined
      </Button>
      {/* Icon in front of text */}
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        startIcon={<DeleteIcon />}
      >
        Noe de voalbak
      </Button>
      <Button
        variant="contained"
        size="large"
        color="primary"
        className={classes.button}
        endIcon={<KeyboardVoiceIcon />}
      >
        klapt ne kie
      </Button>
      <div>
        <IconButton color="primary" aria-label="delete">
          <DeleteIcon />
        </IconButton>
        <IconButton disabled color="primary" aria-label="delete">
          <DeleteIcon />
        </IconButton>
        <IconButton color="secondary" aria-label="delete">
          <CloudUploadIcon />
        </IconButton>
        <IconButton color="primary" aria-label="delete">
          <KeyboardVoiceIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default Buttonsken;
