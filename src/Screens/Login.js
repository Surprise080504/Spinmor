import React from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { Link as RouterLink, useLocation } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Link from "@material-ui/core/Link";

import { makeStyles } from "@material-ui/core/styles";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import EmailIcon from "@material-ui/icons/Email";

import { tokenAction } from "../Redux/AppReducer/App.act";
import { status } from "../api/api";
import spinmorLogo from "../Assets/images/logo.jpeg";
import welcomeImage from "../Assets/images/welcomeImage.png";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    minWidth: "100%",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  textField: {
    minWidth: 300,
  },

  inputContainer: {
    minHeight: 250,
  },
  formElement: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: 200,
  },

  logoContainer: {
    position: "absolute",
    top: 24,
    left: 24,
  },
  descriptionContainer: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      marginTop: theme.spacing(15),
    },
  },
  sandboxImage: {
    padding: theme.spacing(1),
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(10),
  },
  descriptionSectionMargin: {
    marginBottom: theme.spacing(0.5),
  },
  justifyText: {
    textAlign: "justify",
    "text-justify": "inter-word",
  },
  smartStyle: {
    fontSize: "2.5rem",
    fontFamily: "Brush Script MT",
  },
  alreadyRegistered: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

const mapStateToProps = ({ AppReducer }) => ({
  isTokenCallLoading: AppReducer.isTokenCallLoading,
  tokenCallError: AppReducer.tokenCallError,
  initializationStatus: AppReducer.initializationStatus,
});
const mapDispatchToProps = (dispatch) => ({
  tokenAction: bindActionCreators(tokenAction, dispatch),
});

function Login({ isTokenCallLoading, tokenCallError, tokenAction }) {
  const classes = useStyles();

  const location = useLocation();
  const [verificationLevel, setVerificationLevel] = React.useState(
    "not verified"
  );
  React.useEffect(() => {
    //
    const verify = new URLSearchParams(location.search).get("verify");
    if (verify === "true") {
      setVerificationLevel("recent");
      return;
    }

    const oneWeekMs = 604800016;

    //
    const registrationSuccessTime =
      localStorage.getItem("@registrationSuccessTime") || 0;
    if (Date.now() - parseInt(registrationSuccessTime) < oneWeekMs) {
      setVerificationLevel("last week");
      return;
    }

    //
    const latestTokenResponseTime =
      localStorage.getItem("@latestTokenResponseTime") || 0;
    if (Date.now() - parseInt(latestTokenResponseTime) < oneWeekMs) {
      setVerificationLevel("last week");
      return;
    }

    setVerificationLevel("not verified");
  }, [location.search]);

  //
  //
  const [email, setEmail] = React.useState("");

  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = (e) => {
    e.preventDefault();
    tokenAction(email, password);
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
      <div className={classes.logoContainer}>
        <a href="https://www.spinmor.com/" target="_blank" rel="noreferrer">
          <img src={spinmorLogo} alt="logo" height={96} />
        </a>
      </div>

      {/*<Grid item>
        <Typography variant="h3" component="h1" align="center">
          Please login to continue
        </Typography>
      </Grid>*/}

      {verificationLevel === "not verified" && (
        <Grid container item xs={12} sm={12} md={8} lg={6} xl={6}>
          <div className={classes.descriptionContainer}>
            <Typography
              variant="h6"
              component="p"
              className={classes.justifyText}
            >
              <span>Welcome to Spinmor Operator Web Platform</span>
              <br />
              <br />

              <span>
                “Sandbox” is safe environment where you can learn, test, and
                create locations and items, without creating or committing to
                any financial transaction or affecting business data.
              </span>
              {/*<span>
              Welcome to Spinmor Opertor's web platform, where business owners
              and sellers set up their business.
            </span>

            <br />
            <span>By default your new business is set as "Sandbox".</span>

            <br />
            <span>
              Sandbox is the testing environment of all Spinmor Spinmor
              features.
            </span>

            <br />
            <span>
              Step by step we guide you to create items, generate and print QR
              codes.
            </span>*/}
            </Typography>
            <img
              src={welcomeImage}
              alt="sandbox"
              height={160}
              className={classes.sandboxImage}
            />
          </div>

          <Grid item>
            <Typography variant="h6">
              <br />
              <span>
                <span className={classes.smartStyle}>Smart Homepage Guide</span>{" "}
                is our step by step process to introduce you to how Spinmor
                business operates and provide you tool to safely explore Spinmor
                functionality.
              </span>

              <br />
              <br />
              <span>
                You will experience Spinmor as customer, using Spinmor App to
                scan items, add to basket, go to checkpoint, and "virtually"
                pay.
              </span>

              <br />
              <br />
              <Link component={RouterLink} to="/register">
                Click here to Register
              </Link>
            </Typography>
          </Grid>
        </Grid>
      )}

      <Grid item>
        {isTokenCallLoading && (
          <CircularProgress style={{ alignSelf: "center" }} size="3rem" />
        )}

        {tokenCallError && (
          <Typography>An error while logging in: {tokenCallError}</Typography>
        )}

        {localStorage.getItem("@initializationStatus") ===
          status.error_exchange && (
            <Typography>
              An error while getting exchange rates, please try again
            </Typography>
          )}

        {localStorage.getItem("@initializationStatus") ===
          status.error_login && (
            <Typography>
              An error while getting your info, please try again
            </Typography>
          )}
      </Grid>

      <Grid
        container
        item
        direction="column"
        alignItems="center"
        justify="space-between"
        className={classes.inputContainer}
      >
        <Grid item className={classes.alreadyRegistered}>
          <Typography>Already registered? Please login</Typography>
        </Grid>

        <form
          autoComplete="on"
          onSubmit={handleLogin}
          className={classes.formElement}
        >
          <Grid item>
            <TextField
              value={email}
              label="email"
              // type="email"
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              className={classes.textField}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item>
            <TextField
              value={password}
              label="password"
              type={showPassword ? "text" : "password"}
              autoComplete="on"
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              className={classes.textField}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((prevVal) => !prevVal)}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item style={{ alignSelf: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isTokenCallLoading}
            >
              login
            </Button>
          </Grid>
        </form>

        {(verificationLevel === "last week" ||
          verificationLevel === "not verified") && (
            <Grid
              container
              item
              direction="row"
              justify="space-between"
              alignItems="center"
              xl={4}
              lg={4}
              md={4}
              sm={6}
              xs={12}
            >
              {/*<Grid item>
            <Button variant="outlined" color="primary">
              forgot password
            </Button>
          </Grid>*/}

              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  component={RouterLink}
                  to="/register"
                >
                  register
                </Button>
              </Grid>
            </Grid>
          )}
      </Grid>
    </Grid>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
