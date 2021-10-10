import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Typography,
  CircularProgress,
  Button,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  IconButton
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  EditOutlined as EditOutlinedIcon,
  DeleteForeverOutlined as DeleteForeverOutlinedIcon
} from "@material-ui/icons";

import {
  getAllRewards,
  createReward,
  updateReward,
  deleteReward
} from "../../Redux/RewardsReducer/Rewards.act";
import { getLocationsAction, setGetLocationsStatus } from "../../Redux/LocationReducer/Location.act";
import { status } from "../../api/api";
import { drawerWidth } from "../../Assets/consts";

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

  headerColor: {
    backgroundColor: theme.palette.primary.main,
    "& .MuiTableCell-root": {
      color: theme.palette.getContrastText(theme.palette.primary.main),
    },
  },
  actionsCell: {
    display: "flex",
    height: "100%",
  },
}));

function RewardsTable() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const allRewards = useSelector((state) => state.rewards.allRewards);
  const error = useSelector((state) => state.error);
  const getLocationsStatus = useSelector((state) => state.LocationReducer.getLocationsStatus);
  const locations = useSelector((state) => state.LocationReducer.locations);

  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setPageLoading(true);
    dispatch(setGetLocationsStatus(status.not_started));
  }, []);

  useEffect(() => {
    if (getLocationsStatus === status.not_started) dispatch(getLocationsAction());
    if (getLocationsStatus === status.finish) {
      dispatch(getAllRewards(locations.filter(location => location.LocationType === "coffeeshop")));
    }
  }, [getLocationsStatus])

  useEffect(() => {
    setPageLoading(false);
  }, [allRewards]);

  useEffect(() => {

  }, [error]);

  return (
    <React.Fragment>
      {pageLoading && (
        <Grid item>
          <CircularProgress />
        </Grid>
      )}
    </React.Fragment>
  );
}

export default RewardsTable;
