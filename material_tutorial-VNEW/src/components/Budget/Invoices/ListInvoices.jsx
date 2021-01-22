import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  CircularProgress,
  Paper,
  Button,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import DoneIcon from "@material-ui/icons/Done";
import NotInterestedIcon from "@material-ui/icons/NotInterested";
import {
  CurrentISODate,
  getActualMonth,
  getQueryDateObject,
} from "../../../utils";
import { useAuth } from "../../../Context/AuthContext";
import { db } from "../../../database/firebase";
import SectionTitle from "../../UI_Utils/SectionTitle";
import {
  descendingComparator,
  getComparator,
} from "../../UI_Utils/SortingHelpers";
import InvoiceModal from "./InvoiceModal";
import MessageBox from "../../UI_Utils/MessageBox";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import YearMonthSelector from "./YearMonthSelector";

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: "sender", numeric: false, disablePadding: false, label: "Afzender" },
  {
    id: "datereceived",
    numeric: false,
    disablePadding: false,
    label: "Ontvangen op",
  },
  {
    id: "datetopay",
    numeric: false,
    disablePadding: false,
    label: "Betalen vòòr",
  },
  { id: "amount", numeric: true, disablePadding: false, label: "Bedrag (€)" },
  { id: "payed", numeric: false, disablePadding: false, label: "Betaald?" },
  {
    id: "accountnr",
    numeric: false,
    disablePadding: false,
    label: "Storten op rekening",
  },
  {
    id: "structuredmessage",
    numeric: false,
    disablePadding: false,
    label: "Mededeling faktuur",
  },
  {
    id: "comments",
    numeric: false,
    disablePadding: false,
    label: "Kommentaar",
  },
  {
    id: "ed",
    numeric: false,
    disablePadding: false,
    label: "Edit",
  },
  {
    id: "del",
    numeric: false,
    disablePadding: false,
    label: "Wis",
  },
];

const EnhancedTableHead = (props) => {
  const { classes, order, orderBy, onRequestSort } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <StyledTableCellHead
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </StyledTableCellHead>
        ))}
      </TableRow>
    </TableHead>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  circleSpacer: {
    color: "blue",
  },
  done: {
    color: "yellow",
    cursor: "pointer",
  },
  notdone: {
    color: "#e44d4d",
    cursor: "pointer",
  },
  toolbar: theme.mixins.toolbar,
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  content: {
    flexGrow: 1,
    margin: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  actionButtonDelete: {
    color: "#e44d4d",
  },
  actionButtonEdit: {
    color: "#eeff00",
  },
  button: {
    marginBottom: "10px",
    marginRight: theme.spacing(1),
  },
}));

const StyledTableCellHead = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: "#79ac77",
    },
    "&:nth-of-type(even)": {
      backgroundColor: "#497a48",
    },
  },
}))(TableRow);

export default function ListInvoices() {
  toast.configure();
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const { currentUser } = useAuth();
  const [idToWorkOn, setIdToWorkOn] = useState(0);

  const [initialValues, setInitialValues] = useState({
    accountnr: "",
    amount: 0,
    userid: 0, // currentUser.uid,
    comments: "",
    structuredmessage: "",
    datereceived: "",
    datetopay: "",
    inputdate: CurrentISODate(),
    payed: false,
    sender: "",
  });
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [
    showDeleteInvoiceMessageBox,
    setShowDeleteInvoiceMessageBox,
  ] = useState(false);
  const [month, setMonth] = useState(
    getQueryDateObject(CurrentISODate()).month
  );
  const [year, setYear] = useState(getQueryDateObject(CurrentISODate()).year);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  /**
   * Get the todos collection on a per user base
   */
  const getInvoices = async () => {
    setIsLoading(true);
    console.log("In getInvoices", month);
    /**
     * This is a rather BIG hack, because the firebase engine does
     * not support a wildcard query...
     */
    if (month === 0) {
      // Month 0 (*) the month where clause is removed here
      db.collection("invoices")
        .orderBy("datereceived", "desc")
        .orderBy("sender")
        .where("user", "==", currentUser.uid)
        .where("year_received", "==", year)
        .onSnapshot((querySnapshot) => {
          const docs = [];
          querySnapshot.forEach((doc) => {
            docs.push({ ...doc.data(), id: doc.id });
          });
          setRows(docs);
          setIsLoading(false);
        });
    } else if (month > 0) {
      // Where clause includes month
      db.collection("invoices")
        .orderBy("datereceived", "desc")
        .orderBy("sender")
        .where("user", "==", currentUser.uid)
        .where("month_received", "==", month)
        .where("year_received", "==", year)
        .onSnapshot((querySnapshot) => {
          const docs = [];
          querySnapshot.forEach((doc) => {
            docs.push({ ...doc.data(), id: doc.id });
          });
          setRows(docs);
          setIsLoading(false);
        });
    }
  };

  const handleEdit = (id) => {
    // Get the current invoice from the existing array
    // thus avoiding a roundtrip to firebase

    let currentInvoice = rows.filter((row) => row.id === id);
    setInitialValues({
      accountnr: currentInvoice[0].accountnr,
      amount: currentInvoice[0].amount,
      userid: currentInvoice[0].user,
      comments: currentInvoice[0].comments,
      structuredmessage: currentInvoice[0].structuredmessage,
      datereceived: currentInvoice[0].datereceived,
      datetopay: currentInvoice[0].datetopay,
      inputdate: CurrentISODate(),
      payed: currentInvoice[0].payed,
      sender: currentInvoice[0].sender,
    });
    setIdToWorkOn(id);
    setShowNewInvoiceModal(true);
  };

  /**
   * Show the delete messagebox
   */
  const handleShowMessageBox = (id) => {
    setIdToWorkOn(id);
    setShowDeleteInvoiceMessageBox(true);
  };

  /**
   * Close the Delete messagebox
   */
  const handleMessageBoxClose = () => {
    setShowDeleteInvoiceMessageBox(false);
  };

  /**
   * Show messagebox for deletion
   * @param {id of the record to delete} id
   */
  const handleMessageBoxYes = () => {
    deleteInvoice();
    setShowDeleteInvoiceMessageBox(false);
  };

  /**
   * Delete selected record
   * @param {*} id Document id
   */
  const deleteInvoice = () => {
    db.collection("invoices")
      .doc(idToWorkOn)
      .delete()
      .then(() => {
        setIdToWorkOn(0);
        return toast("Faktuur verwijderd!", {
          position: toast.POSITION.TOP_CENTER,
          type: "success",
          autoClose: 3000,
        });
      })
      .catch((err) => {
        setIdToWorkOn(0);
        return toast(err, {
          position: toast.POSITION.TOP_CENTER,
          type: "error",
          autoClose: 10000,
        });
      });
  };

  const handleNewInvoice = () => {
    setInitialValues({
      accountnr: "",
      amount: 0,
      userid: currentUser.uid,
      comments: "",
      structuredmessage: "",
      datereceived: "",
      datetopay: "",
      inputdate: CurrentISODate(),
      payed: false,
      sender: "",
    });
    setIdToWorkOn(0);
    setShowNewInvoiceModal(true);
  };

  /**
   * Mark the invoice as payed when the user clicks on the
   * payment status button
   */
  const handlePayment = (id, payed) => {
    db.collection("invoices")
      .doc(id)
      .update({ payed: payed })
      .then(() => {
        return toast("Faktuur betaling aangepast", {
          position: toast.POSITION.TOP_CENTER,
          type: "success",
          autoClose: 3000,
        });
      })
      .catch((err) => {
        return toast(err, {
          position: toast.POSITION.TOP_CENTER,
          type: "error",
          autoClose: 10000,
        });
      });
  };

  useEffect(() => {
    getInvoices();
    console.log(month, year);
  }, [month, year]);

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <SectionTitle maintitle="Fakturen" subtitle="ingave en overzicht" />
      <Paper className={classes.paper} elevation={6}>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={handleNewInvoice}
          endIcon={<AddBoxOutlinedIcon />}
        >
          Nieuwe faktuur
        </Button>
        {isLoading && (
          <CircularProgress
            size={25}
            variant="indeterminate"
            className={classes.circleSpacer}
          />
        )}
        <YearMonthSelector
          month={month}
          setMonth={setMonth}
          year={year}
          setYear={setYear}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <StyledTableRow hover tabIndex={-1} key={row.id}>
                      <TableCell align="left">{row.sender}</TableCell>
                      <TableCell align="right">{row.datereceived}</TableCell>
                      <TableCell align="right">{row.datetopay}</TableCell>
                      <TableCell align="right">{row.amount}</TableCell>
                      <TableCell align="center">
                        {row.payed ? (
                          <DoneIcon
                            onClick={() => handlePayment(row.id, false)}
                            className={classes.done}
                          />
                        ) : (
                          <NotInterestedIcon
                            onClick={() => handlePayment(row.id, true)}
                            className={classes.notdone}
                          />
                        )}
                        {/* {row.payed ? "Betaald" : "Niet betaald"} */}
                      </TableCell>
                      <TableCell align="right">{row.accountnr}</TableCell>
                      <TableCell align="right">
                        {row.structuredmessage}
                      </TableCell>
                      <TableCell align="left">{row.comments}</TableCell>
                      <TableCell align="center">
                        <Tooltip
                          title="Faktuur aanpassen"
                          placement="bottom"
                          arrow
                        >
                          <IconButton
                            className={classes.actionButtonEdit}
                            size={dense ? "small" : "medium"}
                            onClick={() => handleEdit(row.id)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip
                          title="Faktuur wissen"
                          placement="bottom"
                          arrow
                        >
                          <IconButton
                            className={classes.actionButtonDelete}
                            size={dense ? "small" : "medium"}
                            onClick={() => handleShowMessageBox(row.id)}
                          >
                            <DeleteForeverIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </StyledTableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
      <InvoiceModal
        open={showNewInvoiceModal}
        initialValues={initialValues}
        setOpen={setShowNewInvoiceModal}
        idToWorkOn={idToWorkOn}
      />
      <MessageBox
        open={showDeleteInvoiceMessageBox}
        messageTitle="Faktuur verwijderen?"
        messageSubTitle="Bent u zeker dat deze faktuur weg mag? Deze actie kan niet ongedaan gemaakt worden!"
        handleMessageBoxClose={handleMessageBoxClose}
        handleMessageBoxYes={handleMessageBoxYes}
      />
    </main>
  );
}
