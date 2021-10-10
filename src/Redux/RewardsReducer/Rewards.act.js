import async from "async";
import {
  GET_ALL_REWARDS,
  CREATE_REWARD,
  UPDATE_REWARD,
  DELETE_REWARD
} from "./Rewards.types";
import { getError, clearError } from "../ErrorReducer/Error.act";
import { axiosInstance } from "../../api/api";

const fetchAllRewards = (data) => ({
  type: GET_ALL_REWARDS,
  payload: data,
});

const addReward = (data) => ({
  type: CREATE_REWARD,
  payload: data,
});

const editReward = (data) => ({
  type: UPDATE_REWARD,
  payload: data,
});

const removeReward = (data) => ({
  type: DELETE_REWARD,
  payload: data,
});

export const getAllRewards = (locations) => async (dispatch, getState) => {
  let allRewards = [];
  await dispatch(clearError());
  await locations.forEach(location => {
    axiosInstance({
      method: "get",
      url: "/Coffee/ReadAllRewards",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token
      },
      withCredentials: true,
      params: { LocationId: location.LocationId }
    })
      .then(res => {
        allRewards = allRewards.concat(res.data);
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
        dispatch(getError({ getAllRewards: `Error ${caughtError}, Rewards that LocationId is equal to ${location.LocationId}, got Error!` }));
        return;
      })
  });
  console.log(allRewards);
  await dispatch(fetchAllRewards(allRewards));
};

export const createReward = (data) => async (dispatch, getState) => {
  await dispatch(clearError());
  try {
    const res = await axiosInstance({
      method: "get",
      url: "/Coffee/CreateRewards",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      data
    });
    if (res.data) dispatch(addReward(data));
    else dispatch(getError(`Error 500, New reward wasn't created!`));
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
    dispatch(getError(`Error ${caughtError}, New reward wasn't created!`));
  }
}

export const updateReward = (data) => async (dispatch, getState) => {
  await dispatch(clearError());
  try {
    const res = await axiosInstance({
      method: "get",
      url: "/Coffee/UpdateRewardsRecord",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      data
    });
    if (res.data) dispatch(editReward(data));
    else dispatch(getError(`Error 500, This reward wasn't updated!`));
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
    dispatch(getError(`Error ${caughtError}, This reward wasn't updated!`));
  }
}

export const deleteReward = (data) => async (dispatch, getState) => {
  await dispatch(clearError());
  try {
    const res = await axiosInstance({
      method: "get",
      url: "/Coffee/DeleteCoffeeRewards",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      params: { CoffeeRewardsId: data.CoffeeRewardsId }
    });
    if (res.data) dispatch(removeReward(data));
    else dispatch(getError(`Error 500, This reward wasn't deleted!`));
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
    dispatch(getError(`Error ${caughtError}, This reward wasn't deleted!`));
  }
}