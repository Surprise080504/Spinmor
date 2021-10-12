import {
  GET_ALL_REWARDS,
  CREATE_REWARD,
  UPDATE_REWARD,
  DELETE_REWARD,
  GET_ALL_ITEMS,
  GET_LINKED_REWARDS,
  SET_LINKED_REWARDS,
  SET_ALL_ITEMS
} from "./Rewards.types";
import { getError, clearError } from "../ErrorReducer/Error.act";
import { axiosInstance } from "../../api/api";

const fetchAllRewards = (data) => ({
  type: GET_ALL_REWARDS,
  payload: data,
});

const fetchAllItems = (data) => ({
  type: GET_ALL_ITEMS,
  payload: data,
});

const fetchLinkedRewards = (data) => ({
  type: GET_LINKED_REWARDS,
  payload: data,
});

export const emptyAllItems = () => ({
  type: SET_ALL_ITEMS,
});

export const emptyLinkedRewards = () => ({
  type: SET_LINKED_REWARDS,
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

export const getAllRewards = (locations, setPageLoading) => async (dispatch, getState) => {
  let allRewards = [];
  let index = 0;
  await dispatch(clearError());
  await locations.forEach((location) => {
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
        if (index === locations.length - 1) {
          dispatch(fetchAllRewards(allRewards));
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
        dispatch(getError({ getAllRewards: `Error ${caughtError}, Rewards that LocationId is equal to ${location.LocationId}, got Error!` }));
        setPageLoading(false);
        return;
      })
  });

};

export const createReward = (data, setLoading, setOpen) => async (dispatch, getState) => {
  await dispatch(clearError());
  try {
    const res = await axiosInstance({
      method: "post",
      url: "/Coffee/CreateRewards",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      data
    });
    if (res.data) {
      data.CoffeeRewardsId = res.data;
      dispatch(addReward(data));
      setLoading(false);
      setOpen(false);
    }
    else dispatch(getError({ createReward: `Error 500, New reward wasn't created!` }));
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
    dispatch(getError({ createReward: `Error ${caughtError}, New reward wasn't created!` }));
  }
}

export const updateReward = (data, setLoading, setOpen) => async (dispatch, getState) => {
  await dispatch(clearError());
  try {
    const res = await axiosInstance({
      method: "put",
      url: "/Coffee/UpdateRewardsRecord",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      data
    });
    if (res) {
      dispatch(editReward(data));
      setLoading(false);
      setOpen(false);
    }
    else dispatch(getError({ updateReward: `Error 500, This reward wasn't updated!` }));
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
    dispatch(getError({ updateReward: `Error ${caughtError}, This reward wasn't updated!` }));
  }
}

export const deleteReward = (data, setConfirmLoading, setConfirmOpen) => async (dispatch, getState) => {
  await dispatch(clearError());
  try {
    const res = await axiosInstance({
      method: "delete",
      url: "/Coffee/DeleteCoffeeRewards",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      params: { CoffeeRewardsId: data.CoffeeRewardsId }
    });
    if (res) {
      dispatch(removeReward(data));
      setConfirmLoading(false);
      setConfirmOpen(false);
    }
    else dispatch(getError({ deleteReward: `Error 500, This reward wasn't deleted!` }));
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
    dispatch(getError({ deleteReward: `Error ${caughtError}, This reward wasn't deleted!` }));
    setConfirmLoading(false);
  }
}

export const getAllItems = (LocationId) => async (dispatch, getState) => {
  await dispatch(clearError());
  try {
    const res = await axiosInstance({
      method: "get",
      url: "/host/ReadAllItems",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      params: { LocationId }
    });
    if (res.data) {
      dispatch(fetchAllItems(res.data));
    }
    else dispatch(getError({ fetchAllItems: `Error 500, didn't get all Items!` }));
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
    dispatch(getError({ fetchAllItems: `Error ${caughtError}, didn't get all Items!` }));
  }
}

export const getLinkedRewards = (CoffeeRewardsID) => async (dispatch, getState) => {
  await dispatch(clearError());
  try {
    const res = await axiosInstance({
      method: "get",
      url: "/Coffee/ReadLinkedRewards",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      params: { CoffeeRewardsID }
    });
    if (res.data) {
      dispatch(fetchLinkedRewards(res.data));
    }
    else dispatch(getError({ fetchLinkedRewards: `Error 500, didn't get linked Rewards!` }));
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
    dispatch(getError({ fetchLinkedRewards: `Error ${caughtError}, didn't get linked Rewards!` }));
  }
}

export const linkRewardProgram = (data, setLoading, setOpen) => async (dispatch, getState) => {
  await dispatch(clearError());
  try {
    const res = await axiosInstance({
      method: "post",
      url: "Coffee/LinkRewardProgram2Items",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      data
    });
    if (res) {
      setLoading(false);
      setOpen(false);
    }
    else dispatch(getError({ linkRewardProgram: `Error 500, didn't link the Rewards Program!` }));
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
    dispatch(getError({ linkRewardProgram: `Error ${caughtError},didn't link the Rewards Program!` }));
  }
}