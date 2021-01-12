import React from "react";
import { Button, Grid, TextField } from "@material-ui/core";

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
import { useFormik } from "formik";
import { CurrentISODate } from "../../../utils";

export default function AccountModal({ open, setOpen, oldValues }) {
  console.log(oldValues);

  //const initialValues = oldValues;
  OLD VALUES NOT RECOVERED!!!
  const initialValues = oldValues;

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
  const onSubmit = (values, { resetForm }) => {
    alert(JSON.stringify(values));
    resetForm({});
    handleClose();
  };

  /**
   * Formik hook
   */
  const formik = useFormik({
    initialValues,
    onSubmit,
    validate,
  });

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
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle id="form-dialog-title">Nieuwe rekening</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Voer de gegevens in voor een nieuwe rekening
            </DialogContentText>
            <Grid container spacing={2}>
              <Grid item>
                <TextField
                  id="accountOwnerName"
                  name="accountOwnerName"
                  label="Naam"
                  helperText="Eignaar van de rekening"
                  onChange={formik.handleChange}
                  value={formik.values.accountOwnerName}
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
                />
                {formik.errors.accountBankName && (
                  <TextError error={formik.errors.accountBankName} />
                )}
              </Grid>
              <Grid item>
                <FormControl>
                  <InputLabel htmlFor="formatted-text-mask-input">
                    IBAN nr
                  </InputLabel>
                  <Input
                    value={formik.values.accountNr}
                    onChange={formik.handleChange}
                    name="accountNr"
                    id="accountNr"
                    inputComponent={IbanField}
                  />
                </FormControl>
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
                />
                {formik.errors.accountCurrentBalance && (
                  <TextError error={formik.errors.accountCurrentBalance} />
                )}
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
        </form>
      </Dialog>
    </div>
  );
}
