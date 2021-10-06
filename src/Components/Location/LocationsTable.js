import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

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
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";

import {
  getLocationsAction,
  setGetLocationsStatus,
  setSelectedLocation,
  setDeleteLocationStatus,
  deleteLocationAction,
} from "../../Redux/LocationReducer/Location.act";
import { readBusinessAction } from "../../Redux/AppReducer/App.act";
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

const mapStateToProps = ({ LocationReducer }) => ({
  locations: LocationReducer.locations,
  getLocationsStatus: LocationReducer.getLocationsStatus,
  deleteLocationStatus: LocationReducer.deleteLocationStatus,
});
const mapDispatchToProps = (dispatch) => ({
  getLocationsAction: bindActionCreators(getLocationsAction, dispatch),
  setGetLocationsStatus: bindActionCreators(setGetLocationsStatus, dispatch),
  setSelectedLocation: bindActionCreators(setSelectedLocation, dispatch),
  setDeleteLocationStatus: bindActionCreators(
    setDeleteLocationStatus,
    dispatch
  ),
  deleteLocationAction: bindActionCreators(deleteLocationAction, dispatch),
  readBusinessAction: bindActionCreators(readBusinessAction, dispatch),
});

function LocationsTable({
  locations,
  getLocationsStatus,
  setGetLocationsStatus,
  getLocationsAction,

  setSelectedLocation,

  deleteLocationStatus,
  setDeleteLocationStatus,
  deleteLocationAction,

  readBusinessAction,
}) {
  const classes = useStyles();

  //
  //fetch locations on mount
  React.useEffect(() => {
    if (getLocationsStatus === status.not_started) {
      getLocationsAction();
      readBusinessAction();
    }
  }, [getLocationsStatus, getLocationsAction, readBusinessAction]);

  //
  //cleanup on unmount
  React.useEffect(() => {
    return function cleanup() {
      setGetLocationsStatus(status.not_started);
    };
  }, [setGetLocationsStatus]);

  //
  //delete
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState({});
  const alertDelete = (itemToDelete) => {
    setItemToDelete(itemToDelete);
    setIsAlertOpen(true);
  };

  const cancelDelete = React.useCallback(() => {
    if (deleteLocationStatus === status.loading) {
      return;
    }

    setIsAlertOpen(false);
    setItemToDelete({});
    setDeleteLocationStatus(status.not_started);
  }, [deleteLocationStatus, setDeleteLocationStatus]);

  const confirmDelete = () => {
    deleteLocationAction(itemToDelete);
  };

  //auto close delete dialog
  React.useEffect(() => {
    if (deleteLocationStatus === status.finish) {
      cancelDelete();
    }
  }, [cancelDelete, deleteLocationStatus]);

  //
  //
  const openLocationFormDialog = (e, location) => {
    setSelectedLocation(location);
  };
  const openNewLocationForm = () => {
    const data = {
      LocationId: -99,
      LocationName: null,
      LocationType: null,
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
  //enabled/disabled
  const [showEnabled, setShowEnabled] = React.useState(true);
  const [showDisabled, setShowDisabled] = React.useState(false);

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
            You don't have locations yet, start by adding a new one
          </Typography>
        </Grid>
      )}

      {getLocationsStatus === status.finish && (
        <React.Fragment>
          <Grid item>
            <Button
              color="primary"
              size="large"
              variant="contained"
              onClick={openNewLocationForm}
            >
              NEW
            </Button>
          </Grid>

          <Grid container item>
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showEnabled}
                    onChange={() => setShowEnabled((prevVal) => !prevVal)}
                    color="primary"
                  />
                }
                label="View enabled locations"
              />
            </Grid>

            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showDisabled}
                    onChange={() => setShowDisabled((prevVal) => !prevVal)}
                    color="primary"
                  />
                }
                label="View disabled locations"
              />
            </Grid>
          </Grid>
        </React.Fragment>
      )}

      {getLocationsStatus === status.finish /*&& locations.length > 0*/ && (
        <Grid item style={{ width: "100%" }}>
          <TableContainer component={Paper}>
            <Table aria-label="locations table">
              <TableHead>
                <TableRow className={classes.headerColor}>
                  <TableCell align="left" scope="col">
                    Location Name
                  </TableCell>
                  <TableCell align="left" scope="col">
                    Currency
                  </TableCell>
                  <TableCell align="left" scope="col">
                    Description
                  </TableCell>
                  <TableCell align="left" scope="col">
                    Thank you message
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
                  ? locations
                    .filter(
                      (loc) =>
                        (showEnabled && loc.Enabled === "e") ||
                        (showDisabled && loc.Enabled !== "e")
                    )
                    .slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : locations
                ).map((location) => (
                  <TableRow key={location.LocationId}>
                    <TableCell align="left">{location.LocationName}</TableCell>

                    <TableCell align="left">
                      {location.CurrencySymbol}
                    </TableCell>

                    <TableCell align="left">{location.Description}</TableCell>

                    <TableCell align="left">{location.ByeBye}</TableCell>

                    <TableCell padding="checkbox">
                      <div className={classes.actionsCell}>
                        <IconButton
                          onClick={(e) => openLocationFormDialog(e, location)}
                        >
                          <EditOutlinedIcon color="primary" />
                        </IconButton>
                        <IconButton onClick={() => alertDelete(location)}>
                          <DeleteForeverOutlinedIcon />
                        </IconButton>
                      </div>
                    </TableCell>

                    <TableCell align="right">{location.QRCode}</TableCell>
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
                    count={locations.length}
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
        aria-labelledby="delete-location-dialog-title"
        aria-describedby="delete-location-dialog-description"
      >
        <DialogTitle id="delete-location-dialog-title">
          Delete location
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-location-dialog-description">
            Are you sure you want delete {itemToDelete.LocationName}?
            <br />
            All items of that location will be deleted.
          </DialogContentText>

          {deleteLocationStatus === status.loading && <CircularProgress />}

          {deleteLocationStatus.split(" ")[0] === status.error && (
            <Typography variant="body2" align="left" color="error">
              Error deleting location: {deleteLocationStatus.split(" ")[1]}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={confirmDelete}
            color="primary"
            disabled={deleteLocationStatus === status.loading}
            variant="contained"
          >
            Delete
          </Button>

          <div style={{ flexGrow: 1 }} />

          <Button
            onClick={cancelDelete}
            color="primary"
            autoFocus
            disabled={deleteLocationStatus === status.loading}
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

export default connect(mapStateToProps, mapDispatchToProps)(LocationsTable);
