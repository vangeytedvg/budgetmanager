import React, { useEffect, useState } from "react";
import { Button, Grid, Divider } from "@material-ui/core";
import { TextField } from "formik-material-ui";

import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import * as Yup from "yup";
import { useAuth } from "../../../Context/AuthContext";
import { db } from "../../../database/firebase";
import IbanField from "../../UI_Utils/IbanField";
import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircle from "@material-ui/icons/AccountCircle";
import EuroIcon from "@material-ui/icons/Euro";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import RateReviewIcon from "@material-ui/icons/RateReview";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/CancelOutlined";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { DialogTitle } from "../../UI_Utils/DialogTitle";
import { Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CurrentISODate } from "../../../utils";
import Zoom from "@material-ui/core/Zoom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom in={true} {...props} />;
});

export default function ExpensesModal({
  open,
  setOpen,
  initialValues,
  idToWorkOn,
}) {
  toast.configure();
  const { currentUser } = useAuth();
  const [accounts, setAccounts] = useState([]);
  /**
   * The Validation schema for this form
   */
  const validationSchema = Yup.object({
    accountid: Yup.string().required("Required!"),
    ownername: Yup.string().notRequired(),
    comments: Yup.string().required("Geef uitleg over de uitgave"),
    location: Yup.string().required("Geef de plaats van de uitgave"),
    amount: Yup.number()
      .min(1, "Uitgavebedrag kan niet nul zijn!")
      .required("Verplicht veld"),
  });

  /**
   * Form submission
   * @param {} values
   */
  const onSubmit = (values, { resetForm }) => {
    // Get the owner object from the existing accounts array
    let accUser = accounts.filter((acc) => acc.id === values.accountid);
    // If we have an idToWorkOn value, then this is an update
    if (idToWorkOn) {
      db.collection("expenses")
        .doc(idToWorkOn)
        .update({
          owner: accUser[0],
          userid: currentUser.uid,
          amount: values.amount,
          comments: values.comments,
          location: values.location,
          date_expense: values.date_expense,
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
      db.collection("expenses")
        .add({
          owner: accUser[0],
          userid: currentUser.uid,
          amount: values.amount,
          comments: values.comments,
          location: values.location,
          date_expense: values.date_expense,
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

  /**
   * Get the accounts collection for the current user
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
    <div>
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
                {idToWorkOn ? "Bestaande uitgave aanpassen" : "Nieuwe uitgave"}
              </DialogTitle>
              <Divider />
              <DialogContent>
                <DialogContentText>Details van de uitgave</DialogContentText>
                <Grid container spacing={2}>
                  <Grid item sm={12} md={4} lg={6}>
                    <Field
                      component={TextField}
                      id="accountid"
                      name="accountid"
                      helperText="Rekening waarmee uitgave is gedaan"
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
                      id="amount"
                      name="amount"
                      type="number"
                      helperText="Bedrag uitgave"
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
                    {/* Using the iban field with InputProps */}
                    <Field
                      component={TextField}
                      name="location"
                      id="location"
                      helperText="Plaats van uitgave"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOnIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item sm={12} md={4} lg={6}>
                    <Field
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
    </div>
  );
}
