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
  Button,
  NativeSelect,
  FormControlLabel,
  Checkbox
} from "@material-ui/core";

import PaperComponent from "../Custom/PaperComponent";
import { clearError } from "../../Redux/ErrorReducer/Error.act";
import { linkRewardProgram } from "../../Redux/RewardsReducer/Rewards.act";

function LinkModal(props) {
  const dispatch = useDispatch();

  const { open, data, title, loading, setOpen, setLoading } = props;
  const [maxWidth, setMaxWidth] = useState('sm');
  const [checkedArr, setCheckedArr] = useState([]);

  const error = useSelector((state) => state.error);
  const allItems = useSelector((state) => state.rewards.allItems);
  const linkedRewards = useSelector((state) => state.rewards.linkedRewards);

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
    let tempArr = [];
    checkedArr.forEach(element => {
      tempArr.push(element.ItemListId);
    });
    let postData = {
      ItemsList: tempArr,
      CoffeeRewardsId: data.CoffeeRewardsId
    }
    dispatch(linkRewardProgram(postData, setLoading, setOpen));
  }

  useEffect(() => {
    if (error.fetchLinkedRewards || error.fetchAllItems)
      setLoading(false);
  }, [error]);

  useEffect(() => {
    setCheckedArr(linkedRewards);
  }, [linkedRewards]);

  const handleChange = (ItemListId, ItemName, e) => {
    let tempArr = [...checkedArr];
    if (e.target.checked === true) {
      tempArr.push({
        Name: ItemName,
        ItemListId
      });
    } else {
      tempArr = tempArr.filter(element => element.ItemListId !== ItemListId);
    }
    setCheckedArr(tempArr);
  };

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

              {error.fetchAllItems && (
                <Typography variant="body2" align="left" color="error">
                  {error.fetchAllItems}
                </Typography>
              )}

              {error.fetchLinkedRewards && (
                <Typography variant="body2" align="left" color="error">
                  {error.fetchLinkedRewards}
                </Typography>
              )}
            </Grid>
            {(!error.fetchAllItems && !error.fetchLinkedRewards && !loading) && allItems.filter(item => item.ItemType === "Main Product").map(item => {
              let checked = false;
              if (checkedArr.filter(element => element.ItemListId === item.ItemListid).length > 0)
                checked = true;
              return (
                <Grid item xs={4} key={item.QRCode}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={checked}
                        onChange={(e) => handleChange(item.ItemListid, item.ItemName, e)}
                      />
                    }
                    label={item.ItemName}
                  />
                </Grid>
              )
            })}
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
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
};

export default React.memo(LinkModal);