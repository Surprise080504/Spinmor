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
    minHeight: "100vh",
  },
}));

const mapStateToProps = ({ AppReducer }) => ({
  registerStatus: AppReducer.registerStatus,
});
const mapDispatchToProps = (dispatch) => ({
  // registerAction: bindActionCreators(registerAction, dispatch),
});

function Register({ registerStatus }) {
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
          Registration completed successfully
        </Typography>
      </Grid>

      <Grid item>
        <Typography variant="body1" align="center">
          We have sent an email with a confirmation link to your email address.
          Please allow 5-10 minutes for this message to arrive.
        </Typography>
      </Grid>

      <Button
        size="large"
        color="primary"
        variant="contained"
        component={Link}
        to="/login"
      >
        Log In
      </Button>
    </Grid>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
