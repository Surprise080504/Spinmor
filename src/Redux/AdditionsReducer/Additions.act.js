import {
  GET_ALL_ADDITIONS,
  GET_ALL_LOCATION_ITEMS,
  CREATE_ADDITION
} from "./Additions.types";
import { getError, clearError } from "../ErrorReducer/Error.act";
import { axiosInstance } from "../../api/api";

const fetchAllAdditions = (data) => ({
  type: GET_ALL_ADDITIONS,
  payload: data,
});

const fetchAllLocationItems = (data) => ({
  type: GET_ALL_LOCATION_ITEMS,
  payload: data,
});

const addAddition = (data) => ({
  type: CREATE_ADDITION,
  payload: data,
});

export const getAllAdditions = (locations, setPageLoading) => async (dispatch, getState) => {
  let allAdditions = [];
  let index = 0;
  await dispatch(clearError());
  await locations.forEach((location) => {
    axiosInstance({
      method: "get",
      url: "/Coffee/ReadAllLinkAdditions",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token
      },
      withCredentials: true,
      params: { LocationId: location.LocationId }
    })
      .then(res => {
        allAdditions = allAdditions.concat(res.data);
        if (index === locations.length - 1) {
          dispatch(fetchAllAdditions(allAdditions));
          setPageLoading(false);
        }
        index++;
      })
      .catch(error => {
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
        dispatch(getError({ getAllAdditions: `Error ${caughtError}, didn't get Link Additions that LocationId is equal to ${location.LocationId}!` }));
        setPageLoading(false);
        return;
      })
  });

};

export const getAllLocationItems = (locations, setPageLoading) => async (dispatch, getState) => {
  let allLocationItems = [];
  let index = 0;
  await dispatch(clearError());
  await locations.forEach((location) => {
    axiosInstance({
      method: "get",
      url: "/host/ReadAllItems",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token
      },
      withCredentials: true,
      params: { LocationId: location.LocationId }
    })
      .then(res => {
        allLocationItems = allLocationItems.concat(res.data);
        if (index === locations.length - 1) {
          dispatch(fetchAllLocationItems(allLocationItems));
        }
        index++;
      })
      .catch(error => {
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
        dispatch(getError({ getAllLocationItems: `Error ${caughtError}, didn't get Items that LocationId is equal to ${location.LocationId}!` }));
        setPageLoading(false);
        return;
      })
  });

};

export const createAddition = (data, setLoading, setOpen) => async (dispatch, getState) => {
  await dispatch(clearError());
  try {
    const res = await axiosInstance({
      method: "put",
      url: "/Coffee/CreateLinkAdditions",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      data
    });
    if (res.data) {
      data.LinkedAdditionsID = res.data;
      dispatch(addAddition(data));
      setLoading(false);
      setOpen(false);
    }
    else dispatch(getError({ createAddition: `Error 500, New addition wasn't created!` }));
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
    dispatch(getError({ createAddition: `Error ${caughtError}, New addition wasn't created!` }));
  }
}