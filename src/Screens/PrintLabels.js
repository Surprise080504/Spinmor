import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import LinearProgress from "@material-ui/core/LinearProgress";
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
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
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

import {
  getLocationsAction,
  setGetLocationsStatus,
} from "../Redux/LocationReducer/Location.act";
import {
  setGetTemplatesStatus,
  getTemplatesAction,
  setSelectedTemplate,
  setLabelLocation,
  toggleLabelItem,
  clearLabelItems,
  createDocAction,
} from "../Redux/PrintReducer/Print.act";
import {
  getLocationGoods,
  initializeLocationsGoods,
  setAllGoods,
} from "../Redux/GoodReducer/Good.act";
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

  printLabelsContainer: {
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
}));

const mapStateToProps = ({
  AppReducer,
  LocationReducer,
  PrintReducer,
  GoodReducer,
}) => ({
  isMenuOpen: AppReducer.isMenuOpen,

  locations: LocationReducer.locations,
  getLocationsStatus: LocationReducer.getLocationsStatus,

  locationsGoods: GoodReducer.locationsGoods,
  allGoods: GoodReducer.allGoods,

  getTemplatesStatus: PrintReducer.getTemplatesStatus,
  templates: PrintReducer.templates,
  selectedTemplate: PrintReducer.selectedTemplate,

  labelLocation: PrintReducer.labelLocation,

  labelItems: PrintReducer.labelItems,
});
const mapDispatchToProps = (dispatch) => ({
  getLocationsAction: bindActionCreators(getLocationsAction, dispatch),
  setGetLocationsStatus: bindActionCreators(setGetLocationsStatus, dispatch),

  setGetTemplatesStatus: bindActionCreators(setGetTemplatesStatus, dispatch),
  getTemplatesAction: bindActionCreators(getTemplatesAction, dispatch),
  setSelectedTemplate: bindActionCreators(setSelectedTemplate, dispatch),

  setLabelLocation: bindActionCreators(setLabelLocation, dispatch),
  toggleLabelItem: bindActionCreators(toggleLabelItem, dispatch),
  clearLabelItems: bindActionCreators(clearLabelItems, dispatch),
  createDocAction: bindActionCreators(createDocAction, dispatch),

  initializeLocationsGoods: bindActionCreators(
    initializeLocationsGoods,
    dispatch
  ),
  getLocationGoods: bindActionCreators(getLocationGoods, dispatch),
  setAllGoods: bindActionCreators(setAllGoods, dispatch),
});

function PrintLabels({
  isMenuOpen,

  locations,
  getLocationsStatus,
  setGetLocationsStatus,
  getLocationsAction,

  setGetTemplatesStatus,
  getTemplatesAction,
  getTemplatesStatus,
  templates,

  setSelectedTemplate,
  selectedTemplate,

  setLabelLocation,
  labelLocation,

  initializeLocationsGoods,
  getLocationGoods,
  locationsGoods,
  allGoods,
  setAllGoods,

  toggleLabelItem,
  clearLabelItems,
  labelItems,
  createDocAction,
}) {
  const classes = useStyles();

  //
  //cleanup on unmount
  React.useEffect(() => {
    return function cleanup() {
      setGetLocationsStatus(status.not_started);
      setGetTemplatesStatus(status.not_started);
      setLabelLocation({ LocationId: -1 });
      setSelectedTemplate({ TemplateName: -1 });
      clearLabelItems();
    };
  }, [
    clearLabelItems,
    setGetLocationsStatus,
    setGetTemplatesStatus,
    setLabelLocation,
    setSelectedTemplate,
  ]);

  //
  //fetch locations on mount
  React.useEffect(() => {
    if (getTemplatesStatus === status.not_started) {
      getTemplatesAction();
    }

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
    getTemplatesStatus,
    getTemplatesAction,
  ]);

  //
  //get goods of selected location
  const selectLocation = (newLocation) => {
    setAllGoods([]);

    setLabelLocation(newLocation);
  };

  React.useEffect(() => {
    if (labelLocation.LocationId === -1) {
      return;
    }

    getLocationGoods(labelLocation.LocationId, labelLocation.LocationName);
  }, [getLocationGoods, labelLocation.LocationId, labelLocation.LocationName]);

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
  const onSelectTemplate = (newValue) => {
    setSelectedTemplate(newValue);
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
    if (labelItems.length < allGoods.length) {
      for (let i = 0; i < allGoods.length; i++) {
        const foundItem = labelItems.find(
          (item) => item.ItemListId === allGoods[i].ItemListId
        );

        if (!Boolean(foundItem)) {
          toggleLabelItem(allGoods[i]);
        }
      }
    } else {
      clearLabelItems();
    }
  };

  const onPrintClick = () => {
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
  //
  return (
    <Grid
      container
      className={clsx(
        classes.content,
        isMenuOpen && classes.contentShift,
        classes.printLabelsContainer
      )}
      direction="column"
      alignItems="flex-start"
      spacing={3}
    >
      <div className={classes.drawerHeader} />

      {(getLocationsStatus === status.loading ||
        getTemplatesStatus === status.loading) && (
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

      {getTemplatesStatus.split(" ")[0] === status.error && (
        <Grid item>
          <Typography variant="body1" color="error">
            There was an error getting templates:{" "}
            {getTemplatesStatus.split(" ")[1]}
          </Typography>
        </Grid>
      )}

      {locationsGoods
        .find((locGoods) => locGoods.LocationId === labelLocation.LocationId)
        ?.getGoodsStatus.split(" ")[0] === status.error && (
        <Grid item>
          <Typography variant="body1" color="error">
            There was an error getting items:{" "}
            {
              locationsGoods
                .find(
                  (locGoods) => locGoods.LocationId === labelLocation.LocationId
                )
                .getGoodsStatus.split(" ")[1]
            }
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

      {locationsGoods.find(
        (locGoods) => locGoods.LocationId === labelLocation.LocationId
      )?.getGoodsStatus === status.finish &&
        allGoods.length === 0 && (
          <Grid item>
            <Typography variant="body1" color="error">
              You don't have items in this location
            </Typography>
          </Grid>
        )}

      {getLocationsStatus === status.finish && (
        <Grid item>
          <Autocomplete
            style={{ minWidth: 300 }}
            value={labelLocation.LocationId !== -1 ? labelLocation : null}
            disableClearable
            onChange={(e, newValue) => selectLocation(newValue)}
            id="location-select"
            disabled={isLoading}
            options={locations}
            classes={{
              option: classes.option,
            }}
            autoHighlight
            getOptionLabel={(option) => option.LocationName}
            renderOption={(option) => (
              <React.Fragment>
                {option.LocationName}
                <div style={{ flexGrow: 1 }} />({option.ItemCount}) items
              </React.Fragment>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Location"
                variant="outlined"
                required
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "off", // disable autocomplete and autofill
                }}
                placeholder="select a location"
              />
            )}
          />
        </Grid>
      )}

      {getTemplatesStatus === status.finish && (
        <Grid item>
          <Autocomplete
            style={{ minWidth: 300 }}
            value={
              selectedTemplate.TemplateName !== -1 ? selectedTemplate : null
            }
            disableClearable
            onChange={(e, newValue) => onSelectTemplate(newValue)}
            id="template-select"
            disabled={isLoading}
            options={templates.filter((t) => t.Type === "L")}
            classes={{
              option: classes.option,
            }}
            autoHighlight
            getOptionLabel={(option) => option.TemplateName}
            renderOption={(option) => (
              <React.Fragment>{option.TemplateName}</React.Fragment>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Template"
                variant="outlined"
                required
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "off", // disable autocomplete and autofill
                }}
                placeholder="select template"
              />
            )}
          />
        </Grid>
      )}

      <Grid item>
        <Button
          color="primary"
          variant="contained"
          onClick={onPrintClick}
          disabled={
            labelLocation.LocationId === -1 ||
            selectedTemplate.TemplateName === -1 ||
            isLoading ||
            labelItems.length === 0
          }
        >
          Submit
        </Button>
      </Grid>

      {labelItems.find((item) => item?.createDocStatus === status.finish) && (
        <Grid item>
          <Typography>
            Documents are ready to be downloaded.&nbsp;
            <Link component={RouterLink} to="/print/documents">
              Click to view
            </Link>
          </Typography>
        </Grid>
      )}

      {getLocationsStatus === status.finish /*&& locations.length > 0*/ && (
        <Grid item style={{ width: "100%" }}>
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
                        labelItems.length < allGoods.length
                      }
                      checked={
                        allGoods.length > 0 &&
                        labelItems.length === allGoods.length
                      }
                      onChange={onSelectAllClick}
                      inputProps={{ "aria-label": "select all items" }}
                      disabled={allGoods.length === 0}
                    />
                  </TableCell>
                  <TableCell align="left" scope="col">
                    Name
                  </TableCell>
                  <TableCell align="left" scope="col">
                    Description
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
                  <TableCell align="right" scope="col">
                    QR code
                  </TableCell>
                </TableRow>
                {locationsGoods.find(
                  (locGoods) => locGoods.LocationId === labelLocation.LocationId
                )?.getGoodsStatus === status.loading && (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <LinearProgress />
                    </TableCell>
                  </TableRow>
                )}
              </TableHead>

              <TableBody>
                {(rowsPerPage > 0
                  ? allGoods.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : allGoods
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

                    <TableCell align="left">{good.Description}</TableCell>

                    <TableCell align="left">{good.Price}</TableCell>

                    <TableCell align="left">{good.Tax}</TableCell>

                    <TableCell align="left">{good.PriceIncludeTax}</TableCell>

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
                    // colSpan={4}
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

export default connect(mapStateToProps, mapDispatchToProps)(PrintLabels);
