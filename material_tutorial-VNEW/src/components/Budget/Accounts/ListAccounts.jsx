import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import SectionTitle from "../../UI_Utils/SectionTitle";
import { Button, Grid, Paper, TextField } from "@material-ui/core";
import { useFormik } from "formik";
import { CurrentISODate } from "../../../utils";
import InputMask from "react-input-mask";
import TextError from "../../UI_Utils/TextError";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { useAuth } from "../../../Context/AuthContext";
import { db } from "../../../database/firebase";
import AccountModal from "./AccountModal";

/**
 * Styling the component
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
  button: {
    marginBottom: "10px",
  },
}));

const ListAccounts = (props) => {
  // Accounts array for firebase
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [accountOwner, setAccountOwner] = useState("");
  const [accountNr, setAccountNr] = useState("");
  const [bank, setBank] = useState("");
  const [balance, setBalance] = useState(0);
  const [idToWorkOn, setIdToWorkOn] = useState(0);
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);

  const [initialValues, setInitialValues] = useState({
    date_created: CurrentISODate(),
    userid: 0, //currentUser.uid,
    accountOwnerName: "",
    accountNr: "",
    accountBankName: "",
    accountCurrentBalance: "",
  });

  const classes = useStyles();
  // Get the current user

  const { currentUser, logout } = useAuth();

  const handleNewAccount = () => {
    setInitialValues({
      date_created: CurrentISODate(),
      userid: currentUser.uid,
      accountOwnerName: "",
      accountNr: "",
      accountBankName: "",
      accountCurrentBalance: "",
    });
    setIdToWorkOn(0);
    setShowNewInvoiceModal(true);
  };

  const handleEditAccount = (id) => {
    // Not needed to go to firestore again, we have the data already,
    // so filter it out from the accounts array
    let currentAccount = accounts.filter((accounts) => accounts.id === id);
    console.log("Gevonden ", currentAccount[0]);
    setInitialValues({
      date_created: CurrentISODate(),
      userid: currentUser.uid,
      accountOwnerName: currentAccount[0].owner,
      accountNr: currentAccount[0].accountnr,
      accountBankName: currentAccount[0].bank,
      accountCurrentBalance: currentAccount[0].balance,
    });
    console.log("Werd doorgegeven: ", initialValues);
    setIdToWorkOn(id);
    setShowNewInvoiceModal(true);
  };

  const deleteAccount = () => {
    // setShowMessageToDelete(false);
    // const id = e.id
    db.collection("accounts")
      .doc(idToWorkOn)
      .delete()
      .then(() => {
        // return toast("Record deleted", {
        //   position: toast.POSITION.BOTTOM_CENTER,
        //   type: "info",
        //   autoClose: 3000,
        // });
      })
      .catch((err) => {
        // return toast("Error", {
        //   position: toast.POSITION.BOTTOM_CENTER,
        //   type: "warning",
        //   autoClose: 3000,
        // });
      });
    // setShowMessage(false);
  };

  /**
   * Get the accounts collection on a per user base
   */
  const getAccounts = async () => {
    setIsLoading(true);
    db.collection("accounts")
      .where("userid", "==", currentUser.uid)
      .onSnapshot((querySnapshot) => {
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        setAccounts(docs);
        setIsLoading(false);
      });
  };

  /**
   * useEffect hook
   */
  useEffect(() => {
    // On page load get the accounts
    getAccounts();
  }, []);

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <SectionTitle
        maintitle="Lijst rekeningen"
        subtitle="algemeen overzicht"
      />
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        onClick={handleNewAccount}
      >
        Nieuwe rekening
      </Button>
      <Grid
        container
        spacing={4}
        className={`${classes.gridContainer} ${classes.gridMarginTop}`}
      >
        {accounts.map((account, key) => {
          return (
            <Grid item xs={12} md={6} lg={6}>
              <Card className={classes.root} raised>
                <CardHeader title={account.owner} subheader={account.bank} />
                <CardContent>
                  <Typography color="secondary" variant="h4">
                    €{account.balance}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    onClick={() => handleEditAccount(account.id)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <AccountModal
        open={showNewInvoiceModal}
        initialValues={initialValues}
        setOpen={setShowNewInvoiceModal}
        idToWorkOn={idToWorkOn}
      />
    </div>
  );
};

export default ListAccounts;
