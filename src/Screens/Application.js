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
  setGetApplicationStageStatus,
  getApplicationStageAction,
} from "../Redux/AppReducer/App.act";

import ApplicationNotStarted from "../Components/Application/ApplicationNotStarted";
import ApplicationSubmitted from "../Components/Application/ApplicationSubmitted";
import UnknownHomeStep from "../Components/Home/UnknownHomeStep";

import ApplyStage1 from "../Components/Application/Australia/ApplyStage1";

function getStepContent(applicationStage) {
  if (applicationStage === "user") {
    return <ApplyStage1 />;
  } else if (applicationStage === "business") {
    return <ApplicationNotStarted />;
  } else if (applicationStage === "attachments") {
    return <ApplicationNotStarted />;
  } else if (applicationStage === "submitted") {
    return <ApplicationSubmitted />;
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

  applicationStage: AppReducer.applicationStage,
});
const mapDispatchToProps = (dispatch) => ({
  getApplicationStageAction: bindActionCreators(
    getApplicationStageAction,
    dispatch
  ),
  setGetApplicationStageStatus: bindActionCreators(
    setGetApplicationStageStatus,
    dispatch
  ),
});

function Application({
  isMenuOpen,

  prodStatus,

  applicationStage,

  getApplicationStageAction,
  setGetApplicationStageStatus,
}) {
  const classes = useStyles();

  //
  //cleanup on unmount
  React.useEffect(() => {
    setGetApplicationStageStatus(status.not_started);
  }, [setGetApplicationStageStatus]);

  //
  //application stage from server on mount
  React.useEffect(() => {
    getApplicationStageAction({ updateStatus: true });
  }, [getApplicationStageAction]);

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
      {console.log("Application.js")}
      <div className={classes.drawerHeader} />

      {prodStatus !== "Sandbox" && (
        <Grid item>
          <Typography variant="h1">
            not in sandbox mode. you should not see this!
          </Typography>
        </Grid>
      )}

      <div style={{ marginTop: 16 }} />

      {prodStatus === "Sandbox" && getStepContent(applicationStage)}
    </Grid>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Application);
