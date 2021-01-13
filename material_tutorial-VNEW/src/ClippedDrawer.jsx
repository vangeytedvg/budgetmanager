import React, { useState } from "react";
import { withRouter, useHistory } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccountBalanceWalletTwoToneIcon from "@material-ui/icons/AccountBalanceWalletTwoTone";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import ViewListTwoToneIcon from "@material-ui/icons/ViewListTwoTone";
import ListAltTwoToneIcon from "@material-ui/icons/ListAltTwoTone";
import DescriptionTwoToneIcon from "@material-ui/icons/DescriptionTwoTone";
import EuroIcon from "@material-ui/icons/Euro";
import DateRangeTwoToneIcon from "@material-ui/icons/DateRangeTwoTone";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ReceiptIcon from "@material-ui/icons/Receipt";
import MenuIcon from "@material-ui/icons/Menu";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { useAuth } from "./Context/AuthContext";
import denkatech from "./images/denkatech.png";
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.easeIn,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: "#12412d",
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: "#12412d",
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    // Change background when drawer is open
    backgroundColor: "#12412d",
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    // Change background color when closed
    backgroundColor: "#12602d",
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
    // This centers the icons when the drawer is closed
    paddingLeft: theme.spacing(1),
  },
  toolbar: {
    display: "flex",
    backgroundColor: "#1d5f43",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
  },
  logo: {
    width: "170px",
    height: "50px",
  },
  currentUser: {
    marginRight: "15px",
    color: "#00ff55",
    textShadow: "0px 0px 16px #fff",
  },
}));

const ClippedDrawer = (props) => {
  // Drawer open by default
  const [open, setOpen] = React.useState(true);
  const theme = useTheme();
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Destructure history from props (react-router-dom)
  const classes = useStyles();

  /**
   * Check logged in user
   */
  const getCurrentUser = () => {
    if (currentUser != null) {
      return currentUser.email;
    } else {
      return "Not logged in";
    }
  };

  /**
   * Disable the buttons if no user is logged in
   */
  const disbledButtons = () => {
    if (currentUser) {
      return false;
    } else {
      return true;
    }
  };

  /**
   * When the user logs out, we go back to the login page
   */
  async function handleLogout() {
    try {
      await logout();
      history.push("/login");
    } catch {}
  }

  const menuOptions = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      linkto: () => history.push("/"),
    },
    {
      text: "Rekeningen",
      icon: <EuroIcon />,
      linkto: () => history.push("/accounts"),
    },
    {
      text: "Uitgaven",
      icon: <AccountBalanceWalletTwoToneIcon />,
      linkto: () => history.push("/expenses"),
    },
    {
      text: "Overzicht uitgaven",
      icon: <ListAltTwoToneIcon />,
      linkto: () => history.push("/expenseoverview"),
    },
    {
      text: "Inkomsten",
      icon: <AccountBalanceIcon />,
      linkto: () => history.push("/income"),
    },
    {
      text: "Overzicht inkomsten",
      icon: <ViewListTwoToneIcon />,
      linkto: () => history.push("/incomeoverview"),
    },
    {
      text: "Facturen",
      icon: <DescriptionTwoToneIcon />,
      linkto: () => history.push("/invoices"),
    },
    {
      text: "Overzicht Facturen",
      icon: <ReceiptIcon />,
      linkto: () => history.push("/invoicesoverview"),
    },
    {
      text: "Betaalplannen",
      icon: <BusinessCenterIcon />,
      linkto: () => history.push("/payplan"),
    },
    {
      text: "Agenda",
      icon: <DateRangeTwoToneIcon />,
      linkto: () => history.push("/agenda"),
    },
  ];

  return (
    <div className={classes.root}>
      <CssBaseline />
      {/* The upper part of the screen */}
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            Persoonlijk Budget Beheer
          </Typography>
          {currentUser && (
            <>
              <div className={classes.currentUser}>{getCurrentUser()}</div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* The actual drawer */}
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <div>
            <img className={classes.logo} src={denkatech} alt="logo" />
          </div>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <div className={classes.drawerContainer}>
          <List>
            {menuOptions.map((item, index) => {
              // Need to destructure here, otherwise react complains
              // that objects can not be a child of ....
              const { text, icon, linkto } = item;
              return (
                <ListItem
                  // If no user logged in, no actions possible
                  disabled={disbledButtons()}
                  button
                  onClick={linkto}
                  key={text}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              );
            })}
          </List>
          <Divider />
        </div>
      </Drawer>
    </div>
  );
};

// Need to use this to be able to use routing
export default withRouter(ClippedDrawer);
