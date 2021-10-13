import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import { setSelectedLocation } from "../../../Redux/LocationReducer/Location.act";

import LocationForm from "../../Location/LocationForm";

const useStyles = makeStyles((theme) => ({
  smartStyle: {
    fontSize: "2.5rem",
    fontFamily: "Brush Script MT",
  },
}));

const mapStateToProps = ({ AppReducer, LocationReducer }) => ({
  firstName: AppReducer.userInfo.firstName,

  selectedLocation: LocationReducer.selectedLocation,
});
const mapDispatchToProps = (dispatch) => ({
  setSelectedLocation: bindActionCreators(setSelectedLocation, dispatch),
});

function Tutorial1({ firstName, selectedLocation, setSelectedLocation }) {
  const classes = useStyles();

  //
  //
  const openLocationFormDialog = (e, location) => {
    setSelectedLocation(location);
  };
  const openNewLocationForm = () => {
    const data = {
      LocationId: -99,
      LocationName: null,
      StreetAddress1: null,
      StreetAddress2: null,
      Country: null,
      Suburb: null,
      State: null,
      Description: null,
      ByeBye: null,
      CurrencySymbol: null,
    };

    const e = null;
    openLocationFormDialog(e, data);
  };

  //
  //
  return (
    <React.Fragment>
      <Grid item>
        <Typography variant="h6">Hi {firstName},</Typography>
        <br />

        <Typography variant="h6">
          Let our{" "}
          <span className={classes.smartStyle}>Smart Guide</span>{" "}
          introduce you to Spinmor.
        </Typography>
        <br />

        <Typography variant="h6" component="p">
          Operator is the entity (a person or company) who sells Goods & Items
          in Locations. An operator can have one or more locations, like an
          Airbnb host that offers more than one home for booking.
        </Typography>
        <br />

        {/*<Typography variant="h6">Hi {firstName},</Typography>
        <br />

        <Typography variant="h6" component="p">
          Thank you for evaluating Spinmor as an Operator. This homepage takes
          you step by step, and introduces you to Spinmor functionality, in
          Sandbox environment. You will create items, print QR Codes, use
          Spinmor to scan the items, virtually pay for them, and understand
          Spinmor’s functionality flow.
        </Typography>
        <br />

        <Typography variant="h6" component="p">
          We will guide you on how to use the Operator module and the Client
          module.
        </Typography>
        <br />

        <Typography variant="h6" component="p">
          Once you are familiar with the software you can then promote your
          Operator business to “Live” environment, and start making money.
        </Typography>
        <br />

        <Typography variant="h6" component="p">
          At any stage you can submit any query in the Ask Me window. We will
          endeavour to respond ASAP to your Email address.
        </Typography>
        <br />

        <Typography variant="h6" component="p">
          Operator is the entity (a person or company) that sells Goods & Items
          in Locations. An operator can have one or more locations, like an
          Airbnb host that offers more than one home for booking.
        </Typography>
        <br />*/}
      </Grid>

      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={openNewLocationForm}
        >
          Click here to create new location
        </Button>
      </Grid>

      <Grid item>
        <br />
        <Typography variant="h6" component="p">
          Alternatively, use the menu option "Locations" to view existing
          locations, and to create new location.
        </Typography>
      </Grid>

      <Grid item>
        <br />

        <Typography variant="h6" component="p">
          <Checkbox
            color="primary"
            inputProps={{ 'aria-label': 'primary checkbox' }}
            style={{ marginBottom: 3 }}
          />
          Don't show <span className={classes.smartStyle}>Smart Guide</span>{" "} any more
        </Typography>
      </Grid>

      {selectedLocation.LocationId !== -1 && <LocationForm />}
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Tutorial1);
