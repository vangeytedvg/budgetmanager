import React, { useState, useEffect } from "react";
import { Button, Grid, Divider } from "@material-ui/core";
import { TextField } from "formik-material-ui";

// import Input from "@material-ui/core/Input";
// import InputLabel from "@material-ui/core/InputLabel";
// import FormControl from "@material-ui/core/FormControl";
import * as Yup from "yup";
import IbanField from "../../UI_Utils/IbanField";
import InputAdornment from "@material-ui/core/InputAdornment";
import MenuItem from "@material-ui/core/MenuItem";
// import AccountCircle from "@material-ui/icons/AccountCircle";
import EuroIcon from "@material-ui/icons/Euro";
// import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import EventIcon from "@material-ui/icons/Event";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import RateReviewIcon from "@material-ui/icons/RateReview";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/CancelOutlined";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { DialogTitle } from "../../UI_Utils/DialogTitle";
import { Field, Form, Formik } from "formik";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import { Select } from "formik-material-ui";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CurrentISODate } from "../../../utils";
import { db } from "../../../database/firebase";
import { useAuth } from "../../../Context/AuthContext";

import Zoom from "@material-ui/core/Zoom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom in={true} {...props} />;
});

export default function PayplanModal({
  open,
  setOpen,
  initialValues,
  idToWorkOn,
}) {
  const [accounts, setAccounts] = useState([]);
  const { currentUser } = useAuth();
  toast.configure();

  const days = [];
  for (let i = 0; i <= 31; i++) {
    days.push(i);
  }

  /**
   * The Validation schema for this form
   */
  const validationSchema = Yup.object({
    accountid: Yup.string().required("Verplicht veld"),
    payplan_origin: Yup.string().required("Verplicht veld"),
    payplan_accountNr: Yup.string().required("Verplicht veld"),
    payplan_structMessage: Yup.string().notRequired(),
    payplan_totalRequestAmount: Yup.number().required("verplicht veld"),
    payplan_payAmount: Yup.number().required("Verplicht veld"),
    payplan_day: Yup.number().required("Verplicht veld"),
    payplan_comment: Yup.string().notRequired(),
  });

  /**
   * Form submission
   * @param {} values
   */
  const onSubmit = (values, { resetForm }) => {
    // If we have an idToWorkOn value, then this is an update
    if (idToWorkOn) {
      db.collection("payplans")
        .doc(idToWorkOn)
        .update({
          accountid: values.accountid,
          payplan_origin: values.payplan_origin,
          payplan_accountNr: values.payplan_accountNr,
          payplan_structMessage: values.payplan_structMessage,
          payplan_totalRequestAmount: values.payplan_totalRequestAmount,
          payplan_payAmount: values.payplan_payAmount,
          payplan_day: values.payplan_day,
          payplan_comment: values.payplan_comment,
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
      db.collection("payplans")
        .add({
          date_created: CurrentISODate(),
          userid: currentUser.uid,
          accountid: values.accountid,
          payplan_origin: values.payplan_origin,
          payplan_accountNr: values.payplan_accountNr,
          payplan_structMessage: values.payplan_structMessage,
          payplan_totalRequestAmount: values.payplan_totalRequestAmount,
          payplan_payAmount: values.payplan_payAmount,
          payplan_day: values.payplan_day,
          payplan_comment: values.payplan_comment,
        })
        .then(() => {
          // Clear the form fields
          resetForm({ values: "" });
          return toast("Nieuw betaalplan aangemaakt", {
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

  /**
   * Get the accounts collection for the current user, this
   * data is used to operate on the account data afterwards
   */
  const getAccounts = async () => {
    db.collection("accounts")
      .where("userid", "==", currentUser.uid)
      .onSnapshot((querySnapshot) => {
        const docs = [""];
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        console.log(docs);
        setAccounts(docs);
      });
  };

  /**
   * useEffect hook
   */
  useEffect(() => {
    // On page load get the todos
    getAccounts();
  }, []);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      TransitionComponent={Transition}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ submitForm, isSubmitting }) => (
          <Form>
            <DialogTitle id="form-dialog-title" onClose={handleClose}>
              {idToWorkOn
                ? "Bestaand betaalplan aanpassen"
                : "Nieuw betaalplan"}
            </DialogTitle>
            <Divider />
            <DialogContent>
              <DialogContentText>
                Gegevens voor dit betaalplan
              </DialogContentText>
              <Grid container spacing={2}>
                <Grid item sm={12} md={4} lg={6}>
                  <FormControl>
                    <InputLabel shrink htmlFor="accountid">
                      Uitvoerende rekening
                    </InputLabel>
                    <Field
                      component={Select}
                      name="accountid"
                      InputProps={{
                        id: "accountid",
                      }}
                    >
                      {accounts.map((account) => {
                        return (
                          <MenuItem key={account.id} value={account.id}>
                            {account.owner} {account.comments}
                          </MenuItem>
                        );
                      })}
                    </Field>
                  </FormControl>
                </Grid>
                <Grid item sm={12} md={4} lg={6}>
                  <Field
                    component={TextField}
                    id="payplan_origin"
                    name="payplan_origin"
                    helperText="Te betalen aan"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SupervisorAccountIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item sm={12} md={4} lg={6}>
                  {/* Using the iban field with InputProps */}
                  <Field
                    component={TextField}
                    name="payplan_accountNr"
                    id="payplan_accountNr"
                    helperText="Storten op rekening"
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
                    id="payplan_structMessage"
                    name="payplan_structMessage"
                    type="text"
                    helperText="Mededeling op betaling"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <RateReviewIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item sm={12} md={4} lg={6}>
                  <Field
                    component={TextField}
                    id="payplan_totalRequestAmount"
                    name="payplan_totalRequestAmount"
                    type="number"
                    helperText="Totaal bedrag van invordering"
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
                    id="payplan_payAmount"
                    name="payplan_payAmount"
                    type="number"
                    helperText="Bedrag per aflossing"
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
                  <FormControl>
                    <InputLabel shrink htmlFor="accountid">
                      Dag betaling
                    </InputLabel>
                    <Field
                      component={Select}
                      name="payplan_day"
                      InputProps={{
                        id: "payplan_day",
                      }}
                    >
                      {days.map((day) => {
                        return (
                          <MenuItem key={day} value={day}>
                            {day}
                          </MenuItem>
                        );
                      })}
                    </Field>
                  </FormControl>
                </Grid>
                <Grid item sm={12} md={4} lg={6}>
                  <Field
                    component={TextField}
                    id="payplan_comment"
                    name="payplan_comment"
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
            <Divider />
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
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
