import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import SectionTitle from "../../UI_Utils/SectionTitle";

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
  crumb: {
    color: "#1d5f43",
  },
}));

const IncomeOverview = () => {
  const classes = useStyles();

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <SectionTitle maintitle="Inkomsten" subtitle="overzicht" />
    </main>
  );
};

export default IncomeOverview;
