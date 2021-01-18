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

import { useAuth } from "../../../Context/AuthContext";
import { db } from "../../../database/firebase";
import SectionTitle from "../../UI_Utils/SectionTitle";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

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
  //   {
  //     id: "id",
  //     numeric: false,
  //     disablePadding: true,
  //     label: "Id",
  //   },
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
  { id: "amount", numeric: true, disablePadding: false, label: "Bedrag" },
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
    label: "Gestructureerde mededeling",
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

export default function EnhancedTable() {
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

  const handleEdit = (id) => {
    setSelected(id);
    let currentInvoice = rows.filter((row) => row.id === id);
    console.log(currentInvoice);
    alert(id);
  };

  useEffect(() => {
    getInvoices();
    // Avoid eslint error:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNewInvoice = () => {
    return false;
  };

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <SectionTitle maintitle="Fakturen" subtitle="ingave en overzicht" />
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        onClick={handleNewInvoice}
        endIcon={<AddBoxOutlinedIcon />}
      >
        Nieuwe faktuur
      </Button>
      <Paper className={classes.paper} elevation={6}>
        <TableContainer>
          {isLoading && <CircularProgress className={classes.circleSpacer} />}
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
                      <TableCell align="left">
                        {row.payed ? "Betaald" : "Niet betaald"}
                      </TableCell>
                      <TableCell align="right">{row.accountnr}</TableCell>
                      <TableCell align="right">
                        {row.stucturedmessage}
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
                            onClick={() => handleEdit(row.id)}
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
    </main>
  );
}
