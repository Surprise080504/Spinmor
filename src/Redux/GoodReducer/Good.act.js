import {
  INITIALIZE_LOCATIONS_GOODS,
  //
  SET_LOCATIONS_GOODS,
  SET_ALL_GOODS,
  //
  SELECTED_GOOD,
  READ_GOOD_STATUS,
  UPDATE_GOOD_STATUS,
  CREATE_GOOD_STATUS,
  UPLOAD_SELECTED_IMAGE_STATUS,
  UPLOAD_GOOD_IMAGE_QR,
} from "./Good.types";

import { axiosInstance, status } from "../../api/api";

export const initializeLocationsGoods = (locations) => ({
  type: INITIALIZE_LOCATIONS_GOODS,
  payload: locations,
});

//
//

export const setLocationsGoods = (locationsGoods) => ({
  type: SET_LOCATIONS_GOODS,
  payload: locationsGoods,
});

export const setAllGoods = (allGoods) => ({
  type: SET_ALL_GOODS,
  payload: allGoods,
});

//
//

export const setSelectedGood = (selectedGood) => ({
  type: SELECTED_GOOD,
  payload: {
    ...selectedGood,
    ItemListId: selectedGood.ItemListId || selectedGood.ItemListid,
  },
});

export const setReadGoodStatus = (readGoodStatus) => ({
  type: READ_GOOD_STATUS,
  payload: readGoodStatus,
});

export const setUpdateGoodStatus = (updateGoodStatus) => ({
  type: UPDATE_GOOD_STATUS,
  payload: updateGoodStatus,
});

export const setCreateGoodStatus = (createGoodStatus) => ({
  type: CREATE_GOOD_STATUS,
  payload: createGoodStatus,
});

export const setUploadImageStatus = (uploadSelectedImageStatus) => ({
  type: UPLOAD_SELECTED_IMAGE_STATUS,
  payload: uploadSelectedImageStatus,
});

export const setUploadGoodlmageQR = (uploadGoodImageQR) => ({
  type: UPLOAD_GOOD_IMAGE_QR,
  payload: uploadGoodImageQR,
});

//
//

export const updateLocationAnyStatus = (
  statusField,
  LocationId,
  status
) => async (dispatch, getState) => {
  let locationsGoods = [...getState().GoodReducer.locationsGoods];

  for (let i = 0; i < locationsGoods.length; i++) {
    if (locationsGoods[i].LocationId !== LocationId) {
      continue;
    }

    const updatedStatus = { ...locationsGoods[i] };
    updatedStatus[statusField] = status;
    locationsGoods[i] = updatedStatus;
  }

  dispatch(setLocationsGoods(locationsGoods));
};

//
//

export const getLocationGoods = (LocationId, LocationName) => async (
  dispatch,
  getState
) => {
  dispatch(
    updateLocationAnyStatus("getGoodsStatus", LocationId, status.loading)
  );

  try {
    const getGoodsRes = await axiosInstance({
      method: "get",
      url: "/host/ReadAllItems",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      params: {
        LocationId: LocationId,
      },
    });

    if (getGoodsRes.data) {
      console.log(getGoodsRes.data);
      // let locationsGoods = [...getState().GoodReducer.locationsGoods];
      // locationsGoods = locationsGoods.map((locGoods) =>
      //   locGoods.LocationId !== LocationId
      //     ? locGoods
      //     : { ...locGoods, goods: getGoodsRes.data }
      // );
      // dispatch(setLocationsGoods(locationsGoods));

      dispatch(
        setAllGoods(
          [
            ...getState().GoodReducer.allGoods.filter(
              (good) => good.LocationId !== LocationId
            ),
            ...getGoodsRes.data.map((good) => ({
              ...good,
              ItemListId: good.ItemListid,
              LocationName: LocationName,
            })),
          ].sort((a, b) =>
            a.LocationName.toLowerCase() > b.LocationName.toLowerCase()
              ? 1
              : b.LocationName.toLowerCase() > a.LocationName.toLowerCase()
              ? -1
              : 0
          )
        )
      );
      dispatch(
        updateLocationAnyStatus("getGoodsStatus", LocationId, status.finish)
      );
    } else {
      dispatch(
        updateLocationAnyStatus(
          "getGoodsStatus",
          LocationId,
          `${status.error} 404`
        )
      );
    }
  } catch (error) {
    let caughtError = 500;

    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      caughtError = error.response.status;
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }

    dispatch(
      updateLocationAnyStatus(
        "getGoodsStatus",
        LocationId,
        `${status.error} ${caughtError}`
      )
    );
  }
};

//
//

export const deleteGoodAction = (goodToDelete) => async (
  dispatch,
  getState
) => {
  console.log("deleteGoodAction");

  dispatch(
    updateLocationAnyStatus(
      "deleteGoodStatus",
      goodToDelete.LocationId,
      status.loading
    )
  );

  try {
    await axiosInstance({
      method: "delete",
      url: "/host/DeleteItem",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      params: {
        ItemListId: goodToDelete.ItemListId,
      },
    });

    const goodsWithoutDeleted = getState().GoodReducer.allGoods.filter(
      (good) => good.ItemListId !== goodToDelete.ItemListId
    );
    dispatch(setAllGoods(goodsWithoutDeleted));

    dispatch(
      updateLocationAnyStatus(
        "deleteGoodStatus",
        goodToDelete.LocationId,
        status.finish
      )
    );
  } catch (error) {
    let caughtError = 500;

    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      caughtError = error.response.status;
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }

    dispatch(
      updateLocationAnyStatus(
        "deleteGoodStatus",
        goodToDelete.LocationId,
        `${status.error} ${caughtError}`
      )
    );
  }
};

export const readGoodAction = (ListItemId) => async (dispatch, getState) => {
  dispatch(setReadGoodStatus(status.loading));

  try {
    const readItemRes = await axiosInstance({
      method: "get",
      url: "/host/ReadItem",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      params: {
        itemListId: ListItemId,
      },
    });

    if (readItemRes.data) {
      dispatch(setSelectedGood(readItemRes.data));
      dispatch(setReadGoodStatus(status.finish));
    } else {
      dispatch(setReadGoodStatus(`${status.error} 404`));
    }
  } catch (error) {
    let caughtError = 500;

    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      caughtError = error.response.status;
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }

    dispatch(setReadGoodStatus(`${status.error} ${caughtError}`));
  }
};

export const updateGoodAction = (formData) => async (dispatch, getState) => {
  dispatch(setUpdateGoodStatus(status.loading));

  try {
    await axiosInstance({
      method: "post",
      url: "/host/UpdateItem",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      data: formData,
    });

    dispatch(setUpdateGoodStatus(status.finish));
    dispatch(
      updateLocationAnyStatus(
        "getGoodsStatus",
        formData.LocationId,
        status.not_started
      )
    );
  } catch (error) {
    let caughtError = 500;

    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      caughtError = error.response.status;
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }

    dispatch(setUpdateGoodStatus(`${status.error} ${caughtError}`));
  }
};

export const createGoodAction = (formData) => async (dispatch, getState) => {
  dispatch(setCreateGoodStatus(status.loading));

  try {
    const result = await axiosInstance({
      method: "post",
      url: "/host/CreateItem",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      data: formData,
    });

    dispatch(setCreateGoodStatus(status.finish));
    // dispatch(getLocationsAction(false));
    dispatch(
      updateLocationAnyStatus(
        "getGoodsStatus",
        formData.LocationId,
        status.not_started
      )
    );

    dispatch(setUploadGoodlmageQR(result.data.QRCode));
  } catch (error) {
    let caughtError = 500;

    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      caughtError = error.response.status;
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }

    dispatch(setCreateGoodStatus(`${status.error} ${caughtError}`));
  }
};

export const uploadImage = (formData) => async (dispatch, getState) => {
  dispatch(setUploadImageStatus(status.loading));

  try {
    await axiosInstance({
      method: "post",
      url: "/host/ItemImageUL",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      data: formData,
    });

    dispatch(setUploadImageStatus(status.finish));
  } catch (error) {
    let caughtError = 500;

    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      caughtError = error.response.status;
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }

    dispatch(setUploadImageStatus(`${status.error} ${caughtError}`));
  }
};
