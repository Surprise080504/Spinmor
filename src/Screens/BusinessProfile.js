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

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import UndoIcon from "@material-ui/icons/Undo";

import {
  readBusinessAction,
  setReadBusinessStatus,
  updateBusinessAction,
  setUpdateBusinessStatus,
} from "../Redux/AppReducer/App.act";
import { drawerWidth } from "../Assets/consts";
import { status } from "../api/api";
import countries from "../Assets/countries";

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

  profileContainer: {
    paddingTop: theme.spacing(3),
    marginBottom: 0,
  },
  form: {
    padding: theme.spacing(0.5 * 3), //this should match the spacing prop of first Grid component
    // width: "100%",
  },
  option: {
    fontSize: 15,
    "& > span": {
      marginRight: 10,
      fontSize: 18,
    },
  },
  submit: {
    maxWidth: 250,
  },
}));

const mapStateToProps = ({ AppReducer }) => ({
  isMenuOpen: AppReducer.isMenuOpen,

  businessInfo: AppReducer.businessInfo,
  readBusinessStatus: AppReducer.readBusinessStatus,
  updateBusinessStatus: AppReducer.updateBusinessStatus,
});
const mapDispatchToProps = (dispatch) => ({
  readBusinessAction: bindActionCreators(readBusinessAction, dispatch),
  setReadBusinessStatus: bindActionCreators(setReadBusinessStatus, dispatch),
  updateBusinessAction: bindActionCreators(updateBusinessAction, dispatch),
  setUpdateBusinessStatus: bindActionCreators(
    setUpdateBusinessStatus,
    dispatch
  ),
});

function BusinessProfile({
  isMenuOpen,

  businessInfo,

  readBusinessStatus,
  readBusinessAction,
  setReadBusinessStatus,

  updateBusinessStatus,
  updateBusinessAction,
  setUpdateBusinessStatus,
}) {
  const classes = useStyles();

  React.useEffect(() => {
    if (readBusinessStatus === status.not_started) {
      readBusinessAction();
    }
  }, [readBusinessAction, readBusinessStatus]);

  React.useEffect(() => {
    return function cleanup() {
      setReadBusinessStatus(status.not_started);
      setUpdateBusinessStatus(status.not_started);
    };
  }, [setReadBusinessStatus, setUpdateBusinessStatus]);

  const [formState, setFormState] = React.useState(businessInfo);
  React.useEffect(() => {
    const userCountry = businessInfo.country || "";

    setFormState({
      ...businessInfo,
      country: countries.find(
        (c) => c.label.toLowerCase() === userCountry.toLowerCase()
      ),
    });
  }, [businessInfo]);

  const onAnyChange = (e, field) => {
    if (updateBusinessStatus === status.finish) {
      setUpdateBusinessStatus(status.not_started);
    }

    let value = null;
    if (field === "country") {
      value = e;
    } else {
      value = e.target.value;
    }

    const newFormState = { ...formState };
    newFormState[field] = value;
    setFormState(newFormState);
  };
  const resetTextField = (e, field) => {
    e.preventDefault();
    const newFormState = { ...formState };
    newFormState[field] = businessInfo[field];
    setFormState(newFormState);
  };

  const onSubmitForm = (e) => {
    e.preventDefault();

    const formData = {};
    if (formState.businessName !== businessInfo.businessName) {
      formData["BusinessName"] = formState.businessName;
    }
    if (formState.streetAddress1 !== businessInfo.streetAddress1) {
      formData["StreetAddress1"] = formState.streetAddress1;
    }
    if (formState.streetAddress2 !== businessInfo.streetAddress2) {
      formData["StreetAddress2"] = formState.streetAddress2;
    }
    if (formState.suburb !== businessInfo.suburb) {
      formData["Suburb"] = formState.suburb;
    }
    if (formState.state !== businessInfo.state) {
      formData["State"] = formState.state;
    }
    if (formState?.country?.label !== businessInfo.country) {
      formData["Country"] = formState.country.label;
    }

    updateBusinessAction(formData);
  };

  return (
    <Grid
      container
      className={clsx(
        classes.content,
        isMenuOpen && classes.contentShift,
        classes.profileContainer
      )}
      direction="column"
      alignItems="flex-start"
      spacing={3}
    >
      <div className={classes.drawerHeader} />

      {/*<Grid item>
        <Typography variant="h2" component="h1">
          Business profile information
        </Typography>
      </Grid>*/}

      {readBusinessStatus === status.loading && (
        <Grid item>
          <CircularProgress />
        </Grid>
      )}

      {readBusinessStatus.split(" ")[0] === status.error && (
        <Grid item>
          <Typography color="error">
            There was an error getting your business profile information:{" "}
            {readBusinessStatus.split(" ")[1]}
          </Typography>
        </Grid>
      )}

      {readBusinessStatus === status.finish && (
        <Grid item>
          <Typography variant="h6">
            Update business profile
            <br />
            Click button below to save
          </Typography>
        </Grid>
      )}

      {readBusinessStatus === status.finish &&
        updateBusinessStatus.split(" ")[0] === status.error && (
          <Grid item>
            <Typography variant="body1" color="error">
              There was an error updating your business profile information:{" "}
              {updateBusinessStatus.split(" ")[1]}
            </Typography>
          </Grid>
        )}

      {updateBusinessStatus === status.finish && (
        <Grid item>
          <Typography variant="body1" color="primary">
            Profile updated
          </Typography>
        </Grid>
      )}

      {readBusinessStatus === status.finish && (
        <form onSubmit={onSubmitForm} className={classes.form}>
          <Grid
            container
            // direction="column"
            // alignItems="flex-start"
            spacing={3}
          >
            <Grid item xs={12}>
              <TextField
                label="Business Name"
                value={formState.businessName || ""}
                onChange={(e) => onAnyChange(e, "businessName")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        disabled={
                          formState.businessName === businessInfo.businessName
                        }
                        onClick={(e) => resetTextField(e, "businessName")}
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
                value={formState.streetAddress1 || ""}
                onChange={(e) => onAnyChange(e, "streetAddress1")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        disabled={
                          formState.streetAddress1 ===
                          businessInfo.streetAddress1
                        }
                        onClick={(e) => resetTextField(e, "streetAddress1")}
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
                value={formState.streetAddress2 || ""}
                onChange={(e) => onAnyChange(e, "streetAddress2")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        disabled={
                          formState.streetAddress2 ===
                          businessInfo.streetAddress2
                        }
                        onClick={(e) => resetTextField(e, "streetAddress2")}
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
                value={formState.suburb || ""}
                onChange={(e) => onAnyChange(e, "suburb")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        disabled={formState.suburb === businessInfo.suburb}
                        onClick={(e) => resetTextField(e, "suburb")}
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
                value={formState.state || ""}
                onChange={(e) => onAnyChange(e, "state")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        disabled={formState.state === businessInfo.state}
                        onClick={(e) => resetTextField(e, "state")}
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
                style={{ maxWidth: 250 }}
                value={formState.country || countries[0]}
                disableClearable
                onChange={(e, newValue) => onAnyChange(newValue, "country")}
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
                    variant="outlined"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password", // disable autocomplete and autofill
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                className={classes.submit}
                disabled={
                  updateBusinessStatus === status.loading ||
                  isEqual(
                    {
                      ...formState,
                      country: formState.country.label ?? businessInfo.country,
                    },
                    businessInfo
                  )
                }
                startIcon={
                  updateBusinessStatus === status.loading && (
                    <CircularProgress size="0.8125rem" color="primary" />
                  )
                }
              >
                Update Business Profile
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Grid>
  );
}

function countryToFlag(isoCode) {
  return typeof String.fromCodePoint !== "undefined"
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char) =>
          String.fromCodePoint(char.charCodeAt(0) + 127397)
        )
    : isoCode;
}

export default connect(mapStateToProps, mapDispatchToProps)(BusinessProfile);
