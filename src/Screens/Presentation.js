import React from "react";

// import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

import PresentationPage from "../Components/Presentation/PresentationPage";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
  },
}));

const mapStateToProps = ({ AppReducer }) => ({
  supportStatus: AppReducer.supportStatus,
});
const mapDispatchToProps = () => ({
  // registerAction: bindActionCreators(registerAction, dispatch),
});

function Presentation({ supportStatus }) {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="sm" className={classes.root}>
      <PresentationPage />
    </Container>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Presentation);
