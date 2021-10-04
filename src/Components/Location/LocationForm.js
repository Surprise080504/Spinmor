import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import isEqual from "lodash/isEqual";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Autocomplete from "@material-ui/lab/Autocomplete";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

import { makeStyles } from "@material-ui/core/styles";
// import clsx from "clsx";
import UndoIcon from "@material-ui/icons/Undo";

import {
  setGetLocationDetailsStatus,
  getLocationDetailsAction,
  setSelectedLocation,
  setUpdateLocationStatus,
  updateLocationAction,
  setCreateLocationStatus,
  createLocationAction,
} from "../../Redux/LocationReducer/Location.act";
import { drawerWidth } from "../../Assets/consts";
import { status } from "../../api/api";
import countries from "../../Assets/countries";
import currencies from "../../Assets/currencies";

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

  option: {
    fontSize: 15,
    "& > span": {
      marginRight: 10,
      fontSize: 18,
    },
  },
  currencyInput: {
    "& .MuiFormHelperText-root": {
      color: theme.palette.error.dark,
    },
  },

  successMessageStyle: {
    color: theme.palette.primary.main,
    paddingBottom: theme.spacing(2),
  },
}));

const mapStateToProps = ({ LocationReducer, AppReducer }) => ({
  getLocationDetailsStatus: LocationReducer.getLocationDetailsStatus,

  selectedLocation: LocationReducer.selectedLocation,

  updateLocationStatus: LocationReducer.updateLocationStatus,
  createLocationStatus: LocationReducer.createLocationStatus,

  businessInfo: AppReducer.businessInfo,
});
const mapDispatchToProps = (dispatch) => ({
  setGetLocationDetailsStatus: bindActionCreators(
    setGetLocationDetailsStatus,
    dispatch
  ),
  getLocationDetailsAction: bindActionCreators(
    getLocationDetailsAction,
    dispatch
  ),

  setSelectedLocation: bindActionCreators(setSelectedLocation, dispatch),

  setUpdateLocationStatus: bindActionCreators(
    setUpdateLocationStatus,
    dispatch
  ),
  updateLocationAction: bindActionCreators(updateLocationAction, dispatch),

  setCreateLocationStatus: bindActionCreators(
    setCreateLocationStatus,
    dispatch
  ),
  createLocationAction: bindActionCreators(createLocationAction, dispatch),
});

function LocationForm({
  getLocationDetailsStatus,
  setGetLocationDetailsStatus,
  getLocationDetailsAction,

  selectedLocation,
  setSelectedLocation,

  updateLocationStatus,
  setUpdateLocationStatus,
  updateLocationAction,

  createLocationStatus,
  setCreateLocationStatus,
  createLocationAction,

  businessInfo,
}) {
  const classes = useStyles();

  const [successMessage, setSuccessMessage] = React.useState(null);
  //
  //get location details on form mount
  React.useEffect(() => {
    if (
      getLocationDetailsStatus === status.not_started &&
      selectedLocation.LocationId !== -99
    ) {
      getLocationDetailsAction(selectedLocation.LocationId);
      setSuccessMessage(null);
    }
  }, [
    getLocationDetailsAction,
    getLocationDetailsStatus,
    selectedLocation.LocationId,
  ]);

  //
  //cleanup on unmount
  React.useEffect(() => {
    return function cleanup() {
      setGetLocationDetailsStatus(status.not_started);
      setUpdateLocationStatus(status.not_started);
      setCreateLocationStatus(status.not_started);
    };
  }, [
    setCreateLocationStatus,
    setGetLocationDetailsStatus,
    setUpdateLocationStatus,
  ]);

  //
  //initialize local formState to received selectedLocation
  const [formState, setFormState] = React.useState(selectedLocation);
  React.useEffect(() => {
    const countryLabel = selectedLocation.Country || businessInfo.country;
    const currencyIso =
      selectedLocation?.CurrencySymbol?.trim?.() ||
      countries.find((c) => c.label === businessInfo.country).suggestedCurrency;

    setFormState({
      ...selectedLocation,
      Country: countries.find(
        (c) => c.label.toLowerCase() === countryLabel.toLowerCase()
      ),
      CurrencySymbol:
        currencies.find(
          (c) => c.iso === currencyIso || c.symbol === currencyIso
        ) || null,
    });
  }, [businessInfo.country, selectedLocation]);

  //
  //is form the same
  const [isFormSame, setIsFormSame] = React.useState(true);
  const checkIsFormSame = (formState) => {
    const newFormState = { ...formState };

    if (newFormState.Country && newFormState.Country.label) {
      newFormState["Country"] = newFormState.Country.label;
    } else {
      newFormState["Country"] = null;
    }

    if (newFormState.CurrencySymbol && newFormState.CurrencySymbol.iso) {
      newFormState["CurrencySymbol"] = newFormState.CurrencySymbol.iso;
    } else {
      newFormState["CurrencySymbol"] = null;
    }

    // Object.keys(newFormState).forEach((key) =>
    //   newFormState[key] === "" ? null : newFormState[key]
    // );

    const isEqualRes = isEqual(newFormState, {
      ...selectedLocation,
      CurrencySymbol: selectedLocation?.CurrencySymbol?.trim?.(),
    });
    setIsFormSame(isEqualRes);
  };

  //
  //
  const onAnyChange = (e, field) => {
    let value = null;
    if (field === "Country" || field === "CurrencySymbol") {
      value = e;
    } else {
      value = e.target.value === "" ? null : e.target.value;
    }

    const newFormState = { ...formState };
    newFormState[field] = value;

    if (field === "Country" && selectedLocation.LocationId === -99) {
      // newFormState["CurrencySymbol"] = value.suggestedCurrency;
      newFormState["CurrencySymbol"] = currencies.find(
        (currency) => currency.iso === value.suggestedCurrency
      );
    }

    setFormState(newFormState);
    checkIsFormSame(newFormState);
  };

  //
  //
  const resetTextField = (e, field) => {
    if (field !== "CurrencySymbol") {
      e.preventDefault();
    }

    const newFormState = { ...formState };
    newFormState[field] = selectedLocation[field];

    if (field === "CurrencySymbol") {
      const currencyIso = selectedLocation?.CurrencySymbol?.trim?.();
      newFormState[field] = currencies.find(
        (c) => c.iso === currencyIso || c.symbol === currencyIso
      );
    }

    setFormState(newFormState);
    checkIsFormSame(newFormState);
  };

  //
  //
  const onSubmitForm = (e) => {
    e.preventDefault();

    const formData = {};
    if (formState.LocationName !== selectedLocation.LocationName) {
      formData["LocationName"] = formState.LocationName;
    }
    if (formState.StreetAddress1 !== selectedLocation.StreetAddress1) {
      formData["StreetAddress1"] = formState.StreetAddress1;
    }
    if (formState.StreetAddress2 !== selectedLocation.StreetAddress2) {
      formData["StreetAddress2"] = formState.StreetAddress2;
    }
    if (formState?.Country?.label !== selectedLocation.Country) {
      formData["Country"] = formState.Country.label;
    }
    if (formState.Suburb !== selectedLocation.Suburb) {
      formData["Suburb"] = formState.Suburb;
    }
    if (formState.State !== selectedLocation.State) {
      formData["State"] = formState.State;
    }
    if (formState.Description !== selectedLocation.Description) {
      formData["Description"] = formState.Description;
    }
    if (
      formState?.CurrencySymbol?.iso?.trim?.() !==
      selectedLocation?.CurrencySymbol?.trim?.()
    ) {
      formData["CurrencySymbol"] = formState.CurrencySymbol.iso;
    }
    if (formState.ByeBye !== selectedLocation.ByeBye) {
      formData["ByeBye"] = formState.ByeBye;
    }

    if (!formData.Description) {
      formData.Description = "";
    }

    if (selectedLocation.LocationId !== -99) {
      formData["LocationID"] = selectedLocation.LocationId;
      formData["QRCode"] = selectedLocation.QRCode;
      updateLocationAction(formData);
    } else {
      createLocationAction(formData);
    }

    // updateBusinessAction(formData);
  };

  //
  //closing the form. more cleanup in another hook
  const closeDialogForm = () => {
    if (
      updateLocationStatus === status.loading ||
      createLocationStatus === status.loading
    ) {
      return;
    }

    setSelectedLocation({
      LocationId: -1,
      LocationName: null,
      StreetAddress1: null,
      StreetAddress2: null,
      Country: null,
      Suburb: null,
      State: null,
      Description: null,
      ByeBye: null,
      CurrencySymbol: null,
      QRCode: null,
    });
  };

  //
  //auto close form or scroll to error
  const errorTextRef = React.useRef(null);
  React.useEffect(() => {
    if (
      updateLocationStatus === status.finish ||
      createLocationStatus === status.finish
    ) {
      // setSuccessMessage("Location updated");
      // setTimeout(() => errorTextRef.current.scrollIntoView(true), 50);

      setSelectedLocation({
        LocationId: -1,
        LocationName: null,
        StreetAddress1: null,
        StreetAddress2: null,
        Country: null,
        Suburb: null,
        State: null,
        Description: null,
        ByeBye: null,
        CurrencySymbol: null,
        QRCode: null,
      });
    } else if (
      updateLocationStatus.split(" ")[0] === status.error ||
      createLocationStatus.split(" ")[0] === status.error
    ) {
      errorTextRef.current.scrollIntoView(true);
    }
  }, [updateLocationStatus, createLocationStatus, setSelectedLocation]);

  //
  //
  const [tmpCurrency, setTmpCurrency] = React.useState(false);
  const onCurrencyChange = (e, newValue) => {
    if (selectedLocation.LocationId === -99) {
      onAnyChange(newValue, "CurrencySymbol");
    } else {
      setTmpCurrency(newValue);
    }
  };
  const acceptCurrencyChange = () => {
    onAnyChange(tmpCurrency, "CurrencySymbol");
    cancelCurrencyChange();
  };
  const cancelCurrencyChange = () => {
    setTmpCurrency(null);
  };

  // const [currencyDisabled, setCurrencyDisabled] = React.useState(
  //   selectedLocation.LocationId !== -99
  // );
  // const onCurrencyCheckboxChange = () => {
  //   if (
  //     !currencyDisabled &&
  //     formState.CurrencySymbol.iso !==
  //       selectedLocation?.CurrencySymbol?.trim?.()
  //   ) {
  //     console.log("reset");

  //     resetTextField(null, "CurrencySymbol");
  //   }

  //   setCurrencyDisabled(!currencyDisabled);
  // };

  //
  //
  return (
    <React.Fragment>
      <Dialog
        open={selectedLocation.LocationId !== -1}
        onClose={null}
        keepMounted={false}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedLocation.LocationId === -99
            ? "Create a new location"
            : `Edit ${selectedLocation.LocationName}`}
        </DialogTitle>

        <DialogContent>
          {(getLocationDetailsStatus === status.loading ||
            updateLocationStatus === status.loading ||
            createLocationStatus === status.loading) && <CircularProgress />}

          {successMessage && (
            <Typography
              variant="h6"
              align="left"
              ref={errorTextRef}
              className={classes.successMessageStyle}
            >
              {successMessage}
            </Typography>
          )}

          {getLocationDetailsStatus.split(" ")[0] === status.error && (
            <Typography variant="body2" align="left" color="error">
              Error getting location information:{" "}
              {getLocationDetailsStatus.split(" ")[1]}
            </Typography>
          )}

          {updateLocationStatus.split(" ")[0] === status.error && (
            <Typography
              variant="body2"
              align="left"
              ref={errorTextRef}
              color="error"
            >
              Error updating location: {updateLocationStatus.split(" ")[1]}
            </Typography>
          )}
          {createLocationStatus.split(" ")[0] === status.error && (
            <Typography
              variant="body2"
              align="left"
              ref={errorTextRef}
              color="error"
            >
              Error creating location: {createLocationStatus.split(" ")[1]}
            </Typography>
          )}

          {(selectedLocation.LocationId === -99 ||
            (selectedLocation.LocationId !== -99 &&
              getLocationDetailsStatus === status.finish)) && (
            <form onSubmit={onSubmitForm} id="location-form">
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Location Name"
                    value={formState.LocationName || ""}
                    onChange={(e) => onAnyChange(e, "LocationName")}
                    variant="filled"
                    required
                    InputProps={{
                      endAdornment: selectedLocation.LocationId !== -99 && (
                        <InputAdornment position="end">
                          <IconButton
                            disabled={
                              formState.LocationName ===
                              selectedLocation.LocationName
                            }
                            onClick={(e) => resetTextField(e, "LocationName")}
                          >
                            <UndoIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Address"
                    value={formState.StreetAddress1 || ""}
                    onChange={(e) => onAnyChange(e, "StreetAddress1")}
                    variant="filled"
                    InputProps={{
                      endAdornment: selectedLocation.LocationId !== -99 && (
                        <InputAdornment position="end">
                          <IconButton
                            disabled={
                              formState.StreetAddress1 ===
                              selectedLocation.StreetAddress1
                            }
                            onClick={(e) => resetTextField(e, "StreetAddress1")}
                          >
                            <UndoIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/*<Grid item xs={12}>
                  <TextField
                    label="Street Address 2"
                    value={formState.StreetAddress2 || ""}
                    onChange={(e) => onAnyChange(e, "StreetAddress2")}
                    variant="filled"
                    InputProps={{
                      endAdornment: selectedLocation.LocationId !== -99 && (
                        <InputAdornment position="end">
                          <IconButton
                            disabled={
                              formState.StreetAddress2 ===
                              selectedLocation.StreetAddress2
                            }
                            onClick={(e) => resetTextField(e, "StreetAddress2")}
                          >
                            <UndoIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>*/}

                <Grid item xs={12}>
                  <TextField
                    label="Suburb"
                    value={formState.Suburb || ""}
                    onChange={(e) => onAnyChange(e, "Suburb")}
                    variant="filled"
                    InputProps={{
                      endAdornment: selectedLocation.LocationId !== -99 && (
                        <InputAdornment position="end">
                          <IconButton
                            disabled={
                              formState.Suburb === selectedLocation.Suburb
                            }
                            onClick={(e) => resetTextField(e, "Suburb")}
                          >
                            <UndoIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="State"
                    value={formState.State || ""}
                    onChange={(e) => onAnyChange(e, "State")}
                    variant="filled"
                    InputProps={{
                      endAdornment: selectedLocation.LocationId !== -99 && (
                        <InputAdornment position="end">
                          <IconButton
                            disabled={
                              formState.State === selectedLocation.State
                            }
                            onClick={(e) => resetTextField(e, "State")}
                          >
                            <UndoIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Autocomplete
                    style={{ maxWidth: 274 }}
                    value={formState.Country || countries[0]}
                    disableClearable
                    onChange={(e, newValue) => onAnyChange(newValue, "Country")}
                    id="country-select"
                    options={countries}
                    classes={{
                      option: classes.option,
                    }}
                    autoHighlight
                    getOptionLabel={(option) => option.label}
                    renderOption={(option) => (
                      <React.Fragment>{option.label}</React.Fragment>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Country"
                        variant="filled"
                        required
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "new-password", // disable autocomplete and autofill
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Autocomplete
                    style={{ maxWidth: 274 }}
                    value={formState.CurrencySymbol || null}
                    disableClearable
                    onChange={(e, newValue) =>
                      // onAnyChange(newValue, "CurrencySymbol")
                      onCurrencyChange(e, newValue)
                    }
                    id="currency-select"
                    options={currencies}
                    classes={{
                      option: classes.option,
                    }}
                    autoHighlight
                    // disabled={currencyDisabled}
                    getOptionLabel={(option) => option.iso}
                    renderOption={(option) => <span>{option.iso}</span>}
                    renderInput={(params) => (
                      <TextField
                        // className={clsx(
                        //   !currencyDisabled && classes.currencyInput
                        // )}
                        {...params}
                        label="Currency"
                        variant="filled"
                        required
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "new-password", // disable autocomplete and autofill
                        }}
                        // helperText={
                        //   selectedLocation.LocationId !== -99
                        //     ? "Changes will not affect items prices!"
                        //     : ""
                        // }
                      />
                    )}
                  />
                </Grid>

                {/*selectedLocation.LocationId !== -99 && (
                  <Grid item xs={12} style={{ marginTop: -26 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!currencyDisabled}
                          onChange={onCurrencyCheckboxChange}
                          color="primary"
                        />
                      }
                      label="Allow editing of currency"
                    />
                  </Grid>
                )*/}

                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    multiline
                    rows={4}
                    rowsMax={8}
                    fullWidth
                    variant="filled"
                    placeholder="Goods & Items have a story. Tell your story here"
                    value={formState.Description || ""}
                    onChange={(e) => onAnyChange(e, "Description")}
                    InputProps={{
                      endAdornment: selectedLocation.LocationId !== -99 && (
                        <InputAdornment position="end">
                          <IconButton
                            disabled={
                              formState.Description ===
                              selectedLocation.Description
                            }
                            onClick={(e) => resetTextField(e, "Description")}
                          >
                            <UndoIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Thank you message"
                    multiline
                    rows={4}
                    rowsMax={8}
                    fullWidth
                    variant="filled"
                    placeholder="Message to display on mobile phone, after the client pays for the purchased items"
                    value={formState.ByeBye || ""}
                    onChange={(e) => onAnyChange(e, "ByeBye")}
                    InputProps={{
                      endAdornment: selectedLocation.LocationId !== -99 && (
                        <InputAdornment position="end">
                          <IconButton
                            disabled={
                              formState.ByeBye === selectedLocation.ByeBye
                            }
                            onClick={(e) => resetTextField(e, "ByeBye")}
                          >
                            <UndoIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </form>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={closeDialogForm}
            color="primary"
            autoFocus
            disabled={
              updateLocationStatus === status.loading ||
              createLocationStatus === status.loading
            }
            variant="contained"
          >
            Cancel
          </Button>
          <div style={{ flexGrow: 1 }} />

          <Button
            form="location-form"
            type="submit"
            color="primary"
            disabled={
              updateLocationStatus === status.loading ||
              createLocationStatus === status.loading ||
              isFormSame
            }
            variant="contained"
          >
            {selectedLocation.LocationId === -99 ? "Create" : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      {/** editing currency warning dialog */}
      <Dialog open={Boolean(tmpCurrency)} maxWidth="xs">
        <DialogTitle>Edit currency of this location?</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Editing currency can conflict with prices quoted for Goods & Items
            of this location. Are you sure?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            color="primary"
            onClick={cancelCurrencyChange}
            variant="contained"
          >
            Cancel
          </Button>
          <div style={{ flexGrow: 1 }} />

          <Button
            color="primary"
            onClick={acceptCurrencyChange}
            variant="contained"
          >
            Change
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationForm);
