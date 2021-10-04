import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import {
  setIsSupportOpen,
  setSupportStatus,
  supportAction,
} from "../../Redux/AppReducer/App.act";
import { status } from "../../api/api";

const useStyles = makeStyles((theme) => ({
  minDialogWidth: {
    minWidth: 350,
  },
}));

const mapStateToProps = ({ AppReducer }) => ({
  isSupportOpen: AppReducer.isSupportOpen,
  supportStatus: AppReducer.supportStatus,
});
const mapDispatchToProps = (dispatch) => ({
  setIsSupportOpen: bindActionCreators(setIsSupportOpen, dispatch),
  setSupportStatus: bindActionCreators(setSupportStatus, dispatch),
  supportAction: bindActionCreators(supportAction, dispatch),
});

function SupportDialog({
  isSupportOpen,
  supportStatus,
  setIsSupportOpen,
  setSupportStatus,
  supportAction,
}) {
  const classes = useStyles();

  const [supportText, setSupportText] = React.useState("");

  //
  //cleanup on unmount
  React.useEffect(() => {
    setSupportStatus(status.not_started);
  }, [setSupportStatus]);

  //
  //
  const [discardWarning, setDiscardWarning] = React.useState(false);
  const cancelDiscard = () => {
    setDiscardWarning(false);
  };
  const confirmDiscard = () => {
    setIsSupportOpen(false);
  };

  //
  //
  const onCancel = () => {
    if (supportStatus === status.finish) {
      setIsSupportOpen(false);
    }

    if (supportText) {
      setDiscardWarning(true);
    } else {
      setIsSupportOpen(false);
    }
  };

  const onSubmit = () => {
    supportAction(supportText);
  };

  //
  //
  return (
    <React.Fragment>
      <Dialog open={isSupportOpen} keepMounted={false} maxWidth="md">
        <DialogTitle>Support</DialogTitle>

        <DialogContent className={classes.minDialogWidth}>
          {supportStatus === status.finish && (
            <DialogContentText>
              Thank you
              <br />
              We will endeavour to respond by Email ASAP
            </DialogContentText>
          )}

          {supportStatus.split(" ")[0] === status.error && (
            <DialogContentText>
              There was an error: {supportStatus.split(" ")[1]}. Please try
              again
            </DialogContentText>
          )}

          {supportStatus !== status.finish && (
            <TextField
              label="Contact us"
              multiline
              rows={6}
              rowsMax={20}
              fullWidth
              variant="filled"
              onChange={(e) => {
                setSupportText(e.target.value);
              }}
              value={supportText}
            />
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={onCancel}
            color="primary"
            variant="contained"
            disabled={supportStatus === status.loading}
          >
            {supportStatus !== status.finish ? "Cancel" : "Close"}
          </Button>
          <div style={{ flexGrow: 1 }} />

          {supportStatus !== status.finish && (
            <Button
              color="primary"
              variant="contained"
              onClick={onSubmit}
              disabled={supportStatus === status.loading || !supportText}
              endIcon={
                supportStatus === status.loading && (
                  <CircularProgress size="0.875rem" />
                )
              }
            >
              Submit
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/** confirm discard */}
      <Dialog open={discardWarning}>
        <DialogTitle>Discard changes?</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Your support request will be lost
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button color="primary" variant="contained" onClick={cancelDiscard}>
            Keep editing
          </Button>
          <div style={{ flexGrow: 1 }} />

          <Button color="primary" variant="contained" onClick={confirmDiscard}>
            Discard
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SupportDialog);
