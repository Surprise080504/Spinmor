import React from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Link from "@material-ui/core/Link";
import Autocomplete from "@material-ui/lab/Autocomplete";
import InputAdornment from "@material-ui/core/InputAdornment";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";

import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import { registerAction } from "../../Redux/AppReducer/App.act";
import { status } from "../../api/api";
import countries from "../../Assets/countries";
import currencies from "../../Assets/currencies";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
  },

  title: {
    padding: theme.spacing(2, 2, 1, 2),
  },
  error: {
    color: theme.palette.error.main,
    padding: theme.spacing(1, 2, 2, 2),
  },
  option: {
    fontSize: 15,
    "& > span": {
      marginRight: 10,
      fontSize: 18,
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  loginInstead: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(4),
  },
}));

const mapStateToProps = ({ AppReducer }) => ({
  registerStatus: AppReducer.registerStatus,
});
const mapDispatchToProps = (dispatch) => ({
  registerAction: bindActionCreators(registerAction, dispatch),
});

function RegisterPage({ registerStatus, registerAction }) {
  const classes = useStyles();

  const [chosenPrefix, setChosenPrefix] = React.useState("");
  const [chosenCurrency, setChosenCurrency] = React.useState("");
  const onCountryChange = (newCountry) => {
    setChosenPrefix(newCountry.phone);
    setChosenCurrency(newCountry.suggestedCurrency);
  };

  const formRef = React.useRef(null);
  const [submitDisabled, setSubmitDisabled] = React.useState(false);

  const onSubmitForm = (e) => {
    e.preventDefault();

    const formData = {
      FirstName: formRef.current.firstName.value,
      LastName: formRef.current.lastName.value,
      Email: formRef.current.email.value,
      Password: formRef.current.password.value,
      Country: formRef.current.country.value,
      Mobile: formRef.current.mobile.value,
      Operator: formRef.current.businessName.value,
      UserType: "operator admin",
      CountryCode: "+" + chosenPrefix,
      CurrencySymbol: chosenCurrency,
    };
    registerAction(formData);
  };

  const [emailConfirmError, setEmailConfirmError] = React.useState(null);
  const onEmailChange = () => {
    if (!formRef.current.confirmEmail.value) {
      return;
    }

    if (formRef.current.email.value !== formRef.current.confirmEmail.value) {
      setEmailConfirmError("email does not match");
      setSubmitDisabled(true);
    } else {
      setEmailConfirmError(null);
      setSubmitDisabled(false);
    }
  };

  const [passwordConfirmError, setPasswordConfirmError] = React.useState(null);
  const [passwordStrengthErrors, setPasswordStrengthErrors] = React.useState(
    []
  );
  const onPasswordChange = () => {
    let strengthErrors = [];
    const pass = formRef.current.password.value;
    if (pass.length < 10) {
      strengthErrors.push("- 10 characters");
    }
    if (!/\d/.test(pass)) {
      strengthErrors.push("- 1 digit");
    }
    if (!/[a-z]/.test(pass)) {
      strengthErrors.push("- 1 lowercase letter");
    }
    if (!/[A-Z]/.test(pass)) {
      strengthErrors.push("- 1 uppercase letter");
    }
    if (!/[!#\$&\*]/.test(pass)) {
      strengthErrors.push("- 1 symbol: ! # $ & *");
    }
    if (/\s/.test(pass)) {
      strengthErrors.push("- can not contain spaces");
    }

    if (strengthErrors.length > 0) {
      strengthErrors.unshift("Password must include at least:");
      setPasswordStrengthErrors(strengthErrors);
      setSubmitDisabled(true);
    } else {
      setPasswordStrengthErrors([]);
      setSubmitDisabled(false);
    }

    //
    //is matching
    if (!formRef.current.confirmPassword.value) {
      return;
    }

    if (
      formRef.current.password.value !== formRef.current.confirmPassword.value
    ) {
      setPasswordConfirmError("password does not match");
      setSubmitDisabled(true);
    } else {
      setPasswordConfirmError(null);
      setSubmitDisabled(false);
    }
  };

  //
  //mobile number validation
  const [mobileErrors, setMobileErrors] = React.useState([]);
  const onMobileChange = React.useCallback(() => {
    const mobile = formRef.current.mobile.value;
    if (mobile === "") {
      setMobileErrors([]);
      setSubmitDisabled(false);
      return;
    }

    const errors = [];

    if (!/^\d+$/.test(mobile)) {
      errors.push("- can contain digits only");
    }
    if (mobile[0] == 0) {
      errors.push("- first digit can not be 0");
    }
    const countryOfPrefix = countries.find(
      (country) => country.phone == chosenPrefix
    );
    if (
      mobile.length < countryOfPrefix.minLengthNoZero ||
      mobile.length > countryOfPrefix.maxLengthNoZero
    ) {
      errors.push("- incorrect length");
    }

    if (errors.length > 0) {
      errors.unshift("Mobile phone format incorrect:");
      setMobileErrors(errors);
      setSubmitDisabled(true);
    } else {
      setMobileErrors([]);
      setSubmitDisabled(false);
    }
  }, [chosenPrefix]);
  React.useEffect(() => {
    onMobileChange();
  }, [chosenPrefix, onMobileChange]);

  // React.useEffect(() => {
  //   console.log(
  //     formRef.current.acceptTerms.setCustomValidity(
  //       "Please accept terms & conditions to continue"
  //     )
  //   );
  // }, [formRef]);

  const [prefixesAnchorEl, setPrefixesAnchorEl] = React.useState(null);
  const onPrefixesMenuClick = (event) => {
    setPrefixesAnchorEl(event.currentTarget);
  };
  const closePrefixesMenu = () => {
    setPrefixesAnchorEl(null);
  };

  //
  //currencies menu
  const [currenciesAnchorEl, setCurrenciesAnchorEl] = React.useState(null);
  const onCurrenciesMenuClick = (event) => {
    setCurrenciesAnchorEl(event.currentTarget);
  };
  const closeCurrenciesMenu = () => {
    setCurrenciesAnchorEl(null);
  };

  //
  //passwords visibility
  const [isPassVisible, setIsPassVisible] = React.useState(false);
  const [isConfirmPassVisible, setIsConfirmPassVisible] = React.useState(false);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Grid
      container
      justify="space-evenly"
      alignItems="center"
      alignContent="center"
      className={classes.root}
      direction="column"
    >
      <Grid item className={classes.title}>
        <Typography variant="h4" component="h1" align="center">
          Welcome to Spinmor!
          <br />
          <Typography variant="h5">Please register to continue</Typography>
        </Typography>
      </Grid>

      <Grid item xs={12} className={classes.error}>
        {registerStatus.split(" ")[0] === status.error && (
          <Typography>
            An error ocurred:{" "}
            {registerStatus.split(" ")[2]
              ? registerStatus.split(" ").slice(2).join(" ")
              : registerStatus.split(" ")[1]}
          </Typography>
        )}
      </Grid>

      <form onSubmit={onSubmitForm} ref={formRef}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="firstName"
              autoComplete="given-name"
              required
              id="firstName"
              variant="outlined"
              fullWidth
              label="First Name"
              autoFocus
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="lastName"
              autoComplete="family-name"
              required
              id="lastName"
              variant="outlined"
              fullWidth
              label="Last Name"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="email"
              autoComplete="email"
              required
              type="email"
              id="email"
              variant="outlined"
              fullWidth
              label="Email Address"
              onChange={onEmailChange}
              helperText="email will be used as username"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="confirmEmail"
              required
              type="email"
              id="confirm-email"
              variant="outlined"
              fullWidth
              label="Confirm Email"
              error={Boolean(emailConfirmError)}
              helperText={emailConfirmError}
              onChange={onEmailChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="password"
              autoComplete="new-password"
              required
              type={isPassVisible ? "new-password" : "password"}
              id="password"
              variant="outlined"
              fullWidth
              label="Password"
              onChange={onPasswordChange}
              error={passwordStrengthErrors.length > 0}
              helperText={passwordStrengthErrors.map(
                (strengthError, strengthErrorI) => (
                  <span key={strengthErrorI}>
                    {strengthError}
                    {strengthErrorI !== passwordStrengthErrors.length - 1 && (
                      <br />
                    )}
                  </span>
                )
              )}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setIsPassVisible((prevVal) => !prevVal)}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {isPassVisible ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="confirmPassword"
              required
              type={isConfirmPassVisible ? "new-password" : "password"}
              id="confirm-password"
              variant="outlined"
              fullWidth
              label="Confirm Password"
              error={Boolean(passwordConfirmError)}
              helperText={passwordConfirmError}
              onChange={onPasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() =>
                        setIsConfirmPassVisible((prevVal) => !prevVal)
                      }
                      onMouseDown={handleMouseDownPassword}
                    >
                      {isConfirmPassVisible ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="businessName"
              autoComplete="organization"
              required
              id="business-name"
              variant="outlined"
              fullWidth
              label="Business Name"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              fullWidth
              id="country-select"
              options={countries}
              classes={{
                option: classes.option,
              }}
              autoHighlight
              onChange={(e, newValue) => onCountryChange(newValue)}
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
                    name: "country",
                    required: true,
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="mobile"
              autoComplete="tel"
              id="mobile"
              variant="outlined"
              fullWidth
              label="Mobile Phone"
              type="tel"
              onChange={onMobileChange}
              error={mobileErrors.length > 0}
              helperText={mobileErrors.map((mobileError, mobileErrorI) => (
                <span>
                  {mobileError}
                  {mobileErrorI !== mobileErrors.length - 1 && <br />}
                </span>
              ))}
              disabled={!chosenPrefix}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Button
                      onClick={onPrefixesMenuClick}
                      aria-controls="prefixes-menu"
                      aria-haspopup="true"
                    >
                      +{chosenPrefix}
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
                          onClick={() => setChosenPrefix(country.phone)}
                        >
                          +{country.phone}
                        </MenuItem>
                      ))}
                    </Menu>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Button
              onClick={onCurrenciesMenuClick}
              aria-controls="currencies-menu"
              aria-haspopup="true"
              variant="outlined"
              endIcon={<ExpandMoreIcon />}
            >
              {chosenCurrency !== "" ? chosenCurrency : "Select currency"}
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
                  onClick={() => setChosenCurrency(currency.iso)}
                >
                  {currency.iso}
                </MenuItem>
              ))}
            </Menu>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox name="acceptTerms" required color="primary" />}
              label={
                <Typography variant="body2">
                  I accept the&nbsp;
                  <Link
                    variant="body2"
                    href="https://www.google.com"
                    target="_blank"
                  >
                    Terms and conditions
                  </Link>
                </Typography>
              }
            />
          </Grid>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={submitDisabled || registerStatus === status.loading}
            startIcon={
              registerStatus === status.loading && (
                <CircularProgress size="0.8125rem" color="primary" />
              )
            }
          >
            Sign Up
          </Button>
        </Grid>

        <Grid container justify="flex-end">
          <Grid item className={classes.loginInstead}>
            <Link variant="body2" component={RouterLink} to="/login">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);
