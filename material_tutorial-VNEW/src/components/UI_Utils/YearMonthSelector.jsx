import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Typopgraphy from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { CurrentISODate, getQueryDateObject } from "../../utils";
import { Button, Grid, Typography } from "@material-ui/core";
import TodayIcon from "@material-ui/icons/Today";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  container: {
    backgroundColor: "#1f5a13",
  },
  menubar: {
    display: "flex",
    justifyContent: "flex-end",
    alignContent: "center",
    alignItems: "center",
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const YearMonthSelector = ({ month, setMonth, year, setYear }) => {
  const classes = useStyles();

  const monthNames = [
    { id: 0, name: "*" },
    { id: 1, name: "Januari" },
    { id: 2, name: "Februari" },
    { id: 3, name: "Maart" },
    { id: 4, name: "April" },
    { id: 5, name: "Mei" },
    { id: 6, name: "Juni" },
    { id: 7, name: "Juli" },
    { id: 8, name: "Augustus" },
    { id: 9, name: "September" },
    { id: 10, name: "Oktober" },
    { id: 11, name: "November" },
    { id: 12, name: "December" },
  ];

  // Construct a year array, go back to ten years in the past. Add
  // one year in the future.  Cause invoices can arrive in december for the next year!
  let currentYear = getQueryDateObject(CurrentISODate());
  const yearArr = [];
  for (let i = currentYear.year - 10; i < currentYear.year + 1; i++) {
    yearArr.push(i + 1);
  }
  yearArr.reverse();

  const handleChangeMonth = (event) => {
    setMonth(event.target.value);
  };

  const handleChangeYear = (event) => {
    setYear(event.target.value);
  };

  return (
    <div className={classes.container}>
      <Grid container className={classes.menubar} spacing={2}>
        <Grid item>
          <Typography variant="p" style={{ color: "#eeff00" }}>
            Selecteer maand en jaar voor overzicht
          </Typography>
        </Grid>
        <Grid item>
          <ArrowForwardIcon style={{ color: "#eeff00" }} />
        </Grid>
        <Grid item>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Maand</InputLabel>
            <Select
              labelId="month"
              id="month"
              value={month}
              onChange={handleChangeMonth}
            >
              {monthNames.map((zen) => (
                <MenuItem value={zen.id}>{zen.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Jaar</InputLabel>
            <Select
              labelId="year"
              id="year"
              value={year}
              onChange={handleChangeYear}
            >
              {yearArr.map((zen) => (
                <MenuItem value={zen}>{zen}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* <Grid item>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            endIcon={<TodayIcon />}
            onClick={handleSelectCurrent}
          >
            Huidige maand en jaar
          </Button>
        </Grid> */}
      </Grid>
    </div>
  );
};

export default YearMonthSelector;
