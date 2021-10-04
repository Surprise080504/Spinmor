import React from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { makeStyles } from "@material-ui/core/styles";

import { supportAction } from "../../Redux/AppReducer/App.act";
import { status } from "../../api/api";
import spinmorLogo from "../../Assets/images/logo.jpeg";
import PresentationSuccess from "./PresentationSuccess";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
  },

  logo: {
    marginTop: theme.spacing(3),
  },
  logoLink: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    padding: theme.spacing(2, 2, 2, 2),
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
  supportStatus: AppReducer.supportStatus,
});
const mapDispatchToProps = (dispatch) => ({
  supportAction: bindActionCreators(supportAction, dispatch),
});

const timeOptions = [
  { label: "Morning" },
  { label: "Mid-Day" },
  { label: "Early Afternoon" },
  { label: "Evening" },
  { label: "Late Evening" },
];

function PresentationPage({ supportStatus, supportAction }) {
  const classes = useStyles();

  const formRef = React.useRef(null);

  const onSubmitForm = (e) => {
    e.preventDefault();

    const formData = {
      propertyUrl: formRef.current.propertyUrl.value,
      firstName: formRef.current.firstName.value,
      lastName: formRef.current.lastName.value,
      email: formRef.current.email.value,
      preferredTime: formRef.current.preferredTime.value,
    };
    supportAction(JSON.stringify(formData, null, 2), true);
  };

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      alignContent="center"
      className={classes.root}
      direction="column"
    >
      <div className={classes.logo}>
        <a
          className={classes.logoLink}
          href="https://www.spinmor.com/"
          target="_blank"
          rel="noreferrer"
        >
          <img src={spinmorLogo} alt="logo" height={78} />
          <Typography variant="h6">www.spinmor.com</Typography>
        </a>
      </div>

      <Grid item className={classes.title}>
        <Typography variant="h4" align="center" component="h1" color="primary">
          Book one to one Online Presentation
        </Typography>
      </Grid>

      {supportStatus !== status.finish ? (
        <>
          {supportStatus.split(" ")[0] === status.error && (
            <Grid item xs={12} className={classes.error}>
              <Typography>
                An error ocurred:{" "}
                {supportStatus.split(" ")[2]
                  ? supportStatus.split(" ").slice(2).join(" ")
                  : supportStatus.split(" ")[1]}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="h6" component="p">
              In this 30 minute presentation session you will learn how Spinmor
              benefits Airbnb and other STR property hosts, and how you can
              implement Spinmor at your property /properties.
              <br />
              <br />
              After the presentation we I will conduct free discussion and
              answer questions.
              <br />
              This session is for property owners and hosts only who are not
              Property Managers.
              <br />
              <br />
            </Typography>
          </Grid>

          <form onSubmit={onSubmitForm} ref={formRef}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6">
                  For presentation to be relevant to you, please enter the URL
                  where you list your short stay property:
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="propertyUrl"
                  required
                  variant="outlined"
                  fullWidth
                  label="Property URL"
                  autoComplete="propertyUrl"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="firstName"
                  autoComplete="given-name"
                  required
                  id="firstName"
                  variant="outlined"
                  fullWidth
                  label="First Name"
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
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Autocomplete
                  fullWidth
                  id="time-select"
                  options={timeOptions}
                  classes={{
                    option: classes.option,
                  }}
                  openOnFocus
                  autoHighlight
                  // onChange={(e, newValue) => onCountryChange(newValue)}
                  getOptionLabel={(option) => option.label}
                  renderOption={(option) => (
                    <React.Fragment>{option.label}</React.Fragment>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Preferred Time"
                      variant="outlined"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password", // disable autocomplete and autofill
                        name: "preferredTime",
                        required: true,
                      }}
                    />
                  )}
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
                disabled={supportStatus === status.loading}
                startIcon={
                  supportStatus === status.loading && (
                    <CircularProgress size="0.8125rem" color="primary" />
                  )
                }
              >
                Sign Up
              </Button>
            </Grid>
          </form>
        </>
      ) : (
        <PresentationSuccess />
      )}
    </Grid>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(PresentationPage);
