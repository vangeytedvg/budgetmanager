import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import SectionTitle from "../../UI_Utils/SectionTitle";
import { Button, Grid, Paper, TextField } from "@material-ui/core";
import { useFormik } from "formik";
import { CurrentISODate } from "../../../utils";
import InputMask from "react-input-mask";
import TextError from "../../UI_Utils/TextError";

/**
 * Styling
 */
const useStyles = makeStyles((theme) => ({
  root: {
    "& .MultiFormControl-root": {
      width: "80%",
      margin: theme.spacing(1),
    },
  },
  accountOwnerName: {
    minWidth: "300px",
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  crumb: {
    color: "#1d5f43",
  },
  pageContent: {
    marginTop: "15px",
    maxWidth: "100%",
    padding: theme.spacing(3),
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  blabla: {
    padding: "18px",
    borderRadius: "5px",
    backgroundColor: "#535353",
    borderBlockStyle: "none",
    color: "white",
    fontFamily: "Roboto",
  },
}));

/*** VALIDATION AND FIELDS */

const initialValues = {
  date_created: CurrentISODate(),
  userid: 0, //currentUser.uid,
  accountOwnerName: "",
  accountNr: "",
  accountBankName: "",
  accountCurrentBalance: "",
};

const validate = (values) => {
  // Validation rules
  let errors = {};
  if (!values.accountOwnerName) {
    errors.accountOwnerName = "Naam verplicht!";
  }
  if (!values.accountBankName) {
    errors.accountBankName = "Banknaam verplicht!";
  }
  if (!values.accountNr) {
    errors.accountNr = "Rekeningnummer verplicht";
  }
  if (!values.accountCurrentBalance) {
    errors.accountCurrentBalance = "Balans verplicht";
  }

  return errors;
};

/**
 * Form submission
 * @param {} values
 */
const onSubmit = (values) => {
  alert(JSON.stringify(values));
};

/**
 * Accounts component
 */
const Accounts = () => {
  const classes = useStyles();

  const formik = useFormik({
    initialValues,
    onSubmit,
    validate,
  });

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <SectionTitle maintitle="Rekeningen" subtitle="beheer" />
      <Paper className={classes.pageContent} elevation={8}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item>
              <TextField
                id="accountOwnerName"
                name="accountOwnerName"
                label="Naam"
                helperText="Eignaar van de rekening"
                onChange={formik.handleChange}
                value={formik.values.accountOwnerName}
                variant="outlined"
              />
              {formik.errors.accountOwnerName && (
                <TextError error={formik.errors.accountOwnerName} />
              )}
            </Grid>
            <Grid item>
              <TextField
                id="accountBankName"
                name="accountBankName"
                label="Bank"
                helperText="Naam van de bank"
                onChange={formik.handleChange}
                value={formik.values.accountBankName}
                variant="outlined"
              />
              {formik.errors.accountBankName && (
                <TextError error={formik.errors.accountBankName} />
              )}
            </Grid>
            <Grid item>
              <TextField
                id="accountNr"
                name="accountNr"
                label="Rekening nummer"
                helperText="Rekening nummer (IBAN)"
                onChange={formik.handleChange}
                value={formik.values.accountNr}
                variant="outlined"
              />
              {formik.errors.accountNr && (
                <TextError error={formik.errors.accountNr} />
              )}
            </Grid>
            <Grid item>
              <TextField
                id="accountCurrentBalance"
                name="accountCurrentBalance"
                label="Stand"
                type="number"
                helperText="Bedrag op de rekening"
                onChange={formik.handleChange}
                value={formik.values.accountCurrentBalance}
                variant="outlined"
              />
              {formik.errors.accountCurrentBalance && (
                <TextError error={formik.errors.accountCurrentBalance} />
              )}
            </Grid>
          </Grid>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default Accounts;
