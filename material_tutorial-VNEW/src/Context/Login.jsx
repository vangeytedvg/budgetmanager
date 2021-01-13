import React, { useState } from "react";
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
import { useAuth } from "../Context/AuthContext";
import { Link, useHistory } from "react-router-dom";
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
  createaccount: {
    color: "yellow",
  },
  circleSpacer: {
    marginLeft: "20px",
  },
  inputs: {
    width: "100%",
    marginBottom: "15px",
  },
}));

export default function Login() {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(email, password);
      history.push("/");
    } catch {
      setError("Failed to log in");
    }
    setLoading(false);
  }

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

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
            <CardHeader title="Login" subheader="voer uw gegevens in" />

            <CardContent>
              {error && (
                <Alert className={classes.alerter} severity="error">
                  Inlog gegevens zijn incorrect!
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

                <CardActions>
                  {/* If the login is running, disable the button */}
                  <Button
                    color="primary"
                    variant="contained"
                    disabled={loading}
                    type="submit"
                  >
                    Log In
                  </Button>
                  <div>
                    Nog geen account?{" "}
                    <Link className={classes.createaccount} to="/signup">
                      Account maken
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
