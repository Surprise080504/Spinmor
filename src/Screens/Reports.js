import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
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

import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";

import {
  setGetReportsStatus,
  getReportsAction,
} from "../Redux/ReportReducer/Report.act";
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

const mapStateToProps = ({ AppReducer, ReportReducer }) => ({
  isMenuOpen: AppReducer.isMenuOpen,

  prodStatus: AppReducer.prodStatus,

  getReportsStatus: ReportReducer.getReportsStatus,

  allReports: ReportReducer.allReports,
  allLocations: ReportReducer.allLocations,

  totalSum: ReportReducer.totalSum,
  totalAmount: ReportReducer.totalAmount,
});
const mapDispatchToProps = (dispatch) => ({
  setGetReportsStatus: bindActionCreators(setGetReportsStatus, dispatch),
  getReportsAction: bindActionCreators(getReportsAction, dispatch),
});

function Reports({
  isMenuOpen,

  prodStatus,

  getReportsStatus,
  setGetReportsStatus,
  getReportsAction,

  allReports,
  totalSum,
  totalAmount,
}) {
  const classes = useStyles();

  //
  //fetch reports on mount
  React.useEffect(() => {
    if (getReportsStatus === status.not_started) {
      getReportsAction();
    }
  }, [getReportsAction, getReportsStatus]);

  //
  //cleanup on unmount
  React.useEffect(() => {
    return function cleanup() {
      setGetReportsStatus(status.not_started);
    };
  }, [setGetReportsStatus]);

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

      <Grid item>
        <Typography variant="h6">Total orders: {totalAmount}</Typography>
      </Grid>

      <Grid item style={{ minWidth: 750 }}>
        <TableContainer component={Paper}>
          <Table aria-label="links table">
            <TableHead>
              <TableRow className={classes.headerColor}>
                <TableCell align="left" scope="col">
                  Location Name
                </TableCell>
                <TableCell align="left" scope="col">
                  Order Id
                </TableCell>
                <TableCell align="center" scope="col">
                  Order Total
                </TableCell>
                <TableCell align="left" scope="col">
                  Date
                </TableCell>
                <TableCell align="right" scope="col">
                  Status
                </TableCell>
              </TableRow>

              {getReportsStatus === status.finish && allReports.length === 0 && (
                <TableRow>
                  <TableCell align="center" colSpan={5}>
                    <b>You do not have reports</b>
                  </TableCell>
                </TableRow>
              )}

              {getReportsStatus.split(" ")[0] === status.error && (
                <TableRow>
                  <TableCell align="center" colSpan={5}>
                    <b>
                      There was an error getting your reports:{" "}
                      {getReportsStatus.split(" ")[1]}
                    </b>
                  </TableCell>
                </TableRow>
              )}

              {getReportsStatus === status.loading && (
                <TableRow>
                  <TableCell align="center" colSpan={5}>
                    <LinearProgress color="primary" />
                  </TableCell>
                </TableRow>
              )}
            </TableHead>

            <TableBody>
              {(rowsPerPage > 0
                ? allReports.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : allReports
              ).map((rep, index) => (
                <TableRow key={index}>
                  <TableCell align="left">{rep.LocationName}</TableCell>

                  <TableCell align="left">{rep.OrdersId}</TableCell>

                  <TableCell align="center">
                    {rep.TotalOrder?.toFixed?.(2)}
                  </TableCell>

                  <TableCell align="left">
                    {new Date(rep.Date).toDateString()}
                  </TableCell>

                  <TableCell align="right">{prodStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={5}
                  count={allReports.length}
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

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
