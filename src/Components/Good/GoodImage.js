import React from "react";
import { connect } from "react-redux";
import { axiosInstance } from "../../api/api";
const mapStateToProps = ({ AppReducer }) => ({
  token: AppReducer.token,
});
const mapDispatchToProps = () => ({});
const GoodImage = ({ QRCode, token }) => {
  const [imageData, setImageData] = React.useState("");
  React.useEffect(() => {
    (async () => {
      try {
        const imageData = await axiosInstance({
          method: "get",
          url: "/host/ItemImageDL",
          headers: {
            Authorization: "Bearer " + token,
          },
          withCredentials: true,
          params: {
            filename: QRCode.replaceAll(".", ""),
          },
        });
        if (imageData.data?.FileBase64Content) {
          setImageData(imageData.data.FileBase64Content);
        }
      } catch (error) {
        //
      }
    })();
  }, [QRCode]);
  return imageData ? (
    <img src={`data:image/jpg;base64,${imageData}`} width={300} />
  ) : null;
};
export default connect(mapStateToProps, mapDispatchToProps)(GoodImage);
