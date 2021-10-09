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
import { status } from "../../api/api";

function ConfirmDialog(props) {

  const { title, deleteStatus, open, cancelDelete, confirmDelete } = props;

  return (
    <Dialog
      open={open}
      onClose={() => cancelDelete()}
      aria-labelledby="delete-location-dialog-title"
      aria-describedby="delete-location-dialog-description"
    >
      <DialogTitle id="delete-location-dialog-title">
        Delete location
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-location-dialog-description">
          Are you sure you want delete {title}?
          <br />
          All items of that location will be deleted.
        </DialogContentText>

        {deleteStatus === status.loading && <CircularProgress />}

        {deleteStatus.split(" ")[0] === status.error && (
          <Typography variant="body2" align="left" color="error">
            Error deleting location: {deleteStatus.split(" ")[1]}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => confirmDelete()}
          color="primary"
          disabled={deleteStatus === status.loading}
          variant="contained"
        >
          Delete
        </Button>

        <div style={{ flexGrow: 1 }} />

        <Button
          onClick={() => cancelDelete()}
          color="primary"
          autoFocus
          disabled={deleteStatus === status.loading}
          variant="contained"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog;