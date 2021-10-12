import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Grid,
  Typography,
  TextField,
  Button,
  Select,
  NativeSelect,
  InputLabel,
  MenuItem,
  FormControl,
  Tabs,
  AppBar,
  Tab,
  Box,
  FormControlLabel,
  Checkbox
} from "@material-ui/core";
import { useTheme } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';

import PaperComponent from "../Custom/PaperComponent";
import { clearError, getError } from "../../Redux/ErrorReducer/Error.act";
import { createAddition } from "../../Redux/AdditionsReducer/Additions.act";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

function AdditionsModal(props) {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { open, title, data, setData, loading, setOpen, setLoading, mode } = props;
  const [maxWidth, setMaxWidth] = useState('sm');

  const error = useSelector((state) => state.error);
  const locations = useSelector((state) => state.LocationReducer.locations);
  const allLocationItems = useSelector((state) => state.additions.allLocationItems);
  const [allItems, setAllItems] = useState([]);

  const handleMaxWidthChange = (event) => {
    setMaxWidth(event.target.value);
  };

  const closeDialog = () => {
    dispatch(clearError());
    setOpen(false);
    setLoading(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (data.LocationId === -1) {
      dispatch(getError({ createAddition: 'Please select the Location!' }));
      return;
    }
    dispatch(createAddition(data, setLoading, setOpen));
  }

  const handleInputChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  }

  const handleSelectChange = (e) => {
    setData({ ...data, LocationId: e.target.value });
  }

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const handleCheckboxChange = (ItemListId, e, mode) => {
    let tempArr = mode === "main" ? [...data.MainProductId] : [...data.AdditionProducts];
    if (e.target.checked === true) {
      tempArr.push(ItemListId)
    } else {
      tempArr = tempArr.filter(element => element !== ItemListId);
    }
    if (mode === "main") setData({ ...data, MainProductId: tempArr });
    else setData({ ...data, AdditionProducts: tempArr });
  };

  useEffect(() => {
    if (error.createAddition || error.updateAddition)
      setLoading(false);
  }, [error]);

  useEffect(() => {
    if (data.LocationId === -1 && data.LocationId !== undefined) {
      setAllItems([]);
    }
    if (data.LocationId > -1) {
      setAllItems(allLocationItems.filter(item => item.LocationId === data.LocationId));
    }
  }, [data]);

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      maxWidth={maxWidth}
      fullWidth
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        <Grid container spacing={3}>
          <Grid item xs={10}>
            {title}
          </Grid>
          <Grid item xs={2}>
            <NativeSelect
              autoFocus
              value={maxWidth}
              onChange={handleMaxWidthChange}
              inputProps={{
                name: 'max-width',
                id: 'max-width',
              }}
              variant="outlined"
            >
              <option value="xs">x-small</option>
              <option value="sm">small</option>
              <option value="md">middle</option>
              <option value="lg">large</option>
            </NativeSelect>
          </Grid>
        </Grid>
      </DialogTitle>

      <DialogContent>
        <form id="addition-form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {loading && <CircularProgress />}

              {error.createAddition && (
                <Typography variant="body2" align="left" color="error">
                  {error.createAddition}
                </Typography>
              )}

              {error.updateAddition && (
                <Typography variant="body2" align="left" color="error">
                  {error.updateAddition}
                </Typography>
              )}
            </Grid>
            <Grid item xs={6}>
              <FormControl variant="filled" fullWidth>
                <InputLabel id="demo-simple-select-filled-label">Location</InputLabel>
                <Select
                  labelId="demo-simple-select-filled-label"
                  id="LocationId"
                  value={data.LocationId}
                  onChange={handleSelectChange}
                  disabled={mode ? false : true}
                >
                  <MenuItem value={-1}>None</MenuItem>
                  {locations.filter(location => location.LocationType === "coffeeshop").map(location => {
                    return (
                      <MenuItem key={location.QRCode} value={location.LocationId}>{location.LocationName}</MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="LinkName"
                label="Name"
                fullWidth
                variant="filled"
                value={data.LinkName}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <AppBar position="static" color="default">
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                aria-label="full width tabs example"
              >
                <Tab label="Main Products" {...a11yProps(0)} />
                <Tab label="Addition Products" {...a11yProps(1)} />
              </Tabs>
            </AppBar>
            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={value}
              onChangeIndex={handleChangeIndex}
              style={{ width: "100%" }}
            >
              <TabPanel value={value} index={0} dir={theme.direction}>
                <Grid container spacing={1}>
                  {allItems.filter(item => item.ItemType === "Main Product").map(item => {
                    let checked = false;
                    if (data.MainProductId.filter(element => element === item.ItemListid).length > 0)
                      checked = true;
                    return (
                      <Grid item xs={4} key={item.QRCode}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="primary"
                              checked={checked}
                              onChange={(e) => handleCheckboxChange(item.ItemListid, e, "main")}
                            />
                          }
                          label={item.ItemName}
                        />
                      </Grid>
                    )
                  })}
                </Grid>
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                <Grid container spacing={1}>
                  {allItems.filter(item => item.ItemType === "Additions").map(item => {
                    let checked = false;
                    if (data.AdditionProducts.filter(element => element === item.ItemListid).length > 0)
                      checked = true;
                    return (
                      <Grid item xs={4} key={item.QRCode}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="primary"
                              checked={checked}
                              onChange={(e) => handleCheckboxChange(item.ItemListid, e, "addition")}
                            />
                          }
                          label={item.ItemName}
                        />
                      </Grid>
                    )
                  })}
                </Grid>
              </TabPanel>
            </SwipeableViews>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={closeDialog}
          color="primary"
          autoFocus
          variant="contained"
          disabled={loading}
        >
          Cancel
        </Button>
        <div style={{ flexGrow: 1 }} />

        <Button
          form="addition-form"
          type="submit"
          color="primary"
          variant="contained"
          disabled={loading}
        >
          {mode ? "Create" : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  )
};

export default React.memo(AdditionsModal);