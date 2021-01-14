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
  CircularProgress,
} from "@material-ui/core";
import CountUp from "react-countup";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import { useAuth } from "../../../Context/AuthContext";
import { db } from "../../../database/firebase";
import AccountModal from "./AccountModal";
import MessageBox from "../../UI_Utils/MessageBox";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  balance: {
    color: "#b8dd24",
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
  const [
    showDeleteAccountMessageBox,
    setShowDeleteAccountMessageBox,
  ] = useState(false);

  // Get the current user
  const { currentUser, logout } = useAuth();

  /**
   * Show the delete messagebox
   */
  const handleShowMessageBox = (id) => {
    setIdToWorkOn(id);
    setShowDeleteAccountMessageBox(true);
  };

  /**
   * Close the Delete messagebox
   */
  const handleMessageBoxClose = () => {
    setShowDeleteAccountMessageBox(false);
  };

  /**
   * Show messagebox for deletion
   * @param {id of the record to delete} id
   */
  const handleMessageBoxYes = (id) => {
    deleteAccount();
    setIdToWorkOn(0);
    setShowDeleteAccountMessageBox(false);
  };

  const [initialValues, setInitialValues] = useState({
    date_created: CurrentISODate(),
    userid: currentUser.uid,
    accountOwnerName: "",
    accountNr: "",
    accountBankName: "",
    accountCurrentBalance: "",
    accountComment: "",
  });

  const classes = useStyles();

  const handleNewAccount = () => {
    setInitialValues({
      date_created: CurrentISODate(),
      userid: currentUser.uid,
      accountOwnerName: "",
      accountNr: "",
      accountBankName: "",
      accountCurrentBalance: "",
      accountComment: "",
    });
    setIdToWorkOn(0);
    setShowNewInvoiceModal(true);
  };

  const handleEditAccount = (id) => {
    // Not needed to go to firestore again, we have the data already,
    // so filter it out from the accounts array
    let currentAccount = accounts.filter((accounts) => accounts.id === id);

    setInitialValues({
      date_created: CurrentISODate(),
      userid: currentUser.uid,
      accountOwnerName: currentAccount[0].owner,
      accountNr: currentAccount[0].accountnr,
      accountBankName: currentAccount[0].bank,
      accountCurrentBalance: currentAccount[0].balance,
      accountComment: currentAccount[0].comments,
    });

    setIdToWorkOn(id);
    setShowNewInvoiceModal(true);
  };

  /**
   * Permanently delete the selected account nr
   */
  const deleteAccount = () => {
    db.collection("accounts")
      .doc(idToWorkOn)
      .delete()
      .then(() => {
        return toast("Rekening is verwijderd!", {
          position: toast.POSITION.TOP_CENTER,
          type: "success",
          autoClose: 3000,
        });
      })
      .catch((err) => {
        return toast("Fout opgetreden!", {
          position: toast.POSITION.TOP_CENTER,
          type: "warning",
          autoClose: 3000,
        });
      });
  };

  /**
   * Get the accounts collection on a per user base
   */
  const getAccounts = async () => {
    setIsLoading(true);
    db.collection("accounts")
      .where("userid", "==", currentUser.uid)
      .orderBy("owner")
      .orderBy("bank")
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
        endIcon={<AddBoxOutlinedIcon />}
      >
        Nieuwe rekening
      </Button>
      {isLoading && <CircularProgress className={classes.circleSpacer} />}
      <Grid
        container
        spacing={4}
        className={`${classes.gridContainer} ${classes.gridMarginTop}`}
      >
        {accounts.map((account, key) => {
          return (
            <Grid item xs={12} md={4} lg={4}>
              <Card className={classes.root} raised>
                <CardHeader title={account.owner} subheader={account.bank} />
                <CardContent>
                  <Typography color="secondary" variant="h7">
                    {account.comments}
                  </Typography>
                  <Typography variant="h6">IBAN {account.accountnr}</Typography>
                  <Typography className={classes.balance} variant="h4">
                    <CountUp
                      start={0}
                      end={account.balance}
                      duration={1.5}
                      decimals={2}
                      separator=","
                      prefix="€"
                    />
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    onClick={() => handleEditAccount(account.id)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleShowMessageBox(account.id)}
                    color="primary"
                  >
                    <DeleteForeverIcon />
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
      <MessageBox
        open={showDeleteAccountMessageBox}
        messageTitle="Rekening verwijderen?"
        messageSubTitle="Bent u zeker dat deze rekening weg mag? Deze actie kan niet ongedaan gemaakt worden!"
        handleMessageBoxClose={handleMessageBoxClose}
        handleMessageBoxYes={handleMessageBoxYes}
      />
    </div>
  );
};

export default ListAccounts;
