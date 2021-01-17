import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { DataGrid } from "@material-ui/data-grid";
import SectionTitle from "../../UI_Utils/SectionTitle";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import { Button, Grid } from "@material-ui/core";
import { useAuth } from "../../../Context/AuthContext";
import { db } from "../../../database/firebase";
import MessageBox from "../../UI_Utils/MessageBox";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * If not defined, the page will not show correctly
 */
const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    margin: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  table: {
    minWidth: 650,
  },
  paper: {
    height: "50vh",
  },

  button: {
    margin: theme.spacing(1),
  },
}));

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "sender", headerName: "Afzender", width: 180 },
  { field: "datereceived", headerName: "Ontvangen op", width: 170 },
  { field: "datetopay", headerName: "Betalen vòòr", width: 170 },
  { field: "amount", headerName: "Bedrag", width: 130 },
  { field: "payed", headerName: "Betaald", width: 120 },
  { field: "accountnr", headerName: "Op rekening nr", width: 190 },
  { field: "structuredmessage", headerName: "Mededeling", width: 130 },
  { field: "comments", headerName: "Kommentaar", width: 130 },
];

const Invoices = () => {
  const classes = useStyles();
  // Remembers the selected row in the datagrid
  const [select, setSelection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const { currentUser } = useAuth();

  const handleNewInvoice = () => {};

  /**
   * Get the todos collection on a per user base
   */
  const getInvoices = async () => {
    setIsLoading(true);
    db.collection("invoices")
      .orderBy("inputdate", "asc")
      .orderBy("sender")
      .where("user", "==", currentUser.uid)
      .onSnapshot((querySnapshot) => {
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        setRows(docs);
        setIsLoading(false);
      });
  };

  const handleSel = (e) => {
    setSelection(e.rowIds[0]);
  };

  const handleEditInvoice = () => {
    console.log("Edit ", select);
  };

  useEffect(() => {
    getInvoices();
    // Avoid eslint error:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <SectionTitle maintitle="Fakturen" subtitle="ingave" />
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        onClick={handleNewInvoice}
        endIcon={<AddBoxOutlinedIcon />}
      >
        Nieuwe rekening
      </Button>
      {select > "" && (
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          onClick={handleEditInvoice}
          endIcon={<AddBoxOutlinedIcon />}
        >
          Faktuur aanpassen
        </Button>
      )}
      <div className={classes.paper}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={25}
          onSelectionChange={handleSel}
        />
        {console.log(select)}
      </div>
    </main>
  );
};

export default Invoices;
