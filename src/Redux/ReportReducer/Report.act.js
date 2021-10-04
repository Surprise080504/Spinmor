import {
  GET_REPORTS_STATUS,
  REPORTS_RES,
  //
  SET_ALL_REPORTS,
  SET_ALL_LOCATIONS,
  //
  SET_TOTAL_SUM,
  SET_TOTAL_AMOUNT,
} from "./Report.types";

import { status, axiosInstance } from "../../api/api";

export const setGetReportsStatus = (getReportsStatus) => ({
  type: GET_REPORTS_STATUS,
  payload: getReportsStatus,
});

export const setReportsRes = (reportsRes) => ({
  type: REPORTS_RES,
  payload: reportsRes,
});

//
//

export const setAllReports = (allReports) => ({
  type: SET_ALL_REPORTS,
  payload: allReports,
});

export const setAllLocations = (allLocations) => ({
  type: SET_ALL_LOCATIONS,
  payload: allLocations,
});

//
//

export const setTotalSum = (totalSum) => ({
  type: SET_TOTAL_SUM,
  payload: totalSum,
});

export const setTotalAmount = (totalAmount) => ({
  type: SET_TOTAL_AMOUNT,
  payload: totalAmount,
});

//
//

export const getReportsAction = () => async (dispatch, getState) => {
  dispatch(setGetReportsStatus(status.loading));

  try {
    const getReportsRes = await axiosInstance({
      method: "get",
      url: "/reports/OperatorOrders",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
    });

    const OperatorOrders = getReportsRes.data.OperataorOrders;

    const allReports = [];
    const allLocations = [];

    let allSum = 0.0;
    let allAmount = 0;

    for (let i = 0; i < OperatorOrders.length; i++) {
      const currentLocation = OperatorOrders[i];
      const locationOrders = currentLocation.Orders;
      let locationTotalAmount = 0;
      let locationTotalSum = 0.0;

      for (let j = 0; j < locationOrders.length; j++) {
        const currentOrder = locationOrders[j];

        locationTotalAmount++;
        locationTotalSum += currentOrder.TotalOrder;

        allReports.push({
          ...currentOrder,
          LocationId: currentLocation.LocationId,
          LocationName: currentLocation.LocationName,
        });
      }

      allLocations.push({
        LocationId: currentLocation.LocationId,
        LocationName: currentLocation.LocationName,
        locationTotalAmount,
        locationTotalSum,
      });

      allSum += locationTotalSum;
      allAmount += locationTotalAmount;
    }

    allReports.sort((a, b) =>
      a.LocationName.toLowerCase() > b.LocationName.toLowerCase()
        ? 1
        : b.LocationName.toLowerCase() > a.LocationName.toLowerCase()
        ? -1
        : 0
    );

    dispatch(setTotalSum(allSum));
    dispatch(setTotalAmount(allAmount));

    dispatch(setAllReports(allReports));
    dispatch(setAllLocations(allLocations));

    dispatch(setReportsRes(getReportsRes.data));
    dispatch(setGetReportsStatus(status.finish));
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

    dispatch(setGetReportsStatus(`${status.error} ${caughtError}`));
  }
};
