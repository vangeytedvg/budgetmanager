import React from "react";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/CancelOutlined";
import {
  Button,
  Grid,
  InputAdornment,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import { DialogTitle } from "../../UI_Utils/DialogTitle";
import { Switch, TextField } from "formik-material-ui";
import IbanField from "../../UI_Utils/IbanField";
import {
  AccountCircle,
  Euro as EuroIcon,
  CreditCard as CreditCardIcon,
  RateReview as RateReviewIcon,
} from "@material-ui/icons";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CurrentISODate } from "../../../utils";
import { db } from "../../../database/firebase";
import Zoom from "@material-ui/core/Zoom";

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom in={true} {...props} />;
});

export default function InvoiceModal({
  open,
  setOpen,
  initialValues,
  idToWorkOn,
}) {
  toast.configure();
  console.log(initialValues);

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
    accountnr: Yup.string().required("Rekening nr verplicht"),
    structuredmessage: Yup.string().notRequired(),
    comments: Yup.string().notRequired(),
    payed: Yup.bool().notRequired(),
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
      db.collection("invoices")
        .add({
          accountnr: values.accountnr,
          amount: values.amount,
          comments: values.comments,
          structuredmessage: values.structuredmessage,
          datereceived: values.datereceived,
          datetopay: values.datetopay,
          inputdate: CurrentISODate(),
          // payed: values.payed,
          sender: values.sender,
          user: values.userid,
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
        TransitionComponent={Transition}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ submitForm, isSubmitting }) => (
            <Form>
              <DialogTitle id="customized-dialog-title" onClose={handleClose}>
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
                      id="comments"
                      name="comments"
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
                  {/* <Grid item sm={12} md={6} lg={4}>
                    <FormControlLabel
                    SWITCH was outcommented because there is a bug in the implementation,
                    found not solution on the internet (dd 20/01/2021)
                      control={
                        <Field
                          fullWidth
                          component={Switch}
                          name="payed"
                          type="checkbox"
                          helperText="Commentaar"
                        />
                      }
                      label="Betaald?"
                    />
                  </Grid> */}
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  endIcon={<CancelIcon />}
                  color="secondary"
                >
                  Annuleren
                </Button>
                <Button type="submit" endIcon={<SaveIcon />} color="primary">
                  Opslaan
                </Button>{" "}
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
}
