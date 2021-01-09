import React from "react";
import { makeStyles } from "@material-ui/core/styles";

/**
 * If not defined, the page will not show correctly
 */
const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

const Contact = () => {
  const classes = useStyles();

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      Contact Page
    </main>
  );
};

export default Contact;
