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

function Stage5({
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
        <Typography variant="h6">Well done {firstName}.</Typography>
        <br />

        <Typography variant="h6" component="p">
          This is stage 5
        </Typography>
        <br />
      </Grid>
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Stage5);
