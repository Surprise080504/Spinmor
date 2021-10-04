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
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import UndoIcon from "@material-ui/icons/Undo";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import {
  readProfileAction,
  setReadProfileStatus,
  updateProfileAction,
  setUpdateProfileStatus,
} from "../Redux/AppReducer/App.act";
import { drawerWidth } from "../Assets/consts";
import { status } from "../api/api";
import countries from "../Assets/countries";
import currencies from "../Assets/currencies";

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
    maxWidth: 200,
  },
}));

const mapStateToProps = ({ AppReducer }) => ({
  isMenuOpen: AppReducer.isMenuOpen,

  userInfo: AppReducer.userInfo,
  readProfileStatus: AppReducer.readProfileStatus,
  updateProfileStatus: AppReducer.updateProfileStatus,
});
const mapDispatchToProps = (dispatch) => ({
  readProfileAction: bindActionCreators(readProfileAction, dispatch),
  setReadProfileStatus: bindActionCreators(setReadProfileStatus, dispatch),
  updateProfileAction: bindActionCreators(updateProfileAction, dispatch),
  setUpdateProfileStatus: bindActionCreators(setUpdateProfileStatus, dispatch),
});

function UserProfile({
  isMenuOpen,

  userInfo,

  readProfileStatus,
  readProfileAction,
  setReadProfileStatus,

  updateProfileStatus,
  updateProfileAction,
  setUpdateProfileStatus,
}) {
  const classes = useStyles();

  //
  //
  React.useEffect(() => {
    if (readProfileStatus === status.not_started) {
      readProfileAction();
    }
  }, [readProfileAction, readProfileStatus]);

  //
  //
  React.useEffect(() => {
    return function cleanup() {
      setReadProfileStatus(status.not_started);
      setUpdateProfileStatus(status.not_started);
    };
  }, [setReadProfileStatus, setUpdateProfileStatus]);

  //
  //
  const [formState, setFormState] = React.useState(userInfo);
  React.useEffect(() => {
    const userCountry = userInfo.country || "";
    const userCountryCode = userInfo.countryCode
      ? userInfo.countryCode?.trim?.()
      : "";

    setFormState({
      ...userInfo,
      country: countries.find(
        (c) => c.label.toLowerCase() === userCountry.toLowerCase()
      ),
      countryCode: userCountryCode,
    });
  }, [userInfo]);

  //
  //
  const onAnyChange = (e, field) => {
    if (updateProfileStatus === status.finish) {
      setUpdateProfileStatus(status.not_started);
    }

    let value = null;
    if (field === "country") {
      value = e;
    } else if (field === "countryCode") {
      value = e;
    } else if (field === "currencySymbol") {
      value = e;
    } else {
      value = e.target.value;
    }

    const newFormState = { ...formState };
    newFormState[field] = value;
    setFormState(newFormState);

    if (field === "countryCode") {
      closePrefixesMenu();
    }
  };
  const resetTextField = (e, field) => {
    e.preventDefault();
    const newFormState = { ...formState };
    newFormState[field] = userInfo[field];
    setFormState(newFormState);
  };

  //
  //
  const onSubmitForm = (e) => {
    e.preventDefault();

    const formData = {};

    if (formState.firstName !== userInfo.firstName) {
      formData["FirstName"] = formState.firstName;
    }
    if (formState.lastName !== userInfo.lastName) {
      formData["LastName"] = formState.lastName;
    }
    if (formState.email !== userInfo.email) {
      formData["Email"] = formState.email;
    }
    if (formState?.country?.label?.trim?.() !== userInfo?.country?.trim?.()) {
      formData["Country"] = formState.country;
    }
    if (formState?.countryCode?.trim?.() !== userInfo?.countryCode?.trim?.()) {
      formData["CountryCode"] = "+" + formState.countryCode;
    }
    if (
      formState?.currencySymbol?.trim?.() !== userInfo?.currencySymbol?.trim?.()
    ) {
      formData["CurrencySymbol"] = formState.currencySymbol;
    }

    updateProfileAction(formData);
  };

  //
  //
  const [prefixesAnchorEl, setPrefixesAnchorEl] = React.useState(null);
  const onPrefixesMenuClick = (event) => {
    setPrefixesAnchorEl(event.currentTarget);
  };
  const closePrefixesMenu = () => {
    setPrefixesAnchorEl(null);
  };

  //
  //
  const [currenciesAnchorEl, setCurrenciesAnchorEl] = React.useState(null);
  const onCurrenciesMenuClick = (event) => {
    setCurrenciesAnchorEl(event.currentTarget);
  };
  const closeCurrenciesMenu = () => {
    setCurrenciesAnchorEl(null);
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
          User profile information
        </Typography>
      </Grid>*/}

      {readProfileStatus === status.loading && (
        <Grid item>
          <CircularProgress />
        </Grid>
      )}

      {readProfileStatus.split(" ")[0] === status.error && (
        <Grid item>
          <Typography color="error">
            There was an error getting your profile information:{" "}
            {readProfileStatus.split(" ")[1]}
          </Typography>
        </Grid>
      )}

      {readProfileStatus === status.finish && (
        <Grid item>
          <Typography variant="h6">
            Update user profile
            <br />
            Click button below to save
          </Typography>
        </Grid>
      )}

      {readProfileStatus === status.finish &&
        updateProfileStatus.split(" ")[0] === status.error && (
          <Grid item>
            <Typography variant="body1" color="error">
              There was an error updating your profile information:{" "}
              {updateProfileStatus.split(" ")[1]}
            </Typography>
          </Grid>
        )}

      {updateProfileStatus === status.finish && (
        <Grid item>
          <Typography variant="body1" color="primary">
            Profile updated
          </Typography>
        </Grid>
      )}

      {readProfileStatus === status.finish && (
        <form onSubmit={onSubmitForm} className={classes.form}>
          <Grid
            container
            // direction="column"
            // alignItems="flex-start"
            spacing={3}
          >
            <Grid item xs={12}>
              <TextField
                label="First Name"
                value={formState.firstName || ""}
                onChange={(e) => onAnyChange(e, "firstName")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        disabled={formState.firstName === userInfo.firstName}
                        onClick={(e) => resetTextField(e, "firstName")}
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
                label="Last Name"
                value={formState.lastName || ""}
                onChange={(e) => onAnyChange(e, "lastName")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        disabled={formState.lastName === userInfo.lastName}
                        onClick={(e) => resetTextField(e, "lastName")}
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
                label="Mobile"
                value={formState.mobile || ""}
                onChange={(e) => onAnyChange(e, "mobile")}
                type="tel"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Button
                        onClick={onPrefixesMenuClick}
                        aria-controls="prefixes-menu"
                        aria-haspopup="true"
                      >
                        +{formState.countryCode}
                      </Button>
                      <Menu
                        id="prefixes-menu"
                        anchorEl={prefixesAnchorEl}
                        keepMounted
                        open={Boolean(prefixesAnchorEl)}
                        onClose={closePrefixesMenu}
                        onClick={closePrefixesMenu}
                        style={{ maxHeight: 350 }}
                      >
                        {countries.map((country) => (
                          <MenuItem
                            key={country.phone + "-" + country.code}
                            onClick={() =>
                              onAnyChange(country.phone, "countryCode")
                            }
                          >
                            +{country.phone}
                          </MenuItem>
                        ))}
                      </Menu>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        disabled={formState.mobile === userInfo.mobile}
                        onClick={(e) => resetTextField(e, "mobile")}
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
                label="Email"
                value={formState.email || ""}
                onChange={(e) => onAnyChange(e, "email")}
                type="email"
                required
                autoComplete="email"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        disabled={formState.email === userInfo.email}
                        onClick={(e) => resetTextField(e, "email")}
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
                label="Username"
                value={userInfo.email || ""}
                disabled
                helperText="You can not change username"
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      style={{ visibility: "hidden" }}
                    >
                      <IconButton
                        disabled={formState.email === userInfo.email}
                        onClick={(e) => resetTextField(e, "email")}
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
                onClick={onCurrenciesMenuClick}
                aria-controls="currencies-menu"
                aria-haspopup="true"
                variant="outlined"
                endIcon={<ExpandMoreIcon />}
              >
                {formState.currencySymbol !== ""
                  ? formState.currencySymbol
                  : "Select currency"}
              </Button>
              <Menu
                id="currencies-menu"
                anchorEl={currenciesAnchorEl}
                keepMounted
                open={Boolean(currenciesAnchorEl)}
                onClose={closeCurrenciesMenu}
                onClick={closeCurrenciesMenu}
                style={{ maxHeight: 350 }}
              >
                {currencies.map((currency) => (
                  <MenuItem
                    key={currency.iso}
                    onClick={() => onAnyChange(currency.iso, "currencySymbol")}
                  >
                    {currency.iso}
                  </MenuItem>
                ))}
              </Menu>
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
                  updateProfileStatus === status.loading ||
                  isEqual(
                    {
                      ...formState,
                      country: formState.country.label,
                      currencySymbol: formState?.currencySymbol?.trim?.(),
                    },
                    {
                      ...userInfo,
                      countryCode: userInfo?.countryCode?.trim?.(),
                      currencySymbol: userInfo?.currencySymbol?.trim?.(),
                    }
                  )
                }
                startIcon={
                  updateProfileStatus === status.loading && (
                    <CircularProgress size="0.8125rem" color="primary" />
                  )
                }
              >
                Update User Profile
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

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
