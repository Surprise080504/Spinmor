import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import {
  updateApplicationStageAction,
  setUpdateApplicationStageStatus,
} from "../../Redux/AppReducer/App.act";
import { status } from "../../api/api";

const useStyles = makeStyles((theme) => ({
  upgradeButton: {
    marginTop: theme.spacing(3),
  },
}));

const mapStateToProps = ({ AppReducer }) => ({
  firstName: AppReducer.userInfo.firstName,

  updateApplicationStageStatus: AppReducer.updateApplicationStageStatus,
});
const mapDispatchToProps = (dispatch) => ({
  updateApplicationStageAction: bindActionCreators(
    updateApplicationStageAction,
    dispatch
  ),
  setUpdateApplicationStageStatus: bindActionCreators(
    setUpdateApplicationStageStatus,
    dispatch
  ),
});

function ApplicationNotStarted({
  firstName,

  updateApplicationStageAction,
  setUpdateApplicationStageStatus,
  updateApplicationStageStatus,
}) {
  const classes = useStyles();

  //
  //cleanup on unmount
  React.useEffect(() => {
    return function cleanup() {
      setUpdateApplicationStageStatus(status.not_started);
    };
  }, [setUpdateApplicationStageStatus]);

  //
  //
  const onStartApplication = () => {
    updateApplicationStageAction("user");
  };

  //
  //
  return (
    <React.Fragment>
      <Grid item className={classes.upgradeButton}>
        <Typography variant="h6" color="primary">
          Thank you {firstName},
        </Typography>
      </Grid>

      <Grid item className={classes.upgradeButton}>
        <Typography variant="h6">
          One of our sales person will contact you in the next 48 hours.
          <br />
          You can save time by starting the application form.
        </Typography>
      </Grid>

      <Grid item className={classes.upgradeButton}>
        <Button
          variant="contained"
          color="primary"
          disabled={updateApplicationStageStatus === status.loading}
          onClick={onStartApplication}
          endIcon={
            updateApplicationStageStatus === status.loading && (
              <CircularProgress size="0.875rem" />
            )
          }
        >
          Start application form
        </Button>
      </Grid>

      {updateApplicationStageStatus.split(" ")[0] === status.error && (
        <Grid item className={classes.upgradeButton}>
          <Typography variant="body2" color="error">
            There was an error: {updateApplicationStageStatus.split(" ")[1]}.
            Please try again
          </Typography>
        </Grid>
      )}
    </React.Fragment>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationNotStarted);
