import React from "react";
import { useHistory } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import { drawerWidth } from "../Assets/consts";
import { status } from "../api/api";
import { getLocationsAction, setGetLocationsStatus } from "../Redux/LocationReducer/Location.act";

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    // padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  drawerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    // justifyContent: 'flex-end',
  },

  rewardsContainer: {
    paddingTop: theme.spacing(3),
    marginBottom: 0,
  }
}));

const mapStateToProps = ({ AppReducer, LocationReducer }) => ({
  isMenuOpen: AppReducer.isMenuOpen,
  locations: LocationReducer.locations,
  getLocationsStatus: LocationReducer.getLocationsStatus
});
const mapDispatchToProps = (dispatch) => ({
  getLocationsAction: bindActionCreators(getLocationsAction, dispatch),
  setGetLocationsStatus: bindActionCreators(setGetLocationsStatus, dispatch)
});

function Rewards({
  isMenuOpen,
  locations,
  getLocationsStatus,
  getLocationsAction,
  setGetLocationsStatus
}) {
  const classes = useStyles();
  const history = useHistory();
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    setGetLocationsStatus(status.not_started);
  }, [])

  React.useEffect(() => {
    if (getLocationsStatus === status.not_started) getLocationsAction();
    if (getLocationsStatus === status.finish) {
      let count = 0;
      locations.forEach(location => {
        if (location.LocationType === "coffeeshop") count++;
      });
      if (count > 0) setMessage("Coffee shop can offer customers rewards program: Buy x coffee get 1 free. Spinmor manages the number of cups the client purchase. You will define which items are considered as cup of coffee. You can also offer rewards for people purchasing sandwiches, and group all items that are of the type sandwich. When clients reach the reward, we credit their order by the price of the least expensive item, unless there is only one item in that order.");
      else setMessage("You do not have any location of the type Coffee Shop")
    }
  }, [getLocationsStatus])

  return (
    <Grid
      container
      className={clsx(
        classes.content,
        isMenuOpen && classes.contentShift,
        classes.rewardsContainer
      )}
      direction="column"
      alignItems="flex-start"
      spacing={3}
    >
      <div className={classes.drawerHeader} />

      <Grid item>
        <Typography variant="h2" component="h1">
          Rewards & Additions
        </Typography>
      </Grid>

      <Grid item>
        <Typography variant="body1">
          {message}
        </Typography>
      </Grid>

      <Grid item>
        <Button
          variant="contained"
          color="primary"
          disabled={getLocationsStatus === status.loading ? true : false}
          onClick={() => history.push("/goods/rewards-additions/rewards")}
          endIcon={
            getLocationsStatus === status.loading && (
              <CircularProgress size="0.875rem" />
            )
          }
        >
          Manage Reward Programs
        </Button>
      </Grid>

      <Grid item>
        <Typography variant="body1">
          Additions are descriptive items, with zero value, of how the client wants his coffee be served.
          Common Additions are Takeaway, Add sugar, Soy milk (for coffee) and Heat up, No Mayo for sandwiches.
        </Typography>
      </Grid>

      <Grid item>
        <Button
          variant="contained"
          color="primary"
          disabled={getLocationsStatus === status.loading ? true : false}
          endIcon={
            getLocationsStatus === status.loading && (
              <CircularProgress size="0.875rem" />
            )
          }
        >
          Manage Additions
        </Button>
      </Grid>

    </Grid>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Rewards);
