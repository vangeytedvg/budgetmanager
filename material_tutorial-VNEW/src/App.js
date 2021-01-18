/**
 * Totaly rewritten Budget Application
 * SOD : 19/12/2020
 */
import React from "react";
import "./styles.css";
import { Route, Switch } from "react-router-dom";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import ClippedDrawer from "./ClippedDrawer";
import Home from "./components/Home";
import About from "./components/About";
import { makeStyles } from "@material-ui/core/styles";
import Contact from "./components/Contact";
import Income from "./components/Budget/Income/Income";
import Expenses from "./components/Budget/Expenses/Expenses";
import IncomeOverview from "./components/Budget/Income/IncomeOverview";
import ExpensesOverview from "./components/Budget/Expenses/ExpensesOverview";
import Invoices from "./components/Budget/Invoices/Invoices";
import InvoicesOverview from "./components/Budget/Invoices/InvoicesOverview";
import PaymentPlans from "./components/Budget/PaymentPlans/PaymentPlans";
import Agenda from "./components/Agenda/Agenda";
import Accounts from "./components/Budget/Accounts/Accounts";
import { colors } from "@material-ui/core";
import Login from "./Context/Login";
import Signup from "./Context/Signup";
import ForgotPassword from "./Context/ForgotPassword";
import UpdateProfile from "./Context/UpdateProfile";
import { AuthProvider } from "./Context/AuthContext";
import PrivateRoute from "./Context/PrivateRoute";
import ListAccounts from "./components/Budget/Accounts/ListAccounts";
import ListInvoices from "./components/Budget/Invoices/ListInvoices";

const useStyles = makeStyles({
  container: {
    display: "flex",
  },
});

function App() {
  // Start the app in dark mode, and define a global theme for
  // the app

  const theme = createMuiTheme({
    palette: {
      primary: {
        contrastText: colors.grey[100],
        dark: colors.green[300],
        main: colors.green[500],
        light: colors.indigo[100],
      },
      secondary: {
        contrastText: colors.grey[100],
        dark: colors.blue[300],
        main: colors.blue[500],
        light: colors.blue[100],
      },
      type: "dark",
    },
  });

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <ClippedDrawer />
          <Switch>
            <PrivateRoute exact path="/" component={Home} />
            <PrivateRoute path="/accounts" component={ListAccounts} />
            <PrivateRoute path="/expenses" component={Expenses} />
            <PrivateRoute path="/income" component={Income} />
            <PrivateRoute path="/incomeoverview" component={IncomeOverview} />
            <PrivateRoute
              path="/expenseoverview"
              component={ExpensesOverview}
            />
            <PrivateRoute path="/invoices" component={Invoices} />
            <PrivateRoute path="/invoicesoverview" component={ListInvoices} />
            <PrivateRoute path="/payplan" component={PaymentPlans} />

            <Route from="/login" render={(props) => <Login {...props} />} />
            <Route from="/signup" render={(props) => <Signup {...props} />} />
            <Route from="/contact" render={(props) => <Contact {...props} />} />
          </Switch>
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
