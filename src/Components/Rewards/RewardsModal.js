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
  FormControl
} from "@material-ui/core";

import PaperComponent from "../Custom/PaperComponent";
import { clearError, getError } from "../../Redux/ErrorReducer/Error.act";
import { createReward, updateReward } from "../../Redux/RewardsReducer/Rewards.act"

function RewardsModal(props) {
  const dispatch = useDispatch();

  const { open, title, data, setData, loading, setOpen, setLoading, mode } = props;
  const [maxWidth, setMaxWidth] = useState('sm');

  const error = useSelector((state) => state.error);
  const locations = useSelector((state) => state.LocationReducer.locations);

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
      dispatch(getError({ createReward: 'Please select the Location!' }));
      return;
    }
    if (mode) dispatch(createReward(data, setLoading, setOpen));
    else dispatch(updateReward(data, setLoading, setOpen));
  }

  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  }

  const handleSelectChange = (e) => {
    setData({ ...data, LocationId: e.target.value });
  }

  useEffect(() => {
    if (error.createReward || error.updateReward)
      setLoading(false);
  }, [error]);

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
        <form id="reward-form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {loading && <CircularProgress />}

              {error.createReward && (
                <Typography variant="body2" align="left" color="error">
                  {error.createReward}
                </Typography>
              )}

              {error.updateReward && (
                <Typography variant="body2" align="left" color="error">
                  {error.updateReward}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormControl id="LocationId" variant="filled" fullWidth>
                <InputLabel id="demo-simple-select-filled-label">Location</InputLabel>
                <Select
                  labelId="demo-simple-select-filled-label"
                  id="LocationId"
                  value={data.LocationId}
                  onChange={handleSelectChange}
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
            <Grid item xs={12}>
              <TextField
                id="Name"
                label="Reward Name"
                fullWidth
                variant="filled"
                value={data.Name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="HowMany"
                label="How Many"
                fullWidth
                variant="filled"
                required
                type="number"
                inputProps={{
                  min: "0",
                  step: "1",
                }}
                value={data.HowMany}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="Message"
                label="Message When Achived"
                fullWidth
                variant="filled"
                multiline
                rows={4}
                rowsMax={8}
                value={data.Message}
                onChange={handleChange}
              />
            </Grid>
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
          form="reward-form"
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

export default React.memo(RewardsModal);