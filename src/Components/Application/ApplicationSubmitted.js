import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import { setIsSupportOpen } from "../../Redux/AppReducer/App.act";
import { status } from "../../api/api";

const useStyles = makeStyles((theme) => ({
  marginTop3: {
    marginTop: theme.spacing(3),
  },
}));

const mapStateToProps = ({ AppReducer }) => ({
  firstName: AppReducer.userInfo.firstName,
});
const mapDispatchToProps = (dispatch) => ({
  setIsSupportOpen: bindActionCreators(setIsSupportOpen, dispatch),
});

function ApplicationSubmitted({
  firstName,

  setIsSupportOpen,
}) {
  const classes = useStyles();

  const openSupport = () => {
    setIsSupportOpen(true);
  };

  //
  //
  return (
    <React.Fragment>
      <Grid item className={classes.marginTop3}>
        <Typography variant="h6" color="primary">
          Thank you {firstName}!
        </Typography>
      </Grid>

      <Grid item className={classes.marginTop3}>
        <Typography variant="h6">
          We are going over your application and will be in touch soon.
          <br />
          In any question, you may use the button below to contact us.
        </Typography>
      </Grid>

      <Grid item className={classes.marginTop3}>
        <Button variant="outlined" color="primary" onClick={openSupport}>
          Contact Us
        </Button>
      </Grid>
    </React.Fragment>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationSubmitted);
