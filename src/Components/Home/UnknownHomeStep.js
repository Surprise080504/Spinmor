import React from "react";
// import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { status } from "../../api/api";

const useStyles = makeStyles((theme) => ({
  main: {
    padding: theme.spacing(3),
  },
}));

const mapStateToProps = ({ AppReducer }) => ({
  homePageStatus: AppReducer.homePageStatus,
  getApplicationStageStatus: AppReducer.getApplicationStageStatus,
});
const mapDispatchToProps = (dispatch) => ({
  // tokenAction: bindActionCreators(tokenAction, dispatch),
});

function UnknownHomeStep({ homePageStatus, getApplicationStageStatus }) {
  const classes = useStyles();

  return (
    <Grid item className={classes.main}>
      <Typography variant="h3">
        We have encountered some problems,
        <br />
        please refresh the page.
      </Typography>

      {homePageStatus.split(" ")[0] === status.error && (
        <Typography variant="body1" color="error">
          <br />
          error code: {homePageStatus.split(" ")[1]}
        </Typography>
      )}

      {getApplicationStageStatus.split(" ")[0] === status.error && (
        <Typography variant="body1" color="error">
          <br />
          error code: {getApplicationStageStatus.split(" ")[1]}
        </Typography>
      )}
    </Grid>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(UnknownHomeStep);
