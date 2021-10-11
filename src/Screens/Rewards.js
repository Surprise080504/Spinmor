import React from "react";
import { useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import { drawerWidth } from "../Assets/consts";
import RewardsTable from "../Components/Rewards/RewardsTable";

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

  rewardsContainer: {
    paddingTop: theme.spacing(3),
    marginBottom: 0,
  }
}));

function Rewards() {
  const classes = useStyles();
  const isMenuOpen = useSelector((state) => state.AppReducer.isMenuOpen);

  return (
    <Grid
      container
      className={clsx(
        classes.content,
        isMenuOpen && classes.contentShift,
        classes.rewardsContainer
      )}
      direction="column"
      alignItems="flex-start"
      spacing={3}
    >
      <div className={classes.drawerHeader} />

      <Grid item>
        <Typography variant="h2" component="h1">
          Rewards Program
        </Typography>
      </Grid>

      <Grid item style={{ width: '100%' }}>
        <RewardsTable />
      </Grid>

    </Grid>
  );
}

export default Rewards;
