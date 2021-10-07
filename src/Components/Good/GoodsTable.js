import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Link from "@material-ui/core/Link";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";

import {
  getLocationsAction,
  setGetLocationsStatus,
} from "../../Redux/LocationReducer/Location.act";
import {
  initializeLocationsGoods,
  getLocationGoods,
  setSelectedGood,
  updateLocationAnyStatus,
  setAllGoods,
  deleteGoodAction,
} from "../../Redux/GoodReducer/Good.act";
import { drawerWidth } from "../../Assets/consts";
import { status } from "../../api/api";

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

const mapStateToProps = ({ LocationReducer, GoodReducer }) => ({
  locations: LocationReducer.locations,
  getLocationsStatus: LocationReducer.getLocationsStatus,

  locationsGoods: GoodReducer.locationsGoods,
  allGoods: GoodReducer.allGoods,

  selectedGood: GoodReducer.selectedGood,
});
const mapDispatchToProps = (dispatch) => ({
  getLocationsAction: bindActionCreators(getLocationsAction, dispatch),
  setGetLocationsStatus: bindActionCreators(setGetLocationsStatus, dispatch),

  initializeLocationsGoods: bindActionCreators(
    initializeLocationsGoods,
    dispatch
  ),

  getLocationGoods: bindActionCreators(getLocationGoods, dispatch),
  updateLocationAnyStatus: bindActionCreators(
    updateLocationAnyStatus,
    dispatch
  ),
  setAllGoods: bindActionCreators(setAllGoods, dispatch),

  setSelectedGood: bindActionCreators(setSelectedGood, dispatch),
  deleteGoodAction: bindActionCreators(deleteGoodAction, dispatch),
});

function GoodsTable({
  locations,
  getLocationsStatus,
  setGetLocationsStatus,
  getLocationsAction,

  initializeLocationsGoods,
  locationsGoods,
  allGoods,

  getLocationGoods,
  updateLocationAnyStatus,
  setAllGoods,

  selectedGood,
  setSelectedGood,
  deleteGoodAction,
}) {
  const classes = useStyles();
  //
  //cleanup on unmount
  React.useEffect(() => {
    return function cleanup() {
      setGetLocationsStatus(status.not_started);
      setAllGoods([]);
    };
  }, [setGetLocationsStatus, setAllGoods]);

  //
  //get locations using Location action
  //  initialize the locations in GoodReducer after they are fetched
  React.useEffect(() => {
    if (getLocationsStatus === status.not_started) {
      getLocationsAction();
    } else if (getLocationsStatus === status.finish) {
      initializeLocationsGoods(locations);
    }
  }, [
    getLocationsStatus,
    getLocationsAction,
    initializeLocationsGoods,
    locations,
  ]);

  //
  //get goods of each location only if status is not started
  React.useEffect(() => {
    if (!locationsGoods || locationsGoods.length === 0) {
      return;
    }

    for (let i = 0; i < locationsGoods.length; i++) {
      if (locationsGoods[i].getGoodsStatus === status.not_started) {
        getLocationGoods(
          locationsGoods[i].LocationId,
          locationsGoods[i].LocationName
        );
      }
    }
  }, [locationsGoods, getLocationGoods]);

  //
  //delete
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState({ ListItemId: -1 });

  const [deleteGoodStatus, setDeleteGoodStatus] = React.useState(
    status.not_started
  );
  React.useEffect(() => {
    if (itemToDelete.ListItemId === -1) {
      return;
    }

    const locationGoods = locationsGoods.find(
      (locGoods) => locGoods.LocationId === itemToDelete.LocationId
    );
    if (locationGoods) {
      setDeleteGoodStatus(locationGoods.deleteGoodStatus);
    }
  }, [itemToDelete.ListItemId, itemToDelete.LocationId, locationsGoods]);

  const alertDelete = (itemToDelete) => {
    setItemToDelete(itemToDelete);
    setIsAlertOpen(true);
  };

  const cancelDelete = React.useCallback(() => {
    if (deleteGoodStatus === status.loading) {
      return;
    }

    setIsAlertOpen(false);
    setItemToDelete({ ListItemId: -1 });
    updateLocationAnyStatus(
      "deleteGoodStatus",
      itemToDelete.LocationId,
      status.not_started
    );
  }, [deleteGoodStatus, itemToDelete.LocationId, updateLocationAnyStatus]);

  const confirmDelete = () => {
    deleteGoodAction(itemToDelete);
  };

  //auto close delete dialog
  React.useEffect(() => {
    if (deleteGoodStatus === status.finish) {
      cancelDelete();
    }
  }, [cancelDelete, deleteGoodStatus]);

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
      ItemType: null,
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
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //
  //
  return (
    //This component is a child of <Grid container />
    <React.Fragment>
      {getLocationsStatus === status.loading && (
        <Grid item>
          <CircularProgress />
        </Grid>
      )}

      {getLocationsStatus.split(" ")[0] === status.error && (
        <Grid item>
          <Typography variant="body1" color="error">
            There was an error getting your locations:{" "}
            {getLocationsStatus.split(" ")[1]}
          </Typography>
        </Grid>
      )}

      {getLocationsStatus === status.finish && locations.length === 0 && (
        <Grid item>
          <Typography variant="body1">
            <Link component={RouterLink} to="/locations">
              Create location
            </Link>
            &nbsp;and then items to the location
          </Typography>
        </Grid>
      )}

      {getLocationsStatus === status.finish && locations.length > 0 && (
        <Grid item>
          <Button
            color="primary"
            size="large"
            variant="contained"
            onClick={openNewGoodForm}
          >
            NEW
          </Button>
        </Grid>
      )}

      {getLocationsStatus === status.finish && (
        <Grid item style={{ width: "100%" }}>
          <TableContainer component={Paper}>
            <Table aria-label="locations table">
              <TableHead>
                <TableRow className={classes.headerColor}>
                  <TableCell align="left" scope="col">
                    Location Name
                  </TableCell>
                  <TableCell align="left" scope="col">
                    Item Name and Description
                  </TableCell>
                  <TableCell align="left" scope="col">
                    Price
                  </TableCell>
                  <TableCell align="left" scope="col">
                    Tax
                  </TableCell>
                  <TableCell align="left" scope="col">
                    Total
                  </TableCell>
                  <TableCell align="left" scope="col">
                    Actions
                  </TableCell>
                  <TableCell align="right" scope="col">
                    QR code
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {(rowsPerPage > 0
                  ? allGoods.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                  : allGoods
                ).map((good, index) => (
                  <TableRow key={index + " - " + good.QRCode}>
                    <TableCell align="left">{good.LocationName}</TableCell>

                    <TableCell align="left">{good.ItemName}</TableCell>

                    <TableCell align="left">{good.Price.toFixed(2)}</TableCell>

                    <TableCell align="left">{good.Tax.toFixed(2)}</TableCell>

                    <TableCell align="left">
                      {good.PriceIncludeTax.toFixed(2)}
                    </TableCell>

                    <TableCell padding="checkbox">
                      <div className={classes.actionsCell}>
                        <IconButton
                          onClick={(e) => openGoodFormDialog(e, good)}
                        >
                          <EditOutlinedIcon color="primary" />
                        </IconButton>
                        <IconButton onClick={() => alertDelete(good)}>
                          <DeleteForeverOutlinedIcon />
                        </IconButton>
                      </div>
                    </TableCell>

                    <TableCell align="right">{good.QRCode?.trim?.()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      { label: "All", value: -1 },
                    ]}
                    colSpan={3}
                    count={allGoods.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: { "aria-label": "rows per page" },
                      native: true,
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Grid>
      )}

      <Dialog
        open={isAlertOpen}
        onClose={cancelDelete}
        aria-labelledby="delete-good-dialog-title"
        aria-describedby="delete-good-dialog-description"
      >
        <DialogTitle id="delete-good-dialog-title">Delete item</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-good-dialog-description">
            Are you sure you want delete {itemToDelete.ItemName}?
          </DialogContentText>

          {deleteGoodStatus === status.loading && <CircularProgress />}

          {deleteGoodStatus.split(" ")[0] === status.error && (
            <Typography variant="body2" align="left" color="error">
              Error deleting location: {deleteGoodStatus.split(" ")[1]}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={confirmDelete}
            color="primary"
            disabled={deleteGoodStatus === status.loading}
            variant="contained"
          >
            Delete
          </Button>

          <div style={{ flexGrow: 1 }} />

          <Button
            onClick={cancelDelete}
            color="primary"
            autoFocus
            disabled={deleteGoodStatus === status.loading}
            variant="contained"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));
function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(GoodsTable);
