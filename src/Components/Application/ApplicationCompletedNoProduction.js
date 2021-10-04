import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import { setSelectedGood } from "../../Redux/GoodReducer/Good.act";

import GoodForm from "../Good/GoodForm";

const useStyles = makeStyles((theme) => ({
  //
}));

const mapStateToProps = ({ AppReducer, GoodReducer }) => ({
  firstName: AppReducer.userInfo.firstName,
  homePageLocations: AppReducer.homePage.Locations ?? [],

  selectedGood: GoodReducer.selectedGood,
});
const mapDispatchToProps = (dispatch) => ({
  setSelectedGood: bindActionCreators(setSelectedGood, dispatch),
});

function ApplicationCompletedNoProduction({
  firstName,
  homePageLocations,

  selectedGood,
  setSelectedGood,
}) {
  //
  //
  return (
    <React.Fragment>
      <Grid item>
        <Typography variant="h6">you completed the application</Typography>
        <br />

        <Typography variant="h6" component="p">
          If you see this screen, please ask us to upgrade you to production
          mode!
        </Typography>
        <br />
      </Grid>
    </React.Fragment>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationCompletedNoProduction);
