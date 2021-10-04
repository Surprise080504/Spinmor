import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import { drawerWidth } from "../Assets/consts";
import { status } from "../api/api";
import {
  setHomePageStatus,
  getHomePageAction,
  getApplicationStageAction,
} from "../Redux/AppReducer/App.act";

import Tutorial1 from "../Components/Home/Tutorial/Tutorial1";
import Tutorial2 from "../Components/Home/Tutorial/Tutorial2";
import Tutorial3 from "../Components/Home/Tutorial/Tutorial3";
import Tutorial4 from "../Components/Home/Tutorial/Tutorial4";
import Tutorial5 from "../Components/Home/Tutorial/Tutorial5";

import ApplicationNotStarted from "../Components/Application/ApplicationNotStarted";
import ApplicationCompletedNoProduction from "../Components/Application/ApplicationCompletedNoProduction";
import UnknownHomeStep from "../Components/Home/UnknownHomeStep";

function getStepContent(homePageStage, applicationStage) {
  if (homePageStage === -1) {
    return (
      <Grid item style={{ paddingTop: 64 }}>
        <CircularProgress color="primary" />
      </Grid>
    );
  } else if (homePageStage === 1) {
    return <Tutorial1 />;
  } else if (homePageStage === 2) {
    return <Tutorial2 />;
  } else if (homePageStage === 3) {
    return <Tutorial3 />;
  } else if (homePageStage === 4) {
    return <Tutorial4 />;
  } else if (homePageStage === 5 && !applicationStage) {
    return <Tutorial5 />;
  } else if (homePageStage === 5 && applicationStage === "not started") {
    return <ApplicationNotStarted />;
  } else if (applicationStage === "completed") {
    return <ApplicationCompletedNoProduction />;
  } else {
    return <UnknownHomeStep />;
  }
}

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
}));

const mapStateToProps = ({ AppReducer, LocationReducer, GoodReducer }) => ({
  isMenuOpen: AppReducer.isMenuOpen,

  prodStatus: AppReducer.prodStatus,
  homePage: AppReducer.homePage,

  applicationStage: AppReducer.applicationStage,

  createLocationStatus: LocationReducer.createLocationStatus,

  createGoodStatus: GoodReducer.createGoodStatus,
});
const mapDispatchToProps = (dispatch) => ({
  setHomePageStatus: bindActionCreators(setHomePageStatus, dispatch),
  getHomePageAction: bindActionCreators(getHomePageAction, dispatch),

  getApplicationStageAction: bindActionCreators(
    getApplicationStageAction,
    dispatch
  ),
});

function Home({
  isMenuOpen,

  prodStatus,
  homePage,
  setHomePageStatus,
  getHomePageAction,

  applicationStage,

  createLocationStatus,
  createGoodStatus,

  getApplicationStageAction,
}) {
  const classes = useStyles();

  //
  //cleanup on unmount
  React.useEffect(() => {
    setHomePageStatus(status.not_started);
  }, [setHomePageStatus]);

  //
  //home page stage & application stage from server on mount
  React.useEffect(() => {
    getHomePageAction({ updateStatus: true });
    getApplicationStageAction({ updateStatus: true });
  }, [getApplicationStageAction, getHomePageAction]);

  //
  //update home page stage from server on mount after each step (except stage 3 which handles it)
  React.useEffect(() => {
    if (
      createLocationStatus === status.finish ||
      createGoodStatus === status.finish
    ) {
      getHomePageAction({ updateStatus: false });
    }
  }, [getHomePageAction, createLocationStatus, createGoodStatus]);

  //
  //
  return (
    <Grid
      container
      className={clsx(
        classes.content,
        isMenuOpen && classes.contentShift,
        classes.scannerContainer
      )}
      direction="column"
      alignItems="flex-start"
    >
      <div className={classes.drawerHeader} />

      {prodStatus !== "Sandbox" && (
        <Grid item>
          <Typography variant="h1">not in sandbox mode</Typography>
        </Grid>
      )}

      <div style={{ marginTop: 16 }} />

      {prodStatus === "Sandbox" &&
        getStepContent(homePage.Stage, applicationStage)}
    </Grid>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
