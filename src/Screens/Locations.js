import React from "react";
// import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import { drawerWidth } from "../Assets/consts";
import LocationsTable from "../Components/Location/LocationsTable";
import LocationForm from "../Components/Location/LocationForm";

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    // padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  drawerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    // justifyContent: 'flex-end',
  },

  locationsContainer: {
    paddingTop: theme.spacing(3),
    marginBottom: 0,
  },
}));

const mapStateToProps = ({ AppReducer, LocationReducer }) => ({
  isMenuOpen: AppReducer.isMenuOpen,

  selectedLocation: LocationReducer.selectedLocation,
});
const mapDispatchToProps = (dispatch) => ({
});

function Locations({ isMenuOpen, selectedLocation }) {
  const classes = useStyles();

  return (
    <Grid
      container
      className={clsx(
        classes.content,
        isMenuOpen && classes.contentShift,
        classes.locationsContainer
      )}
      direction="column"
      alignItems="flex-start"
      spacing={3}
    >
      <div className={classes.drawerHeader} />

      <Grid item>
        <Typography variant="h2" component="h1">
          Locations
        </Typography>
      </Grid>

      <LocationsTable />

      {selectedLocation.LocationId !== -1 && <LocationForm />}
    </Grid>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Locations);
