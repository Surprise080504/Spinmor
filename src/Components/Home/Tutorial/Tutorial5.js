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
  setSupportStatus,
  supportAction,
  updateApplicationStageAction,
  setUpdateApplicationStageStatus,
} from "../../../Redux/AppReducer/App.act";
import { status } from "../../../api/api";

const useStyles = makeStyles((theme) => ({
  upgradeButton: {
    marginTop: theme.spacing(3),
  },
}));

const mapStateToProps = ({ AppReducer }) => ({
  firstName: AppReducer.userInfo.firstName,
  lastName: AppReducer.userInfo.lastName,

  supportStatus: AppReducer.supportStatus,

  updateApplicationStageStatus: AppReducer.updateApplicationStageStatus,
});
const mapDispatchToProps = (dispatch) => ({
  setSupportStatus: bindActionCreators(setSupportStatus, dispatch),
  supportAction: bindActionCreators(supportAction, dispatch),

  updateApplicationStageAction: bindActionCreators(
    updateApplicationStageAction,
    dispatch
  ),
  setUpdateApplicationStageStatus: bindActionCreators(
    setUpdateApplicationStageStatus,
    dispatch
  ),
});

function Tutorial5({
  firstName,
  lastName,

  supportStatus,
  supportAction,
  setSupportStatus,

  updateApplicationStageStatus,
  updateApplicationStageAction,
  setUpdateApplicationStageStatus,
}) {
  const classes = useStyles();

  //
  //cleanup on unmount
  React.useEffect(() => {
    return function cleanup() {
      setSupportStatus(status.not_started);
      setUpdateApplicationStageStatus(status.not_started);
    };
  }, [setSupportStatus, setUpdateApplicationStageStatus]);

  //
  //
  const onUpgrade = () => {
    const message = `${firstName} ${lastName} is asking to upgrade the account to Production`;
    supportAction(message);
  };

  //
  //
  React.useEffect(() => {
    if (supportStatus === status.finish) {
      updateApplicationStageAction("not started");
    }
  }, [supportStatus, updateApplicationStageAction]);

  //
  //
  return (
    <React.Fragment>
      <Grid item>
        <Typography variant="h6">{firstName};</Typography>
        <br />

        <Typography variant="h6" component="p">
          You are now familiar with Spinmor Application.
          <br />
          Take your time to practice Spinmor further more.
          <br />
          Once you are ready to activate your operation (Production status)
          click below button.
        </Typography>
      </Grid>

      {supportStatus !== status.finish && (
        <Grid item className={classes.upgradeButton}>
          <Button
            variant="contained"
            color="primary"
            disabled={
              supportStatus === status.loading ||
              updateApplicationStageStatus === status.loading
            }
            onClick={onUpgrade}
            endIcon={
              (supportStatus === status.loading ||
                updateApplicationStageStatus === status.loading) && (
                <CircularProgress size="0.875rem" />
              )
            }
          >
            Upgrade to Production
          </Button>
        </Grid>
      )}

      {supportStatus.split(" ")[0] === status.error && (
        <Grid item className={classes.upgradeButton}>
          <Typography variant="body2" color="error">
            There was an error: {supportStatus.split(" ")[1]}. Please try again
          </Typography>
        </Grid>
      )}

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

export default connect(mapStateToProps, mapDispatchToProps)(Tutorial5);
