import React from "react";
import PropTypes from "prop-types";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { Link, useLocation, useHistory } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";

import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import {
  logout,
  setIsMenuOpen,
  setIsSupportOpen,
} from "../../Redux/AppReducer/App.act";

import { drawerWidth } from "../../Assets/consts";
import spinmorLogo from "../../Assets/images/logo.jpeg";
import SupportDialog from "./SupportDialog";

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },

  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },

  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "space-between",
  },

  spinmorTitle: {
    padding: theme.spacing(1),
    boxSizing: "border-box",
    // maxHeight: 56,
    justifyContent: "space-between",
  },
  divider: {
    padding: theme.spacing(0, 1, 0, 1),
  },

  menuItemColor: {
    color: "black",
    paddingLeft: theme.spacing(1),
    "& .MuiListItemIcon-root": {
      color: "black",
    },
  },
  menuActiveItemColor: {
    color: theme.palette.primary.main,
    paddingLeft: theme.spacing(1),
    "& .MuiListItemIcon-root": {
      color: theme.palette.primary.main,
    },
    "& .MuiListItemText-primary": {
      fontWeight: 600,
    },
  },
  nested: {
    paddingLeft: theme.spacing(3),
  },
  printMenuText: {
    flexGrow: 0,
    marginRight: theme.spacing(1),
  },
  printMenuGutter: {
    paddingLeft: theme.spacing(1),
  },
}));

const mapStateToProps = ({ AppReducer }) => ({
  direction: AppReducer.direction,
  isMenuOpen: AppReducer.isMenuOpen,

  firstName: AppReducer.userInfo.firstName,
  businessName: AppReducer.businessInfo.businessName,
  prodStatus: AppReducer.prodStatus,

  isSupportOpen: AppReducer.isSupportOpen,
});
const mapDispatchToProps = (dispatch) => ({
  logout: bindActionCreators(logout, dispatch),
  setIsMenuOpen: bindActionCreators(setIsMenuOpen, dispatch),
  setIsSupportOpen: bindActionCreators(setIsSupportOpen, dispatch),
});

function AppBarNav({
  direction,
  isMenuOpen,
  setIsMenuOpen,

  logout,
  firstName,
  businessName,
  prodStatus,

  setIsSupportOpen,
  isSupportOpen,
}) {
  const classes = useStyles();

  const location = useLocation();
  const history = useHistory();

  //
  //
  const handleDrawerOpen = () => {
    setIsMenuOpen(true);
  };
  const handleDrawerClose = () => {
    setIsMenuOpen(false);
  };

  //
  //
  const handleLogout = () => {
    logout();
    history.push("/");
  };

  const [printMenuOpen, setPrintMenuOpen] = React.useState(true);
  const [goodsMenuOpen, setGoodsMenuOpen] = React.useState(true);
  const onPrintClick = () => {
    setPrintMenuOpen(!printMenuOpen);
  };

  const onGoodsClick = () => {
    setGoodsMenuOpen(!goodsMenuOpen);
  };

  const getPrintMenuClassName = () => {
    if (printMenuOpen) {
      return "";
    }

    if (location.pathname.split("/")[1] === "print") {
      return classes.menuActiveItemColor;
    } else {
      return classes.menuItemColor;
    }
  };

  const getGoodsMenuClassName = () => {
    if (goodsMenuOpen) {
      return "";
    }

    if (location.pathname.split("/")[1] === "goods") {
      return classes.menuActiveItemColor;
    } else {
      return classes.menuItemColor;
    }
  };

  //
  //
  const openSupport = () => {
    setIsSupportOpen(true);
  };

  //
  //
  return (
    <React.Fragment>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, isMenuOpen && classes.appBarShift)}
      >
        <Toolbar
        // style={{
        //   display: "flex",
        //   flexDirection: "row",
        //   justifyContent: "space-between",
        // }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, isMenuOpen && classes.hide)}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap>
            G'day {firstName}
          </Typography>

          <Typography className={classes.divider}>|</Typography>
          <Typography variant="h6" noWrap>
            Company: {businessName}
          </Typography>

          <div style={{ flexGrow: 1 }} />
          <Typography>Status: {prodStatus}</Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        className={classes.drawer}
        variant="persistent"
        // anchor="left"
        open={isMenuOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <img
            src={spinmorLogo}
            alt="logo"
            width={drawerWidth - 80}
          // height={48}
          />

          <IconButton onClick={handleDrawerClose}>
            {direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>

        <Divider />

        <List>
          {location.pathname.split("/")[1] !== "application" ? (
            <React.Fragment>
              <ListItem
                button
                component={Link}
                to="/"
                className={
                  location.pathname === "/"
                    ? classes.menuActiveItemColor
                    : classes.menuItemColor
                }
              >
                <ListItemText primary="Home" />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/profile/user"
                className={
                  location.pathname === "/profile/user"
                    ? classes.menuActiveItemColor
                    : classes.menuItemColor
                }
              >
                <ListItemText primary="User Profile" />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/profile/business"
                className={
                  location.pathname === "/profile/business"
                    ? classes.menuActiveItemColor
                    : classes.menuItemColor
                }
              >
                <ListItemText primary="Business Profile" />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/locations"
                className={
                  location.pathname === "/locations"
                    ? classes.menuActiveItemColor
                    : classes.menuItemColor
                }
              >
                <ListItemText primary="Locations" />
              </ListItem>

              <ListItem
                button
                onClick={onPrintClick}
                className={getPrintMenuClassName()}
                classes={{
                  gutters: classes.printMenuGutter,
                }}
              >
                <ListItemText
                  primary="Goods & Items"
                  className={classes.printMenuText}
                />
                {goodsMenuOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>

              <Collapse in={printMenuOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={Link}
                    to="/goods/create"
                    className={
                      location.pathname === "/goods/create"
                        ? clsx(classes.menuActiveItemColor, classes.nested)
                        : clsx(classes.menuItemColor, classes.nested)
                    }
                  >
                    <ListItemText primary="Create & View" />
                  </ListItem>
                  <ListItem
                    button
                    // className={classes.nested}
                    component={Link}
                    to="/goods/rewards"
                    className={
                      location.pathname === "/goods/rewards"
                        ? clsx(classes.menuActiveItemColor, classes.nested)
                        : clsx(classes.menuItemColor, classes.nested)
                    }
                  >
                    <ListItemText primary="Rewards & Additions" />
                  </ListItem>
                </List>
              </Collapse>

              <ListItem
                button
                onClick={onPrintClick}
                className={getPrintMenuClassName()}
                classes={{
                  gutters: classes.printMenuGutter,
                }}
              >
                <ListItemText
                  primary="Print QR Code"
                  className={classes.printMenuText}
                />
                {printMenuOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>

              <Collapse in={printMenuOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={Link}
                    to="/print/labels"
                    className={
                      location.pathname === "/print/labels"
                        ? clsx(classes.menuActiveItemColor, classes.nested)
                        : clsx(classes.menuItemColor, classes.nested)
                    }
                  >
                    <ListItemText primary="Labels" />
                  </ListItem>

                  <ListItem
                    button
                    // className={classes.nested}
                    component={Link}
                    to="/print/cards"
                    className={
                      location.pathname === "/print/cards"
                        ? clsx(classes.menuActiveItemColor, classes.nested)
                        : clsx(classes.menuItemColor, classes.nested)
                    }
                  >
                    <ListItemText primary="Cards" />
                  </ListItem>

                  <ListItem
                    button
                    // className={classes.nested}
                    component={Link}
                    to="/print/documents"
                    className={
                      location.pathname === "/print/documents"
                        ? clsx(classes.menuActiveItemColor, classes.nested)
                        : clsx(classes.menuItemColor, classes.nested)
                    }
                  >
                    <ListItemText primary="Print" />
                  </ListItem>
                </List>
              </Collapse>

              <ListItem
                button
                component={Link}
                to="/orders"
                className={
                  location.pathname === "/orders"
                    ? classes.menuActiveItemColor
                    : classes.menuItemColor
                }
              >
                <ListItemText primary="Orders" />
              </ListItem>
            </React.Fragment>
          ) : (
            <ListItem
              button
              component={Link}
              to="/application"
              className={
                location.pathname === "/application"
                  ? classes.menuActiveItemColor
                  : classes.menuItemColor
              }
            >
              <ListItemText primary="Application" />
            </ListItem>
          )}

          <Divider />
          <ListItem
            button
            onClick={openSupport}
            className={classes.menuItemColor}
          >
            <ListItemText primary="Support" />
          </ListItem>

          <ListItem
            button
            onClick={handleLogout}
            className={classes.menuItemColor}
          >
            <ListItemText primary="Sign Out" />
          </ListItem>
        </List>
      </Drawer>

      {isSupportOpen && <SupportDialog />}
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(AppBarNav);
