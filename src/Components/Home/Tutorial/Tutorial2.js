import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import { setSelectedGood } from "../../../Redux/GoodReducer/Good.act";

import GoodForm from "../../Good/GoodForm";

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

function Tutorial2({
  firstName,
  homePageLocations,

  selectedGood,
  setSelectedGood,
}) {
  const exampleGood = React.useMemo(
    () => ({
      ItemName: "My item",
      Description: "My first item",
      LocationId: homePageLocations[0].LocationId, //need to update after API update
      Location: homePageLocations[0],
    }),
    [homePageLocations]
  );

  //
  //
  const openGoodFormDialog = (e, good) => {
    setSelectedGood(good);
  };
  const openNewGoodForm = () => {
    const data = {
      ItemListId: -99,
      LocationId: null,
      ItemName: null,
      Description: null,
      Price: null,
      Tax: null,
      PriceIncludeTax: null,
      QRCode: null,
    };

    const e = null;
    openGoodFormDialog(e, data);
  };

  //
  //
  return (
    <React.Fragment>
      <Grid item>
        <Typography variant="h6">Well done {firstName}.</Typography>
        <br />

        <Typography variant="h6" component="p">
          You have created location <b>{homePageLocations[0]?.LocationName}</b>,
          to which you add items. Each location has one or more items.
        </Typography>
        <br />
      </Grid>

      <Grid item>
        <Button variant="contained" color="primary" onClick={openNewGoodForm}>
          To add items to location "{homePageLocations[0]?.LocationName}" click
          here
        </Button>
      </Grid>

      <Grid item>
        <br />
        <Typography variant="h6" component="p">
          Alternatively, use the menu option "Goods & Items". Select location
          from picklist. View all existing items in the location and create new
          items.
        </Typography>
      </Grid>

      {selectedGood.ItemListId !== -1 && (
        <GoodForm
          exampleGood={exampleGood}
          disableLocations={true}
          hideLocationsSelection={true}
        />
      )}
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Tutorial2);
