import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import SectionTitle from "../../UI_Utils/SectionTitle";
import { Button, Grid } from "@material-ui/core";
import { CurrentISODate } from "../../../utils";
import Tooltip from "@material-ui/core/Tooltip";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
  Divider,
} from "@material-ui/core";
import CountUp from "react-countup";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import MemoryIcon from "@material-ui/icons/Memory";
import { useAuth } from "../../../Context/AuthContext";
import { db } from "../../../database/firebase";
import PayplanModal from "./PayplanModal";
import MessageBox from "../../UI_Utils/MessageBox";
import { toast } from "react-toastify";
import bg from "../../../images/globalbg.png";
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
    borderRadius: "15px",
    backgroundImage: `url(${bg})`,
    // filter: `blur(${"1px"})`,
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

const ListPaymentPlans = (props) => {
  // Accounts array for firebase
  const [isLoading, setIsLoading] = useState(false);
  const [idToWorkOn, setIdToWorkOn] = useState(0);
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [plans, setPlans] = useState([]);
  const [showDeletePlanMessageBox, setShowDeletePlanMessageBox] = useState(
    false
  );

  const [initialValues, setInitialValues] = useState({
    date_created: CurrentISODate(),
    userid: 0, // currentUser.uid,
    accountid: "",
    payplan_origin: "",
    payplan_accountNr: "",
    payplan_structMessage: "",
    payplan_totalRequestAmount: "",
    payplan_payAmount: "",
    payplan_day: "",
    payplan_comment: "",
  });

  // Get the current user
  const { currentUser } = useAuth();

  /**
   * Show the delete messagebox
   */
  const handleShowMessageBox = (id) => {
    setIdToWorkOn(id);
    setShowDeletePlanMessageBox(true);
  };

  /**
   * Close the Delete messagebox
   */
  const handleMessageBoxClose = () => {
    setShowDeletePlanMessageBox(false);
  };

  /**
   * Show messagebox for deletion
   * @param {id of the record to delete} id
   */
  const handleMessageBoxYes = (id) => {
    deleteAccount();
    setIdToWorkOn(0);
    setShowDeletePlanMessageBox(false);
  };

  const classes = useStyles();

  const handleNewAccount = () => {
    setInitialValues({
      date_created: CurrentISODate(),
      userid: currentUser.uid,
      accountid: "",
      payplan_origin: "",
      payplan_accountNr: "",
      payplan_structMessage: "",
      payplan_totalRequestAmount: "",
      payplan_payAmount: "",
      payplan_day: "",
      payplan_comment: "",
    });
    setIdToWorkOn(0);
    setShowNewPlanModal(true);
  };

  const handleEditAccount = (id) => {
    // Not needed to go to firestore again, we have the data already,
    // so filter it out from the accounts array
    setInitialValues({
      userid: currentUser.uid,
      accountid: "",
      payplan_origin: "",
      payplan_accountNr: "",
      payplan_structMessage: "",
      payplan_totalRequestAmount: "",
      payplan_payAmount: "",
      payplan_day: "",
      payplan_comment: "",
    });

    setIdToWorkOn(id);
    setShowNewPlanModal(true);
  };

  /**
   * Permanently delete the selected account nr
   */
  const deleteAccount = () => {
    db.collection("paymentplans")
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
  const getPayplans = async () => {
    setIsLoading(true);
    db.collection("payplans")
      .where("userid", "==", currentUser.uid)
      .onSnapshot((querySnapshot) => {
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        setPlans(docs);
      });
    setIsLoading(false);
  };

  /**
   * useEffect hook
   */
  useEffect(() => {
    // On page load get the accounts
    getPayplans();
  }, []);

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <SectionTitle
        maintitle="Betaalplannen"
        subtitle="algemeen overzicht en aanmaak"
      />
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        onClick={handleNewAccount}
        endIcon={<AddBoxOutlinedIcon />}
      >
        Nieuw betaalplan
      </Button>
      {isLoading && <CircularProgress className={classes.circleSpacer} />}
      <Grid
        container
        spacing={2}
        className={`${classes.gridContainer} ${classes.gridMarginTop}`}
      >
        {plans.map((plan, key) => {
          return (
            <Grid item xs={12} md={6} lg={4} key={key}>
              <Card className={classes.root} raised>
                <CardHeader
                  title={plan.payplan_origin}
                  subheader={plan.payplan_day}
                />
                <CardContent>
                  <Typography color="secondary" variant="h6">
                    {plan.payplan_comment}
                  </Typography>
                  <Grid container>
                    <Grid container>
                      <Grid item>
                        <Typography variant="h6">
                          Totaal bedrag €{plan.payplan_totalRequestAmount}
                        </Typography>
                      </Grid>
                      <Grid item></Grid>
                    </Grid>
                  </Grid>
                </CardContent>
                <Divider />
                <CardActions>
                  <Tooltip
                    title="Rekeningdetails aanpassen"
                    placement="top"
                    arrow
                  >
                    <IconButton
                      onClick={() => handleEditAccount(plan.id)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Rekening wissen" placement="top" arrow>
                    <IconButton
                      onClick={() => handleShowMessageBox(plans.id)}
                      color="primary"
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <PayplanModal
        open={showNewPlanModal}
        initialValues={initialValues}
        setOpen={setShowNewPlanModal}
        idToWorkOn={idToWorkOn}
      />
      <MessageBox
        open={showDeletePlanMessageBox}
        messageTitle="Betaalplan verwijderen?"
        messageSubTitle="Bent u zeker dat dit betaalplan weg mag? Deze actie kan niet ongedaan gemaakt worden!"
        handleMessageBoxClose={handleMessageBoxClose}
        handleMessageBoxYes={handleMessageBoxYes}
      />
    </div>
  );
};

export default ListPaymentPlans;
