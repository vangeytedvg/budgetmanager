import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import SectionTitle from "../../UI_Utils/SectionTitle";
import { Button, Grid, Paper, TextField } from "@material-ui/core";
import { useFormik } from "formik";
import { CurrentISODate } from "../../../utils";
import InputMask from "react-input-mask";
import TextError from "../../UI_Utils/TextError";

const ListAccounts = (props) => {
  // Accounts array for firebase
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [accountOwner, setAccountOwner] = useState("");
  const [accountNr, setAccountNr] = useState("");
  const [bank, setBank] = useState("");
  const [balance, setBalance] = useState(0);

  // Get the current user
  const { currentUser, logout } = useAuth();

  /**
   * Styling
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
    blabla: {
      padding: "18px",
      borderRadius: "5px",
      backgroundColor: "#535353",
      borderBlockStyle: "none",
      color: "white",
      fontFamily: "Roboto",
    },
  }));

  const deleteAccount = () => {
    setShowMessageToDelete(false);
    // const id = e.id
    db.collection("accounts")
      .doc(idToDelete)
      .delete()
      .then(() => {
        return toast("Record deleted", {
          position: toast.POSITION.BOTTOM_CENTER,
          type: "info",
          autoClose: 3000,
        });
      })
      .catch((err) => {
        return toast("Error", {
          position: toast.POSITION.BOTTOM_CENTER,
          type: "warning",
          autoClose: 3000,
        });
      });
    setShowMessage(false);
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
      <SectionTitle maintitle="Dashboard" subtitle="algemeen overzicht" />
      <Grid
        container
        spacing={4}
        className={`${classes.gridContainer} ${classes.gridMarginTop}`}
      >
        <Grid item xs={12} md={6} lg={4}>
          <Card className={classes.root} raised>
            <CardHeader title="Rekeningen" subheader="huidige stand" />
            <CardContent></CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default ListAccounts;
