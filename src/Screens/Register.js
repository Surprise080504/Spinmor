import React from "react";

// import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

import RegisterPage from "../Components/Register/RegisterPage";
import RegisterSuccess from "../Components/Register/RegisterSuccess";
import { status } from "../api/api";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
  },
}));

const mapStateToProps = ({ AppReducer }) => ({
  registerStatus: AppReducer.registerStatus,
});
const mapDispatchToProps = () => ({
  // registerAction: bindActionCreators(registerAction, dispatch),
});

function Register({ registerStatus }) {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="sm" className={classes.root}>
      {registerStatus !== status.finish ? (
        <RegisterPage />
      ) : (
        <RegisterSuccess />
      )}
    </Container>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
