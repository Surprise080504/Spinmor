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
  setGetLinksStatus,
  getLinksAction,
  setDeleteLinkStatus,
  deleteLinkAction,
} from "../Redux/PrintReducer/Print.act";
import { drawerWidth } from "../Assets/consts";
import { status } from "../api/api";

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

  printDocumentsContainer: {
    paddingTop: theme.spacing(3),
    marginBottom: 0,
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

const mapStateToProps = ({ PrintReducer, AppReducer }) => ({
  isMenuOpen: AppReducer.isMenuOpen,

  getLinksStatus: PrintReducer.getLinksStatus,
  printLinks: PrintReducer.printLinks,

  deleteLinkStatus: PrintReducer.deleteLinkStatus,
});
const mapDispatchToProps = (dispatch) => ({
  setGetLinksStatus: bindActionCreators(setGetLinksStatus, dispatch),
  getLinksAction: bindActionCreators(getLinksAction, dispatch),

  setDeleteLinkStatus: bindActionCreators(setDeleteLinkStatus, dispatch),
  deleteLinkAction: bindActionCreators(deleteLinkAction, dispatch),
});

function Print({
  isMenuOpen,

  getLinksStatus,
  setGetLinksStatus,
  getLinksAction,
  printLinks,

  setDeleteLinkStatus,
  deleteLinkAction,
  deleteLinkStatus,
}) {
  const classes = useStyles();

  //
  //fetch links on mount
  React.useEffect(() => {
    if (getLinksStatus === status.not_started) {
      getLinksAction();
    }
  }, [getLinksAction, getLinksStatus]);

  //
  //cleanup on unmount
  React.useEffect(() => {
    return function cleanup() {
      setGetLinksStatus(status.not_started);
    };
  }, [setGetLinksStatus]);

  //
  //delete
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState({});
  const alertDelete = (itemToDelete) => {
    setItemToDelete(itemToDelete);
    setIsAlertOpen(true);
  };

  const cancelDelete = React.useCallback(() => {
    if (deleteLinkStatus === status.loading) {
      return;
    }

    setIsAlertOpen(false);
    setItemToDelete({});
    setDeleteLinkStatus(status.not_started);
  }, [deleteLinkStatus, setDeleteLinkStatus]);

  const confirmDelete = () => {
    deleteLinkAction(itemToDelete);
  };

  //auto close delete dialog
  React.useEffect(() => {
    if (deleteLinkStatus === status.finish) {
      cancelDelete();
    }
  }, [cancelDelete, deleteLinkStatus]);

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
    <Grid
      container
      className={clsx(
        classes.content,
        isMenuOpen && classes.contentShift,
        classes.printDocumentsContainer
      )}
      direction="column"
      alignItems="flex-start"
      spacing={3}
    >
      <div className={classes.drawerHeader} />

      {getLinksStatus === status.loading && (
        <Grid item>
          <CircularProgress />
        </Grid>
      )}

      {getLinksStatus.split(" ")[0] === status.error && (
        <Grid item>
          <Typography variant="body1" color="error">
            There was an error getting your documents:{" "}
            {getLinksStatus.split(" ")[1]}
          </Typography>
        </Grid>
      )}

      {getLinksStatus === status.finish && printLinks.length === 0 && (
        <Grid item>
          <Typography variant="body1">
            You don't have documents to print. Firstly generate QR Code using
            menu option Labels or Cards.
          </Typography>
        </Grid>
      )}

      {getLinksStatus === status.finish && printLinks.length > 0 && (
        <Grid item style={{ width: "100%" }}>
          <TableContainer component={Paper}>
            <Table aria-label="links table">
              <TableHead>
                <TableRow className={classes.headerColor}>
                  <TableCell align="left" scope="col">
                    Name
                  </TableCell>
                  <TableCell align="left" scope="col">
                    Link
                  </TableCell>
                  <TableCell align="left" scope="col">
                    Date
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
                  ? printLinks.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : printLinks
                ).map((link) => (
                  <TableRow key={link.Link2PrintID}>
                    <TableCell align="left">{link.Name}</TableCell>

                    <TableCell align="left">
                      <Link href={link.Url}>{link.Url}</Link>
                    </TableCell>

                    <TableCell align="left">
                      {new Date(link.Date).toDateString()}
                    </TableCell>

                    <TableCell padding="checkbox">
                      <IconButton onClick={() => alertDelete(link)}>
                        <DeleteForeverOutlinedIcon />
                      </IconButton>
                    </TableCell>

                    <TableCell align="right">{link.QRCode}</TableCell>
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
                    count={printLinks.length}
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
        aria-labelledby="delete-link-dialog-title"
        aria-describedby="delete-link-dialog-description"
      >
        <DialogTitle id="delete-link-dialog-title">Delete link</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-link-dialog-description">
            Are you sure you want delete {itemToDelete.Name}?
            <br />
            <br />
            {itemToDelete.Url}
          </DialogContentText>

          {deleteLinkStatus === status.loading && <CircularProgress />}

          {deleteLinkStatus.split(" ")[0] === status.error && (
            <Typography variant="body2" align="left" color="error">
              Error deleting link: {deleteLinkStatus.split(" ")[1]}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={confirmDelete}
            color="primary"
            disabled={deleteLinkStatus === status.loading}
            variant="contained"
          >
            Delete
          </Button>

          <div style={{ flexGrow: 1 }} />

          <Button
            onClick={cancelDelete}
            color="primary"
            autoFocus
            disabled={deleteLinkStatus === status.loading}
            variant="contained"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
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

export default connect(mapStateToProps, mapDispatchToProps)(Print);
