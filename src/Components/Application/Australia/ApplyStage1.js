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
} from "../../../Redux/AppReducer/App.act";
import { status } from "../../../api/api";

const useStyles = makeStyles((theme) => ({
  upgradeButton: {
    marginTop: theme.spacing(3),
  },
}));

const mapStateToProps = ({ AppReducer }) => ({
  //
});
const mapDispatchToProps = (dispatch) => ({
  //
});

function ApplyStage1({
  firstName,
  lastName,

  supportStatus,
  supportAction,
  setSupportStatus,
}) {
  const classes = useStyles();

  //
  //cleanup on unmount
  // React.useEffect(() => {
  //   return function cleanup() {
  //     setSupportStatus(status.not_started);
  //   };
  // }, [setSupportStatus]);

  //
  //
  const onUpgrade = () => {
    const message = `${firstName} ${lastName} is asking to upgrade the account to Production`;
    supportAction(message);
  };

  //
  //
  return (
    <React.Fragment>
      <Grid item className={classes.upgradeButton}>
        <Typography variant="h3" color="primary">
          Australia Application Stage One
          <br />
          <span style={{ fontSize: "5rem" }}>PAGE NOT COMPLETE</span>
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
        <Button variant="contained" color="primary">
          Fill application form
        </Button>
      </Grid>

      {supportStatus !== status.finish && (
        <Grid item className={classes.upgradeButton}>
          <Button
            variant="contained"
            color="primary"
            disabled={supportStatus === status.loading}
            onClick={onUpgrade}
            endIcon={
              supportStatus === status.loading && (
                <CircularProgress size="0.875rem" />
              )
            }
          >
            Upgrade to Production
          </Button>
        </Grid>
      )}

      {/*supportStatus.split(" ")[0] === status.error && (
        <Grid item className={classes.upgradeButton}>
          <Typography variant="body2" color="error">
            There was an error: {supportStatus.split(" ")[1]}. Please try again
          </Typography>
        </Grid>
      )*/}
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplyStage1);
