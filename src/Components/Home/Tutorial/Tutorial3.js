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
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

import {
  setSelectedTemplate,
  setLabelLocation,
  toggleLabelItem,
  clearLabelItems,
  createDocAction,
} from "../../../Redux/PrintReducer/Print.act";
import { getHomePageAction } from "../../../Redux/AppReducer/App.act";
import { status } from "../../../api/api";

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
  createButton: {
    marginBottom: theme.spacing(1),
  },
}));

const mapStateToProps = ({ AppReducer, PrintReducer }) => ({
  homePageLocations: AppReducer.homePage.Locations ?? [],
  homePageGoods: AppReducer.homePage.ItemsList ?? [],

  labelItems: PrintReducer.labelItems,
});
const mapDispatchToProps = (dispatch) => ({
  setSelectedTemplate: bindActionCreators(setSelectedTemplate, dispatch),
  setLabelLocation: bindActionCreators(setLabelLocation, dispatch),
  toggleLabelItem: bindActionCreators(toggleLabelItem, dispatch),
  clearLabelItems: bindActionCreators(clearLabelItems, dispatch),
  createDocAction: bindActionCreators(createDocAction, dispatch),

  getHomePageAction: bindActionCreators(getHomePageAction, dispatch),
});

function Tutorial3({
  homePageGoods,
  homePageLocations,
  labelItems,

  setSelectedTemplate,
  setLabelLocation,
  toggleLabelItem,
  clearLabelItems,
  createDocAction,

  getHomePageAction,
}) {
  const classes = useStyles();

  //
  //cleanup on unmount
  React.useEffect(() => {
    return function cleanup() {
      setLabelLocation({ LocationId: -1 });
      setSelectedTemplate({ TemplateName: -1 });
      clearLabelItems();
    };
  }, [clearLabelItems, setLabelLocation, setSelectedTemplate]);

  //
  //set location and template on mount
  React.useEffect(() => {
    setLabelLocation(homePageLocations[0]);
    setSelectedTemplate({
      TemplateName: "Test QR Code",
      Type: "L",
    });
  }, [homePageLocations, setLabelLocation, setSelectedTemplate]);

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
  const [isLoading, setIsLoading] = React.useState(false);
  React.useEffect(() => {
    setIsLoading(
      Boolean(
        labelItems.find((item) => item?.createDocStatus === status.loading)
      )
    );
  }, [labelItems]);

  const handleItemCheckboxClick = (item) => {
    // console.log("toggling", item);
    toggleLabelItem(item);
  };

  const onSelectAllClick = () => {
    if (labelItems.length < homePageGoods.length) {
      for (let i = 0; i < homePageGoods.length; i++) {
        const foundItem = labelItems.find(
          (item) => item.ItemListId === homePageGoods[i].ItemListId
        );

        if (!Boolean(foundItem)) {
          toggleLabelItem(homePageGoods[i]);
        }
      }
    } else {
      clearLabelItems();
    }
  };

  const onPrintClick = () => {
    if (labelItems.length === 0) {
      return;
    }

    for (let i = 0; i < labelItems.length; i++) {
      if (
        labelItems[i].createDocStatus === status.not_started ||
        labelItems[i].createDocStatus.split(" ")[0] === status.error
      ) {
        createDocAction(labelItems[i]);
      }
    }
  };

  //
  //update home page
  React.useEffect(() => {
    const oneDocCreated = Boolean(
      labelItems.find((item) => item?.createDocStatus === status.finish)
    );

    if (!isLoading && oneDocCreated) {
      getHomePageAction({ updateStatus: false });
    }
  }, [getHomePageAction, isLoading, labelItems]);

  //
  //
  return (
    <React.Fragment>
      <Grid item>
        <Typography variant="h6">
          You are almost done with setting up Operator business.
        </Typography>
        <br />

        <Typography variant="h6" component="p">
          Core Spinmor technology provides clients/guests an application to scan
          QR Codes, generated with Goods & Items you have created before, and
          display prices, add to basket, and pay at checkout.
        </Typography>
        <br />

        {/*<Typography variant="h6" component="p">
          Below is a list of Goods & Items you are offering for sale. Next to
          each item there is a checkbox.
        </Typography>
        <Typography variant="h6" component="p">
          Click on any checkbox and then click on "Create Documents" button to
          generate “Test QR Code” document with QR Code and the item’s details.
        </Typography>
        <br />*/}

        <Typography variant="h6" component="p">
          <b>Let’s print QR Codes for Goods & Items</b>
        </Typography>
        <br />

        <Typography variant="h6" component="p">
          When the documents are ready to be downloaded, you will be forwarded
          to the next step.
        </Typography>
        <br />
      </Grid>

      <Grid item>
        <Button
          color="primary"
          variant="contained"
          onClick={onPrintClick}
          disabled={isLoading}
          className={classes.createButton}
        >
          {labelItems.length === 0
            ? "Select Items to Print QR Code"
            : "Create QR Document"}
        </Button>
      </Grid>

      <Grid item>
        <TableContainer component={Paper}>
          <Table aria-label="items table">
            <TableHead>
              <TableRow className={classes.headerColor}>
                <TableCell padding="checkbox" />

                <TableCell
                  padding="checkbox"
                  className={classes.checkboxHeader}
                >
                  <Checkbox
                    indeterminate={
                      labelItems.length > 0 &&
                      labelItems.length < homePageGoods.length
                    }
                    checked={
                      homePageGoods.length > 0 &&
                      labelItems.length === homePageGoods.length
                    }
                    onChange={onSelectAllClick}
                    inputProps={{ "aria-label": "select all items" }}
                    disabled={homePageGoods.length === 0}
                  />
                </TableCell>
                <TableCell align="left" scope="col">
                  Name
                </TableCell>
                <TableCell align="left" scope="col">
                  Total price
                </TableCell>
                <TableCell align="left" scope="col">
                  Location name
                </TableCell>
                <TableCell align="right" scope="col">
                  QR code
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {(rowsPerPage > 0
                ? homePageGoods.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : homePageGoods
              ).map((good) => (
                <TableRow key={good.ItemListId}>
                  <TableCell padding="checkbox">
                    {labelItems.find(
                      (item) => item.ItemListId === good.ItemListId
                    )?.createDocStatus !== status.not_started ? (
                      <StatusColumn
                        itemStatus={
                          labelItems.find(
                            (item) => item.ItemListId === good.ItemListId
                          )?.createDocStatus
                        }
                      />
                    ) : null}
                  </TableCell>

                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={Boolean(
                        labelItems.find(
                          (item) => item.ItemListId === good.ItemListId
                        )
                      )}
                      onClick={() => handleItemCheckboxClick(good)}
                      disabled={isLoading}
                    />
                  </TableCell>

                  <TableCell align="left">{good.ItemName}</TableCell>

                  <TableCell align="left">{good.PriceIncludeTax}</TableCell>

                  <TableCell align="left">{good.LocationName}</TableCell>

                  <TableCell align="right">{good.QRCode?.trim?.()}</TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  // colSpan={4}
                  count={homePageGoods.length}
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

function StatusColumn({ itemStatus }) {
  let title = "";
  let component = <div />;

  if (itemStatus === status.loading) {
    title = "Creating printable document";
    component = <CircularProgress color="primary" size="1rem" />;
  }
  if (itemStatus === status.finish) {
    title = "Printable document successfully created";
    component = <CheckCircleOutlineIcon color="primary" size="1rem" />;
  }
  if (itemStatus?.split?.(" ")[0] === status.error) {
    title = "Error creating printable document: " + itemStatus.split(" ")[1];
    component = <ErrorOutlineIcon color="error" size="1rem" />;
  }

  return <Tooltip title={title}>{component}</Tooltip>;
}

export default connect(mapStateToProps, mapDispatchToProps)(Tutorial3);
