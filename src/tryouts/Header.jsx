import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import AcUnitIcon from "@material-ui/icons/AcUnit";
import { makeStyles } from "@material-ui/styles";

/**
 * Example of in-component styling
 */
const useStyles = makeStyles(() => ({
  TypeographyStyles: {
    flex: 1,
  },
}));

const Header = () => {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography className={classes.TypeographyStyles}>
          Danny Van Geyte
        </Typography>
        <AcUnitIcon />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
