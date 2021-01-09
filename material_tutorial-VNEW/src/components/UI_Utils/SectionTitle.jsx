import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

/**
 * Styles
 */
const useStyles = makeStyles((theme) => ({
  crumb: {
    color: "#1d5f43",
  },
}));

const SectionTitle = ({ maintitle, subtitle }) => {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h3">{maintitle}</Typography>
      <Typography color="secondary" variant="subtitle1">
        {subtitle}
      </Typography>
    </>
  );
};

export default SectionTitle;
