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
import { CurrentISODate, getQueryDateObject } from "../../../utils";
import { useAuth } from "../../../Context/AuthContext";
import { db } from "../../../database/firebase";
import SectionTitle from "../../UI_Utils/SectionTitle";
import { getComparator } from "../../UI_Utils/SortingHelpers";
import MessageBox from "../../UI_Utils/MessageBox";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ExpensesModal from "./ExpensesModal";
import YearMonthSelector from "../../UI_Utils/YearMonthSelector";

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
  { id: "owner", numeric: false, disablePadding: false, label: "Door" },
  { id: "amount", numeric: false, disablePadding: false, label: "Bedrag (€)" },
  { id: "date_created", numeric: false, disablePadding: false, label: "Datum" },
  { id: "location", numeric: false, disablePadding: false, label: "Locatie" },
  {
    id: "comments",
    numeric: false,
    disablePadding: false,
    label: "Commentaar",
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

export default function ListExpenses() {
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
    owner: "",
    ownerId: "",
    date_created: "",
    location: "",
    comments: "",
    amount: 0,
    date_expense: "",
    accountid: "",
    userid: 0, // currentUser.uid,
  });

  const [showNewExpenseModal, setShowNewExpenseModal] = useState(false);
  const [
    showDeleteExpenseMessageBox,
    setShowDeleteExpenseMessageBox,
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
  const getExpenses = async () => {
    setIsLoading(true);
    console.log("In getExpenses", month);
    /**
     * This is a rather BIG hack, because the firebase engine does
     * not support a wildcard query...
     */
    if (month === 0) {
      // Month 0 (*) the month where clause is removed here
      db.collection("expenses")
        .orderBy("date_created", "desc")
        .where("userid", "==", currentUser.uid)
        .where("year", "==", year)
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
      console.log(month, year);
      db.collection("expenses")
        .orderBy("date_created", "desc")
        .where("userid", "==", currentUser.uid)
        .where("month", "==", month)
        .where("year", "==", year)
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
    // Get the current expense from the existing array
    // thus avoiding a roundtrip to firebase
    let currentExpense = rows.filter((row) => row.id === id);
    setInitialValues({
      owner: currentExpense[0].owner.owner,
      ownerId: currentExpense[0].owner.userid,
      accountid: currentExpense[0].owner.id,
      date_created: currentExpense[0].date_created,
      date_expense: currentExpense[0].date_expense,
      location: currentExpense[0].location,
      comments: currentExpense[0].comments,
      amount: currentExpense[0].amount,
      userid: currentUser.uid,
    });
    console.log(initialValues);
    setIdToWorkOn(id);
    setShowNewExpenseModal(true);
  };

  /**
   * Show the delete messagebox
   */
  const handleShowMessageBox = (id) => {
    setIdToWorkOn(id);
    setShowDeleteExpenseMessageBox(true);
  };

  /**
   * Close the Delete messagebox
   */
  const handleMessageBoxClose = () => {
    setShowDeleteExpenseMessageBox(false);
  };

  /**
   * Show messagebox for deletion
   * @param {id of the record to delete} id
   */
  const handleMessageBoxYes = () => {
    deleteExpense();
    setShowDeleteExpenseMessageBox(false);
  };

  /**
   * Get the expense doc to be edited
   * @param {*} id
   */
  async function onAskToEdit(id) {
    // Fetch the record with the expense id
    const snapshot = await db.collection("expenses").doc(id).get();
    const data = snapshot.data();
    return data;
  }

  /**
   * Update the account and set the amount plus the recovery of the expense
   * @param {*} id
   * @param {*} amount
   */
  async function onUpdateAccount(id, amount) {
    const snapshot = await db.collection("accounts").doc(id).get();
    let oldAmount = snapshot.data();
    // console.log(oldAmount);
    // console.log("OLD AMOUNT", oldAmount.balance);
    let newAmount = oldAmount.balance + amount;
    // console.log(newAmount)
    db.collection("accounts")
      .doc(id)
      .update("balance", newAmount)
      .catch((err) => {
        return toast("Error during update balance", {
          position: toast.POSITION.TOP_CENTER,
          type: "error",
          autoClose: 5000,
        });
      });
  }

  /**
   * Delete selected record
   * @param {*} id Document id
   */
  const deleteExpense = () => {
    // Delete the expense
    // First get the account
    const originalExpense = onAskToEdit(idToWorkOn).then((t) => {
      let accountId = t.owner.id;
      let expenseAmount = t.amount;
      // console.log("Account id", accountId, "Amount", expenseAmount);
      const updateAccount = onUpdateAccount(accountId, expenseAmount).then(
        () => {
          // Finally delete the expense doc
          db.collection("expenses")
            .doc(idToWorkOn)
            .delete()
            .then(() => {
              return toast("Record deleted, balance reset", {
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
        }
      );
    });
  };

  const handleNewExpense = () => {
    setInitialValues({
      owner: "",
      ownerId: "",
      accountId: "",
      date_created: CurrentISODate(),
      date_expense: "",
      location: "",
      comments: "",
      amount: 0,
      userid: currentUser.uid,
    });
    setIdToWorkOn(0);
    setShowNewExpenseModal(true);
  };

  useEffect(() => {
    getExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <SectionTitle maintitle="Uitgaven" subtitle="beheer" />
      <Paper className={classes.paper} elevation={6}>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={handleNewExpense}
          endIcon={<AddBoxOutlinedIcon />}
        >
          Nieuwe uitgave
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
                      <TableCell align="left">{row.owner.owner}</TableCell>
                      <TableCell align="right">{row.amount}</TableCell>
                      <TableCell align="right">{row.date_created}</TableCell>
                      <TableCell align="left">{row.location}</TableCell>
                      <TableCell align="left">{row.comments}</TableCell>

                      <TableCell align="center">
                        <Tooltip
                          title="Uitgave aanpassen"
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
                        <Tooltip title="Uigave wissen" placement="bottom" arrow>
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
      <ExpensesModal
        open={showNewExpenseModal}
        initialValues={initialValues}
        setOpen={setShowNewExpenseModal}
        idToWorkOn={idToWorkOn}
      />
      <MessageBox
        open={showDeleteExpenseMessageBox}
        messageTitle="Uitgave verwijderen?"
        messageSubTitle="Bent u zeker dat deze uitgave weg mag? Deze actie kan niet ongedaan gemaakt worden!.  De balans wordt gecorrigeerd."
        handleMessageBoxClose={handleMessageBoxClose}
        handleMessageBoxYes={handleMessageBoxYes}
      />
    </main>
  );
}
