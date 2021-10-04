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

import { status } from "../../api/api";

const initialState = {
  getReportsStatus: status.not_started,
  reportsRes: null,

  allReports: [],
  allLocations: [],

  totalSum: -1,
  totalAmount: -1,
};

const ReportReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REPORTS_STATUS: {
      return {
        ...state,
        getReportsStatus: action.payload,
      };
    }

    case REPORTS_RES: {
      return {
        ...state,
        reportsRes: action.payload,
      };
    }

    //
    //

    case SET_ALL_REPORTS: {
      return {
        ...state,
        allReports: action.payload,
      };
    }

    case SET_ALL_LOCATIONS: {
      return {
        ...state,
        allLocations: action.payload,
      };
    }

    //
    //

    case SET_TOTAL_SUM: {
      return {
        ...state,
        totalSum: action.payload,
      };
    }

    case SET_TOTAL_AMOUNT: {
      return {
        ...state,
        totalAmount: action.payload,
      };
    }

    //
    //

    default: {
      return state;
    }
  }
};

export default ReportReducer;
