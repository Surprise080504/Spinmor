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
import Tooltip from "@material-ui/core/Tooltip";
import Link from "@material-ui/core/Link";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

import { status } from "../../../api/api";
import { scannerAppTitle } from "../../../Assets/consts";

const useStyles = makeStyles((theme) => ({
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
  checkboxHeader: {
    "& .MuiCheckbox-root": {
      color: theme.palette.getContrastText(theme.palette.primary.main),
    },
    "& .Mui-checked": {
      color: theme.palette.getContrastText(theme.palette.primary.main),
    },
    "& .Mui-disabled": {
      color: theme.palette.text.disabled,
    },
    "& .MuiCheckbox-indeterminate": {
      color: theme.palette.text.hint,
    },
  },
  LinkButton: {
    marginBottom: theme.spacing(3),
  },
}));

const mapStateToProps = ({ AppReducer }) => ({
  homePageLinks: AppReducer.homePage.Link2PrintList,

  token: AppReducer.token,
});
const mapDispatchToProps = (dispatch) => ({
  //
});

function Tutorial4({ homePageLinks, token }) {
  const classes = useStyles();

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
  const getClientLink = () => {
    const dev_scanner = "http://localhost:4000";
    const prod_scanner = "https://spinmorm.azurewebsites.net";
    const scanner_link =
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? dev_scanner
        : prod_scanner;

    const operatorAppTitle = document.title;

    let operatorAppHost =
      window.location.protocol + "//" + window.location.hostname;
    if (window.location.port) {
      operatorAppHost += ":" + window.location.port;
    }

    const href = encodeURI(
      `${scanner_link}?operatorAppTitle=${operatorAppTitle}&operatorAppHost=${operatorAppHost}&token=${token}`
    );
    console.log(href);
    return href;
    // href={`http://localhost:4000?token=${token}&operatorAppTitle=${document.title}&operatorAppHost=${window.location.hostname}`}
    // href={`https://spinmorm.azurewebsites.net?token=${token}&operatorAppTitle=${document.title}&operatorAppHost=${window.location.hostname}`}
  };

  //
  //
  return (
    <React.Fragment>
      <Grid item>
        {/*<Typography variant="h6">
          You have created location, item and QR document. We are ready to
          explore the client's application.
        </Typography>
        <br />

        <Typography variant="h6" component="p">
          Click on the document's link to view it. You can print it or open it
          on tablet or computer’s screen. Using your iPhone / mobile device with
          camera you can scan this QR code whether it is printed or displayed on
          another screen.
        </Typography>
        <br />

        <Typography variant="h6" component="p">
          You can create more items documents by accessing the menu "Labels",
          location document by using the menu "Cards" and view them later by
          using the menu "Print"
        </Typography>
        <br />

        <Typography variant="h6" component="p">
          We are about to leave the Operator module and log on the client’s
          application. In the client’s application you scan the QR Codes
          generated and printed before, add items to basket and proceed to
          Checkout.
        </Typography>
        <br />

        <Typography variant="h6" component="p">
          NOTE: When Operator is in “Sandbox” status, no financial transactions
          are taken place, and no obligations to purchase items or pay for them.
          The main purpose is to familiarize the operator with the complete
          Spinmor process, from setting up the business till selling the items.
        </Typography>
        <br />

        <Typography variant="h6" component="p">
          Use your credentials to also log on Spinmor clients application (make
          this as URL to SpinmorM.Azurewebsites.net)
        </Typography>
        <br />*/}

        <Typography variant="h6" component="p">
          We are ready to explore the client's application.
        </Typography>
        <br />

        <Typography variant="h6" component="p">
          Click on the link below to download QR Code testing document
          <br />
          Print it or open it on tablet or computer’s screen.
        </Typography>
        <br />

        <Typography variant="h6" component="p">
          We are about to leave the Operator Web Platform and test the QR Code
          in the{" "}
          <Link href={getClientLink()} target={scannerAppTitle}>
            Client Application
          </Link>
        </Typography>
        <br />
      </Grid>

      <Grid item>
        <Button
          color="primary"
          variant="contained"
          // onClick={onPrintClick}
          className={classes.LinkButton}
          // href={`http://localhost:4000?token=${token}&operatorAppTitle=${document.title}&operatorAppHost=${window.location.hostname}`}
          // href={`https://spinmorm.azurewebsites.net?token=${token}&operatorAppTitle=${document.title}&operatorAppHost=${window.location.hostname}`}
          href={getClientLink()}
          target={scannerAppTitle}
        >
          {console.log("window.location.port", window.location.port)}
          Open Client Application
        </Button>
      </Grid>
      <Grid item>
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
                <TableCell align="right" scope="col">
                  QR code
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {(rowsPerPage > 0
                ? homePageLinks.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : homePageLinks
              ).map((link) => (
                <TableRow key={link.Link2PrintID}>
                  <TableCell align="left">{link.Name}</TableCell>

                  <TableCell align="left">
                    <Link href={link.Url}>{link.Url}</Link>
                  </TableCell>

                  <TableCell align="right">{link.QRCode}</TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={3}
                  count={homePageLinks.length}
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

export default connect(mapStateToProps, mapDispatchToProps)(Tutorial4);
