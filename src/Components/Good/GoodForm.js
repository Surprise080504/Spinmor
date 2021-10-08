import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import isEqual from "lodash/isEqual";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import UndoIcon from "@material-ui/icons/Undo";
import NativeSelect from '@material-ui/core/NativeSelect';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

import PaperComponent from "../Custom/PaperComponent";

import {
  setSelectedGood,
  setReadGoodStatus,
  setUpdateGoodStatus,
  setCreateGoodStatus,
  readGoodAction,
  updateGoodAction,
  createGoodAction,
  setUploadGoodlmageQR,
} from "../../Redux/GoodReducer/Good.act";
import { drawerWidth } from "../../Assets/consts";
import { status } from "../../api/api";
import GoodImage from "./GoodImage";

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

  option: {
    fontSize: 15,
    "& > span": {
      marginRight: 10,
      fontSize: 18,
    },
  },
  currencyInput: {
    "& .MuiFormHelperText-root": {
      color: theme.palette.error.dark,
    },
  },
  formControl: {
    width: 274 - 15,
  }
}));

const mapStateToProps = ({ GoodReducer, LocationReducer }) => ({
  readGoodStatus: GoodReducer.readGoodStatus,

  selectedGood: GoodReducer.selectedGood,

  updateGoodStatus: GoodReducer.updateGoodStatus,
  createGoodStatus: GoodReducer.createGoodStatus,

  locations: LocationReducer.locations,
});
const mapDispatchToProps = (dispatch) => ({
  setSelectedGood: bindActionCreators(setSelectedGood, dispatch),
  setReadGoodStatus: bindActionCreators(setReadGoodStatus, dispatch),
  setUpdateGoodStatus: bindActionCreators(setUpdateGoodStatus, dispatch),
  setCreateGoodStatus: bindActionCreators(setCreateGoodStatus, dispatch),
  readGoodAction: bindActionCreators(readGoodAction, dispatch),
  updateGoodAction: bindActionCreators(updateGoodAction, dispatch),
  createGoodAction: bindActionCreators(createGoodAction, dispatch),
  setUploadGoodlmageQR: bindActionCreators(setUploadGoodlmageQR, dispatch),
});

function GoodForm({
  readGoodStatus,
  setReadGoodStatus,
  readGoodAction,

  selectedGood,
  setSelectedGood,

  updateGoodStatus,
  setUpdateGoodStatus,
  updateGoodAction,

  createGoodStatus,
  setCreateGoodStatus,
  createGoodAction,
  setUploadGoodlmageQR,

  locations,

  exampleGood = {},
  disableLocations,
  hideLocationsSelection,
}) {
  const classes = useStyles();
  //
  //get location details on form mount
  React.useEffect(() => {
    if (
      readGoodStatus === status.not_started &&
      selectedGood.ItemListId !== -99
    ) {
      readGoodAction(selectedGood.ItemListId);
    }
  }, [readGoodAction, readGoodStatus, selectedGood.ItemListId]);

  //
  //cleanup on unmount
  React.useEffect(() => {
    return function cleanup() {
      setReadGoodStatus(status.not_started);
      setUpdateGoodStatus(status.not_started);
      setCreateGoodStatus(status.not_started);
    };
  }, [setCreateGoodStatus, setReadGoodStatus, setUpdateGoodStatus]);

  //
  //initialize local formState to received selectedGood
  const [formState, setFormState] = React.useState(selectedGood);
  const [itemtypes, setItemtypes] = React.useState(["Main Product", "Additions", "N/A"]);
  React.useEffect(() => {
    if (locations.length === 0) {
      setItemtypes(["Main Product", "Additions", "N/A"]);
    }
    else {
      if (selectedGood.ItemListId === -99) {
        if (locations[0].LocationType !== "coffeeshop") setItemtypes(["N/A"]);
        else setItemtypes(["Main Product", "Additions"]);
      }
      else {
        const temp_location = locations.find((l) => l.LocationId === selectedGood.LocationId);
        if (temp_location.LocationType !== "coffeeshop") setItemtypes(["N/A"]);
        else setItemtypes(["Main Product", "Additions"]);
      }
    }
    let OptionsText = "";
    if (selectedGood.ItemListId !== -99 && selectedGood.Options === 'o') {
      OptionsText = selectedGood.OptionsText.substring(1).substring(0, selectedGood.OptionsText.length - 2);
    }
    else {
      OptionsText = selectedGood.OptionsText;
    }
    setFormState({
      ...selectedGood,
      Location:
        selectedGood.ItemListId === -99
          ? null
          : locations.find((l) => l.LocationId === selectedGood.LocationId),
      ...exampleGood,
      OptionsText
    });
  }, [selectedGood, locations, exampleGood]);

  //
  //is form the same
  const [isFormSame, setIsFormSame] = React.useState(true);
  const checkIsFormSame = (formState) => {
    const newFormState = { ...formState };

    if (newFormState.Location && newFormState.Location.LocationId) {
      newFormState["Location"] = newFormState.Location.LocationId;
    } else {
      newFormState["Location"] = null;
    }

    const isEqualRes = isEqual(newFormState, selectedGood);
    setIsFormSame(isEqualRes);
  };

  //
  //
  const onAnyChange = (e, field) => {
    let value = null;
    const newFormState = { ...formState };
    if (field === "Location") {
      if (e.LocationType !== "coffeeshop") setItemtypes(["N/A"]);
      else setItemtypes(["Main Product", "Additions"]);
      value = e;
    } else {
      value = e.target.value === "" ? null : e.target.value;
    }
    newFormState[field] = value;
    setFormState(newFormState);
    checkIsFormSame(newFormState);
  };

  //
  //
  const resetTextField = (e, field) => {
    // if (field !== "CurrencySymbol") {
    //   e.preventDefault();
    // }

    const newFormState = { ...formState };
    newFormState[field] = selectedGood[field];

    // if (field === "CurrencySymbol") {
    //   const currencyIso = selectedGood.CurrencySymbol?.trim?.();
    //   newFormState[field] = currencies.find((c) => c.iso === currencyIso);
    // }

    setFormState(newFormState);
    checkIsFormSame(newFormState);
  };

  //
  //
  const onSubmitForm = (e) => {
    e.preventDefault();

    const formData = {};

    if (formState.Location?.LocationId) {
      formData["LocationId"] = formState.Location.LocationId;
    } else {
      formData["LocationId"] = locations[0].LocationId;
    }
    if (formState.ItemName !== selectedGood.ItemName) {
      formData["ItemName"] = formState.ItemName;
    }
    if (formState.ItemType !== selectedGood.ItemType) {
      formData["ItemType"] = formState.ItemType;
    }
    if (formState.Price !== selectedGood.Price) {
      formData["Price"] = formState.Price;
    } else {
      formData["Price"] = selectedGood.Price;
    }
    if (formState.Tax !== selectedGood.Tax) {
      formData["Tax"] = formState.Tax;
    } else {
      formData["Tax"] = selectedGood.Tax;
    }
    formData["PriceIncludeTax"] = parseFloat(
      Math.abs(formData.Price || 0.0) + Math.abs(formData.Tax || 0.0)
    );
    if (formState.Options !== selectedGood.Options) {
      formData["Options"] = formState.Options;
    }
    if (formState.OptionsText !== selectedGood.OptionsText) {
      if (formState.Options === "o") {
        const tempOptions = String(formState.OptionsText).split(";");
        let tempStr = "{";
        let limit = tempOptions.length - 1;
        if (String(formState.OptionsText).charAt(formState.OptionsText.length - 1) === ';') limit = tempOptions.length - 2;
        tempOptions.forEach((option, index) => {
          tempStr += option.trim();
          if (index < limit)
            tempStr += ";";
        })
        formData["OptionsText"] = tempStr + "}";
      }
      else formData["OptionsText"] = formState.OptionsText;
    }

    if (selectedGood.ItemListId !== -99) {
      formData["ItemListId"] = selectedGood.ItemListId;
      formData["QRCode"] = selectedGood.QRCode;
      formData["LocationId"] = selectedGood.LocationId;
      updateGoodAction(formData);
    } else {
      formData["ItemGroupId"] = 1;
      if (formState["ItemType"] === null) {
        if (itemtypes.length === 1) formData["ItemType"] = "N/A"
        else formData["ItemType"] = "Main Product"
      }
      if (formState["Options"] === null && formState["ItemType"] == "Additions") formData["Options"] = "n"
      createGoodAction(formData);
    }
  };

  //
  //closing the form. more cleanup in another hook
  const closeDialogForm = () => {
    if (
      updateGoodStatus === status.loading ||
      createGoodStatus === status.loading
    ) {
      return;
    }

    setSelectedGood({
      ItemListId: -1,
      LocationId: null,
      ItemName: null,
      ItemType: null,
      Price: null,
      Tax: null,
      PriceIncludeTax: null,
      QRCode: null,
      Options: null,
      OptionsText: null,
      Enable: null
    });
  };

  //
  //auto close form or scroll to error
  const errorTextRef = React.useRef(null);
  React.useEffect(() => {
    if (
      updateGoodStatus === status.finish ||
      createGoodStatus === status.finish
    ) {
      setSelectedGood({
        ItemListId: -1,
        LocationId: null,
        ItemName: null,
        ItemType: null,
        Price: null,
        Tax: null,
        PriceIncludeTax: null,
        QRCode: null,
        Options: null,
        OptionsText: null,
        Enable: null
      });
    } else if (
      updateGoodStatus.split(" ")[0] === status.error ||
      createGoodStatus.split(" ")[0] === status.error
    ) {
      errorTextRef.current.scrollIntoView(true);
      // console.log("scrolling into view");
    }
  }, [updateGoodStatus, createGoodStatus, setSelectedGood]);

  const formatTotal = () => {
    let res = parseFloat(
      Math.abs(formState.Price || 0.0) + Math.abs(formState.Tax || 0.0)
    ).toFixed(2);

    if (formState.Location?.CurrencySymbol) {
      res += " " + formState.Location.CurrencySymbol;
    }
    return res;
  };

  const onShowUploadDialog = () => {
    setUploadGoodlmageQR(selectedGood.QRCode);
    closeDialogForm();
  };

  const [maxWidth, setMaxWidth] = React.useState('sm');

  const handleMaxWidthChange = (event) => {
    setMaxWidth(event.target.value);
  };

  return (
    <Dialog
      open={selectedGood.ItemListId !== -1}
      onClose={null}
      keepMounted={false}
      maxWidth={maxWidth}
      fullWidth
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        <Grid container spacing={3}>
          <Grid item xs={10}>
            {hideLocationsSelection ? (
              <React.Fragment>
                Create a new item at <b>{formState.Location?.LocationName}</b>
              </React.Fragment>
            ) : selectedGood.ItemListId === -99 ? (
              "Create a new item"
            ) : (
              `Edit ${selectedGood.ItemName}`
            )}
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
        {(readGoodStatus === status.loading ||
          updateGoodStatus === status.loading ||
          createGoodStatus === status.loading) && <CircularProgress />}

        {readGoodStatus.split(" ")[0] === status.error && (
          <Typography variant="body2" align="left" color="error">
            Error getting item information: {readGoodStatus.split(" ")[1]}
          </Typography>
        )}

        {updateGoodStatus.split(" ")[0] === status.error && (
          <Typography
            variant="body2"
            align="left"
            ref={errorTextRef}
            color="error"
          >
            Error updating item: {updateGoodStatus.split(" ")[1]}
          </Typography>
        )}
        {createGoodStatus.split(" ")[0] === status.error && (
          <Typography
            variant="body2"
            align="left"
            ref={errorTextRef}
            color="error"
          >
            Error creating item: {createGoodStatus.split(" ")[1]}
          </Typography>
        )}

        {(selectedGood.ItemListId === -99 ||
          (selectedGood.ItemListId !== -99 &&
            readGoodStatus === status.finish)) && (
            <form onSubmit={onSubmitForm} id="item-form">
              <Grid container spacing={3}>
                <Hidden xsUp={hideLocationsSelection}>
                  <Grid item xs={6}>
                    <Autocomplete
                      disabled={
                        selectedGood.ItemListId !== -99 || disableLocations
                      }
                      style={{ maxWidth: 274 - 15 }} //alway write the desired width - 15
                      value={formState.Location || locations[0]}
                      disableClearable
                      onChange={(e, newValue) =>
                        onAnyChange(newValue, "Location")
                      }
                      id="location-select"
                      options={locations}
                      classes={{
                        option: classes.option,
                      }}
                      autoHighlight
                      getOptionLabel={(option) => option.LocationName}
                      renderOption={(option) => (
                        <React.Fragment>{option.LocationName}</React.Fragment>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Location"
                          variant="filled"
                          required
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: "new-password", // disable autocomplete and autofill
                            required: true,
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Hidden>

                <Grid item xs={6}>
                  <FormControl variant="filled" className={classes.formControl}>
                    <InputLabel id="demo-simple-select-filled-label">Item Type</InputLabel>
                    <Select
                      labelId="demo-simple-select-filled-label"
                      id="demo-simple-select-filled"
                      value={formState.ItemType || itemtypes[0]}
                      onChange={(e) => onAnyChange(e, "ItemType")}
                    >
                      {itemtypes.map(item => {
                        return (
                          <MenuItem key={item} value={item}>{item}</MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Item name and description"
                    multiline
                    rows={4}
                    rowsMax={8}
                    style={{ width: "100%" }}
                    variant="filled"
                    required
                    placeholder="please enter the item namme and description(up to 200 letters)"
                    value={formState.ItemName || ""}
                    onChange={(e) => onAnyChange(e, "ItemName")}
                    InputProps={{
                      endAdornment: selectedGood.ItemListId !== -99 && (
                        <InputAdornment position="end">
                          <IconButton
                            disabled={
                              formState.ItemName === selectedGood.ItemName
                            }
                            onClick={(e) => resetTextField(e, "ItemName")}
                          >
                            <UndoIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Price"
                    fullWidth
                    style={{ maxWidth: 274 }}
                    value={formState.Price || ""}
                    onChange={(e) => onAnyChange(e, "Price")}
                    variant="filled"
                    required
                    type="number"
                    InputProps={{
                      endAdornment: selectedGood.ItemListId !== -99 && (
                        <InputAdornment position="end">
                          <IconButton
                            disabled={formState.Price === selectedGood.Price}
                            onClick={(e) => resetTextField(e, "Price")}
                          >
                            <UndoIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{
                      min: "0.000",
                      step: "0.001",
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Tax"
                    fullWidth
                    style={{ maxWidth: 274 }}
                    value={formState.Tax || ""}
                    onChange={(e) => onAnyChange(e, "Tax")}
                    variant="filled"
                    required
                    type="number"
                    InputProps={{
                      endAdornment: selectedGood.ItemListId !== -99 && (
                        <InputAdornment position="end">
                          <IconButton
                            disabled={formState.Tax === selectedGood.Tax}
                            onClick={(e) => resetTextField(e, "Tax")}
                          >
                            <UndoIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{
                      min: "0.000",
                      step: "0.001",
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Total"
                    fullWidth
                    style={{ maxWidth: 274 }}
                    value={formatTotal()}
                    disabled
                    variant="filled"
                  />
                </Grid>
                {formState.ItemType === "Additions" && (
                  <>
                    <Grid item xs={6}>
                      <FormControl variant="filled" className={classes.formControl}>
                        <InputLabel id="demo-simple-select-filled-label">Options Type</InputLabel>
                        <Select
                          labelId="demo-simple-select-filled-label"
                          id="demo-simple-select-filled"
                          value={formState.Options || "n"}
                          onChange={(e) => onAnyChange(e, "Options")}
                        >
                          <MenuItem key={0} value="n">No Options</MenuItem>
                          <MenuItem key={1} value="o">Options</MenuItem>
                          <MenuItem key={2} value="f">Free Text</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        disabled={(formState.Options === null || formState.Options === 'n') ? true : false}
                        label="Options Text"
                        multiline
                        rows={4}
                        rowsMax={8}
                        style={{ width: "100%" }}
                        variant="filled"
                        required
                        placeholder={formState.Options === "f" ? "Client will enter free text" : "Enter options separated by semicolon"}
                        value={formState.OptionsText || ""}
                        onChange={(e) => onAnyChange(e, "OptionsText")}
                        InputProps={{
                          endAdornment: selectedGood.ItemListId !== -99 && (
                            <InputAdornment position="end">
                              <IconButton
                                disabled={
                                  formState.OptionsText === selectedGood.OptionsText
                                }
                                onClick={(e) => resetTextField(e, "OptionsText")}
                              >
                                <UndoIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </>
                )}

                {selectedGood.ItemListId !== -99 && (
                  <Grid item xs={6}>
                    <TextField
                      label="QR Code"
                      fullWidth
                      style={{ maxWidth: 274 }}
                      value={selectedGood.QRCode}
                      disabled
                      variant="filled"
                    />
                  </Grid>
                )}

                {selectedGood.ItemListId !== -99 ? (
                  <Grid item xs={12}>
                    Would you like to upload an image of this item?
                    <br />
                    <Button
                      onClick={onShowUploadDialog}
                      color="primary"
                      variant="contained"
                      style={{ marginTop: 8 }}
                    >
                      Upload Image
                    </Button>
                  </Grid>
                ) : null}

                {selectedGood.ItemListId !== -99 ? (
                  <Grid item xs={12}>
                    <GoodImage QRCode={selectedGood.QRCode} />
                  </Grid>
                ) : null}
              </Grid>
            </form>
          )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={closeDialogForm}
          color="primary"
          autoFocus
          disabled={
            updateGoodStatus === status.loading ||
            createGoodStatus === status.loading
          }
          variant="contained"
        >
          Cancel
        </Button>
        <div style={{ flexGrow: 1 }} />

        <Button
          form="item-form"
          type="submit"
          color="primary"
          disabled={
            updateGoodStatus === status.loading ||
            createGoodStatus === status.loading ||
            isFormSame
          }
          variant="contained"
        >
          {selectedGood.ItemListId === -99 ? "Create" : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(GoodForm);
