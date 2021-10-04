import React from "react";

// import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
  },
}));

const mapStateToProps = ({ AppReducer }) => ({
  registerStatus: AppReducer.registerStatus,
});
const mapDispatchToProps = (dispatch) => ({
  // registerAction: bindActionCreators(registerAction, dispatch),
});

function PresentationSuccess({ registerStatus }) {
  const classes = useStyles();

  return (
    <Grid
      container
      justify="space-evenly"
      alignItems="center"
      alignContent="center"
      className={classes.root}
      direction="column"
    >
      <Grid item className={classes.title}>
        <Typography variant="h4" component="h1" align="center">
          Thank you for registering. We will contact you shortly
        </Typography>
      </Grid>
    </Grid>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PresentationSuccess);
