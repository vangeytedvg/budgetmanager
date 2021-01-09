import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import SectionTitle from "./UI_Utils/SectionTitle";
/* Card imports */
import {
  Grid,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  Button,
  IconButton,
} from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { red } from "@material-ui/core/colors";

/**
 * If not defined, the page will not show correctly
 */
const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  root: {
    maxWidth: 345,
    minWidth: 200,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
  gridContainer: {
    paddingLeft: "60px",
    paddingRight: "40px",
  },
  gridMarginTop: {
    marginTop: "50px",
  },
}));

const Home = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  console.log("ENV", process.env.REACT_APP_APIKEY);

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
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                This impressive paella is a perfect party dish and a fun meal to
                cook together with your guests. Add 1 cup of frozen peas along
                with the mussels, if you like.
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton color="secondary">
                <ArrowForwardIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg="4">
          <Card className={classes.root} raised>
            <CardHeader title="Agenda" subheader="(0) taken" />
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                This impressive paella is a perfect party dish and a fun meal to
                cook together with your guests. Add 1 cup of frozen peas along
                with the mussels, if you like.
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton color="secondary">
                <ArrowForwardIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg="4">
          <Card className={classes.root} raised>
            <CardHeader title="Fakturen" subheader="openstaande facturen" />
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                This impressive paella is a perfect party dish and a fun meal to
                cook together with your guests. Add 1 cup of frozen peas along
                with the mussels, if you like.
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton color="secondary">
                <ArrowForwardIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
