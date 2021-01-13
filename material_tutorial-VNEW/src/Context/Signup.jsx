// import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { useAuth } from "./AuthContext";
import { Link, useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  Card,
  Grid,
  CardHeader,
  CardContent,
  Button,
  TextField,
  CardActions,
  Container,
  makeStyles,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Alert, AlertTitle } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 400,
    minWidth: 200,
    justifyContent: "center",
    alignContent: "center",
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  gridContainer: {
    justifyContent: "center",
    alignContent: "center",
    paddingLeft: "60px",
    paddingRight: "40px",
  },
  gridMarginTop: {
    marginTop: "150px",
  },
  alerter: {
    marginBottom: "15px",
  },
  circleSpacer: {
    marginLeft: "20px",
  },
  inputs: {
    width: "100%",
    marginBottom: "15px",
  },
  createaccount: {
    color: "yellow",
  },
}));

export default function Signup() {
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { login } = useAuth();
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleChangePassword2 = (e) => {
    setPassword2(e.target.value);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    let pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );

    // Validate email format
    if (email === "") {
      return setError("Email verplicht");
    }

    if (!pattern.test(email)) {
      return setError("Ongeldig Email adres");
    }

    // Password checkup

    if (password.length < 6 && password2.length < 6) {
      return setError("Paswoord moet minstens ze tekens lang zijn!");
    }

    if (password !== password2) {
      return setError("Paswoorden komen niet overeen");
    }

    try {
      setError("");
      setLoading(true);
      await signup(email, password);
      history.push("/");
    } catch {
      setError("Kon account niet aanmaken.  Kijk ingevoerde gegevens na!");
    }
    setLoading(false);
  }

  return (
    <Container>
      <Grid
        container
        spacing={4}
        // This syntax allows multiple css classes
        className={`${classes.gridContainer} ${classes.gridMarginTop}`}
      >
        <Grid item xs={12} md={12} lg={12}>
          <Card className={classes.root} raised>
            <CardHeader
              title="Nieuw account maken"
              subheader="voer uw login gegevens in"
            />
            <CardContent>
              {error && (
                <Alert className={classes.alerter} severity="error">
                  {error}
                </Alert>
              )}
              <form onSubmit={handleSubmit}>
                <TextField
                  className={classes.inputs}
                  id="email"
                  name="email"
                  label="Email"
                  helperText="Voer een geldige email in"
                  onChange={handleChangeEmail}
                  value={email}
                  variant="outlined"
                />
                <TextField
                  className={classes.inputs}
                  id="password"
                  name="password"
                  label="Paswoord"
                  type="password"
                  helperText="Password voor uw account"
                  onChange={handleChangePassword}
                  value={password}
                  variant="outlined"
                />
                <TextField
                  className={classes.inputs}
                  id="password2"
                  name="password2"
                  label="Paswoord herhalen"
                  type="password"
                  helperText="Bevestig uw paswoord"
                  onChange={handleChangePassword2}
                  value={password2}
                  variant="outlined"
                />
                <CardActions>
                  {/* If the login is running, disable the button */}
                  <Button
                    color="primary"
                    variant="contained"
                    disabled={loading}
                    type="submit"
                  >
                    Maak account
                  </Button>
                  <div>
                    Wel al een account?{" "}
                    <Link className={classes.createaccount} to="/login">
                      Inloggen
                    </Link>
                  </div>
                </CardActions>
              </form>
            </CardContent>
          </Card>
        </Grid>
        {/* Show a spinner while authorization runs */}
        {loading && <CircularProgress className={classes.circleSpacer} />}
      </Grid>
    </Container>
  );
}
