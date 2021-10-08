import React from "react";
// import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import { drawerWidth } from "../Assets/consts";
// import { status } from "../api/api";
// import { setSelectedLocation } from "../Redux/LocationReducer/Location.act";
import GoodsTable from "../Components/Good/GoodsTable";
import GoodForm from "../Components/Good/GoodForm";
import UploadImageComponent from "../Components/Good/UploadImageComponent";

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

  goodContainer: {
    paddingTop: theme.spacing(3),
    marginBottom: 0,
  },
}));

const mapStateToProps = ({ AppReducer, GoodReducer }) => ({
  isMenuOpen: AppReducer.isMenuOpen,

  selectedGood: GoodReducer.selectedGood,
  uploadGoodImageQR: GoodReducer.uploadGoodImageQR,
});
const mapDispatchToProps = (dispatch) => ({
  // setSelectedLocation: bindActionCreators(setSelectedLocation, dispatch),
});

function Goods({ isMenuOpen, selectedGood, uploadGoodImageQR }) {
  const classes = useStyles();

  const exampleGood = React.useMemo(() => ({}), []);

  return (
    <Grid
      container
      className={clsx(
        classes.content,
        isMenuOpen && classes.contentShift,
        classes.goodContainer
      )}
      direction="column"
      alignItems="flex-start"
      spacing={3}
    >
      <div className={classes.drawerHeader} />

      <Grid item>
        <Typography variant="h2" component="h1">
          Create & View
        </Typography>
      </Grid>

      <GoodsTable />
      {uploadGoodImageQR && <UploadImageComponent />}

      {selectedGood.ItemListId !== -1 && <GoodForm exampleGood={exampleGood} />}
    </Grid>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Goods);
