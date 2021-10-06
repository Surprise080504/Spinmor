import {
  SET_LOCATIONS,
  GET_LOCATIONS_STATUS,
  //
  SELECTED_LOCATION,
  GET_LOCATION_DETAILS_STATUS,
  UPDATE_LOCATION_STATUS,
  DELETE_LOCATION_STATUS,
  CREATE_LOCATION_STATUS,
} from "./Location.types";

import { axiosInstance, status } from "../../api/api";

export const setLocations = (locations) => ({
  type: SET_LOCATIONS,
  payload: locations,
});

export const setGetLocationsStatus = (getLocationsStatus) => ({
  type: GET_LOCATIONS_STATUS,
  payload: getLocationsStatus,
});

export const getLocationsAction = (updateStatus = true) => async (
  dispatch,
  getState
) => {
  if (updateStatus) {
    dispatch(setGetLocationsStatus(status.loading));
  }

  try {
    const getLocationsRes = await axiosInstance({
      method: "get",
      url: "/host/GetLocations",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
    });
    if (getLocationsRes.data) {
      dispatch(setLocations(getLocationsRes.data));
      if (updateStatus) {
        dispatch(setGetLocationsStatus(status.finish));
      }
    } else {
      if (updateStatus) {
        dispatch(setGetLocationsStatus(`${status.error} 404`));
      }
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

    if (updateStatus) {
      dispatch(setGetLocationsStatus(`${status.error} ${caughtError}`));
    }
  }
};

export const setSelectedLocation = (selectedLocation) => ({
  type: SELECTED_LOCATION,
  payload: { ...selectedLocation },
});

//
//

export const setGetLocationDetailsStatus = (getLocationDetailsStatus) => ({
  type: GET_LOCATION_DETAILS_STATUS,
  payload: getLocationDetailsStatus,
});

export const getLocationDetailsAction = (locationId) => async (
  dispatch,
  getState
) => {
  dispatch(setGetLocationDetailsStatus(status.loading));

  try {
    const getLocationDetailsRes = await axiosInstance({
      method: "get",
      url: "/host/ReadLocation",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      params: {
        LocationId: locationId,
      },
    });

    if (getLocationDetailsRes.data) {
      dispatch(setSelectedLocation(getLocationDetailsRes.data));
      dispatch(setGetLocationDetailsStatus(status.finish));
    } else {
      dispatch(setGetLocationDetailsStatus(`${status.error} 404`));
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

    dispatch(setGetLocationDetailsStatus(`${status.error} ${caughtError}`));
  }
};

//
//

export const setUpdateLocationStatus = (updateLocationStatus) => ({
  type: UPDATE_LOCATION_STATUS,
  payload: updateLocationStatus,
});

export const updateLocationAction = (formData) => async (
  dispatch,
  getState
) => {
  dispatch(setUpdateLocationStatus(status.loading));

  try {
    await axiosInstance({
      method: "put",
      url: "/host/UpdateLocation",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      data: formData,
    });

    dispatch(setUpdateLocationStatus(status.finish));
    dispatch(getLocationsAction(false));
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

    dispatch(setUpdateLocationStatus(`${status.error} ${caughtError}`));
  }
};

//
//

export const setDeleteLocationStatus = (deleteLocationStatus) => ({
  type: DELETE_LOCATION_STATUS,
  payload: deleteLocationStatus,
});

export const deleteLocationAction = (locationToDelete) => async (
  dispatch,
  getState
) => {
  dispatch(setDeleteLocationStatus(status.loading));

  try {
    await axiosInstance({
      method: "delete",
      url: "/host/DeleteLocation",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      params: {
        LocationId: locationToDelete.LocationId,
      },
    });

    dispatch(setDeleteLocationStatus(status.finish));
    // dispatch(getLocationsAction(false));
    const locationsWithoutDeleted = getState().LocationReducer.locations.filter(
      (loc) => loc.LocationId !== locationToDelete.LocationId
    );
    dispatch(setLocations(locationsWithoutDeleted));
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

    dispatch(setDeleteLocationStatus(`${status.error} ${caughtError}`));
  }
};

//
//

export const setCreateLocationStatus = (createLocationStatus) => ({
  type: CREATE_LOCATION_STATUS,
  payload: createLocationStatus,
});

export const createLocationAction = (formData) => async (
  dispatch,
  getState
) => {
  dispatch(setCreateLocationStatus(status.loading));

  try {
    await axiosInstance({
      method: "post",
      url: "/host/CreateLocation",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      data: formData,
    });

    dispatch(setCreateLocationStatus(status.finish));
    dispatch(getLocationsAction(false));
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

    dispatch(setCreateLocationStatus(`${status.error} ${caughtError}`));
  }
};
