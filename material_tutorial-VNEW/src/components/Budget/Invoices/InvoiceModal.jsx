import React from "react";
import { Button, Grid } from "@material-ui/core";
import { TextField } from "formik-material-ui";

import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import * as Yup from "yup";
import IbanField from "../../UI_Utils/IbanField";
import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircle from "@material-ui/icons/AccountCircle";
import EuroIcon from "@material-ui/icons/Euro";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import RateReviewIcon from "@material-ui/icons/RateReview";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CurrentISODate } from "../../../utils";
import { db } from "../../../database/firebase";

export default function AccountModal({
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
    datetopay: Yup.string()
      // Replace all non digits and check if the lenght is 14
      .required("Betaaldatum verplicht!"),
    accountr: Yup.string().required("Rekening nr verplicht"),
    structuredmessage: Yup.notrequired(),
    comments: Yup.notrequired(),
    payed: Yup.notrequired(),
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
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ submitForm, isSubmitting }) => (
            <Form>
              <DialogTitle id="form-dialog-title">
                {idToWorkOn
                  ? "Bestaande rekening aanpassen"
                  : "Nieuwe rekening"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Gegevens voor deze rekening
                </DialogContentText>
                <Grid container spacing={2}>
                  <Grid item sm={12} md={4} lg={6}>
                    <Field
                      component={TextField}
                      id="accountOwnerName"
                      name="accountOwnerName"
                      helperText="Eignaar van de rekening"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountCircle />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item sm={12} md={4} lg={6}>
                    <Field
                      component={TextField}
                      id="accountBankName"
                      name="accountBankName"
                      helperText="Naam van de bank"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountBalanceIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item sm={12} md={4} lg={6}>
                    {/* Using the iban field with InputProps */}
                    <Field
                      component={TextField}
                      name="accountNr"
                      id="accountNr"
                      helperText="Rekening Nr"
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
                  <Grid item sm={12} md={4} lg={6}>
                    <Field
                      component={TextField}
                      id="accountCurrentBalance"
                      name="accountCurrentBalance"
                      type="number"
                      helperText="Bedrag op de rekening"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EuroIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item sm={12} md={4} lg={6}>
                    <Field
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
