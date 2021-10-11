import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Typography,
  CircularProgress,
  Button,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  IconButton
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  EditOutlined as EditOutlinedIcon,
  DeleteForeverOutlined as DeleteForeverOutlinedIcon,
  Link as LinkIcon
} from "@material-ui/icons";

import {
  getAllRewards,
  deleteReward,
  getAllItems,
  getLinkedRewards,
  emptyAllItems,
  emptyLinkedRewards
} from "../../Redux/RewardsReducer/Rewards.act";
import { clearError } from "../../Redux/ErrorReducer/Error.act";
import { getLocationsAction, setGetLocationsStatus } from "../../Redux/LocationReducer/Location.act";
import { status } from "../../api/api";
import { drawerWidth } from "../../Assets/consts";
import TablePaginationActions from "../Custom/TablePaginationActions";
import ConfirmDialog from "../Custom/ConfirmDialog";
import RewardsModal from "./RewardsModal";
import LinkModal from "./LinkModal";

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

  headerColor: {
    backgroundColor: theme.palette.primary.main,
    "& .MuiTableCell-root": {
      color: theme.palette.getContrastText(theme.palette.primary.main),
    },
  },
  actionsCell: {
    display: "flex",
    height: "100%",
  },
}));

function RewardsTable() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const allRewards = useSelector((state) => state.rewards.allRewards);
  const allItems = useSelector((state) => state.rewards.allItems);
  const linkedRewards = useSelector((state) => state.rewards.linkedRewards);
  const error = useSelector((state) => state.error);
  const getLocationsStatus = useSelector((state) => state.LocationReducer.getLocationsStatus);
  const locations = useSelector((state) => state.LocationReducer.locations);

  const [data, setData] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [mode, setMode] = useState(true);
  const [selectedData, setSelectedData] = useState({});
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkTitle, setLinkTitle] = useState("");

  useEffect(() => {
    setPageLoading(true);
    dispatch(clearError());
    dispatch(setGetLocationsStatus(status.not_started));
  }, []);

  useEffect(() => {
    if (getLocationsStatus === status.not_started) dispatch(getLocationsAction());
    if (getLocationsStatus === status.finish) {
      dispatch(getAllRewards(locations.filter(location => location.LocationType === "coffeeshop"), setPageLoading));
    }
  }, [getLocationsStatus]);

  useEffect(() => {
    let tempData = allRewards.sort((a, b) =>
      a.Name.toLowerCase() > b.Name.toLowerCase()
        ? 1
        : b.Name.toLowerCase() > a.Name.toLowerCase()
          ? -1
          : 0);
    setData(tempData);
  }, [allRewards]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleNew = async () => {
    await setSelectedData({
      CoffeeRewardsId: -1,
      HowMany: 0,
      Name: "",
      Message: "",
      LocationId: -1
    });
    await setModalTitle("Create New Reward");
    await setMode(true);
    await setModalOpen(true);
  }

  const handleUpdate = async (reward) => {
    await setSelectedData(reward);
    await setModalTitle(`Edit ${reward.Name}`);
    await setMode(false);
    await setModalOpen(true);
  }

  const openConfirm = async (reward) => {
    await setSelectedData(reward);
    await setConfirmTitle(reward.Name);
    await setConfirmOpen(true);
  }

  const handleDelete = () => {
    setConfirmLoading(true);
    dispatch(deleteReward(selectedData, setConfirmLoading, setConfirmOpen));
  }

  const cancelDelete = () => {
    setConfirmOpen(false);
    dispatch(clearError());
  }

  const handleLink = async (reward) => {
    await setSelectedData(reward);
    await dispatch(emptyAllItems());
    await dispatch(emptyLinkedRewards());
    await setLinkLoading(true);
    await setLinkTitle(`Rewards Program ${reward.Name} Buy ${reward.HowMany} and get 1 free`);
    await setLinkOpen(true);
    await dispatch(getAllItems(reward.LocationId));
    await dispatch(getLinkedRewards(reward.CoffeeRewardsId));
    await setLinkLoading(false);
  }

  return (
    <>
      {pageLoading && (
        <Grid item>
          <CircularProgress />
        </Grid>
      )}
      {error.getAllRewards && (
        <Grid item>
          <Typography variant="body1" color="error">{error.getAllRewards}</Typography>
        </Grid>
      )}
      {pageLoading === false && !error.getAllRewards && (
        <>
          <Grid item>
            <Button
              color="primary"
              size="large"
              variant="contained"
              onClick={handleNew}
            >
              NEW
            </Button>
          </Grid>
          <br />
          <Grid item style={{ width: "100%" }}>
            <TableContainer component={Paper}>
              <Table aria-label="rewards table">
                <TableHead>
                  <TableRow className={classes.headerColor}>
                    <TableCell align="left" scope="col">
                      Reward Name
                    </TableCell>
                    <TableCell align="left" scope="col">
                      How Many
                    </TableCell>
                    <TableCell align="left" scope="col">
                      Message When Achived
                    </TableCell>
                    <TableCell align="center" scope="col">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {(rowsPerPage > 0
                    ? data.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    : allRewards
                  ).map((reward, index) => (
                    <TableRow key={index}>
                      <TableCell align="left">{reward.Name}</TableCell>
                      <TableCell align="left">{reward.HowMany}</TableCell>
                      <TableCell align="left">{reward.Message}</TableCell>
                      <TableCell padding="checkbox">
                        <div className={classes.actionsCell}>
                          <IconButton
                            onClick={(e) => handleUpdate(reward)}
                          >
                            <EditOutlinedIcon color="primary" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleLink(reward)}
                          >
                            <LinkIcon color="secondary" />
                          </IconButton>
                          <IconButton
                            onClick={() => openConfirm(reward)}
                          >
                            <DeleteForeverOutlinedIcon />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        { label: "All", value: -1 },
                      ]}
                      colSpan={3}
                      count={allRewards.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      SelectProps={{
                        inputProps: { "aria-label": "rows per page" },
                        native: true,
                      }}
                      onChangePage={handleChangePage}
                      onChangeRowsPerPage={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Grid>
        </>
      )}
      <RewardsModal
        mode={mode}
        data={selectedData}
        title={modalTitle}
        open={modalOpen}
        setData={setSelectedData}
        loading={modalLoading}
        setOpen={setModalOpen}
        setLoading={setModalLoading}
      />
      <ConfirmDialog
        title={confirmTitle}
        loading={confirmLoading}
        open={confirmOpen}
        cancelDelete={cancelDelete}
        confirmDelete={handleDelete}
        error={error.deleteReward ? error.deleteReward : ''}
      />
      <LinkModal
        open={linkOpen}
        title={linkTitle}
        loading={linkLoading}
        setOpen={setLinkOpen}
        setLoading={setLinkLoading}
        data={selectedData}
      />
    </>
  );
}

export default RewardsTable;
