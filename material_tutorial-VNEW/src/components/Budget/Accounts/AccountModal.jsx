import React from "react";
import { Button, Grid } from "@material-ui/core";
import { TextField } from "formik-material-ui";

import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import IbanField from "../../UI_Utils/IbanField";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextError from "../../UI_Utils/TextError";
import { ErrorMessage, Field, Form, Formik } from "formik";

import { CurrentISODate } from "../../../utils";
import * as Yup from "yup";

export default function AccountModal({ open, setOpen, initialValues }) {
  //const initialValues = oldValues;
  //let initialValues = oldValues;
  console.log("Initial Values", initialValues);

  /**
   * The Validation schema for this form
   */
  const validationSchema = Yup.object({
    accountOwnerName: Yup.string().max(40, "Maximum 40").required("Required!"),
    accountCurrentBalance: Yup.number()
      .min(0, "Must be zero or higher")
      .required("Balance required"),
    accountNr: Yup.string().required("Account nr is required"),
    accountBankName: Yup.string().required("Bank name is required!"),
  });

  /**
   * Form submission
   * @param {} values
   */
  const onSubmit = (values, { resetForm }) => {
    alert(JSON.stringify(values));
    resetForm({});
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ submitForm, isSubmitting }) => (
            <Form>
              <DialogTitle id="form-dialog-title">Nieuwe rekening</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Voer de gegevens in voor een nieuwe rekening
                </DialogContentText>
                <Grid container spacing={2}>
                  <Grid item>
                    <Field
                      component={TextField}
                      id="accountOwnerName"
                      name="accountOwnerName"
                      helperText="Eignaar van de rekening"
                    />
                    <ErrorMessage
                      name="accountOwnerName"
                      component={TextError}
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      component={TextField}
                      id="accountBankName"
                      name="accountBankName"
                      helperText="Naam van de bank"
                    />
                    <ErrorMessage
                      name="accountBankName"
                      component={TextError}
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      component={TextField}
                      name="accountNr"
                      id="accountNr"
                      helperText="Rekening Nr"
                      InputProps={{ inputComponent: IbanField }}
                    />
                    <ErrorMessage name="accountNr" component={TextError} />
                  </Grid>
                  <Grid item>
                    <Field
                      component={TextField}
                      id="accountCurrentBalance"
                      name="accountCurrentBalance"
                      type="number"
                      helperText="Bedrag op de rekening"
                    />
                    <ErrorMessage
                      name="accountCurrentBalance"
                      component={TextError}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="secondary">
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Subscribe
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
}
