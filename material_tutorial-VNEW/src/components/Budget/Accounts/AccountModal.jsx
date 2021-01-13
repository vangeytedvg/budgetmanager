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
    accountOwnerName: Yup.string()
      .max(40, "Maximum 40")
      .required("Naam is verplicht!"),
    accountCurrentBalance: Yup.number()
      .min(0, "Kan niet negatief zijn")
      .required("Stand rekening verplicht"),
    accountNr: Yup.string()
      // Replace all non digits and check if the lenght is 14
      .transform((value) => value.replace(/[^\d]/g, ""))
      .min(14, "Geen correct rekening nummer")
      .required("Rekening nummer verplicht"),
    accountBankName: Yup.string().required("Naam van de bank verplicht"),
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
                  </Grid>
                  <Grid item>
                    <Field
                      component={TextField}
                      id="accountBankName"
                      name="accountBankName"
                      helperText="Naam van de bank"
                    />
                  </Grid>
                  <Grid item>
                    {/* Using the iban field with InputProps */}
                    <Field
                      component={TextField}
                      name="accountNr"
                      id="accountNr"
                      helperText="Rekening Nr"
                      InputProps={{ inputComponent: IbanField }}
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      component={TextField}
                      id="accountCurrentBalance"
                      name="accountCurrentBalance"
                      type="number"
                      helperText="Bedrag op de rekening"
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
