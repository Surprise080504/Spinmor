import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import CircularProgress from "@material-ui/core/CircularProgress";

import { status } from "../../api/api";
import {
  uploadImage,
  setUploadGoodlmageQR,
  setUploadImageStatus,
} from "../../Redux/GoodReducer/Good.act";

const mapStateToProps = ({ GoodReducer }) => ({
  uploadSelectedImageStatus: GoodReducer.uploadSelectedImageStatus,
  uploadGoodImageQR: GoodReducer.uploadGoodImageQR,
});
const mapDispatchToProps = (dispatch) => ({
  uploadImage: bindActionCreators(uploadImage, dispatch),
  setUploadGoodlmageQR: bindActionCreators(setUploadGoodlmageQR, dispatch),
  setUploadImageStatus: bindActionCreators(setUploadImageStatus, dispatch),
});

function UploadImageComponent({
  uploadImage,
  uploadSelectedImageStatus,
  uploadGoodImageQR,
  setUploadGoodlmageQR,
  setUploadImageStatus,
}) {
  const [selectedFile, setSelectedFile] = React.useState(null);

  const [fileExtension, setFileExtension] = React.useState(null);
  React.useEffect(() => {
    setFileExtension(
      selectedFile?.name?.substring?.(
        selectedFile?.name?.lastIndexOf?.(".") + 1
      )
    );
  }, [selectedFile]);

  React.useEffect(() => {
    return function cleanup() {
      setFileExtension(null);
    };
  }, []);

  const onSelectFile = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = {};
    formData["FileName"] = uploadGoodImageQR.replaceAll(".", "");

    let reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = function () {
      formData["FileBase64Content"] = reader.result.split(",")[1];
      uploadImage(formData);
    };
  };

  React.useEffect(() => {
    if (uploadSelectedImageStatus === status.finish) {
      setUploadGoodlmageQR(null);
    }
  }, [uploadSelectedImageStatus, setUploadGoodlmageQR]);

  React.useEffect(() => {
    return function cleanup() {
      setUploadImageStatus(status.not_started);
    };
  }, [setUploadImageStatus]);

  return (
    <Dialog
      open={uploadGoodImageQR}
      onClose={null}
      keepMounted={false}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Upload New Image</DialogTitle>

      <DialogContent>
        <Typography style={{ marginBottom: 8 }}>
          The recommended size of the image is 600 * 600 pixels or any other
          resolution in 1:1 ratio
        </Typography>

        <Grid item xs={12}>
          <input
            onChange={(e) => onSelectFile(e)}
            type="file"
            accept="image/jpeg"
            style={{ display: "none" }}
            id="upload-good-image-input"
          />
          <label htmlFor="upload-good-image-input">
            <Button
              variant="contained"
              color="primary"
              component="span"
              style={{ marginTop: 8 }}
            >
              Choose File
            </Button>
            {selectedFile?.name && (
              <span style={{ marginLeft: 8, fontSize: "0.9rem" }}>
                {selectedFile.name}
              </span>
            )}
          </label>
        </Grid>

        {fileExtension && fileExtension !== "jpg" && (
          <Typography
            variant="body2"
            align="left"
            color="error"
            style={{ marginTop: 16 }}
          >
            File type must be jpg
          </Typography>
        )}

        {uploadSelectedImageStatus.split(" ")[0] === status.error && (
          <Typography
            variant="body2"
            align="left"
            color="error"
            style={{ marginTop: 16 }}
          >
            Error uploading image: {uploadSelectedImageStatus.split(" ")[1]}
          </Typography>
        )}

        {selectedFile ? (
          <Grid item xs={12} style={{ marginTop: 16 }}>
            <img
              alt="preview"
              src={URL.createObjectURL(selectedFile)}
              width={250}
            />
          </Grid>
        ) : null}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => setUploadGoodlmageQR(null)}
          color="primary"
          disabled={uploadSelectedImageStatus === status.loading}
        >
          Cancel
        </Button>
        <div style={{ flexGrow: 1 }} />

        <Button
          color="primary"
          variant="contained"
          onClick={handleUpload}
          disabled={
            !selectedFile ||
            uploadSelectedImageStatus === status.loading ||
            fileExtension?.toLowerCase?.() !== "jpg"
          }
          endIcon={
            uploadSelectedImageStatus === status.loading && (
              <CircularProgress size="0.875rem" />
            )
          }
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadImageComponent);
