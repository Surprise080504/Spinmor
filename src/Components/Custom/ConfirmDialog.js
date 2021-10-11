import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Typography,
  Button
} from "@material-ui/core";

function ConfirmDialog(props) {

  const { title, loading, open, cancelDelete, confirmDelete, error } = props;

  return (
    <Dialog
      open={open}
      onClose={() => cancelDelete()}
      aria-labelledby="delete-location-dialog-title"
      aria-describedby="delete-location-dialog-description"
    >
      <DialogTitle id="delete-location-dialog-title">
        Delete Reward
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-location-dialog-description">
          Are you sure you want delete {title}?
          <br />
          All items of that location will be deleted.
        </DialogContentText>

        {loading && <CircularProgress />}

        {error && (
          <Typography variant="body2" align="left" color="error">
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => confirmDelete()}
          color="primary"
          disabled={loading}
          variant="contained"
        >
          Delete
        </Button>

        <div style={{ flexGrow: 1 }} />

        <Button
          onClick={() => cancelDelete()}
          color="primary"
          autoFocus
          disabled={loading}
          variant="contained"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default React.memo(ConfirmDialog);