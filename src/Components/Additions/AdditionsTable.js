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
  DeleteForeverOutlined as DeleteForeverOutlinedIcon
} from "@material-ui/icons";

import {
  getAllAdditions,
  getAllLocationItems
} from "../../Redux/AdditionsReducer/Additions.act";
import { clearError } from "../../Redux/ErrorReducer/Error.act";
import { getLocationsAction, setGetLocationsStatus } from "../../Redux/LocationReducer/Location.act";
import { status } from "../../api/api";
import TablePaginationActions from "../Custom/TablePaginationActions";
import AdditionsModal from "./AdditionsModal";

const useStyles = makeStyles((theme) => ({
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

  const allAdditions = useSelector((state) => state.additions.allAdditions);
  const allLocationItems = useSelector((state) => state.additions.allLocationItems);
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

  const init = async () => {
    await dispatch(getAllLocationItems(locations.filter(location => location.LocationType === "coffeeshop"), setPageLoading));
    await dispatch(getAllAdditions(locations.filter(location => location.LocationType === "coffeeshop"), setPageLoading));
  }

  useEffect(() => {
    setPageLoading(true);
    dispatch(clearError());
    dispatch(setGetLocationsStatus(status.not_started));
  }, []);

  useEffect(() => {
    if (getLocationsStatus === status.not_started) dispatch(getLocationsAction());
    if (getLocationsStatus === status.finish) init();
  }, [getLocationsStatus]);

  useEffect(() => {
    let tempArr = [];
    allAdditions.sort((a, b) =>
      a.LinkName.toLowerCase() > b.LinkName.toLowerCase()
        ? 1
        : b.LinkName.toLowerCase() > a.LinkName.toLowerCase()
          ? -1
          : 0).forEach(addition => {
            let MainProducts = "";
            let AdditionProducts = "";
            addition.MainProductId.forEach(mp => {
              const tempItem = allLocationItems.find(item => item.ItemListid === mp);
              if (tempItem !== undefined) MainProducts += String(tempItem.ItemName).substring(0, 50) + ", ";
            });
            addition.AdditionProducts.forEach(ap => {
              const tempItem = allLocationItems.find(item => item.ItemListid === ap);
              if (tempItem !== undefined) AdditionProducts += String(tempItem.ItemName).substring(0, 50) + ", ";
            });
            tempArr.push({
              LinkName: addition.LinkName,
              LocationId: addition.LocationId,
              LinkedAdditionsID: addition.LinkedAdditionsID,
              MainProducts,
              AdditionProducts
            });
          });
    setData(tempArr);
  }, [allAdditions]);

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
      LinkName: "",
      LocationId: -1,
      LinkedAdditionsID: -1,
      MainProductId: [],
      AdditionProducts: []
    });
    await setModalTitle("Create New Addition");
    await setMode(true);
    await setModalOpen(true);
  }

  return (
    <>
      {pageLoading && (
        <Grid item>
          <CircularProgress />
        </Grid>
      )}
      {error.getAllAdditions && (
        <Grid item>
          <Typography variant="body1" color="error">{error.getAllAdditions}</Typography>
        </Grid>
      )}
      {error.getAllLocationItems && (
        <Grid item>
          <Typography variant="body1" color="error">{error.getAllLocationItems}</Typography>
        </Grid>
      )}
      {(pageLoading === false && !error.getAllAdditions && !error.getAllLocationItems) && (
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
                <colgroup>
                  <col width="20%" />
                  <col width="40%" />
                  <col width="30%" />
                  <col width="10%" />
                </colgroup>
                <TableHead>
                  <TableRow className={classes.headerColor}>
                    <TableCell align="left" scope="col">
                      Name
                    </TableCell>
                    <TableCell align="left" scope="col">
                      Main Products
                    </TableCell>
                    <TableCell align="left" scope="col">
                      Additions
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
                    : allAdditions
                  ).map((addition, index) => (
                    <TableRow key={index}>
                      <TableCell align="left" style={{ fontSize: 20 }}>{addition.LinkName}</TableCell>
                      <TableCell align="left">{addition.MainProducts}</TableCell>
                      <TableCell align="left">{addition.AdditionProducts}</TableCell>
                      <TableCell padding="checkbox">
                        <div className={classes.actionsCell}>
                          <IconButton
                          // onClick={(e) => handleUpdate(addition)}
                          >
                            <EditOutlinedIcon color="primary" />
                          </IconButton>
                          <IconButton
                          // onClick={() => openConfirm(addition)}
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
                      count={allAdditions.length}
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
      <AdditionsModal
        mode={mode}
        data={selectedData}
        title={modalTitle}
        open={modalOpen}
        setData={setSelectedData}
        loading={modalLoading}
        setOpen={setModalOpen}
        setLoading={setModalLoading}
      />
    </>
  );
}

export default RewardsTable;
