import React from "react";
import {
  Button,
  Grid,
  InputAdornment,
  FormControl,
  FormControlLabel,
  Input,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { Switch, TextField } from "formik-material-ui";
import IbanField from "../../UI_Utils/IbanField";
import {
  AccountCircle,
  Euro as EuroIcon,
  AccountBalance as AccountBalanceIcon,
  CreditCard as CreditCardIcon,
  RateReview as RateReviewIcon,
} from "@material-ui/icons";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CurrentISODate } from "../../../utils";
import { db } from "../../../database/firebase";

export default function InvoiceModal({
  open,
  setOpen,
  initialValues,
  idToWorkOn,
}) {
  toast.configure();

  /**
   * The Validation schema for this form
   */
  const validationSchema = Yup.object({
    sender: Yup.string()
      .max(40, "Maximum 40 tekens")
      .required("Afzender is verplicht"),
    datereceived: Yup.string().required("Ontvangstdatum verplicht!"),
    amount: Yup.number().required("Bedrag verplicht!"),
    datetopay: Yup.string()
      // Replace all non digits and check if the lenght is 14
      .required("Betaaldatum verplicht!"),
    accountr: Yup.string().required("Rekening nr verplicht"),
    structuredmessage: Yup.string().notRequired(),
    comments: Yup.string().notRequired(),
    payed: Yup.string().notRequired(),
  });

  /**
   * Form submission
   * @param {} values
   */
  const onSubmit = (values, { resetForm }) => {
    // If we have an idToWorkOn value, then this is an update
    if (idToWorkOn) {
      db.collection("invoices")
        .doc(idToWorkOn)
        .update({
          accountnr: values.accountnr,
          amount: values.amount,
          comments: values.comments,
          structuredmessage: values.structuredmessage,
          datereceived: values.datereceived,
          datetopay: values.datetopay,
          inputdate: CurrentISODate(),
          payed: false,
          sender: values.sender,
        })
        .then(() => {
          resetForm({ values: "" });
          return toast("Gegevens aangepast!", {
            position: toast.POSITION.TOP_CENTER,
            type: "success",
            autoClose: 3000,
          });
        })
        .catch((err) => {
          resetForm({ values: "" });
          return toast(`Fout opgetreden! ${err}`, {
            position: toast.POSITION.TOP_CENTER,
            type: "error",
            autoClose: 10000,
          });
        });
    }
    if (!idToWorkOn) {
      // No idToWokOn, so this is a new record
      db.collection("invoices")
        .add({
          owner: values.accountOwnerName,
          accountnr: values.accountNr,
          date_created: CurrentISODate(),
          userid: values.userid,
          bank: values.accountBankName,
          balance: values.accountCurrentBalance,
          comments: values.accountComment,
        })
        .then(() => {
          // Clear the form fields
          resetForm({ values: "" });
          return toast("Nieuwe rekening aangemaakt!", {
            position: toast.POSITION.TOP_CENTER,
            type: "success",
            autoClose: 3000,
          });
        })
        .catch((err) => {
          resetForm({ values: "" });
          return toast(`Fout opgetreden! ${err}`, {
            position: toast.POSITION.TOP_CENTER,
            type: "error",
            autoClose: 10000,
          });
        });
    }
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
        maxWidth="md"
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ submitForm, isSubmitting }) => (
            <Form>
              <DialogTitle id="form-dialog-title">
                {idToWorkOn ? "Bestaande faktuur aanpassen" : "Nieuwe faktuur"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Gegevens voor deze faktuur
                </DialogContentText>
                <Grid container spacing={2}>
                  <Grid item sm={12} md={6} lg={4}>
                    <Field
                      component={TextField}
                      fullWidth
                      id="sender"
                      name="sender"
                      helperText="Afzender van de faktuur"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountCircle />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item sm={12} md={6} lg={4}>
                    <Field
                      fullWidth
                      component={TextField}
                      id="datereceived"
                      name="datereceived"
                      helperText="Ontvangen op"
                      type="date"
                    />
                  </Grid>
                  <Grid item sm={12} md={6} lg={4}>
                    <Field
                      fullWidth
                      component={TextField}
                      id="datetopay"
                      name="datetopay"
                      helperText="Uiterste betaaldatum"
                      type="date"
                    />
                  </Grid>
                  <Grid item sm={12} md={6} lg={4}>
                    {/* Using the iban field with InputProps */}
                    <Field
                      fullWidth
                      component={TextField}
                      name="accountnr"
                      id="accountnr"
                      helperText="Rekeningnummer afzender"
                      InputProps={{
                        inputComponent: IbanField,
                        startAdornment: (
                          <InputAdornment position="start">
                            <CreditCardIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item sm={12} md={6} lg={4}>
                    <Field
                      fullWidth
                      component={TextField}
                      id="amount"
                      name="amount"
                      type="number"
                      helperText="Te betalen bedrag"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EuroIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item sm={12} md={6} lg={4}>
                    <Field
                      fullWidth
                      component={TextField}
                      id="structuredmessage"
                      name="structuredmessage"
                      type="text"
                      helperText="Mededeling"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <RateReviewIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item sm={12} md={6} lg={4}>
                    <Field
                      fullWidth
                      component={TextField}
                      id="accountComment"
                      name="accountComment"
                      type="text"
                      helperText="Commentaar"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <RateReviewIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item sm={12} md={6} lg={4}>
                    <FormControlLabel
                      control={
                        <Field
                          fullWidth
                          component={Switch}
                          id="payed"
                          name="payed"
                          type="checkbox"
                          helperText="Commentaar"
                        />
                      }
                      label="Betaald?"
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="secondary">
                  Annuleren
                </Button>
                <Button type="submit" color="primary">
                  Opslaan
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
}
