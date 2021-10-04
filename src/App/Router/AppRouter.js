import React from "react";
// import PropTypes from "prop-types";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { Switch, Redirect, useLocation } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";

import Register from "../../Screens/Register";
import Login from "../../Screens/Login";
import AppBarNav from "../../Components/Navigation/AppBarNav";
import Home from "../../Screens/Home";
import UserProfile from "../../Screens/UserProfile";
import BusinessProfile from "../../Screens/BusinessProfile";
import Locations from "../../Screens/Locations";
import Goods from "../../Screens/Goods";
import PrintLabels from "../../Screens/PrintLabels";
import PrintCards from "../../Screens/PrintCards";
import Print from "../../Screens/Print";
import Reports from "../../Screens/Reports";
import Application from "../../Screens/Application";
import Presentation from "../../Screens/Presentation";

import {
  loginAction,
  setInitializationStatus,
  logout,
  getHomePageAction,
  getApplicationStageAction,
} from "../../Redux/AppReducer/App.act";
import { status } from "../../api/api";

const useStyles = makeStyles((theme) => ({
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  //
  drawerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    // justifyContent: 'flex-end',
  },
}));

const mapStateToProps = ({ AppReducer }) => ({
  token: AppReducer.token,
  initializationStatus: AppReducer.initializationStatus,

  homePageStage: AppReducer.homePage.Stage,
  applicationStage: AppReducer.applicationStage,
});
const mapDispatchToProps = (dispatch) => ({
  loginAction: bindActionCreators(loginAction, dispatch),
  setInitializationStatus: bindActionCreators(
    setInitializationStatus,
    dispatch
  ),
  logout: bindActionCreators(logout, dispatch),

  getHomePageAction: bindActionCreators(getHomePageAction, dispatch),
  getApplicationStageAction: bindActionCreators(
    getApplicationStageAction,
    dispatch
  ),
});

const AppRouter = ({
  token,
  initializationStatus,
  loginAction,
  setInitializationStatus,
  logout,

  getHomePageAction,
  getApplicationStageAction,

  homePageStage,
  applicationStage,
}) => {
  const classes = useStyles();

  React.useEffect(() => {
    console.log("initializationStatus:", initializationStatus);

    if (!token) {
      return;
    }

    if (initializationStatus === status.finish) {
      return;
    }

    if (initializationStatus === status.not_started) {
      setInitializationStatus(`${status.loading} login`);
      getHomePageAction();
      getApplicationStageAction();
      loginAction();
    }

    if (initializationStatus === status.error_login) {
      logout();
      return;
    }

    if (initializationStatus === status.success_login) {
      setInitializationStatus(status.finish);
    }
  }, [
    token,
    initializationStatus,
    logout,
    loginAction,
    setInitializationStatus,
    getHomePageAction,
    getApplicationStageAction,
  ]);

  //
  //
  const location = useLocation();

  const [forceApplication, setForceApplication] = React.useState(false);
  React.useEffect(() => {
    if (homePageStage !== 5) {
      setForceApplication(false);
      return;
    }

    let shouldForce = false;

    if (applicationStage === "user") {
      shouldForce = true;
    } else if (applicationStage === "business") {
      shouldForce = true;
    } else if (applicationStage === "attachments") {
      shouldForce = true;
    } else if (applicationStage === "submitted") {
      shouldForce = true;
    } else {
      setForceApplication(false);
    }

    if (shouldForce) {
      if (location.pathname.split("/")[1] === "application") {
        setForceApplication(false);
      } else {
        setForceApplication(true);
      }
    }
  }, [homePageStage, applicationStage, location.pathname]);

  const [disableApplication, setDisableApplication] = React.useState(false);
  React.useEffect(() => {
    if (
      applicationStage !== "user" &&
      applicationStage !== "business" &&
      applicationStage !== "attachments" &&
      applicationStage !== "submitted"
    ) {
      setDisableApplication(true);
    } else {
      setDisableApplication(false);
    }
  }, [applicationStage]);

  //
  //
  return (
    <React.Fragment>
      {initializationStatus === status.finish &&
        location.pathname.split("/")[1] !== "presentation" && (
          <React.Fragment>
            <AppBarNav />
            {/*<div className={classes.drawerHeader} />*/}
          </React.Fragment>
        )}

      <Switch>
        <Redirect
          from="/:url*(/+)" //this Redirect removes trailing slashes
          to={window.location.pathname.slice(0, -1)}
        />

        <PublicRoute restricted={false} exact path="/presentation">
          <Presentation />
        </PublicRoute>

        {forceApplication && <Redirect to="/application" />}

        {disableApplication && <Redirect from="/application" to="/" />}

        <PublicRoute restricted={false} exact path="/register">
          <Register />
        </PublicRoute>

        <PublicRoute restricted={true} exact path="/login">
          <Login />
        </PublicRoute>

        <PrivateRoute exact path="/">
          <Home />
        </PrivateRoute>

        <PrivateRoute exact path="/profile/user">
          <UserProfile />
        </PrivateRoute>

        <PrivateRoute exact path="/profile/business">
          <BusinessProfile />
        </PrivateRoute>

        <PrivateRoute exact path="/locations">
          <Locations />
        </PrivateRoute>

        <PrivateRoute exact path="/goods">
          <Goods />
        </PrivateRoute>

        <PrivateRoute exact path="/print/labels">
          <PrintLabels />
        </PrivateRoute>

        <PrivateRoute exact path="/print/cards">
          <PrintCards />
        </PrivateRoute>

        <PrivateRoute exact path="/print/documents">
          <Print />
        </PrivateRoute>

        <PrivateRoute exact path="/orders">
          <Reports />
        </PrivateRoute>

        <PrivateRoute exact path="/application">
          <Application />
        </PrivateRoute>

        <PublicRoute path="*">
          <h1 style={{ marginTop: 100, marginLeft: 250 }}>
            error page / page not implemented yet
          </h1>
        </PublicRoute>
      </Switch>
    </React.Fragment>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);
