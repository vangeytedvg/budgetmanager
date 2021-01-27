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
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import RateReviewIcon from "@material-ui/icons/RateReview";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/CancelOutlined";
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
    // If we have an idToWorkOn value, then this is an update
    if (idToWorkOn) {
      db.collection("payplans")
        .doc(idToWorkOn)
        .update({
          owner: values.accountOwnerName,
          accountnr: values.accountNr,
          bank: values.accountBankName,
          balance: values.accountCurrentBalance,
          comments: values.accountComment,
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
      db.collection("accounts")
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
                    id="payplan_Origin"
                    name="payplan_Origin"
                    helperText="Te betalen aan"
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
                    name="payplan_accountNr"
                    id="payplan_accountNr"
                    helperText="Te storten op"
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
                    id="payplan_paySlices"
                    name="payplan_paySlices"
                    type="text"
                    helperText="Aantal aflossingen"
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
                    id="payplan_payAmount"
                    name="payplan_payAmount"
                    type="text"
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
                  <Field
                    component={TextField}
                    id="payplan_Comment"
                    name="payplan_Comment"
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
