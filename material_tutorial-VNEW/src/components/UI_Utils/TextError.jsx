/**
 * Displays a small error message under input fields
 */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";

/**
 * If not defined, the page will not show correctly
 */
const useStyles = makeStyles((theme) => ({
  errorText: {
    fontSize: "0.8rem",
    fontFamily: "Roboto",
    color: "#d36e6e",
    marginTop: "3px",
    marginLeft: "12px",
  },
}));

const TextError = (props) => {
  const classes = useStyles();
  return <div className={classes.errorText}>{props.children}</div>;
};

export default TextError;
